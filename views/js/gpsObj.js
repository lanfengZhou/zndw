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
	 })
})