/*通用弹框*/
(function (window, $) {

    //初始化html
    var html = '<div id="alert" class="alert"><div class="box"><h2 class="head"></h2><p class="msg"></p><p><a class="btn btn_ok">确定</a></p></div></div>' +
        '<div id="confirm" class="alert"><div class="box"><h2 class="head"></h2><p class="msg"></p><p><a class="btn btn_ok">确定</a><a class="btn btn_cancel">取消</a></p></div></div>' +
        '<div id="dialog" class="alert"><div class="box"><iframe frameborder="0"></iframe><a class="btn_close">╳</a></div></div>' +
        '<div id="tooltip"></div>';
    $(document.body).append(html);


    //alert方法
    var alert = window.alert = (function () {
        var $alert = $('#alert'),
            $head = $alert.find('.head'),
            $msg = $alert.find('.msg'), opts;

        //确定按钮点击
        $alert.on('click', '.btn_ok', function () {
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();

            //关闭窗口
            $alert.removeClass('visible');
        });

        return function (_opts) {
            //配置项
            typeof _opts !== 'object' && (_opts = {msg: _opts});
            opts = $.extend({}, alert.defaults, _opts);

            //显示内容
            $head.html(opts.head);
            $msg.html(opts.msg);

            //打开窗口
            $alert.addClass('visible');
        };
    })();
    alert.defaults = {
        msg : '内容',
        head: '提示'
    };


    //confirm方法
    var confirm = window.confirm = (function () {
        var $confirm = $('#confirm'),
            $head = $confirm.find('.head'),
            $msg = $confirm.find('.msg'), opts;

        //确定和取消按钮点击
        $confirm.on('click', '.btn_ok', function () {
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();

            //关闭窗口
            $confirm.removeClass('visible');
        }).on('click', '.btn_cancel', function () {
            var btnCancelClick = opts.btnCancelClick;
            typeof btnCancelClick === 'function' && btnCancelClick();

            //关闭窗口
            $confirm.removeClass('visible');
        });

        return function (_opts) {
            //配置项
            opts = $.extend({}, confirm.defaults, _opts);

            //设置内容
            $head.html(opts.head);
            $msg.html(opts.msg);

            //打开窗口
            $confirm.addClass('visible');
        };
    })();
    confirm.defaults = {
        msg : '内容',
        head: '提示'
    };


    //dialog方法
    var dialog = window.dialog = (function () {
        var $dialog = $('#dialog'),
            $box = $dialog.find('.box'),
            $iframe = $dialog.find('iframe'),
            htmlEl = document.documentElement, opts;

        //关闭按钮点击
        $dialog.on('click', '.btn_close', function () {
            dialog.close();
        });

        return function (_opts) {
            //配置项
            opts = $.extend({}, dialog.defaults, _opts);

            //高度限定不超过窗口高度
            var wHeight = htmlEl.clientHeight;
            opts.height > wHeight && (opts.height = wHeight);

            //设置页面
            $iframe.attr({
                width : opts.width,
                height: opts.height,
                src   : opts.href
            });

            //设置位置尺寸
            $box.css({
                'margin-left': -opts.width / 2 + 'px',
                'margin-top' : -opts.height / 2 + 'px'
            });

            //打开窗口
            $dialog.addClass('visible');

            //关闭函数
            dialog.close = function () {
                var onClose = opts.onClose;
                typeof onClose === 'function' && onClose();

                //关闭窗口
                $dialog.removeClass('visible');

                //重置页面
                $iframe.attr('src', '');
            };
        };
    })();
    dialog.defaults = {
        width : 980,
        height: 600
    };


    //tooltip方法
    window.tooltip = (function () {
        var $tooltip = $('#tooltip'),
            timeout;

        return function (msg, time) {
            $tooltip.html(msg).addClass('visible');

            //定时隐藏
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                $tooltip.removeClass('visible');
            }, time || 2000);
        };
    })();

})(window, $);