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