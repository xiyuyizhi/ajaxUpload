�°ٶ���AJax�ϴ��ļ����
   ������Ŀ:(����Ҫ��node����)
   1����ajaxUpload clone������
   2��npm install ��װ���ģ��
   3��node app.js������Ŀ
   4��������з���localhost:3000/ajax �����ϴ��ļ�

���Լ���Ŀ��ʹ�ô˲����
   1������Ŀ��public�µ�zjmy.upload�ļ��и��Ƶ��Լ���Ŀ��
   2�����Լ�ҳ��������destĿ¼�µ�js��css�ļ�
   3��$('XXX').upload({
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
    ��������ö������ʵ��ʹ������޸ļ���