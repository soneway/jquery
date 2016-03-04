/*
 * picker.js
 * 二级选择器
 */
(function (window, $) {

    var $doc = $(document);
    //范围外点击
    $doc.on('click', function (evt) {
        $(evt.target).closest('.pi-picker').length === 0 && $('.pi-picker').removeClass('on');
    });

    $.fn.picker = function (opts) {
        opts = $.extend({}, $.fn.picker.defaults, opts);

        //配置项
        var data = opts.data;

        //每个元素执行
        return this.each(function () {

            //变量
            var $opener = $(this).addClass('pi-opener').attr('readonly', 'readonly').wrap('<div class="pi-picker"></div>'),
                $picker = $opener.parent('.pi-picker');

            //初始化函数
            function init() {
                //html
                var html = '';
                html += '<div class="ul-box"><ul class="ul-root">';
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    html += '<li class="li-root" data-value="' + item.val + '">' + item.txt + '</li>';
                }
                html += '</ul></div>';
                $picker.append(html);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {

                var $liRoot = $picker.find('.li-root');

                //root选项点击
                $picker.on('click', '.li-root', function () {
                    var $this = $(this),
                        txt = $this.attr('data-value');

                    //关闭box
                    $picker.removeClass('on');
                    //赋值
                    $opener.val(txt);
                    //二级列表选中状态
                    $liRoot.removeClass('selected');
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
    $.fn.picker.defaults = {
        //渲染数据源
        data: null
    };

})(window, $);