$(function(){
            var count=10;
            var flag=1;
            var check=setInterval(function(){
                if(flag){
                    var o=parseFloat(count)/10;
                    $(".topview").css("opacity",o);
                    count=count-4;
                    if (count==6) {
                        flag=0;
                    }
                }
                else{
                    var o=parseFloat(count)/10;
                    $(".topview").css("opacity",o);
                    count+=4;
                    if (count==10) {
                        flag=1;
                    }
                }        
            },500);
            var cavans=document.getElementById("mycavans");
            var ctx=cavans.getContext("2d");
                // ctx.fillStyle="#e8e8e8";
                ctx.rect(0,0,800,600);
            //内建HTML5对象，拥有多种绘制路径，矩形，圆形，字符以及添加图像的方法
            // ctx.fillStyle="#FFff00";//绘制一个红色矩形
            // ctx.fillRect(0,0,150,75);//定义矩形当前的填充方式，坐标，长宽
            // ctx.moveTo(0,0);//定义线条开始坐标
            // ctx.lineTo(200,100);//定义线条结束坐标
            // ctx.stroke();
            var original=$("#toptest").position();//检测区坐标
            var originalY=original.top+$("#toptest").height()/2;
            var originalX=original.left+$("#toptest").width()/2;
            function update(eles){
                eles=[];
                ctx.clearRect(0,0,800,600);//s四个参数，清除矩形左上角x,y坐标，清除矩形的宽度和高度
                $.ajax({
                url:"/locobj/getData",
                type:"GET",
                async:false,
                success:function(data){
                for(var i=0;i<data.locobj.length;i++){
                    var location=JSON.parse(data.locobj[i].data);
                    if(location){
                        ctx.beginPath();                    
                        // ctx.moveTo(location.x,location.y);//移动坐标
                        ctx.arc(location.x,location.y,8,0,2*Math.PI);//x,y,r,start,stop
                        // ctx.fillStyle="#ffffff";
                        ctx.fill();
                        // // ctx.closePath();
                        eles.push(data.locobj[i]);
                        }
                    }
                    // console.log(eles);
                }
            });
            return eles;
            }
            var eles=update();
            function fresh(){
                eles=update();
            }
            setInterval(fresh,2000);
            function getEventPosition(ev){//事件对象e的layerX和layerY属性表示Canvas内部坐标系中的坐标
            　　var x, y;
            　　if (ev.layerX || ev.layerX == 0) {
            　　x = ev.layerX;
            　　y = ev.layerY;
            　　} else if (ev.offsetX || ev.offsetX == 0) { // Opera
            　　x = ev.offsetX;
            　　y = ev.offsetY;
            　　}
            　　return {x: x, y: y};
            }
            function isEmptyObject(obj){
                for(var key in obj){
                    return false;
                }
                return true;
            }
            cavans.addEventListener("click",function(e){
                p = getEventPosition(e);
                draw(p);
                console.log(draw(p));
                var arr=draw(p);
                if(isEmptyObject(arr)){
                    $("#show").text("x轴坐标："+";"+"y轴坐标：");
                }
                else{
                    var arr0=JSON.parse(arr[0].data);
                    // console.log(arr[0].data);
                    $("#show").html("对象别名："+arr[0].alias+"</br></br>"+
                        "绑定电子标签号码："+arr[0].number+"</br></br>"+
                        "x轴坐标："+(arr0.x)+"</br></br>"+
                        "y轴坐标："+(arr0.y));
                }
            });
            function draw(p){
            　　var who = [];
            // 　　ctx.clearRect(0, 0, 800, 600);
                eles.forEach(function(obj, i){
                    var v=JSON.parse(obj.data);
                    // console.log(v);
                　　ctx.beginPath();
                　　ctx.arc(v.x, v.y, 8, 0,2*Math.PI);
                　　ctx.fill();
                　　if(p && ctx.isPointInPath(p.x, p.y)){//ctx对象包含p.x，p.y;
                　　//如果传入了事件坐标，就用isPointInPath判断一下
                　　//如果当前环境覆盖了该坐标，就将当前环境的index值放到数组里
                　　    who.push(eles[i]);
                　　   }
                });
            　　//根据数组中的index值，可以到arr数组中找到相应的元素。
            　　return who;
        　　}

            
            // ctx.beginPath();//绘制圆
            // ctx.arc(95,50,10,0,2*Math.PI);//x,y,r,start,stop
            // ctx.fill();
            // ctx.beginPath();//绘制圆
            // ctx.arc(100,200,10,0,2*Math.PI);//x,y,r,start,stop
            // ctx.fill();
            // cavans.onmousemove=function(e){
            //  var bbox=cavans.getBoundingClientRect();
            //  console.log(e.clientX);
            // }
            $("#adddata").click(function(){
                $.get("/locobj/addData",function(data){

                });
            })
            $("#deldata").click(function(){
                $.get("/locobj/delData",function(data){

                });
            })
        })