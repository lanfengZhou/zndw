var express = require('express');
var router = express.Router();
var query= require('../lib/db/mysql');
var moment = require("moment");
var queryAll=require('./LocobjServices')

router.post('/locobj/query',function(req,res,next){
	var page=req.body.page;
	var rows=req.body.rows;
	var start=rows*(page-1);
	var limit=rows*page;
	var filters=req.body.filters;
	var sql=queryAll(filters,start,limit);
	var total;
	var pages;
	query('select * from locobj',function(err,vals,fileds){
		total=vals.length;
		pages=Math.ceil(total/rows);
	});
	query(sql,function(err,vals,fileds){
		if(err==null){
		for (var i = 0; i < vals.length; i++) {
			vals[i].insertTime=moment(vals[i].insertTime).format('YYYY-MM-DD hh:mm:ss');
		}
			res.json({'success':true,'total':total,'pages':pages,'locobj':vals});
		}
	});
});
//添加定位对象
router.post('/locobj/add',function(req,res,next){
	var alias=req.body.alias;
	var typeNum=req.body.typeNum;
	var state=req.body.state;
	var number=req.body.number;
	if(typeof(number)=='undefined'){//判断是否添加绑定
		number=null;
	}
	var date=moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
	if(number==1){
		res.json({'success':true,'reason':'错误添加'});
	}else{
		query('insert into locobj(alias,type_id,eletag_id,state,insertTime,updateTime) values("'+alias+'",'
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
router.post('/locobj/delete',function(req,res,next){
	var id=req.body.id;
	query('delete from locobj where id='+id,function(err,vals,fileds){
		if(vals){
			res.json({'success':true,'result':'ok'});

		}else{
			res.json({'success':true,'result':'failed'});
		}
	})

});
router.post('/locobj/edit',function(req,res,next){
	var id=req.body.id;
	var alias=req.body.alias;
	var typeNum=req.body.typeNum;
	var number=req.body.number;
	var state=req.body.state;
	console.log(state);
	if(typeof(number)=='undefined'){
		number=null;
	}
	var date=moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
	if(number==1){
		res.json({'success':true,'reason':'错误添加'});
	}else{
		query('update locobj set alias="'+alias+'",type_id='+typeNum+',eletag_id='+number+',state="'+state+
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
router.post('/locobj/unbind',function(req,res,next){
	var id=req.body.id;
	var eletag_id=null;
	query('update locobj set state="false",eletag_id='+eletag_id+' where id='+id,function(err,vals,fields){
		if(err==null){
			res.json({'success':true});
		}else{
			console.log(err);
		}
	});
});
/**
 * 保存绘制区域（圆）
 * @param  {[type]} req         [description]
 * @param  {[type]} res         [description]
 * @param  {[type]} next){	var arc           [description]
 * @return {[type]}             [description]
 */
router.post('/locobj/saveArc',function(req,res,next){
	var arc=req.body.arc;
	console.log(arc);
	// var arcy=req.body.y;
	// var arcr=req.body.r;
	query("update points set paths='"+arc+"' where id=2",function(err,vals,fileds){
		if(err==null){
			res.json({'success':true,'result':'ok'});
		}else{
			res.json({'success':true,'result':'failed'});
		}
	})
});
/**
 * 请求获取圆信息
 * @param  {[type]} req                     [description]
 * @param  {[type]} res                     [description]
 * @param  {[type]} next){			query("select paths         from points  where id [description]
 * @return {[type]}                         [description]
 */
router.get('/locobj/getArc',function(req,res,next){
	// var arcy=req.body.y;
	// var arcr=req.body.r;
	query("select paths from points  where id=2",function(err,vals,fileds){
		if(err==null){
			res.json({'success':true,'result':vals});
		}else{
			res.json({'success':true,'result':'failed'});
		}
	})
});
/**
 * 获取所有已绑定电子标签的对象
 * @param  {[type]} req                   [description]
 * @param  {[type]} res                   [description]
 * @param  {String} next){	query('select id,alias      from locobj where state [description]
 * @return {[type]}                       [description]
 */
router.get('/locobj/getBindObj',function(req,res,next){
	query('select id,alias from locobj where state="true"',function(err,vals,fields){
		if(err==null){
			res.json({'success':true,'result':vals});
		}else{
			console.log(err);
		}
	});
});
/**
 * 获取定位对象坐标
 * @param  {[type]} req                   [description]
 * @param  {[type]} res                   [description]
 * @param  {[type]} next){	query('select o.alias,e.number,o.data from locobj as o left join eletag as e on o.eletag_id [description]
 * @return {[type]}                       [description]
 */
router.post('/locobj/getValue',function(req,res,next){
	var id=req.body.id;
	if (id) {
		query('select o.alias,e.number,o.data from locobj as o left join eletag as e on o.eletag_id=e.id where o.id='+id,function(err,vals,fields){
			if(err==null){
				res.json({'success':true,'locobj':vals});
			}else{
				console.log(err);
			}
		});	
	}else{
		query('select o.alias,e.number,o.data from locobj as o left join eletag as e on o.eletag_id=e.id where o.state="true"',function(err,vals,fields){
			if(err==null){
				res.json({'success':true,'locobj':vals});
			}else{
				console.log(err);
			}
		});		
	}

});

module.exports = router;