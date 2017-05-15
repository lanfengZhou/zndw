var canvasObj={
    ctx:'',
    eles:[],
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
            that.ctx.fillStyle="#ffffff";
            that.ctx.strokeStyle="#ff0000";
            that.ctx.beginPath();
            that.ctx.arc(arc.x,arc.y,arc.r,0,Math.PI*2,true);//起始脚结束脚
            that.ctx.closePath();
            that.ctx.fill();
            that.ctx.stroke();
         });
    },
    x:'',
    y:'',
    r:'',
}
canvasObj.init();
var flag=false;
var TimeFn = null;
$("#mycavans").on('click',function(e){
        // 取消上次延时未执行的方法
    clearTimeout(TimeFn);
    //执行延时
    TimeFn = setTimeout(function(){
        var x, y;
        var show=document.getElementById("show");
        if (e.layerX || e.layerX == 0) {
        　　x = e.layerX;
        　　y = e.layerY;
        　　} else if (e.offsetX || e.offsetX == 0) { // Opera
        　　x = e.offsetX;
        　　y = e.offsetY;
        }
        canvasObj.x=x;
        canvasObj.y=y;
        flag=true;
    },300);

});
$("#mycavans").on('mousemove',function(e){
        var x, y;
        var show=document.getElementById("show");
        if (e.layerX || e.layerX == 0) {
        　　x = e.layerX;
        　　y = e.layerY;
        　　} else if (e.offsetX || e.offsetX == 0) { // Opera
        　　x = e.offsetX;
        　　y = e.offsetY;
        }
        if(flag){
        canvasObj.ctx.clearRect(0,0,800,600);
        canvasObj.ctx.fillStyle="#ffffff";
        canvasObj.ctx.strokeStyle="#ff0000";
        canvasObj.ctx.beginPath();
        canvasObj.r=Math.abs(x-canvasObj.x);
        canvasObj.ctx.arc(canvasObj.x,canvasObj.y,canvasObj.r,0,Math.PI*2,true);//起始脚结束脚
        canvasObj.ctx.closePath();
        canvasObj.ctx.fill();
        canvasObj.ctx.stroke();
        $("#show").html("圆心坐标  X:"+canvasObj.x+',Y:'+canvasObj.y+"</br>"+'半径：'+canvasObj.r);
    }
});
$("#mycavans").on('dblclick',function(e){
        clearTimeout(TimeFn);
        flag=false;
        var x, y;
        var show=document.getElementById("show");
        if (e.layerX || e.layerX == 0) {
        　　x = e.layerX;
        　　y = e.layerY;
        　　} else if (e.offsetX || e.offsetX == 0) { // Opera
        　　x = e.offsetX;
        　　y = e.offsetY;
        }
        // console.log(x);
        // console.log(canvasObj.x+','+canvasObj.y+','+canvasObj.r);
        var data='{"x":'+canvasObj.x+',"y":'+canvasObj.y+',"r":'+canvasObj.r+'}';
        $.post('/locobj/saveArc',{'arc':data},function(data){
            console.log("success");
        })

});
$("#queryObj").click(function(){
    window.location.href='./locCanvas.html';
});
window.onload=drags;
//window.onload:在页面所有资源加载完后执行，如果有多个定义则执行最后一个
//$(function(){}):在DOM节点创建完成后执行，如果定义多个则依次执行
function drags(){
	var oTitle=document.getElementById("toptest");
		oTitle.onmousedown=function(event){
			event=event||window.event;
			console.log(event.clientX);
			fnDown(event,"toptest");
	 }
	
}
function fnDown(event,id){
	
	// console.log(id);
	var oDrag=document.getElementById(id);
		//光标按下时，距离拖动框的距离等于光标的位置减去拖动框距离页面的距离
		disX=event.clientX-oDrag.offsetLeft;
		disY=event.clientY-oDrag.offsetTop;
	//当鼠标指针在元素内部移动时重复的触发
	document.onmousemove=function(event){
		event=event||window.event;
		fnMove(event,disX,disY,id);
	}
	document.onmouseup=function(){
		document.onmousemove=null;
		document.onmouseup=null;
	}
}
function fnMove(e,disX,disY,id){
	var oDrag=document.getElementById(id);
		l=e.clientX-disX;
		t=e.clientY-disY;
		winW=800;
		winH=600;
		maxW=winW-oDrag.offsetWidth-10;
		maxH=winH-oDrag.offsetHeight;
	if (l<0) {
		l=0;
	}else if(l>maxW){
		l=maxW;
	}
	if(t<0){
		t=0;
	}else if(t>maxH){
		t=maxH;
	}
	oDrag.style.left=l+'px';
	oDrag.style.top=t+'px';
	$("#show").text("x轴坐标："+l+";"+"y轴坐标："+t);
}
$(function(){
	$("#eletagList").jqGrid({
	 	url:'/eletag/query',
	 	datatype:"json",
	 	colNames:['电子标签号码','电子标签别名','添加时间','编辑'],
	 	colModel:[
	 		{name:'number',index:'number',width:50,align:'center',editable:true,editrules:{required:true},editoptions:{readonly:true}},
	 		{name:'alias',index:'alias',width:50,align:'center',editable:true},
	 		{name:'insertTime',index:'insertTime',width:50,align:'center',editable:false},
	 		{name:'action',index:'act',width:150,align:'center',sortable:false}
	 	],
	 	jsonReader:{
	 		root:'eletag',
	 		records:"total",
	 		total:"pages"
	 	},
	 	rowNum:10,
	 	rowList:[10,20,30],
	 	pager:'#tagPager',
	 	mtype : "post",
	 	viewrecords:true,
	 	caption:"电子标签管理",
	 	rownumbers:true,
	 	rownumWidth:40,
	 	gridComplete:function(){
	 		var ids=$("#eletagList").jqGrid('getDataIDs');
	 		for(var i=0;i<ids.length;i++){
	 			var cl=ids[i];
	 			edit="<button style='height:30px;width:50px;' class='edit'>修改</button>";
	 			del = "<button style='height:30px;width:50px;' class='delete'  onclick=\"jQuery('#eletagList').jqGrid('delGridRow','"
		                    + cl + "',{url:'/eletag/delete',delData:{id:"+cl+"},});\" >删除</button>";
	 			$("#eletagList").jqGrid('setRowData',ids[i],{
	 			 	action:edit+del,
	 			});
	 		}
	 		$(".edit").click(function(){
	 			var id=$(this).closest("tr").prop("id");
	 			jQuery('#eletagList').jqGrid('editGridRow',id,
	 				{
	 					url:'/eletag/edit',
	 					// editData:$("#eletagForm").serialize(),
	 				});
	 		})
	 	}
	 });
	 jQuery("#eletagList").jqGrid('navGrid','#tagPager',{edit:false,add:false,del:false,search:false})
	 	.navButtonAdd('#tagPager',{
		caption:"添加标签",
		buttonicon:"ui-icon-add",
		onClickButton:function(){
			$("#overlay").show();
			$("#formDiv").slideDown("fast");
		},
		position:"last"
	});
	 jQuery("#eletagList").jqGrid('setGridWidth',$(window).width()-2,true);
	 jQuery("#eletagList").jqGrid('setGridHeight',$(window).height()-150,true);
	 $("#cancle").click(function(){
	 	$("#formDiv").slideUp("fast");
	 	$("#overlay").hide();
	 });
	 //电子标签重复性检查
	 $("#tagNum").blur(function(){
	 	$.post("/eletag/checkTagnum",{number:$(this).val()},function(data){
	 		if(data.result=="exist"){
	 			$("#tagNum").closest("div").next().show();
	 		}
	 		else{
	 			$("#tagNum").closest("div").next().hide();
	 		}
	 	});
	 })
	 $("#add").click(function(){
	 	$.ajax({
	 		type:"POST",
	 		url:"/eletag/"+$(this).prop("id"),
	 		datatype:"json",
	 		data:$("#eletagForm").serialize(),
	 		success:function(data){
	 			// console.log(data);
	 			$("#formDiv").slideUp("fast");
	 			$("#overlay").hide();
	 			$("#eletagList").jqGrid('setGridParam',{
	 				url:'/eletag/query',
	 			}).trigger("reloadGrid");
	 		}
	 	})
	 });
	 // var tt='aa';
	 // function test(){//函数提升和作用域链问题
	 // 	console.log(tt);//undefined
	 // 	var tt='dd';
	 // 	console.log(tt);//dd
	 // }
})
$(function(){
	$("#gpsList").jqGrid({
	 	url:'/gps/query',
	 	datatype:"json",
	 	colNames:['GPS识别码','GPS识别码别名','添加时间','编辑'],
	 	colModel:[
	 		{name:'number',index:'number',width:50,align:'center',editable:true,editrules:{required:true},editoptions:{readonly:true}},
	 		{name:'alias',index:'alias',width:50,align:'center',editable:true},
	 		{name:'insertTime',index:'insertTime',width:50,align:'center',editable:false},
	 		{name:'action',index:'act',width:150,align:'center',sortable:false}
	 	],
	 	jsonReader:{
	 		root:'gps',
	 		records:"total",
	 		total:"pages"
	 	},
	 	rowNum:10,
	 	rowList:[10,20,30],
	 	pager:'#tagPager',
	 	mtype : "post",
	 	viewrecords:true,
	 	caption:"GPS接收器管理",
	 	rownumbers:true,
	 	rownumWidth:40,
	 	gridComplete:function(){
	 		var ids=$("#gpsList").jqGrid('getDataIDs');
	 		for(var i=0;i<ids.length;i++){
	 			var cl=ids[i];
	 			edit="<button style='height:30px;width:50px;' class='edit'>修改</button>";
	 			del = "<button style='height:30px;width:50px;' class='delete'  onclick=\"jQuery('#gpsList').jqGrid('delGridRow','"
		                    + cl + "',{url:'/gps/delete',delData:{id:"+cl+"},});\" >删除</button>";
	 			$("#gpsList").jqGrid('setRowData',ids[i],{
	 			 	action:edit+del,
	 			});
	 		}
	 		$(".edit").click(function(){
	 			var id=$(this).closest("tr").prop("id");
	 			jQuery('#gpsList').jqGrid('editGridRow',id,
	 				{
	 					url:'/gps/edit',
	 					// editData:$("#gpsForm").serialize(),
	 				});
	 		})
	 	}
	 });
	 jQuery("#gpsList").jqGrid('navGrid','#tagPager',{edit:false,add:false,del:false,search:false})
	 	.navButtonAdd('#tagPager',{
		caption:"添加GPS",
		buttonicon:"ui-icon-add",
		onClickButton:function(){
			$("#overlay").show();
			$("#formDiv").slideDown("fast");
		},
		position:"last"
	});
	 jQuery("#gpsList").jqGrid('setGridWidth',$(".gpsList").width()-2,true);
	 jQuery("#gpsList").jqGrid('setGridHeight',$(window).height()-150,true);
	 $("#cancle").click(function(){
	 	$("#formDiv").slideUp("fast");
	 	$("#overlay").hide();
	 });
	 //电子标签重复性检查
	 $("#tagNum").blur(function(){
	 	$.post("/gps/checkTagnum",{number:$(this).val()},function(data){
	 		if(data.result=="exist"){
	 			$("#tagNum").closest("div").next().show();
	 		}
	 		else{
	 			$("#tagNum").closest("div").next().hide();
	 		}
	 	});
	 })
	 $("#add").click(function(){
	 	$.ajax({
	 		type:"POST",
	 		url:"/gps/"+$(this).prop("id"),
	 		datatype:"json",
	 		data:$("#gpsForm").serialize(),
	 		success:function(data){
	 			// console.log(data);
	 			$("#formDiv").slideUp("fast");
	 			$("#overlay").hide();
	 			$("#gpsList").jqGrid('setGridParam',{
	 				url:'/gps/query',
	 			}).trigger("reloadGrid");
	 		}
	 	})
	 });
	 // var tt='aa';
	 // function test(){//函数提升和作用域链问题
	 // 	console.log(tt);//undefined
	 // 	var tt='dd';
	 // 	console.log(tt);//dd
	 // }
})
$(function(){
	$("#gpsobjList").jqGrid({
	 	url:'/gpsobj/query',
	 	datatype:"json",
	 	colNames:['定位对象类型','定位对象别名','是否绑定GPS','绑定GPS识别码','添加时间','编辑'],
	 	colModel:[
	 		{name:'typeName',index:'typeName',width:50,align:'center',editable:true,editrules:{required:true},editoptions:{readonly:true}},
	 		{name:'alias',index:'alias',width:50,align:'center',editable:true},
	 		{name:'state',index:'state',width:50,align:'center',editable:true,editoptions:{readonly:true}},
	 		{name:'number',index:'number',width:50,align:'center',editable:true,editoptions:{readonly:true}},
	 		{name:'insertTime',index:'insertTime',width:50,align:'center',editable:false,editoptions:{readonly:true}},
	 		{name:'action',index:'act',width:100,align:'center',sortable:false}
	 	],
	 	jsonReader:{
	 		root:'gpsobj',
	 		records:"total",
	 		total:"pages"
	 	},
	 	rowNum:10,
	 	rowList:[10,20,30],
	 	pager:'#objPager',
	 	mtype : "post",
	 	viewrecords:true,
	 	caption:"定位对象管理",
	 	rownumbers:true,
	 	rownumWidth:40,
	 	gridComplete:function(){
	 		var ids=$("#gpsobjList").jqGrid('getDataIDs');
	 		for(var i=0;i<ids.length;i++){
	 			var cl=ids[i];
	 			edit="<button style='height:30px;width:50px;' class='edit'>修改</button>";
	 			del = "<button style='height:30px;width:50px;' class='delete'  onclick=\"jQuery('#gpsobjList').jqGrid('delGridRow','"
		                    + cl + "',{url:'/gpsobj/delete',delData:{id:"+cl+"},});\" >删除</button>";
		        // bind="<button style='height:30px;width:50px;' class='bind'>绑定</button>";
		        unbind="<button style='height:30px;width:50px;' class='unbind'>解绑</button>";
	 			$("#gpsobjList").jqGrid('setRowData',ids[i],{
	 			 	action:edit+del+unbind,
	 			});
	 		}
	 		$(".edit").click(function(){
	 			var id=$(this).closest("tr").prop("id");
	 			$("#LeditNumbers").val(id);
	 			$("#edit").show();
	 			$("#add").hide();
	 			$("#overlay").show();
				var gr=$("#gpsobjList").jqGrid('getRowData',id);
				// console.log(gr.typeName);
				$("#typeNum option").each(function(){  
			        if($(this).text() == gr.typeName){  
			            $(this).prop("selected",true);  
			        }  
			    });
			    $("input:text[name='alias']").val(gr.alias);
			    $("input:radio[value="+gr.state+"]").prop("checked",true);
			    if(gr.state=="true"){
			    	$(".eleNumber").show();
	 				$.get("/gps/getTagnum", function(data){
	 				$("#number").empty();
	 				$("#number").append("<option value='1'>"+gr.number+"</option>");
	 				for(var i=0;i<data.tagnum.length;i++){
	 				// console.log(data.tagnum[i].number);
	 					$("#number").append("<option value="+data.tagnum[i].id+">"+data.tagnum[i].number+"</option>");
	 					}		
	 				});
			    }else{
	 				$("#number").empty();
	 				$(".eleNumber").hide();
	 			}
				$("#formDiv").slideDown("fast");
	 		});
	 		$(".unbind").click(function(){
	 			var id=$(this).closest("tr").prop("id");
	 			$.post("/gpsobj/unbind",{id:id},function(data){
	 				$("#gpsobjList").jqGrid('setGridParam',{
	 					url:'/gpsobj/query',
	 				}).trigger("reloadGrid");
	 			})

	 		});
	 	}
	 });
	 jQuery("#gpsobjList").jqGrid('navGrid','#objPager',{edit:false,add:false,del:false,search:false})
	 	.navButtonAdd('#objPager',{
		caption:"添加定位对象",
		buttonicon:"ui-icon-add",
		onClickButton:function(){
			$("#overlay").show();
			$("#edit").hide();
	 		$("#add").show();
	 		$("input:text").val("");
	 		$("#number").empty();
	 		$("input:radio[value='false']").prop("checked",true);
	 		$(".eleNumber").hide();
			$("#formDiv").slideDown("fast");
		},
		position:"last"
	});
	 jQuery("#gpsobjList").jqGrid('setGridWidth',$(".gpsobjList").width()-2,true);
	 jQuery("#gpsobjList").jqGrid('setGridHeight',$(window).height()-150,true);
	 jQuery("#gpsobjList").jqGrid('filterToolbar',{stringResult: true,searchOnEnter : true});
	 $("#cancle").click(function(){
	 	$("#formDiv").slideUp("fast");
	 	$("#overlay").hide();
	 });
	 $.get("/loctype/query", function(data){
	 	// $("#typeNum").append("<option>1</option>");
	 	for(var i=0;i<data.loctype.length;i++){
	 		// console.log(data.loctype.typeNum);
	 		$("#typeNum").append("<option value="+data.loctype[i].typeNum+">"+data.loctype[i].typeName+"</option>");
	 	}
	 });
	 $("#add,#edit").click(function(){
	 	var name=$(this).prop("id");
	 	$.ajax({
	 		type:"POST",
	 		url:"/gpsobj/"+name,
	 		datatype:"json",
	 		data:$("#gpsobjForm").serialize(),
	 		success:function(data){
	 			// console.log(data);
	 			$("#formDiv").slideUp("fast");
	 			$("#overlay").hide();
	 			$("#gpsobjList").jqGrid('setGridParam',{
	 				url:'/gpsobj/query',
	 			}).trigger("reloadGrid");
	 		}
	 	})
	 });
	 //是否绑定电子标签
	 $("input:radio").click(function(){
	 	if ($(this).prop("value")=="true") {
	 		$(".eleNumber").show();
	 		$.get("/gps/getTagnum", function(data){
	 			$("#number").empty();
	 			$("#number").append("<option value='1'>请选择需要绑定的GPS识别码</option>");
	 			for(var i=0;i<data.tagnum.length;i++){
	 				// console.log(data.tagnum[i].number);
	 				$("#number").append("<option value="+data.tagnum[i].id+">"+data.tagnum[i].number+"</option>");
	 			}		
	 		
	 		});
	 	}
	 	else{
	 		$("#number").empty();
	 		$(".eleNumber").hide();
	 	}
	 });
})
$(function(){
	$(".dropdown-menu a").click(function(){
		var name=$(this).prop("name");
		// $.get(name,function(data){
			$("#show").prop("src",name);
		// });
	});
})
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

