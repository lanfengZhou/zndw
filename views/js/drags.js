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