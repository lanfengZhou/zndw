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