function $(id){
    return document.getElementById(id);
}
function $XMLHttpRequest(type,url,param,callback){
    if(window.XMLHttpRequest){
            var xmlhttp=new XMLHttpRequest();
            }else if(window.ActiveXobject){
                var xmlhttp=new ActiveXobject('Microft.XMLHttp');
    }
     xmlhttp.open(type,url,true);
     xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
     xmlhttp.send(param);
     xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4&&xmlhttp.status==200) {
            callback(xmlhttp.responseText);
        }
     }

}
var bmap = {
    status: false,
    map: '',
    point: '',
    overlaysCache: [],
    polOverlay: [],//多边形覆盖物
    myOverlay: [],
    drawingManager: '',
    /**
     * 实例化
     */
    init: function(){
        if(this.status){
            return;
        }
        this.status = true;
        this.map = new BMap.Map('map');
        this.point = new BMap.Point(116.307852,40.057031);
        var map = this.map;
        var control=new BMap.MapTypeControl();
        control.setAnchor(BMAP_ANCHOR_TOP_LEFT);
        map.addControl(control);   //添加地图类型控件
        map.centerAndZoom(this.point, 12);
        map.enableScrollWheelZoom();
        if (this.myOverlay) {
            this.loadMyOverlay();
        };
    },
    /**
     * 加载已经存在的区域
     * @return {[type]} [description]
     */
    loadMyOverlay: function(){
        var map = this.map;
        // this.clearAll();
        $XMLHttpRequest('get','/gpsobj/getPolygon',null,function(data){
            var pts=[];
            var result=JSON.parse(data);
            var polygon=JSON.parse(result.result);
            for (var i = 0; i < polygon.length; i++) {
                pts.push(new BMap.Point(polygon[i].lng,polygon[i].lat));
            }
            bmap.polOverlay= new BMap.Polygon(pts);
            bmap.polOverlay.disableMassClear();
            map.addOverlay(bmap.polOverlay);
        });
    },
   /**
    * 为每个覆盖物添加显示窗口
    * @param {[type]} mk        [description]
    * @param {[type]} result    [description]
    * @param {[type]} new_point [description]
    */
   addInfoWindow:function(mk,gpsobj_id,lng,lat,new_point){
    mk.addEventListener("click",function(e){
    var opts = {
          width : 100,     // 信息窗口宽度
          height: 50,  // 信息窗口高度
          title : "<div style='font-size:16px;font-family:Arial;color:#8e8e8e'>定位对象名称："+gpsobj_id+"</div>", // 信息窗口标题
          enableMessage:true,//设置允许信息窗发送短息
        };
    // var p=JSON.parse(result.coordinate);
    var infoWindow = new BMap.InfoWindow("<div style='font-size:16px;font-family:Arial;color:#8e8e8e'>原始坐标:("+lng+','+lat+")</div>", opts);  // 创建信息窗口对象
    this.openInfoWindow(infoWindow,new_point); //开启信息窗口              
    });
   },
   /**
    * 原始坐标转换为百度坐标(单个)
    * @param  {[type]} coordinate [description]
    * @return {[type]}            [description]
    */
   transCoor:function(coordinate,callback){
    var convertor = new BMap.Convertor();
    // translateCallback = function (data){
    //     callback(data.points[0]);
    // };
    var pointArr = [];
    pointArr.push(coordinate);
    // console.log(pointArr);
    convertor.translate(pointArr, 1, 5, function(data){
        if(data.status === 0){
        callback(data.points[0]);          
        }
    });

   },
   /**
    * 批量坐标转换
    * @param  {[type]}   points   [description]
    * @param  {Function} callback [description]
    * @return {[type]}            [description]
    */
   shiftCoor:function(points,callback){
    var convertor = new BMap.Convertor();
    convertor.translate(points, 1, 5, function(data){
        if(data.status === 0){
        callback(data.points);          
        }
    });
   }  
};
bmap.init();
var isPanelShow = true;
var showPanel=$('showPanel');
showPanel.addEventListener('click',function(){
    // clearInterval(timer1);
    var panelWrap=$('panelWrap');
    if(isPanelShow){
        isPanelShow=false;
        panelWrap.style.width='230px';
        showPanel.style.marginRight='230px';
        showPanel.innerHTML='隐藏定位对象>';
        $XMLHttpRequest('GET','/gpsobj/getBindobj',null,function(data){
            $('selObj').options.length=0;
            $('queryOne').options.length=0;
            var result=JSON.parse(data);
            var obj=result.result;
            $('selObj').options.add(new Option('请选择需要查询的定位对象','1'));
            $('queryOne').options.add(new Option('请选择需要查询的定位对象','1'));
            for (var i = 0; i < obj.length; i++) {
                    $('selObj').options.add(new Option(obj[i].alias,obj[i].id));
                    $('queryOne').options.add(new Option(obj[i].alias,obj[i].id));
            }
        });
    }else{
        isPanelShow=true;
        panelWrap.style.width='0px';
        showPanel.style.marginRight='0px';
        showPanel.innerHTML='选取定位对象<';
    }

},false);
/**
 * 获取定位对象坐标
 * @return {[type]} [description]
 */
