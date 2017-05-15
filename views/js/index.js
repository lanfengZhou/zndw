$(function(){
	$(".dropdown-menu a").click(function(){
		var name=$(this).prop("name");
		// $.get(name,function(data){
			$("#show").prop("src",name);
		// });
	});
})