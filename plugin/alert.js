/*通用弹框*/
(function (window, $) {

    require('fancybox');


    //alert方法
    window.alert = (function () {
        var $alert = $('#alert'),
            $head = $alert.find('.head'),
            $msg = $alert.find('.msg'), opts;

        //取消按钮点击
        $alert.on('click', '.btn_cancel', function () {
            var btnCancelClick = opts.btnCancelClick;
            typeof btnCancelClick === 'function' && btnCancelClick();
            $.fancybox.close();
        });

        return function (_opts) {
            //配置项
            typeof _opts === 'string' && (_opts = {msg: _opts});
            opts = $.extend({}, window.alert.defaults, _opts);

            //显示内容
            $head.html(opts.head);
            $msg.html(opts.msg);

            //打开窗口
            $.fancybox($.extend({}, opts, {
                href : '#alert',
                type : 'inline',
                modal: true
            }));
        };
    })();
    window.alert.defaults = {
        msg : '内容',
        head: '提示'
    };


    //confirm方法
    window.confirm = (function () {
        var $confirm = $('#confirm'),
            $head = $confirm.find('.head'),
            $msg = $confirm.find('.msg'), opts;

        //确定和取消按钮点击
        $confirm.on('click', '.btn_ok', function () {
            var btnOkClick = opts.btnOkClick;
            typeof btnOkClick === 'function' && btnOkClick();
            $.fancybox.close();
        }).on('click', '.btn_cancel', function () {
            var btnCancelClick = opts.btnCancelClick;
            typeof btnCancelClick === 'function' && btnCancelClick();
            $.fancybox.close();
        });

        return function (_opts) {
            //配置项
            opts = $.extend({}, window.confirm.defaults, _opts);

            //设置内容
            $head.html(opts.head);
            $msg.html(opts.msg);

            //打开窗口
            $.fancybox($.extend({}, opts, {
                href : '#confirm',
                type : 'inline',
                modal: true
            }));
        };
    })();
    window.confirm.defaults = {
        msg : '内容',
        head: '提示'
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