var timer1local;
var timer2local;
$('queryAll').addEventListener('click',function(e){
    // disabled="true"
    this.disabled="true";
    this.style.opacity=0.5;
    $('selObj').options[0].selected=true;
    $('queryOne').options[0].selected=true;
    clearTimeout(timer2local);
    timer1();
    function timer1(){
        var map=bmap.map;
        map.clearOverlays();
        $XMLHttpRequest('post','/gpsobj/getValue',null,function(data){
        var result=JSON.parse(data);
        for(var i=0;i<result.result.length;i++){
            var c=result.result[i].lastValue;
            if(c!=null){
                var alias=result.result[i].alias;
                var lng=c.substr(0,c.indexOf(','));
                var lat=c.substr(c.indexOf(',')+1,c.length);
                var point= new BMap.Point(lng,lat);
                (function(i){
                    // var points=point;
                    var lngs=lng;
                    var lats=lat;
                    bmap.transCoor(point,function(trasPoint){//闭包对上层函数执行环境的引用
                    var mk= new BMap.Marker(trasPoint);
                    map.addOverlay(mk);
                    var isinPolygon = BMapLib.GeoUtils.isPointInPolygon(trasPoint,bmap.polOverlay);
                    if(isinPolygon==true){
                        var label = new BMap.Label(result.result[i].alias,{offset:new BMap.Size(20,-10)});
                        mk.setLabel(label);
                    }else{
                        var label=new BMap.Label(result.result[i].alias+'已超出围栏外',{offset:new BMap.Size(20,-10)});
                        label.setStyle({
                            backgroundColor:"red",
                             color : "black",
                             fontSize : "12px",
                             height : "20px",
                             lineHeight : "20px",
                             fontFamily:"微软雅黑"
                         });
                        mk.setLabel(label);
                    }
                    bmap.addInfoWindow(mk,result.result[i].alias,lngs,lats,trasPoint);
                    // console.log(trasPoint.lng);
                    });
                })(i);
            }
            }  
        });
        timer1local=setTimeout(timer1,5000);
    }

});
$('queryOne').addEventListener('change',function(e){
        var that=this;
        $('queryAll').disabled=false;
        $('queryAll').style.opacity=1;
        $('selObj').options[0].selected=true;
        clearTimeout(timer1local);
        clearTimeout(timer2local);
        timer2();
        function timer2(){
            var map = bmap.map;
            var id='id='+that.value;
            map.clearOverlays();
            $XMLHttpRequest('post','/gpsobj/getValue',id,function(data){
                var result=JSON.parse(data);
                var c=result.result[0].lastValue;
                if(c!=null){
                var lng=c.substr(0,c.indexOf(','));
                var lat=c.substr(c.indexOf(',')+1,c.length);
                var point= new BMap.Point(lng,lat);
                var mk = new BMap.Marker(point);
                bmap.transCoor(point,function(trasPoint){
                    var mk= new BMap.Marker(trasPoint);
                    map.addOverlay(mk);
                    mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    var label = new BMap.Label(result.result[0].alias,{offset:new BMap.Size(20,-10)});
                    mk.setLabel(label);
                    bmap.addInfoWindow(mk,result.result[0].alias,lng,lat,trasPoint);
                    var isinPolygon = BMapLib.GeoUtils.isPointInPolygon(trasPoint,bmap.polOverlay);
                    if(isinPolygon==true){

                    }else{
                        label=new BMap.Label(result.result[0].alias+'已超出围栏外',{offset:new BMap.Size(20,-10)});
                        label.setStyle({
                            backgroundColor:"red",
                             color : "black",
                             fontSize : "12px",
                             height : "20px",
                             lineHeight : "20px",
                             fontFamily:"微软雅黑"
                         });
                        mk.setLabel(label);
                    }
                });
            }
            });
           timer2local=setTimeout(timer2,5000);
        }
        
    },false);
