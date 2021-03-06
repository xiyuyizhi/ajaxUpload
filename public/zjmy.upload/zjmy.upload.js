/**
 * Created by wangwei on 2015/8/13.
 * AJAX上传文件插件
 */

(function ($) {
    var $minimize,//最小化
        $maximize,//最大化
        $close,//关闭弹窗
        $uploadProcess,//整体弹窗
        $percentSpan,//进度百分比
        $processDiv,//进度背景框
        $li,//每条进度条
        $status,//取消或完成
        width,//进度条的宽度
        fileCount;//文件数量，用来确定多个文件何时全部上传完成
        //fileLength=0;//上传文件的数量，多次上传时此变量十分重要

    /**
     * 获取xhr函数
     * @returns {Function}
     */
    function obtainXhr() {
        var xhr;
        function createXhr() {
            var xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }
            else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            console.log(Object.prototype.toString.call(xhr)=='[object XMLHttpRequest]')
            xhr.withCredentials=true;
            return xhr;
        }
        return function () {
            return xhr || (xhr = createXhr());
        };

    }

    /**
     *检测文件后缀
     */
    function checkSuffix(allowSuffix, fileSuffix) {
        var suffixs = allowSuffix.split(',');
        for (var i = 0; i < suffixs.length; i++) {
            if (suffixs[i].toLowerCase() == fileSuffix) {
                return true;
            }
        }
        return false;
    }

    /**
     * 格式化文件尺寸
     */
    function parseFileInfo(size) {
        if(size/1024/1024>1){
            return (size/1024/1024).toFixed(2)+"Mkb"
        }else{
            return (size/1024).toFixed(2)+"KB"
        }
    }

    /**
     * 初始化上传进度条弹窗
     */
    function initProcessHtml() {
        var _html = "";
        _html += "<div id='uploadProcess'>";
        _html +=   "<p class='head gradientHead'>";
        _html +=      "<span class='headMsg'>上传中</span>";
        _html +=      "<span class='menu'>";
        _html +=         "<span class='minimize'></span>";
        _html +=         "<span class='maximize'></span>";
        _html +=         "<span id='close'>X</span>";
        _html +=       "</span>";
        _html +=   "</p>";
        _html += "<ul class='processUl'>";
        _html +=  "</ul>"
        _html += "</div>";
        return _html;
    }

    /**
     * 为进度条弹窗绑定相关事件
     */
    function eventListener(fileLen){
        $uploadProcess=$("#uploadProcess");
        $minimize=$("#uploadProcess .minimize");
        $maximize=$("#uploadProcess .maximize");
        $close=$("#uploadProcess #close");
        //最小化
        $minimize.on('click',function(){
            $uploadProcess.css('height','50px');
            $minimize.css('display','none');
            $maximize.css('display','block');
        });
        //最大化
        $maximize.on('click',function(){
            $uploadProcess.css('height','400px');
            $minimize.css('display','block');
            $maximize.css('display','none');
        });
        //关闭
        $close.on('click',function(){
            $uploadProcess.css('display','none');
            $(".processUl").html("");
            fileLen['length']=0;
        });

    }

    /**
     *创建上传进度条
     */
    function createProcessHtml(items,Suffix){
        var $ul=$('#uploadProcess .processUl'),
            _html="",
            UlHeight,
            LisHeight;
        for(var i=0;i<items.length;i++){
            if(i==(items.length-1)){
                _html += "<li class='lastLi'>";
            }
            else{
                _html += "<li>";
            }
            _html +=       "<div class='processDiv gradientProcess'></div>";
            _html +=          "<span class='title'>"+items[i].name+"</span>";
            _html +=          "<span class='size'>"+parseFileInfo(items[i].size)+"</span>";
            if(!checkSuffix(Suffix, items[i].type)){
                _html +=          "<span class='percent' style='visibility:visible'>已取消</span>";
                _html +=          "<span class='status cancel' title='取消' style='display:none'></span>";
            }else{
                _html +=          "<span class='percent'></span>";
                _html +=          "<span class='status cancel' title='取消'></span>";
            }
            _html +=    "</li>";
        }
        $ul.append(_html);
        $('#uploadProcess .headMsg').html("上传中");
        $li=$(".processUl li");
        width=$('#uploadProcess').width();
        $percentSpan = $('#uploadProcess .percent');
        $status=$("#uploadProcess .status");
        //当li的高度大于UL高度时,Ul加滚动条
        UlHeight=$ul.height();
        LisHeight=$li.height();
        if(UlHeight<LisHeight*$li.length){
            $ul.css('overflow-y','scroll');
        }else{
            $ul.css('overflow-y','hidden');
        }
    }


    /**
     * 上传进度处理函数
     */
    function process(position, totalSize, index) {
        var currentPercent = position / totalSize;
        $processDiv=$li.eq(index).find(".processDiv");
        $percentSpan.eq(index).css('visibility','visible');
        $percentSpan.eq(index).html((position / totalSize * 100).toFixed(2) + "%");
        $processDiv.css('width',currentPercent * parseInt(width) + "px");
    }

    /**
     * 上传文件处理函数
     */
    function fileUpload(getXhr,file, index,total, Setting) {
        var  xhr = getXhr();
        //当前进度条的取消按钮
        var $cancel=$status.eq(index);
        if (xhr.upload) {
            xhr.upload.addEventListener("progress", function (e) {
                process(e.position, e.totalSize, index);
            }, false);
            xhr.onreadystatechange = function (e) {
                //console.log(e)
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        $processDiv=$li.eq(index).find(".processDiv");
                        $processDiv.hide();
                        $percentSpan.eq(index).css('visibility','hidden');
                        $cancel.removeClass('cancel').addClass('ok');
                        $cancel.unbind()//上传成功后，解除当前取消上传操作
                        fileCount--;
                        //所有的文件都上传成功后
                        if(!fileCount){
                            $('#uploadProcess .headMsg').html("上传完成");
                            Setting.complete();
                            setTimeout(function(){
                                $('#uploadProcess').css("height","50px");
                                $minimize.css('display','none');
                                $maximize.css('display','block');
                            },500);
                        }
                        Setting.success(file,xhr);
                    } else {
                        Setting.error(file,xhr);
                    }
                }
            };
            xhr.open(Setting.method, Setting.url, true);
            var formData = new FormData();
            formData.append('file', file);//multipart/form-data
            xhr.send(formData);

            //取消上传
            $cancel.bind('click',function(){
                xhr.abort();
                $processDiv.hide();
                $cancel.hide();
                $('#uploadProcess .percent').eq(index).html('已取消');
                $('#uploadProcess .headMsg').html("已取消");
                $minimize.click();
                console.log("取消上传成功");
            });
        }
    }
    $.fn.extend({
        'upload': function (options) {
            var fileLength={'length':0};//上传文件的数量，多次上传时此变量十分重要
            var defaultSetting = {
                url: "/",
                method: 'POST',
                maxFileCount:'10',
                allowSuffix: 'image/png,image/jpeg',
                success: function () {
                },
                error: function () {
                },
                complete: function () {
                }
            };
            this.each(function (index, obj) {
                (function(options){
                    //初始时创建上传进度条弹窗
                    $("#uploadProcess").remove();
                    var _html=initProcessHtml();
                    $("body").append(_html);
                    //为进度条弹窗绑定相关事件
                    eventListener(fileLength);
                    $("input[type=file]").remove();
                    if($('input[type=file]').length===0){
                        $(obj).after("<input type='file' name='fileselect[]' multiple style='display: none;'>");
                        $('input[type=file]').on('change',function(e){
                            var eve=e||window.event;
                            var Setting = $.extend(defaultSetting, options);
                            changeFn(eve,Setting);
                            eve.target.value='';//同一张图片也可以多次上传了
                        });//不要重复绑定！！！！1
                    };
                    $(obj).next().css({"height":"0"});//隐藏file上传框
                    //点击当前标签弹出文件选择框
                    $(obj).off("click");//先解除之前的事件绑定
                    $(obj).on('click',function () {
                        $('input[type=file]').click()
                    });
                })(options)
            });
            /**
             *选择文件后的事件处理函数
             */
            function changeFn(e,Set) {
                var files = e.target.files;
                console.log("文件列表");
                var getXhr;
                if(files.length==0){
                    return false;
                }
                if(files.length>Set.maxFileCount){
                    alert("一次最多只能上传"+Set.maxFileCount+"个文件！");
                    return ;
                }
                //创建进度条
                createProcessHtml(files,Set.allowSuffix);
                //显示弹窗
                $uploadProcess.show();
                $maximize.click();
                fileCount=files.length;
                for (var i = 0; i < files.length; i++) {
                    if (checkSuffix(Set.allowSuffix, files[i].type)) {
                        getXhr= obtainXhr();
                        console.log(files[i])
                        fileUpload(getXhr,files[i], (i+fileLength['length']),(files.length+fileLength['length']), Set);
                    } else {
                        alert(files[i].name + " 文件格式不允许！");
                        $('#uploadProcess .headMsg').html("已取消");
                        $minimize.click();
                    }
                }
                fileLength['length']+=files.length;//第二次及之后上传时index从当前已有li长度开始
            }
        }//end upload()
    });

})(jQuery)


