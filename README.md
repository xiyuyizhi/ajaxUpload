仿百度云AJax上传文件插件
   运行项目:(本地要有node环境)
   1、将ajaxUpload clone到本地
   2、npm install 安装相关模块
   3、node app.js启动项目
   4、浏览器中访问localhost:3000/ajax 便能上传文件

在自己项目中使用此插件：
   1、将项目中public下的zjmy.upload文件夹复制到自己项目中
   2、在自己页面中引入dest目录下的js、css文件
   3、$('XXX').upload({
         method: 'POST',
         url: '/upload',
         maxFileCount:2,
         success: function (file, xhr) {
            console.log(file.name+" success")
         },
         complete: function (file, xhr) {
            console.log("all upload success")
         }
         .
         .
         .
         .
      }
    传入的配置对象根据实际使用情况修改即可