/**
 * 获取单独定位对象历史记录
 * @return {[type]} [description]
 */
 $('selObj').addEventListener('change',function(e){
        $('queryAll').disabled=false;
        $('queryAll').style.opacity=1;
        $('queryOne').options[0].selected=true;
        clearTimeout(timer1local);
        clearTimeout(timer2local);
        var id='id='+this.value;
        var map = bmap.map;
        map.clearOverlays();
        var flag=0;
        $XMLHttpRequest('post','/gpsobj/getHisdata',id,function(data){
            var result=JSON.parse(data),
                points=[],
                time=[],
                gpsobj_id=result.result[0].gpsobj_id;
            for(var i=0,len=result.result.length;i<len;i++){
                var c=result.result[i].coordinate,
                    lng=c.substr(0,c.indexOf(',')),
                    lat=c.substr(c.indexOf(',')+1,c.length),
                    point= new BMap.Point(lng,lat);
                    time.push(result.result[i].insertTime);
                    points.push(point); 
            }
            // var lngs=lng;
            // var lats=lat;
            bmap.shiftCoor(points,function(trasPoints){
                for (var j = 0,len=trasPoints.length; j < trasPoints.length; j++) {
                    var mk= new BMap.Marker(trasPoints[j]);
                    map.addOverlay(mk);
                    var label;
                    // bmap.addInfoWindow(mk,gpsobj_id,lngs,lats,trasPoints[j]);
                    var isinPolygon = BMapLib.GeoUtils.isPointInPolygon(trasPoints[j],bmap.polOverlay);
                    if(isinPolygon==true){
                        label = new BMap.Label(gpsobj_id+'在围栏内',{offset:new BMap.Size(20,-10)});
                        mk.setLabel(label);
                    }else{
                        label=new BMap.Label(gpsobj_id+'在围栏外,'+time[j],{offset:new BMap.Size(20,-10)});
                        label.setStyle({
                            backgroundColor:"red",
                             color : "black",
                             fontSize : "12px",
                             height : "20px",
                             lineHeight : "20px",
                             fontFamily:"微软雅黑"
                         });
                        mk.setLabel(label);
                        mk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    }
                    if(j>=1){
                        var polyline = new BMap.Polyline([trasPoints[j-1],trasPoints[j]], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});  //定义折线
                        map.addOverlay(polyline);     //添加折线到地图上                       
                    }
                }
            });               
        });
    },false); 
