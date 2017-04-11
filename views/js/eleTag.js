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
	 jQuery("#eletagList").jqGrid('setGridWidth',$(".eletagList").width()-2,true);
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