var customerGroupInfo={isLoadList:false};

/**
 * 客户群选择页面初始化
 */
customerGroupInfo.initCustomerGroup=function(){
	customerGroupInfo.queryGroupList(1);
	customerGroupInfo.addDelSelectedEvent();
	customerGroupInfo.addAddCustomerGroupEvent();
	customerGroupInfo.addSearchEvent();
}

/**
 *  删除已选客户群
 */
customerGroupInfo.addDelSelectedEvent=function(){
	$("#closeGroup").click(function(event){
		$("#cgList li").removeClass("active");
		$("#selCgDiv").hide();
		$("#selcgListName em").html("");
		//派发事件
		$("#cgDiv").trigger("changeCustomerGroup",null);
	});
}
/**
 * 编辑添加客户群信息
 */
customerGroupInfo.addAddCustomerGroupEvent=function(){
	$("#cgDiv").bind("addCustomerGroup",function(event,data){
		//客户群在第二页编辑就会出现找不到客户群情况
		$("#selCgDiv").show();
		$("#selcgListName em").html(data.customGroupName);
		//如果客户群列表已经查询出来则需要判断当前页面中是否包含有客户群信息
		if(customerGroupInfo.isLoadList){
			if($("#cgList li[customgroupid='"+data.customGroupId+"']").length==1){
				$("#cgList li[customgroupid='"+data.customGroupId+"']").addClass("active");
				$("#cgList li[customgroupid='"+data.customGroupId+"']").trigger("click", data);
			}else{
				//派发事件
				$("#cgDiv").trigger("changeCustomerGroup",data);
			}
		}else{
			//派发事件
			$("#cgDiv").trigger("changeCustomerGroup",data);
		}
	});
}
/**
 * 客户群搜索事件
 */
customerGroupInfo.addSearchEvent=function(){
	$("#cgSearchBtn").click(function(event){
		customerGroupInfo.queryGroupList(1);
	});
}
/**
 *  查询客户群列表
 */
customerGroupInfo.queryGroupList=function(pageNum){
	//去掉空格
	var keyWords=$("#cgSearchInput").val().replace(/(^\s*)|(\s*$)/g,"");
	if(keyWords.indexOf ("请输入") !=-1){
		keyWords ="";
	}
	var url=contextPath+"/action/tactics/createTactics/getMoreMyCustom.do";
	var data={pageNum:pageNum,pageSize:12,keyWords:keyWords};
	$.post(url,data,customerGroupInfo.queryGroupListSuc);
}
/**
 * 查询客户群列表成功
 */
customerGroupInfo.queryGroupListSuc=function(obj){
	var cgItemEjsUrl=contextPath+"/assets/js/tactics/provinces/"+provinces+"/createTacticsCustGroup.ejs";
	var selectCg = $("#selectedCg").data("data");
	var cgListHtml;
	if(selectCg!= null){
		cgListHtml = new EJS({url:cgItemEjsUrl}).render({data:obj.result,customGroupId:selectCg.customGroupId});
	}else{
		cgListHtml = new EJS({url:cgItemEjsUrl}).render({data:obj.result,customGroupId:null});
	}
	$("#cgList").html(cgListHtml);
	customerGroupInfo.addItemClickEvent(obj.result);
	customerGroupInfo.addItemDetailsEvent(obj.result);
	customerGroupInfo.renderCustGroupPageView(obj);
	customerGroupInfo.isLoadList=true;
	if(tacticsInfo.custGroup!=null){
		$("#cgList li[customgroupid='"+tacticsInfo.custGroup.customGroupId+"']").addClass("active");
		$("#cgList li[customgroupid='"+tacticsInfo.custGroup.customGroupId+"']").trigger("click", tacticsInfo.custGroup);
	}
}
/**
 * @param data
 */
