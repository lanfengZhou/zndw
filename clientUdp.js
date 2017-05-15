var dgram = require('dgram');

var clientSocket = dgram.createSocket('udp4');
var query= require('./lib/db/mysql');


clientSocket.on('message', function(msg, rinfo){
	var revice=Buffer.from(msg);
	var messages=revice.toString();
	var reg=/(\d+\.\d+)+/gi;
	var matches=reg.exec(messages);
	var lat=matches[0];
	matches=reg.exec(messages);
	var lng=matches[0];
	// console.log(messages);
	// console.log(lat+','+lng);
  
  	var lats=parseInt(lat/100)+(lat%parseFloat(100))/parseFloat(60);
  	var lngs=parseInt(lng/100)+(lng%parseFloat(100))/parseFloat(60);
  	var coordinate=lats+','+lngs;
  	// console.log(lats);
  	query('update gpsobj set lastValue="'+coordinate+'" where id=1',function(err,vals,fileds){
  		if (err==null) {
  			
  		}else{
  			console.log(err);
  		}
  	});
});

clientSocket.on('error', function(err){
  console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
});

clientSocket.bind(9999);