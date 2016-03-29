/*
 * subpicker.js
 * 二级选择器
 */
(function (window, $) {

    var $doc = $(document), pickerEls = [];
    //点击时关闭其他picker
    $doc.on('click', function (evt) {
        var $srcPicker = $(evt.target).closest('.pi-subpicker'),
            $pickers = $(pickerEls);

        //picker外点击
        $srcPicker.length === 0 ? $pickers.removeClass('on') : $pickers.each(function () {
            //除当前picker,其他picker全部关闭
            this !== $srcPicker[0] && $(this).removeClass('on');
        });
    });

    $.fn.subpicker = function (opts) {
        opts = $.extend({}, $.fn.subpicker.defaults, opts);

        //配置项
        var data = opts.data || {},
            initIndex = opts.initIndex,
            editable = opts.editable,
            valueFormat = opts.valueFormat,
            picked = opts.picked;

        //每个元素执行
        return this.each(function () {

            //变量
            var $opener = $(this).addClass('pi-opener').wrap('<div class="pi-subpicker"></div>'),
                $picker = $opener.parent('.pi-subpicker'), $ulRoot, $liRoot, $liSub;

            //添加picker元素
            pickerEls.push($picker[0]);

            //刷新列表项函数
            function refreshList(data) {
                //html
                var html = '';
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    html += '<li class="li-root' + (i === initIndex ? ' on' : '') + '">' +
                        '<a class="pk-root">' + item.key + '</a><ul class="ul-sub">';
                    (function () {
                        var array = item.val;
                        for (var i = 0, len = array.length; i < len; i++) {
                            html += '<li class="li-sub">' + array[i] + '</li>';
                        }
                    })();
                    html += '</ul></li>';
                }
                $ulRoot.html(html);

                $liRoot = $ulRoot.find('.li-root');
                $liSub = $ulRoot.find('.li-sub');
            }

            //初始化函数
            function init() {

                !editable && $opener.attr('readonly', 'readonly');

                $picker.append('<div class="ul-box"><ul class="ul-root"></ul></div>');
                $ulRoot = $picker.find('.ul-root');

                //列表html
                refreshList(data);

                //初始化事件
                initEvent();
            }

            //初始化事件函数
            function initEvent() {

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
                    //获取值
                    var val = typeof valueFormat === 'function' ? valueFormat($this.closest('.li-root').find('.pk-root').text(), txt) : txt;
                    //赋值
                    $opener.val(val);

                    //回调
                    typeof picked === 'function' && picked(val, $this);

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
        data       : null,
        //选中的索引
        initIndex  : 0,
        //是否可编辑
        editable   : false,
        //返回值格式化
        valueFormat: null,
        //选择后回调
        picked     : null
    };

})(window, $);