var express = require('express');
var router = express.Router();
var query= require('../lib/db/mysql');
var moment = require("moment");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/gps/query',function(req,res,next){
	var page=req.body.page;
	var rows=req.body.rows;
	var total;
	var pages;
	query('select * from gps',function(err,vals,fileds){
		total=vals.length;
		pages=Math.ceil(total/rows);
		var start=rows*(page-1);
		var stop=rows*page;
		query('select * from gps limit '+start+','+stop,function(err,vals,fileds){
			for (var i = 0; i < vals.length; i++) {
				vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD HH:mm:ss');
				vals[i].updateTime=moment(vals[i].updateTime).format('YYYY-MM-DD HH:mm:ss');
			}
			res.json({'success':true,'total':total,'pages':pages,'gps':vals});

			});
		});
});
router.post('/gps/add',function(req,res,next){
	var number=req.body.number;
	var alias=req.body.alias;
	var date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	query('insert into gps(number,alias,insertTime) values('+number+','+alias+',"'+date+'")',function(err,vals,fileds){
		// console.log(vals);
		if (vals) {
			res.json({'success':true,'result':'ok'});
		}else{
			res.json({'success':true,'result':'failed'});
		}
	});
});
router.post('/gps/delete',function(req,res,next){
	var id=req.body.id;
	query('delete from gps where id='+id,function(err,vals,fileds){
		if(err==null){
			res.json({'success':true,'result':'ok'});
		}else{
			res.json({'success':true,'result':'failed'});
		}
	});
});
router.post('/gps/edit',function(req,res,next){
	var id=req.body.id;
	var alias=req.body.alias;
	query('update gps set alias='+alias+' where id='+id,function(err,vals,fileds){
		if(err==null){
			res.json({'success':true,'result':'ok'});
		}else{
			res.json({'success':true,'result':'failed'});
		}
	});
});
router.post('/gps/checkTagnum',function(req,res,next){
	var number=req.body.number;
	// console.log(typeof(number));
	if(number!=''){
		query('select * from gps where number='+number,function(err,vals,fileds){
		if(vals.length>0){
			res.json({'success':true,'result':'exist'});
		}else{
			res.json({'success':true,'result':'ok'});
		}
		});
	}

});
router.get('/gps/getTagnum',function(req,res,next){
	query('select g.* from gps as g left join gpsobj as o on g.id=o.gps_id where o.gps_id is null ',
		function(err,vals,fileds){
			if(err==null){
				res.json({'success':true,'tagnum':vals});
			}
		});
})
module.exports = router;
