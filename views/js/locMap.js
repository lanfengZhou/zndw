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
        map.addEventListener('tilesloaded',function(e){
            $('loading').style.display='none';
        });
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
