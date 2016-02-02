/**
 * jquery.carousel.js
 */
(function (window, $) {

    $.fn.carousel = function (options) {

        var document = window.document,
            $doc = $(document),
            isIE = !!window.attachEvent;

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.carousel.defaults, options);

            //配置项
            var isVertical = opts.isVertical,
                swipThreshold = opts.swipThreshold,
                isAutoPlay = opts.isAutoPlay,
                autoPlayInter = opts.autoPlayInter,
                slideTime = opts.slideTime,
                slideCallback = opts.slideCallback,
                isShowTitle = opts.isShowTitle,
                initIndex = opts.initIndex,
                $btnPrev = opts.$btnPrev,
                $btnNext = opts.$btnNext,
                isShowPager = opts.isShowPager;

            //变量
            var $this = $(this),
                me = this,
                $wrap, $items, itemCount, $title, $pagers;

            //初始化函数
            function init() {
                $this.addClass('jquery-carousel').html('<div class="jquery-carousel-wrap">' + $this.html() + '</div>' + (isShowTitle ? '<div class="jquery-carousel-title"></div>' : ''));
                $wrap = $this.find('div.jquery-carousel-wrap');
                $items = $wrap.children('*').addClass('item');
                itemCount = $items.length;
                isVertical && $this.addClass('vertical');
                $title = $this.find('div.jquery-carousel-title');

                //pager
                var html = '';
                if (isShowPager) {
                    html += '<div class="jquery-carousel-pager">';
                    for (var i = 0, len = itemCount; i < len; i++) {
                        html += '<span></span>';
                    }
                    html += '</div>';
                }
                $pagers = $this.append(html).find('div.jquery-carousel-pager span');

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {
                var width, height, inter, index = initIndex, start, swipSpan;

                //设置尺寸函数
                function setSize() {
                    width = $this.width();
                    height = $this.height();

                    //水平方向滚动
                    if (!isVertical) {
                        $items.css({
                            width: width + 'px'
                        });
                        $wrap[0].style.width = width * itemCount + 3 + 'px';//IE6中需多3px,才能完整显示所有内容
                    }
                    //竖直方向滚动
                    else {
                        $items.css({
                            height: height + 'px'
                        });
                        $wrap[0].style.width = width + 'px';
                    }
                }

                //设置inter函数
                function setInter() {
                    clearInterval(inter);
                    isAutoPlay && (inter = setInterval(function () {
                        ++index === itemCount && (index = 0);
                        slide();
                    }, autoPlayInter));
                }

                //移动到函数
                function slide(swipSpan) {
                    var translate = -index * (isVertical ? height : width);

                    if (typeof swipSpan === 'number') {
                        //起点
                        if (index === 0 && swipSpan > 0) {
                            swipSpan /= 2;
                        }
                        //终点
                        if (index === itemCount - 1 && swipSpan < 0) {
                            swipSpan /= 2;
                        }
                        translate += swipSpan;
                        isVertical ? $wrap.css({
                            top: translate + 'px'
                        }) : $wrap.css({
                            left: translate + 'px'
                        });
                    }
                    else {
                        isVertical ? $wrap.animate({
                            top: translate + 'px'
                        }, slideTime) : $wrap.animate({
                            left: translate + 'px'
                        }, slideTime);

                        //滚动回调函数
                        typeof slideCallback === 'function' && slideCallback(index);

                        //title
                        var title = $items.eq(index).attr('data-title');
                        $title.slideUp(200);
                        title && setTimeout(function () {
                            $title.slideDown(200).html(title);
                        }, 200);

                        //pager状态
                        $pagers.removeClass('selected').eq(index).addClass('selected');
                    }
                }


                //初始化
                //设置尺寸
                setSize();

                //初始化计时器
                setInter();

                //暴露slideToIndex方法
                me.slideToIndex = function (i) {
                    index = i;
                    slide();
                };

                //暴露prev方法
                me.prev = function () {
                    --index < 0 && (index = itemCount - 1);
                    slide();
                };

                //暴露next方法
                me.next = function () {
                    ++index === itemCount && (index = 0);
                    slide();
                };


                //取消自动轮播
                var $hover = $this.slice(0);
                $btnPrev && $hover.push($btnPrev[0]);
                $btnNext && $hover.push($btnNext[0]);
                $hover.on('mousemove', function () {
                    clearInterval(inter);
                });

                //设置自动轮播
                $hover.on('mouseout', function () {
                    setInter();
                });


                //鼠标移动响应函数
                function mousemoveHandler(evt) {
                    swipSpan = (isVertical ? evt.pageY : evt.pageX) - start;
                    slide(swipSpan);
                }

                //鼠标拖拽响应函数
                function dragstartHandler(evt) {
                    evt.preventDefault();
                }

                //触摸开始事件
                $doc.on('mousedown', function () {
                    //重置swipSpan
                    swipSpan = 0;
                });
                $this.on('mousedown', function (evt) {
                    //禁止拖动图片
                    $doc.on('dragstart', dragstartHandler);

                    //记录触摸开始位置
                    start = isVertical ? evt.pageY : evt.pageX;

                    //触摸移动事件
                    $doc.on('mousemove', mousemoveHandler);
                });

                //触摸结束事件
                $doc.on('mouseup', function () {
                    $doc.off('mousemove', mousemoveHandler).off('dragstart', dragstartHandler);
                    //向右,下
                    if (swipSpan > swipThreshold) {
                        --index < 0 && (index = 0);
                    }
                    //向左,上
                    if (swipSpan < -swipThreshold) {
                        ++index === itemCount && (index = itemCount - 1);
                    }

                    //滚动
                    swipSpan !== 0 && slide();
                }).trigger('mouseup');


                //pager点击
                $pagers.on('click', function () {
                    me.slideToIndex($(this).index());
                });


                //前进,后退按钮点击
                $btnPrev && $btnPrev.on('click', function () {
                    me.prev();
                });
                $btnNext && $btnNext.on('click', function () {
                    me.next();
                });


                //IE中mousemove后依然会触发click,为解决这一bug
                isIE && $this.on('click', function (evt) {
                    if (swipSpan !== 0) {
                        evt.preventDefault();
                    }
                });

            }


            //初始化
            init();

        });

    };
    $.fn.carousel.defaults = {
        //是否竖直方向滚动
        isVertical   : false,
        //滑动阈值
        swipThreshold: 50,
        //是否自动轮播
        isAutoPlay   : true,
        //轮播inter
        autoPlayInter: 6000,
        //动画时长
        slideTime    : 400,
        //轮播回调函数
        slideCallback: null,
        //是否显示title
        isShowTitle  : true,
        //初始index
        initIndex    : 0,
        //后退按钮
        $btnPrev     : null,
        //前进按钮
        $btnNext     : null,
        //是否显示pager
        isShowPager  : true
    };

})(window, $);