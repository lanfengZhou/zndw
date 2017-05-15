var express = require('express');
var router = express.Router();
var query= require('../lib/db/mysql');
var moment = require("moment");
var queryAll=require('./GpsobjServices');
var isPointLnPolygon=require('./isPointInPolygon');

router.post('/gpsobj/query',function(req,res,next){
	var page=req.body.page;
	var rows=req.body.rows;
	var start=rows*(page-1);
	var limit=rows*page;
	var filters=req.body.filters;
	var sql=queryAll(filters,start,limit);
	var total;
	var pages;
	query('select * from gpsobj',function(err,vals,fileds){
		total=vals.length;
		pages=Math.ceil(total/rows);
		query(sql,function(err,vals,fileds){
			if(err==null){
				for (var i = 0; i < vals.length; i++) {
					vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD HH:mm:ss');
					// vals[i].updateTime=moment(vals[i].updateTime).format('YYYY-MM-DD HH:mm:ss');
				}
				res.json({'success':true,'total':total,'pages':pages,'gpsobj':vals});
			}else{
				console.log(err);
			}
		});
	});

});
//添加定位对象
router.post('/gpsobj/add',function(req,res,next){
	var alias=req.body.alias;
	var typeNum=req.body.typeNum;
	var state=req.body.state;
	var number=req.body.number;
	if(typeof(number)=='undefined'){//判断是否添加绑定
		number=null;
	}
	var date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	if(number==1){
		res.json({'success':true,'reason':'错误添加'});
	}else{
		query('insert into gpsobj(alias,type_id,gps_id,state,insertTime,updateTime) values("'+alias+'",'
			+typeNum+','+number+',"'+state+'","'+date+'","'+date+'")',function(err,vals,fileds){
				if(err==null){
					res.json({'success':true,'result':'ok'});
				}else{
					console.log(err);
					res.json({'success':true,'result':'failed'});
				}
		});
	}
});
router.post('/gpsobj/delete',function(req,res,next){
	var id=req.body.id;
	query('delete from gpsobj where id='+id,function(err,vals,fileds){
		if(vals){
			res.json({'success':true,'result':'ok'});

		}else{
			res.json({'success':true,'result':'failed'});
		}
	})

});
router.post('/gpsobj/edit',function(req,res,next){
	var id=req.body.id;
	var alias=req.body.alias;
	var typeNum=req.body.typeNum;
	var number=req.body.number;
	var state=req.body.state;
	console.log(state);
	if(typeof(number)=='undefined'){
		number=null;
	}
	var date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	if(number==1){
		res.json({'success':true,'reason':'错误添加'});
	}else{
		query('update gpsobj set alias="'+alias+'",type_id='+typeNum+',gps_id='+number+',state="'+state+
			'",updateTime="'+date+'" where id='+id,function(err,vals,fileds){
				if(err==null){
					res.json({'success':true,'result':'ok'});
				}else{
					console.log(err);
					res.json({'success':true,'result':'failed'});
				}
		});
	}
});
router.post('/gpsobj/unbind',function(req,res,next){
	var id=req.body.id;
	var gps_id=null;
	query('update gpsobj set state="false",gps_id='+gps_id+' where id='+id,function(err,vals,fields){
		if(err==null){
			res.json({'success':true});
		}else{
			console.log(err);
		}
	});
});
/**
 * 获取所有已经绑定GPS的对象
 * @param  {[type]} req                   [description]
 * @param  {[type]} res                   [description]
 * @param  {String} next){	query('select *             from gpsobj where state [description]
 * @return {[type]}                       [description]
 */
router.get('/gpsobj/getBindObj',function(req,res,next){
	query('select id,alias from gpsobj where state="true"',function(err,vals,fields){
		if(err==null){
			res.json({'success':true,'result':vals});
		}else{
			console.log(err);
		}
	});
});
/**
 * 保存多边形的顶点到数据库
 * @param  {[type]} req         内容
 * @param  {[type]} res         回调函数
 */
router.post('/gpsobj/savePolygon',function(req,res,next){
	var points=req.body.points;
	query("update points set paths='"+points+"' where id=1",function(err,vals,fileds){
		if (err==null) {
			res.json({'success':true});
		}else{
			console.log(err);
		}
	});
});
router.get('/gpsobj/delPolygon',function(req,res,next){
	query('update points set paths="null" where id=1',function(err,vals,fields){
		if (err==null) {
			res.json({'success':true,'result':'ok'});
		}else{
			res.json({'success':true,'result':'failed'});
		}
	});
});
/**
 * 判断GPS对象是否在多边形内
 * @param  {[type]} req         [description]
 * @param  {[type]} res         [description]
 * @param  {[type]} next){	var point         对象坐标
 * @return {[type]}             [description]
 */
router.post('/gpsobj/isinPolygon',function(req,res,next){
	var point=req.body.point;
	var polygon;
	query('select paths from points where id=1',function(err,vals,fields){
		polygon=vals[0].paths;
		console.log(vals[0].paths);
		if(isPointLnPolygon(point,polygon)){
			res.json({"success":true,'result':true});
		}else{
			res.json({'success':true,'result':false});
	}
	});

});
/**
 * 获取多边形顶点
 * @param  {[type]} req                   [description]
 * @param  {[type]} res                   [description]
 * @param  {[type]} next){	query('select paths         from points where id [description]
 * @return {[type]}                       [description]
 */
router.get('/gpsobj/getPolygon',function(req,res,next){
	query('select paths from points where id=1',function(err,vals,fields){
		if (err==null) {
			res.json({'success':true,'result':vals[0].paths});
		}else{
			console.log(err);
		}
	});
});
/**
 * 获取定位对象坐标
 * @param  {[type]} req                   [description]
 * @param  {[type]} res                   [description]
 * @param  {[type]} next){	query('select lastValue     from gpsobj',function(err,vals,fields){		if (err [description]
 * @return {[type]}                       [description]
 */
router.post('/gpsobj/getValue',function(req,res,next){
	var id=req.body.id;
	if(id){
		query('select alias,lastValue from gpsobj where id='+id,function(err,vals,fields){
			if (err==null) {
				res.json({"success":true,"result":vals});
			}else{
				console.log(err);
			}
		});
	}else{
		query('select alias,lastValue from gpsobj where state="true"',function(err,vals,fields){
			if (err==null) {
				res.json({"success":true,"result":vals});
			}else{
				console.log(err);
			}
		});
	}
});
/**
 * 获取定位对象历史数据
 * @param  {[type]} req         [description]
 * @param  {[type]} res         [description]
 * @param  {[type]} next){	var id            [description]
 * @return {[type]}             [description]
 */
router.post('/gpsobj/getHisdata',function(req,res,next){
	var id=req.body.id;
	if(id){
		query('select * from hisdata where gpsobj_id='+id,function(err,vals,fields){
			if(err==null){
			for (var i = 0; i < vals.length; i++) {
				vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD HH:mm:ss');
			}
				res.json({'success':true,'result':vals});
			}else{
				console.log(err);
			}
		});
	}else{
		query('select * from hisdata',function(err,vals,fields){
			if(err==null){
			for (var i = 0; i < vals.length; i++) {
				vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD HH:mm:ss');
			}
				res.json({'success':true,'result':vals});
			}else{
				console.log(err);
			}
		});
	}
});
module.exports = router;