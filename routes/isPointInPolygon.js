var express=require("express");
function  isPointLnPolygon(points,polygons){
	var polygon=JSON.parse(polygons);//多边形顶点字符转换为JSON对象
	var point=JSON.parse(points);//定位对象字符转换为JSON对象
	console.log(point);
	console.log(polygon[0]);
	var N = polygon.length;
	// console.log(polygon[0].lng);
    var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    var intersectCount = 0;//cross points count of x 
    var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
    var p1, p2;//neighbour bound vertices
    var p = point; //测试点
    
    p1 = polygon[0];//left vertex        
    for(var i = 1; i <= N; ++i){//check all rays            
        if(p==p1){
            return boundOrVertex;//p is an vertex
        }
        
        p2 = polygon[i % N];//right vertex            
        if(p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)){//ray is outside of our interests                
            p1 = p2; 
            continue;//next ray left point
        }
        
        if(p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)){//ray is crossing over by the algorithm (common part of)
            if(p.lng <= Math.max(p1.lng, p2.lng)){//x is before of ray                    
                if(p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)){//overlies on a horizontal ray
                    return boundOrVertex;
                }
                
                if(p1.lng == p2.lng){//ray is vertical                        
                    if(p1.lng == p.lng){//overlies on a vertical ray
                        return boundOrVertex;
                    }else{//before ray
                        ++intersectCount;
                    } 
                }else{//cross point on the left side                        
                    var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng                        
                    if(Math.abs(p.lng - xinters) < precision){//overlies on a ray
                        return boundOrVertex;
                    }
                    
                    if(p.lng < xinters){//before ray
                        ++intersectCount;
                    } 
                }
            }
        }else{//special case when ray is crossing through the vertex                
            if(p.lat == p2.lat && p.lng <= p2.lng){//p crossing over p2                    
                var p3 = polygon[(i+1) % N]; //next vertex                    
                if(p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)){//p.lat lies between p1.lat & p3.lat
                    ++intersectCount;
                }else{
                    intersectCount += 2;
                }
            }
        }            
        p1 = p2;//next ray left point
    }
    
    if(intersectCount % 2 == 0){//偶数在多边形外
        return false;
    } else { //奇数在多边形内
        return true;
    }            
}

module.exports=isPointLnPolygon;