customerGroupInfo.renderCustGroupPageView=function(data){
	$("#custGroupPage").pagination({
        items: data.totalSize,
        itemsOnPage: data.pageSize,
        currentPage:data.pageNum,
        prevText:'上一页',
        nextText:'下一页',
        cssStyle: 'light-theme',
        onPageClick:function(pageNumber,event){
        	customerGroupInfo.queryGroupList(pageNumber);
        }
    });
}

/**
 * 注册客户群选择事件
 * @param obj
 */
customerGroupInfo.addItemClickEvent=function(obj){
	$("#cgList li").bind("click",function(event,data){
		var item=data;
		if(data==null||data==undefined){
			var index = $("#cgList li").index(this);
			item=obj[index];
			$("#cgList li").removeClass("active");
			$(event.currentTarget).addClass("active");
		}
		//派发事件
		$("#cgDiv").trigger("changeCustomerGroup",item);
		$("#selCgDiv").show();
		$("#selcgListName em").html(item.customGroupName);
	});
}
/**
 * 注册客户群详情事件
 * @param obj
 */
customerGroupInfo.addItemDetailsEvent=function(obj){
	$("#cgList li .group-box-detail > a").click(function(event){
		var detailButton = $(this);
		var event =event || window.event || arguments.callee.caller.arguments[0];
	    event.stopPropagation(); 
	    event.cancelBubble = true;
	    
	    var customGroupId = detailButton.parent().parent().parent().parent().attr('customGroupId');
	    
	    customerGroupInfo.queryCustomerGroupDetails(customGroupId);
	});
}
/**
 * 查询客户群详情
 * @param customGroupId
 */
customerGroupInfo.queryCustomerGroupDetails=function(customGroupId){
	var url=contextPath+"/action/tactics/createTactics/viewCustGroupDetail.do";
	var data={custGroupId:customGroupId};
	$.post(url,data,customerGroupInfo.queryCustomerGroupDetailsSuc);
}
/**
 * 查询客户群详情成功
 * @param GrpDetail
 */
customerGroupInfo.queryCustomerGroupDetailsSuc=function(grpDetail){
	$('.showGroupTypeDialog-id').html(grpDetail.CUSTOM_GROUP_ID);
	$('.showGroupTypeDialog-name').html(grpDetail.CUSTOM_GROUP_NAME);
	$('.showGroupTypeDialog-desc').html(grpDetail.CUSTOM_GROUP_DESC);
	$('.showGroupTypeDialog-filter').html(grpDetail.RULE_DESC);
	$('.showGroupTypeDialog-creater').html(grpDetail.CREATE_USER_NAME);
	$('.showGroupTypeDialog-createtime').html(grpDetail.CREATE_TIME_STR);
	$('.showGroupTypeDialog-updatecycle').html(grpDetail.UPDATE_CYCLE_NAME);
	$('.showGroupTypeDialog-datatime').html(grpDetail.DATA_TIME_STR);
	$('.showGroupTypeDialog-effectivetime').html(grpDetail.CUSTOM_STATUS);
	$('.showGroupTypeDialog-failtime').html(grpDetail.FAIL_TIME_STR);
	
	customerGroupInfo.openDialogForPreview('showGroupTypeDialog','客户群详情',null,680,390);
}
/**
 * 打开客户群详情dialog
 * @param className
 * @param titleTxt
 * @param buttons
 * @param _w
 * @param _h
 * @param _open
 * @param _close
 */
customerGroupInfo.openDialogForPreview=function(className,titleTxt,buttons,_w,_h,_open,_close){
	$('body').css('overflow', 'hidden');
	var ctObj=$("."+className);
	if(ctObj.length>0){
		ctObj=$("."+className);
	}else{
		ctObj=$("<div class='"+className+"'></div>");
		$("body").append(ctObj);
	}

	ctObj.dialog({
		title:titleTxt,
		modal:true,
		width:_w||1100,
		height:_h||610,
		position: { my: "center", at: "center", of: window },
		buttons: buttons,
		open:_open||function(){},
		close:function(event, ui ){
			$(".exclamation:visible").hide();
			$('body').css('overflow', 'auto');
			_close?_close():"";
		}
	});

}