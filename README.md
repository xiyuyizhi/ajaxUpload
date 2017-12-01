仿百度云AJax上传文件插件

   运行项目:(本地要有node环境)
   
   1、将ajaxUpload clone到本地
   
   2、npm install 安装相关模块
   
   3、grunt default 构建文件
   
   3、node app.js启动项目
   
   4、浏览器中访问localhost:3000/ajax 便能上传文件
   

在自己项目中使用此插件：

   1、将项目中public下的zjmy.upload文件夹复制到自己项目中
   
   2、在自己页面中引入dest目录下的js、css文件（先要引用jquery）
   
   ```
   默认配置项：
    url: "/"  上传地址
    method: 'POST'  请求方法
    maxFileCount:'10'  一次最大的上传数量
    allowSuffix: 'image/png,image/jpeg,audio/mp3,audio/mpeg,text/plain,application/msword', 允许的后缀列表
    success: 回调
    error: 
    complete:所有文件都上传后的回调
   ```
   
   使用：
   ```
   <link href="**my.uploadmy.upload.css" rel="stylesheet">
   <script src="**my.upload/jquery-1.8.0.min.js"></script>
   <script src="**my.uploadmy.upload.js"></script>
   
   <div id="up" class="gradientHead upDiv">上传文件</div>
   $('#up').upload({
                   method: 'POST',
                   url: '/upload',
                   maxFileCount:2
                   。
                   。
                   。
               });
   ```
   注意：
   使用时可以根据实际情况修改：
      zjmy.upload.js中：
      $(this).after("<input type='file' name='fileselect[]' multiple style='visibility: hidden'>");修改name名称，与后台参数对应
      或：响应回调中：xhr.status == 201、200等，根据后台指定的状态码确定;

