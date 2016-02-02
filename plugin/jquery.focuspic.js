(function (window, $) {

    $.fn.focuspic = function (options) {

        //每个元素执行
        return this.each(function () {
            var opts = $.extend({}, $.fn.focuspic.deflunt, options);

            //图片地址
            if (!opts.pics) {
                return;
            }

            //配置项
            var pics = opts.pics,
                links = opts.links,
                titles = opts.titles,
                effect = opts.effect,
                duration = opts.duration,
                loopDuration = opts.loopDuration,
                eventType = opts.eventType,
                autoPlay = opts.autoPlay,
                isShowNum = opts.isShowNum,
                playCallback = opts.playCallback;


            //变量
            //循环当前索引
            var loopIndex = 0,
            //定时器
                timer,
            //循环总数
                picsLength = pics.length;

            $this = $(this);
            var height = $this.height(),
                width = $this.width();
            //按钮html生成
            var btnHtml = [];
            for (var i = 0, len = picsLength; i < len; i++) {
                btnHtml.push('<a href="javascript:void(0)">' + (isShowNum ? (i + 1) : '&nbsp;') + '</a>');
            }
            //html拼接
            var html = [];
            html.push('<div class="focuspic_container" style="width: ' + width + 'px; height: ' + height + 'px;">');
            html.push('    <div class="focuspic_img_contaner"></div>');
            html.push('    <div class="focuspic_ctrl_container">');
            html.push('        <div class="focuspic_ctrl_bg" style="width:' + width + 'px;">');
            html.push('        </div>');
            html.push('        <div class="focuspic_ctrl">');
            html.push(btnHtml.join(''));
            html.push('        </div>');
            html.push('        <div class="focuspic_title">');
            html.push('        </div>');
            html.push('    </div>');
            html.push('</div>');
            $this.html(html.join(''));

            //相关操作
            var $btns = $this.find('.focuspic_ctrl a');
            var $imgContainer = $this.find('.focuspic_img_contaner');
            var $title = $this.find('.focuspic_title');
            //点击操作
            $btns.bind(eventType, function () {
                $btns.removeClass('selected');
                var $thisBtn = $(this);
                var index = $thisBtn.index();
                loopIndex = index; //设置循环当前索引
                $thisBtn.addClass('selected');
                //轮播回调
                $.isFunction(playCallback) && playCallback(loopIndex);
                //1.先隐藏
                $imgContainer.hide();
                //2.设置图片和链接
                var imgHtml = (links && links[index]) ? ('<a title="' + ((titles && titles[index]) ? titles[index] : '') + '" ' + (links[index].slice(0, 1) === '#' ? '' : 'target="_blank"') + ' href="' + links[index] + '"><img src="' + pics[index] + '" style="width: ' + width + 'px; height: ' + height + 'px;" /></a>') : ('<img src="' + pics[index] + '" style="width: ' + width + 'px; height: ' + height + 'px;" />');
                $imgContainer.html(imgHtml).mouseenter(function () {
                    clearInterval(timer);
                }).mouseout(function () {
                    clearInterval(timer);
                    if (autoPlay) {
                        timer = setInterval(play, loopDuration);
                    }
                });
                //3.设置过场动画
                switch (effect) {
                    case 'extendw':
                    {
                        $imgContainer.animate({
                            width: 'toggle'
                        }, duration, 'swing');
                        break;
                    }
                    case 'extendh':
                    {
                        $imgContainer.animate({
                            height: 'toggle'
                        }, duration, 'swing');
                        break;
                    }
                    case 'extendb':
                    {
                        $imgContainer.animate({
                            width: 'toggle',
                            height: 'toggle'
                        }, duration, 'swing');
                        break;
                    }
                    default:
                    {
                        $imgContainer.animate({
                            opacity: 'show'
                        }, duration, 'swing');
                        break;
                    }
                }
                //4.设置标题
                var title = titles && titles[index] ? titles[index] : '';
                $title.text(title);
            }).eq(0).trigger(eventType);

            //循环
            if (autoPlay) {
                timer = setInterval(play, loopDuration);
            }
            function play() {
                if (loopIndex++ == (picsLength - 1)) {
                    loopIndex = 0;
                }
                $btns.eq(loopIndex).trigger(eventType);
            }
        });
    };
    $.fn.focuspic.deflunt = {
        //图片地址
        pics: null,
        //链接
        links: null,
        //标题
        titles: null,
        //效果
        effect: 'fade',
        //动画效果间隔时间
        duration: 600,
        //动画切换间隔时间
        loopDuration: 8000,
        //触发事件类型
        eventType: 'mouseover',
        //是否自动播放
        autoPlay: true,
        //是否显示数字
        isShowNum: true,
        //播放回调函数
        playCallback: null
    };

})(window, $);