$('redraw').addEventListener('click',function(e){
    window.location.href='./editMap.html'
},false); 

$(function(){
	$("#locobjList").jqGrid({
	 	url:'/locobj/query',
	 	datatype:"json",
	 	colNames:['定位对象类型','定位对象别名','是否绑定电子标签','绑定电子标签号码','添加时间','编辑'],
	 	colModel:[
	 		{name:'typeName',index:'typeName',width:50,align:'center',editable:true,editrules:{required:true},editoptions:{readonly:true}},
	 		{name:'alias',index:'alias',width:50,align:'center',editable:true},
	 		{name:'state',index:'state',width:50,align:'center',editable:true,editoptions:{readonly:true}},
	 		{name:'number',index:'number',width:50,align:'center',editable:true,editoptions:{readonly:true}},
	 		{name:'insertTime',index:'insertTime',width:50,align:'center',editable:false,editoptions:{readonly:true}},
	 		{name:'action',index:'act',width:100,align:'center',sortable:false}
	 	],
	 	jsonReader:{
	 		root:'locobj',
	 		records:"total",
	 		total:"pages"
	 	},
	 	rowNum:10,
	 	rowList:[10,20,30],
	 	pager:'#objPager',
	 	mtype : "post",
	 	viewrecords:true,
	 	caption:"定位对象管理",
	 	rownumbers:true,
	 	rownumWidth:40,
	 	gridComplete:function(){
	 		var ids=$("#locobjList").jqGrid('getDataIDs');
	 		for(var i=0;i<ids.length;i++){
	 			var cl=ids[i];
	 			edit="<button style='height:30px;width:50px;' class='edit'>修改</button>";
	 			del = "<button style='height:30px;width:50px;' class='delete'  onclick=\"jQuery('#locobjList').jqGrid('delGridRow','"
		                    + cl + "',{url:'/locobj/delete',delData:{id:"+cl+"},});\" >删除</button>";
		        // bind="<button style='height:30px;width:50px;' class='bind'>绑定</button>";
		        unbind="<button style='height:30px;width:50px;' class='unbind'>解绑</button>";
	 			$("#locobjList").jqGrid('setRowData',ids[i],{
	 			 	action:edit+del+unbind,
	 			});
	 		}
	 		$(".edit").click(function(){
	 			var id=$(this).closest("tr").prop("id");
	 			$("#LeditNumbers").val(id);
	 			$("#edit").show();
	 			$("#add").hide();
	 			$("#overlay").show();
				var gr=$("#locobjList").jqGrid('getRowData',id);
				// console.log(gr.typeName);
				$("#typeNum option").each(function(){  
			        if($(this).text() == gr.typeName){  
			            $(this).prop("selected",true);  
			        }  
			    });
			    $("input:text[name='alias']").val(gr.alias);
			    $("input:radio[value="+gr.state+"]").prop("checked",true);
			    if(gr.state=="true"){
			    	$(".eleNumber").show();
	 				$.get("/eletag/getTagnum", function(data){
	 				$("#number").empty();
	 				$("#number").append("<option value='1'>"+gr.number+"</option>");
	 				for(var i=0;i<data.tagnum.length;i++){
	 				// console.log(data.tagnum[i].number);
	 					$("#number").append("<option value="+data.tagnum[i].id+">"+data.tagnum[i].number+"</option>");
	 					}		
	 				});
			    }else{
	 				$("#number").empty();
	 				$(".eleNumber").hide();
	 			}
				$("#formDiv").slideDown("fast");
	 		});
	 		$(".unbind").click(function(){
	 			var id=$(this).closest("tr").prop("id");
	 			$.post("/locobj/unbind",{id:id},function(data){
	 				$("#locobjList").jqGrid('setGridParam',{
	 					url:'/locobj/query',
	 				}).trigger("reloadGrid");
	 			})

	 		});
	 	}
	 });
	 jQuery("#locobjList").jqGrid('navGrid','#objPager',{edit:false,add:false,del:false,search:false})
	 	.navButtonAdd('#objPager',{
		caption:"添加定位对象",
		buttonicon:"ui-icon-add",
		onClickButton:function(){
			$("#overlay").show();
			$("#edit").hide();
	 		$("#add").show();
	 		$("input:text").val("");
	 		$("#number").empty();
	 		$("input:radio[value='false']").prop("checked",true);
	 		$(".eleNumber").hide();
			$("#formDiv").slideDown("fast");
		},
		position:"last"
	});
	 jQuery("#locobjList").jqGrid('setGridWidth',$(".eletagList").width()-2,true);
	 jQuery("#locobjList").jqGrid('setGridHeight',$(window).height()-150,true);
	 jQuery("#locobjList").jqGrid('filterToolbar',{stringResult: true,searchOnEnter : true});
	 $("#cancle").click(function(){
	 	$("#formDiv").slideUp("fast");
	 	$("#overlay").hide();
	 });
	 $.get("/loctype/query", function(data){
	 	// $("#typeNum").append("<option>1</option>");
	 	for(var i=0;i<data.loctype.length;i++){
	 		// console.log(data.loctype.typeNum);
	 		$("#typeNum").append("<option value="+data.loctype[i].typeNum+">"+data.loctype[i].typeName+"</option>");
	 	}
	 });
	 $("#add,#edit").click(function(){
	 	var name=$(this).prop("id");
	 	$.ajax({
	 		type:"POST",
	 		url:"/locobj/"+name,
	 		datatype:"json",
	 		data:$("#locobjForm").serialize(),
	 		success:function(data){
	 			// console.log(data);
	 			$("#formDiv").slideUp("fast");
	 			$("#overlay").hide();
	 			$("#locobjList").jqGrid('setGridParam',{
	 				url:'/locobj/query',
	 			}).trigger("reloadGrid");
	 		}
	 	})
	 });
	 //是否绑定电子标签
	 $("input:radio").click(function(){
	 	if ($(this).prop("value")=="true") {
	 		$(".eleNumber").show();
	 		$.get("/eletag/getTagnum", function(data){
	 			$("#number").empty();
	 			$("#number").append("<option value='1'>请选择需要绑定的电子标签</option>");
	 			for(var i=0;i<data.tagnum.length;i++){
	 				// console.log(data.tagnum[i].number);
	 				$("#number").append("<option value="+data.tagnum[i].id+">"+data.tagnum[i].number+"</option>");
	 			}		
	 		
	 		});
	 	}
	 	else{
	 		$("#number").empty();
	 		$(".eleNumber").hide();
	 	}
	 })
})
var func=function(){
	var a=1;
	return function(){
		a++;
		alert(a);
	}
}
var f=func();
f();
f();
f();