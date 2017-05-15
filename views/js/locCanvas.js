var canvasObj={
	ctx:'',
	eles:[],
	x:'',
	y:'',
	r:'',
	isEmptyObject:function(obj){
		for(var key in obj){
         return false;
        }
         return true;
	},
	init:function(){
		 var cavans=document.getElementById("mycavans");
         this.ctx=cavans.getContext("2d");
         var that=this;
         $.get('/locobj/getArc',function(data){
         	var arc=JSON.parse(data.result[0].paths);
         	that.x=arc.x;
         	that.y=arc.y;
         	that.r=arc.r;
         	that.ctx.lineWidth = 5;
         	that.ctx.fillStyle="#ffffff";
       		that.ctx.strokeStyle="#ff0000";
        	that.ctx.beginPath();
        	that.ctx.arc(arc.x,arc.y,arc.r,0,Math.PI*2,true);//起始脚结束脚
        	that.ctx.shadowBlur=5;
			that.ctx.shadowColor="#000000";
        	that.ctx.closePath();
        	that.ctx.fill();
        	that.ctx.stroke();
         });
         $.get('/locobj/getBindObj',function(data){
         	$("#queryOne").append('<option value=0>请选择单个定位对象</option>');
         	for (var i = 0; i < data.result.length; i++) {
         		$("#queryOne").append('<option value='+data.result[i].id+'>'+data.result[i].alias+'</option>');
         	}
         });
	}
}
canvasObj.init();
$("#mycavans").on('mousemove',function(e){
	var x, y;
	var cavans=document.getElementById("mycavans");
	var show=document.getElementById("show");
	var tc=document.getElementById("tc");
	if (e.layerX || e.layerX == 0) {
    　　x = e.layerX;
    　　y = e.layerY;
    　　} else if (e.offsetX || e.offsetX == 0) { // Opera
    　　x = e.offsetX;
    　　y = e.offsetY;
    }
    for (var i = 0; i < canvasObj.eles.length; i++) {
    	var v=JSON.parse(canvasObj.eles[i].data);
    　　canvasObj.ctx.beginPath();
    　　canvasObj.ctx.arc(v.x, v.y, 8, 0,2*Math.PI);
    // 　　canvasObj.ctx.fill();
    　　if(canvasObj.ctx.isPointInPath(x, y)){//ctx对象包含x，y;
    　　//如果传入了事件坐标，就用isPointInPath判断一下
    　　//如果当前环境覆盖了该坐标，就将当前环境的index值放到数组里
    		document.getElementById("mycavans").style.cursor='pointer';
    		$('#tc').css('left',x+'px');
    		$('#tc').css('top',y+'px');
    		$('#tc').html("对象别名："+canvasObj.eles[i].alias+"</br>"+
            "绑定电子标签号码："+canvasObj.eles[i].number+"</br>"+
            "x轴坐标："+v.x+"</br>"+
            "y轴坐标："+v.y);
　　        show.innerHTML="对象别名："+canvasObj.eles[i].alias+"</br></br>"+
            "绑定电子标签号码："+canvasObj.eles[i].number+"</br></br>"+
            "x轴坐标："+v.x+"</br></br>"+
            "y轴坐标："+v.y;
           	$('#tc').css('display','block');
           	break;
    　　 }else{
    		$('#tc').css('display','none');
    	}
    }
//     canvasObj.eles.forEach(function(obj, i,arr){
//     	var v=JSON.parse(obj.data);
//     　　canvasObj.ctx.beginPath();
//     　　canvasObj.ctx.arc(v.x, v.y, 8, 0,2*Math.PI);
//     // 　　canvasObj.ctx.fill();
//     　　if(canvasObj.ctx.isPointInPath(x, y)){//ctx对象包含x，y;
//     　　//如果传入了事件坐标，就用isPointInPath判断一下
//     　　//如果当前环境覆盖了该坐标，就将当前环境的index值放到数组里
//     		document.getElementById("mycavans").style.cursor='pointer';
//     		$('#tc').css('left',x+'px');
//     		$('#tc').css('top',y+'px');
//     		$('#tc').html("对象别名："+arr[i].alias+"</br>"+
//             "绑定电子标签号码："+arr[i].number+"</br>"+
//             "x轴坐标："+v.x+"</br>"+
//             "y轴坐标："+v.y);
// 　　        show.innerHTML="对象别名："+arr[i].alias+"</br></br>"+
//             "绑定电子标签号码："+arr[i].number+"</br></br>"+
//             "x轴坐标："+v.x+"</br></br>"+
//             "y轴坐标："+v.y;
//            	tc.style.display='block';
//            	return;
//     　　 }else{
//     	    console.log('1');
//     		tc.style.display='none';
//     	}
//     });

});
$("#redraw").click(function(){
	window.location.href='./canvas.html';
});
var clock1;
var clock2;
function updateAll(){
	$.ajax({
        url:"/locobj/getValue",
        type:"post",
        success:function(data){
       	var x,y;
       	canvasObj.ctx.clearRect(0,0,800,600);
       	canvasObj.ctx.lineWidth = 5;
     	canvasObj.ctx.fillStyle="#ffffff";
   		canvasObj.ctx.strokeStyle="#ff0000";
    	canvasObj.ctx.beginPath();
    	canvasObj.ctx.arc(canvasObj.x,canvasObj.y,canvasObj.r,0,Math.PI*2,true);//起始脚结束脚
    	canvasObj.ctx.shadowBlur=5;
		canvasObj.ctx.shadowColor="#000000";
    	canvasObj.ctx.closePath();
    	canvasObj.ctx.fill();
    	canvasObj.ctx.stroke();
    	canvasObj.eles=[];
       	// canvasObj.ctx.save();
        for(var i=0;i<data.locobj.length;i++){
            var location=JSON.parse(data.locobj[i].data);
            if(location){
            	x=Math.abs(location.x-canvasObj.x);
            	y=Math.abs(location.y-canvasObj.y)
            	if(Math.sqrt(Math.pow(x,2)+Math.pow(y,2))>=canvasObj.r){
	            	canvasObj.ctx.beginPath();
	                canvasObj.ctx.arc(location.x,location.y,8,0,2*Math.PI);//x,y,r,start,stop
	                canvasObj.ctx.fillStyle="#f00";
	                canvasObj.ctx.fill();
	                canvasObj.ctx.closePath();
	                canvasObj.eles.push(data.locobj[i]);
            	}else{
	            	canvasObj.ctx.beginPath();
	                canvasObj.ctx.arc(location.x,location.y,8,0,2*Math.PI);//x,y,r,start,stop
	                canvasObj.ctx.fillStyle="#1e70ad";
	                canvasObj.ctx.fill();
	                canvasObj.ctx.closePath();
	                canvasObj.eles.push(data.locobj[i]);
            	}
            }
         }
        }
    });
    clock1=setTimeout(updateAll,2000);
}
$("#queryAll").click(function(){
	clearTimeout(clock1);
	clearTimeout(clock2);
	updateAll();
	$('#queryOne').find('option[value=0]').prop('selected',true);
});
$("#queryOne").change(function(){
	var id=$(this).prop("value");
	if(id!=0){
		clearTimeout(clock1);
		clearTimeout(clock2);
		updateOne();
		function updateOne(){
		$.ajax({
	        url:"/locobj/getValue",
	        type:"post",
	        data:{
	        	id:id,
	        },
	        success:function(data){
	       	var x,y;
	       	canvasObj.ctx.clearRect(0,0,800,600);
	       	canvasObj.ctx.lineWidth = 5;
	     	canvasObj.ctx.fillStyle="#ffffff";
	   		canvasObj.ctx.strokeStyle="#ff0000";
	    	canvasObj.ctx.beginPath();
	    	canvasObj.ctx.arc(canvasObj.x,canvasObj.y,canvasObj.r,0,Math.PI*2,true);//起始脚结束脚
	    	canvasObj.ctx.shadowBlur=5;
			canvasObj.ctx.shadowColor="#000000";
	    	canvasObj.ctx.closePath();
	    	canvasObj.ctx.fill();
	    	canvasObj.ctx.stroke();
	    	canvasObj.ele=[];
	       	// canvasObj.ctx.save();
	            var location=JSON.parse(data.locobj[0].data);
	            if(location){
	            	x=Math.abs(location.x-canvasObj.x);
	            	y=Math.abs(location.y-canvasObj.y)
	            	if(Math.sqrt(Math.pow(x,2)+Math.pow(y,2))>=canvasObj.r){
		            	canvasObj.ctx.beginPath();
		                canvasObj.ctx.arc(location.x,location.y,8,0,2*Math.PI);//x,y,r,start,stop
		                canvasObj.ctx.fillStyle="#f00";
		                canvasObj.ctx.fill();
		                canvasObj.ctx.closePath();
		                canvasObj.eles.push(data.locobj[0]);
	            	}else{
		            	canvasObj.ctx.beginPath();
		                canvasObj.ctx.arc(location.x,location.y,8,0,2*Math.PI);//x,y,r,start,stop
		                canvasObj.ctx.fillStyle="#1e70ad";
		                canvasObj.ctx.fill();
		                canvasObj.ctx.closePath();
		                canvasObj.eles.push(data.locobj[0]);
	            	}
	            }
	          // canvasObj.ctx.restore();
	        }
	    });
	    clock2=setTimeout(updateOne,2000);
	}	
	}
	
});
