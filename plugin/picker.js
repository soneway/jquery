/*
 * picker.js
 * 二级选择器
 */
(function (window, $) {

    var $doc = $(document), pickerEls = [];
    //点击时关闭其他picker
    $doc.on('click', function (evt) {
        var $srcPicker = $(evt.target).closest('.pi-picker'),
            $pickers = $(pickerEls);

        //picker外点击
        $srcPicker.length === 0 ? $pickers.removeClass('on') : $pickers.each(function () {
            //除当前picker,其他picker全部关闭
            this !== $srcPicker[0] && $(this).removeClass('on');
        });
    });

    $.fn.picker = function (opts) {
        opts = $.extend({}, $.fn.picker.defaults, opts);

        //配置项
        var data = opts.data || [],
            editable = opts.editable,
            firstOpt = opts.firstOpt;

        //每个元素执行
        return this.each(function () {

            //变量
            var me = this,
                $opener = $(me).addClass('pi-opener').wrap('<div class="pi-picker"></div>'),
                $picker = $opener.parent('.pi-picker'), $ulBox, $ulRoot, $liRoot;

            //添加picker元素
            pickerEls.push($picker[0]);

            //刷新列表项函数
            function refreshList(_data) {
                data = _data;

                //html
                var html = '';

                //第一个空选项
                firstOpt && (html += '<li class="li-root" data-value="">' + firstOpt + '</li>');

                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i],
                        isObj = typeof item === 'object',
                        val = isObj ? item.val : item,
                        txt = isObj ? item.txt : item;

                    html += '<li class="li-root" data-value="' + val + '">' + txt + '</li>';
                }
                $ulRoot.html(html);
                $liRoot = $ulRoot.find('.li-root');
            }

            //设置值函数
            function setValue(val) {
                //设值为空时
                if (val === '') {
                    return $opener.attr('data-value', val).val(firstOpt);
                }

                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i],
                        isObj = typeof item === 'object';

                    //不为对象
                    if (!isObj) {
                        return $opener.attr('data-value', val).val(val);
                    }

                    //为对象
                    if (item.val === val) {
                        $opener.attr('data-value', val).val(item.txt);
                        break;
                    }
                }
            }

            //暴露方法
            me.refreshList = refreshList;
            me.setValue = setValue;


            //初始化函数
            function init() {

                !editable && $opener.attr('readonly', 'readonly');

                $picker.append('<div class="ul-box"><ul class="ul-root"></ul></div>');
                $ulRoot = $picker.find('.ul-root');
                $ulBox = $picker.find('.ul-box');

                //列表html
                refreshList(data);


                //初始化事件
                initEvent();
            }


            //初始化事件函数
            function initEvent() {

                //root选项点击
                $picker.on('click', '.li-root', function () {
                    var $this = $(this),
                        val = $this.attr('data-value'),
                        txt = $this.text(),
                        onpicked = me.onpicked;

                    //关闭box
                    $picker.removeClass('on');
                    //赋值
                    $opener.attr('data-value', val).val(txt);

                    //回调
                    typeof onpicked === 'function' && onpicked(val, txt, $this);

                    //二级列表选中状态
                    $liRoot.removeClass('selected');
                    $this.addClass('selected');
                });

                //打开点击
                $picker.on('click', '.pi-opener', function () {
                    //打开,关闭box
                    $picker.toggleClass('on');
                });
            }


            //初始化
            init();

        });
    };
    $.fn.picker.defaults = {
        //渲染数据源
        data    : null,
        //是否可编辑
        editable: false,
        //第一个选项
        firstOpt: ''
    };

})(window, $);