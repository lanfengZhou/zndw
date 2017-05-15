var mysql=require('mysql');
var pool=mysql.createPool({//mysql连接池
	host:'localhost',
	user:'root',
	password:'root',
	database:'location',
	port:'3306',
    datatime:true
});
function query(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals,fields);
            });
        }
    });
};

module.exports=query;