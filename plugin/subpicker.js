/*
 * subpicker.js
 * 二级选择器
 */
(function (window, $) {

    var $doc = $(document);
    //范围外点击
    $doc.on('click', function (evt) {
        $(evt.target).closest('.pi-subpicker').length === 0 && $('.pi-subpicker').removeClass('on');
    });

    $.fn.subpicker = function (opts) {
        opts = $.extend({}, $.fn.subpicker.defaults, opts);

        //配置项
        var data = opts.data,
            initAttr = opts.initAttr;

        //每个元素执行
        return this.each(function () {

            //变量
            var $opener = $(this).addClass('pi-opener').attr('readonly', 'readonly').wrap('<div class="pi-subpicker"></div>'),
                $picker = $opener.parent('.pi-subpicker');

            //初始化函数
            function init() {
                //html
                var html = '';
                html += '<div class="ul-box"><ul class="ul-root">';
                for (var p in data) {
                    var val = data[p];
                    html += '<li class="li-root' + (p === initAttr ? ' on' : '') + '">' +
                        '<a class="pk-root">' + p + '</a><ul class="ul-sub">';
                    for (var i = 0, len = val.length; i < len; i++) {
                        html += '<li class="li-sub">' + val[i] + '</li>';
                    }
                    html += '</ul></li>';
                }
                html += '</ul></div>';
                $picker.append(html);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {

                var $liRoot = $picker.find('.li-root'),
                    $liSub = $picker.find('.li-sub');

                //root选项点击
                $picker.on('click', '.pk-root', function () {
                    var $this = $(this);

                    $liRoot.removeClass('on');
                    //li_root选中状态,打开相应的二级列表
                    $this.closest('.li-root').addClass('on');
                });

                //sub选择点击
                $picker.on('click', '.li-sub', function () {
                    var $this = $(this),
                        txt = $this.text();

                    //关闭box
                    $picker.removeClass('on');
                    //赋值
                    $opener.val(txt);
                    //二级列表选中状态
                    $liSub.removeClass('selected');
                    $this.addClass('selected');
                });

                //打开点击
                $picker.on('click', '.pi-opener', function () {
                    //打开.关闭box
                    $picker.toggleClass('on');
                });
            }


            //初始化
            init();

        });
    };
    $.fn.subpicker.defaults = {
        //渲染数据源
        data    : null,
        //选中的属性
        initAttr: ''
    };

})(window, $);