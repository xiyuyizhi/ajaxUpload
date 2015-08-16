var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs=require('fs');
var path = require('path');
var upload = multer({ dest: 'uploads/' });
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/ajax', function(req, res, next) {
    res.render('ajaxUpload');
});

router.post("/upload",upload.array('file',10),function(req,res,next){
    console.log("okoko");
    console.log("name"+req.body.name);
    console.log(req.files);
    var oPs=req.files;
    var _html="";
    for(var i=0;i<oPs.length;i++){
        var file=oPs[i];
        var p='uploads/'+oPs[i].originalname;
        _html+="<h2>"+oPs[i].originalname+"</h2><br/>"
        fs.rename(oPs[i].path,p,function(err){
            if(err) return next(err);
            console.log("ok")
        })
    }
    res.setHeader('Content-Type','text/html');
    res.end(_html+"<br/>共"+oPs.length+"个文件上传成功!");
})

module.exports = router;
