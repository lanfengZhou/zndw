var express=require('express');
var router=express.Router();
var query=require("../lib/db/mysql");

router.get('/loctype/query',function(req,res,next){
	query('select * from loctype',function(err,vals,fileds){
		res.json({'success':true,'loctype':vals});
	});

})

module.exports=router;