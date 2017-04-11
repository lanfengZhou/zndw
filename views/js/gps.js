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