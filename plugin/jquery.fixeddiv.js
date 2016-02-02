(function (window, $) {
    $.fn.fixeddiv = function (options) {
        var isIE6 = $.browser.msie && $.browser.version < 7 && !window.XMLHttpRequest;

        $.fn.fixeddiv.deflunt = {
            left: 0,
            top: 0
        };

        //每个元素执行
        return this.each(function () {
            var opts = options || $.fn.fixeddiv.deflunt;

            var $this = $(this);
            if (!isIE6) {
                $this.css(opts);
                $this.css({
                    position: 'fixed'
                });
            }
            //如为ie6
            else {
                var leftStr;
                var topStr;
                if (opts.left != null) {
                    leftStr = 'expression(eval(document.documentElement.scrollLeft+' + opts.left + '))';
                }
                if (opts.top != null) {
                    topStr = 'expression(eval(document.documentElement.scrollTop+' + opts.top + '))';
                }
                if (opts.right != null) {
                    leftStr = 'expression(eval((document.documentElement.scrollLeft+document.documentElement.clientWidth-this.offsetWidth)-(parseInt(this.currentStyle.marginLeft,10)||0)-(parseInt(this.currentStyle.marginRight,10)||0)-' + opts.right + '))';
                }
                if (opts.bottom != null) {
                    topStr = 'expression(eval((document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight)-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)-' + opts.bottom + '))';
                }
                var className = 'fixeddiv' + Math.ceil(Math.random() * 99999999);
                var styleStr = '<style type="text/css">';
                styleStr += '*html{background-image:url(about:blank);background-attachment:fixed;}';
                styleStr += '*html .' + className + '{left:' + leftStr + '; top:' + topStr + ';position: absolute;}';
                styleStr += '</style>';
                $(styleStr).appendTo($('head'));
                $this.addClass(className);
            }
            $this.appendTo($('body'));
            switch (opts.effect) {
                case 'fade':
                {
                    $this.fadeIn();
                    break;
                }
                case 'slide':
                {
                    $this.slideDown();
                    break;
                }
            }
        });
    }
})(window, $);