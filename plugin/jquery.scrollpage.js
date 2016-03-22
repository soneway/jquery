/*
 * jquery.scrollpage.js
 * 页面滚动js
 */
(function (window, $) {

    $.fn.scrollpage = function (options) {

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.scrollpage.defaults, options);

            //配置项
            var scrollDuration = opts.scrollDuration,
                duration = opts.duration,
                scrollEasing = opts.scrollEasing,
                easing = opts.easing,
                isUnscroll = opts.isUnscroll,
                initIndex = opts.initIndex,
                inited = opts.inited,
                slideCallback = opts.slideCallback;

            //变量
            var thisEl = this,
                document = window.document,
                JSON = window.JSON,
                $html = $('html,body'),
                htmlEl = document.documentElement,
                scrollboxEl = thisEl,
                $scrollbox = $(scrollboxEl),
                $items = $scrollbox.children('*'),
                isIE6 = !-[1,] && !window.XMLHttpRequest;


            //初始化函数
            function init() {

                //如果是ie6,不作特效
                if (isIE6) {
                    return alert('您的浏览器太低级啦!请使用谷歌浏览器或者升级您的浏览器!');
                }

                //添加class
                $scrollbox.addClass('jq-scrollpage');
                $items.addClass('jq-scrollpage-item');

                //隐藏滚动条
                isUnscroll && $(htmlEl).addClass('jq-scrollpage-unsroll');

                //复位为隐藏元素
                $items.find('[data-showopts]').each(function () {
                    var $this = $(this),
                        opts = JSON.parse($this.attr('data-hideopts'));

                    $this.css(opts);
                });

                //初始化完成
                $scrollbox.addClass('inited');
                typeof inited === 'function' && inited($items);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {

                var index = initIndex,
                    itemCount = $items.length,
                    isAnimating = false,
                    windowHeight = htmlEl.clientHeight,
                    scrollTop = 0;

                function slide(i) {
                    i !== undefined && (index = i);

                    //计算scrollTop
                    scrollTop = index * windowHeight;

                    //正在动画
                    isAnimating = true;
                    //页面滚动动画
                    $html.animate({
                        scrollTop: scrollTop
                    }, scrollDuration, scrollEasing, function () {
                        isAnimating = false;
                    });

                    //隐藏动画
                    $items.filter('.current').removeClass('current').find('[data-showopts]').each(function () {
                        var $this = $(this);
                        $this.animate(JSON.parse($this.attr('data-hideopts')),
                            +$this.attr('data-duration') || duration,
                            $this.attr('data-easing') || easing);
                    });

                    //显示动画
                    $items.eq(index).addClass('current').find('[data-showopts]').each(function () {
                        var $this = $(this);
                        setTimeout(function () {
                            $this.animate(JSON.parse($this.attr('data-showopts')),
                                +$this.attr('data-duration') || duration,
                                $this.attr('data-easing') || easing);
                        }, $this.attr('data-delay'));
                    });

                    //函数回调
                    typeof slideCallback === 'function' && slideCallback(index, $items[index].id);
                }

                //暴露slideToIndex函数
                thisEl.slideToIndex = function (i) {
                    slide(i);
                };
                //暴露prev函数
                thisEl.prev = function () {
                    if (index-- === 0) {
                        return index = 0;
                    }
                    slide();
                };
                //暴露next函数
                thisEl.next = function () {
                    if (index++ === itemCount - 1) {
                        return index = itemCount - 1;
                    }
                    slide();
                };


                //滚动事件
                $(document).on('mousewheel', function (evt, delta) {
                    //是否禁用
                    if ($.fn.scrollpage.defaults.disable) return;

                    //阻止默认形为
                    evt.preventDefault();

                    if (!isAnimating) {

                        //初始化时,没有delta参数
                        if (!delta) {
                            return slide();
                        }

                        //较正delta的值(mac osx)
                        delta = delta > 0 ? 1 : -1;

                        //不作动画的情况
                        //滚动到第一屏
                        if (delta > 0 && index === 0) {
                            return;
                        }
                        //滚动到最后一屏
                        if (delta < 0 && index === itemCount - 1) {
                            return;
                        }

                        //index赋值
                        index -= delta;
                        slide();
                    }
                }).trigger('mousewheel');


                //窗口改变处理函数
                function resizeHandler() {
                    windowHeight = htmlEl.clientHeight;

                    //动画重置定位
                    scrollTop = index * windowHeight;
                    $html.animate({
                        scrollTop: scrollTop
                    }, scrollDuration, scrollEasing, function () {
                        isAnimating = false;
                    });
                }

                //节流函数
                function throttle(fn) {
                    clearTimeout(fn.tId);
                    fn.tId = setTimeout(function () {
                        fn();
                    }, 100);
                }

                //窗口大小改变
                $(window).on('resize', function () {
                    throttle(resizeHandler);
                });
            }


            //初始化(延迟是为了防止IE7中scrollbox的高度读取不到)
            setTimeout(function () {
                init();
            }, 500);

        });

    };
    $.fn.scrollpage.defaults = {
        //滚动动画duration
        scrollDuration: 800,
        //内容动画duration
        duration      : 800,
        //滚动动画easing
        scrollEasing  : 'easeInOutCubic',
        //内容动画easing
        easing        : 'swing',
        //是否禁用滚动条
        isUnscroll    : true,
        //初始index
        initIndex     : 0,
        //是否禁用
        disable       : false,
        //初始化完成回调
        inited        : null,
        //滚动回调函数
        slideCallback : null
    };

})(window, $);