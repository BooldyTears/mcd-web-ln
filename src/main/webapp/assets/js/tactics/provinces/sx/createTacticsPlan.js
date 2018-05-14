var planInfo={};

var PLAN_SRV_TYPE_PRODUCT = "1";//产品
var PLAN_SRV_TYPE_POLICY = "2";//政策
var PLAN_SRV_TYPE_CONTENT = "1";//内容
var PLAN_SRV_TYPE_APPLICATION = "2";//应用
/**
 * 初始化产品页面
 */
planInfo.initPlan=function(){
	planInfo.initPlanView();
	planInfo.addEventListenter();
};
/**
 * 初始化页面元素
 */
planInfo.initPlanView=function(){
	planInfo.loadDimInfo();
	planInfo.queryPlan();
}
/*
 * 绑定事件
 */
planInfo.addEventListenter=function(){
	planInfo.addPlanSearchEvent();
	planInfo.addAddPlanEvent();
};
/**
 * 加载产品类别和渠道类型数据
 */
planInfo.loadDimInfo=function(){
	var ejsUrlPlanTypes=contextPath + '/assets/js/tactics/provinces/' + provinces + '/dimPlanTypes.ejs';
	var ejsUrlChannels=contextPath + '/assets/js/tactics/provinces/' + provinces + '/dimChannels.ejs';
	var ejsUrlPlanStyles=contextPath + '/assets/js/tactics/provinces/' + provinces + '/dimPlanStyles.ejs';
	var ejsUrlCitys=contextPath + '/assets/js/tactics/provinces/' + provinces + '/dimCitys.ejs';
	$.ajax({
		url:contextPath+"/action/tactics/createTactics/queryPlanTypes.do",
		data:{},
		success:function(data) {
			if(!data){
				return ;
			}
			//产品类型
			var planTypesHtml = new EJS({url: ejsUrlPlanTypes}).render({data:data.planTypes});
			$("#divDimPlanTypes").html(planTypesHtml);
			
			//渠道类型
			var channelTypesHtml = new EJS({url:ejsUrlChannels}).render({data:data.channels});
			$("#divDimChannels").html(channelTypesHtml);
			
			//产品类型
			var channelStylesHtml = new EJS({url:ejsUrlPlanStyles}).render({data:data.planStyles});
			$("#divDimPlanSrvType").html(channelStylesHtml);
			
			//地市列表
			var dimCitysHtml = new EJS({url:ejsUrlCitys}).render({data:data.dimCitys});
			$("#divDimCitys").parent().hide();
			$("#divDimCitys").html(dimCitysHtml);
			
			planInfo.addDimChangeEvent();
		}
	});
	
	//产品政策关联改变 
	var MCD_PLAN_CHANNEL_RELATION ="MCD_PLAN_CHANNEL_RELATION";
	
	$.ajax({
		url:contextPath+"/action/sys/getDicValueByKey.do",
		data:{
			"key":"MCD_PLAN_CHANNEL_RELATION",
		},
		success:function(data) {
			if(!data){
				return ;
			}
			if(data !="" && data == "1"){
				$("#divDimChannels").parent().hide();
		    }
		}
	});

};
/**
 * 产品类型  产品类别  渠道类型 切换过滤产品事件
 */
planInfo.addDimChangeEvent=function(){
	// 初始化产品类别
	$("#divDimPlanTypes > span").on('click', function(){
		var $target = $(this);
		$target.addClass("active").siblings().removeClass("active");
		planInfo.queryPlan(1);
	});
	// 初始化产品类型
	$("#divDimPlanSrvType > span").on('click', function(){
		var $target = $(this);
		$target.addClass("active").siblings().removeClass("active");
		planInfo.queryPlan(1);
	});
	// 初始化渠道类型
	$("#divDimChannels > span").on('click', function(){
		var $target = $(this);
		$target.addClass("active").siblings().removeClass("active");
		planInfo.queryPlan(1);
	});
};
/**
 * 查询产品列表
 */
planInfo.queryPlan=function(pageNum){
	var keyword=$("#inputKeywordPlan").val().replace(/(^\s*)|(\s*$)/g,"");
	if(keyword.indexOf ("请输入") !=-1){
		keyword ="";
	}
	var planTypeId = $("#divDimPlanTypes span.active").attr("planTypeId");
	var planSrvType = $("#divDimPlanSrvType span.active").attr("planSrvType");
	if(planSrvType==3){
		//$("#divDimCitys").parent().show();
	}else{
		$("#divDimCitys").parent().hide();
	}
	var channelId = $("#divDimChannels span.active").attr("channelId");
	//适用地市ID
	var cityId=$("#divDimCitys span.active").attr("cityId");
	
	var ejsUrlPlans=contextPath + '/assets/js/tactics/provinces/' + provinces + '/tablePlans.ejs';
	$.ajax({
		url:contextPath+"/action/tactics/createTactics/queryPlansByCondition.do",
		data:{
			"keyWords":keyword,
			"planTypeId":planTypeId,
			"planSrvType":planSrvType,
			"channelId":channelId,
			"cityId":cityId,
			"pageSize":5,
			"pageNum":pageNum
		},
		type:"POST",
		success:function(data) {
			if(!data){
				return ;
			}
			// 渲染表格部分
			var planHtml = new EJS({url:ejsUrlPlans}).render({data:data.result});
			$("#tbodyPlansList").html(planHtml);
			$('.public-table tbody tr:nth-child(2n+1)').addClass('odd');
			$('.public-table tbody tr:nth-child(2n)').addClass('even');
			// 分页渲染
			planInfo.renderPageView(data);
			planInfo.addPlanClickEvent(data);
			//编辑情况下 有可能产品列表查询慢
			var editPlanInfo=$("#tbodyPlansList").data("data");
			if(editPlanInfo!=undefined&&editPlanInfo!=null){
				$($("#tbodyPlansList .btn-a-blue")[0]).trigger("click", editPlanInfo);
			}
			
			//产品链接点击事件点击
			$("#tbodyPlansList tr td a").click(planInfo.openDetailDialog);
		}
	
	});
}
/**
 * 注册产品点击事件
 */
planInfo.addPlanClickEvent=function(dataList){
	$("#tbodyPlansList .btn-a-blue").bind("click",function(event,data){
		var item=data;
		if(data==null||data==undefined){
			var index = $("#tbodyPlansList .btn-a-blue").index(this);
			item=dataList.result[index];
		}
		//已存在的不需要再处理
		if ($("#divChoosedPlan span[planId=" + item.planId +"]").length > 0) {
			return ;
		}
		$("#divChoosedPlan span").remove();
		var li=$("<i class=\"close\"\"> &times;</i>");
		li.on("click", function(){
			// 删除已选政策列表中的展示内容
			$("#divChoosedPlan [planId=" + item.planId +"]").remove();
			// 发布策略取消事件
			$("#planDiv").trigger("changePlan",null);
		})
		var span=$("<span class=\"policy\" planId=" + item.planId + "><em>" + item.planName + "</em></span>");
		span.append(li);
		$("#divChoosedPlan").append(span);
		// 发布策略变更事件
		$("#planDiv").trigger("changePlan",item);
	});
}
/**
 * 点击查询按钮事件
 */
planInfo.addPlanSearchEvent=function(){
	$("#planSearchBtn").click(function(event){
		planInfo.queryPlan(1);
	});
}

/**
 * 产品添加事件
 * 
 */
planInfo.addAddPlanEvent=function(){
	$("#planDiv").bind("addPlan",function(event,data){
		if($("#tbodyPlansList .btn-a-blue").length>0){
			$($("#tbodyPlansList .btn-a-blue")[0]).trigger("click", data);
		}else{
			$("#tbodyPlansList").data("data",data);
		}
	});
}
/**
 * 分页显示组件
 */
planInfo.renderPageView=function(data){
	$("#divPlansPage").pagination({
        items: data.totalSize,
        itemsOnPage: data.pageSize,
        currentPage:data.pageNum,
        prevText:'上一页',
        nextText:'下一页',
        cssStyle: 'light-theme',
        onPageClick:function(pageNumber,event){
        	planInfo.queryPlan(pageNumber);
        }
    });
}
planInfo.formatDate=function(now) {
	var year=now.getUTCFullYear();
	var month=now.getMonth()+1;
	var date=now.getDate();
	var hour=now.getHours();
	var minute=now.getMinutes();
	var second=now.getSeconds();
	if(hour == 0){
		return year+"-"+month+"-"+date;
	}
	return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
};

/**
 * 产品详细信息查看弹窗
 */
planInfo.openDetailDialog=function(event){
	//获得产品ID
	var td = $(event.currentTarget).parent();
	var tr = $(td).parent();
	var dataInfo = $(tr).attr("data-info");
	var obj = eval('(' + dataInfo + ')');

	$.ajax({
		url:contextPath+"/action/tactics/createTactics/getPlanDetailById.do",
		data:{
			"planId":obj.planId,
		},
		type:"POST",
		success:function(data) {
			if(!data){
				return ;
			  }
				$('.plan-id').html(data.PLAN_ID);
				$('.plan-name').html(data.PLAN_NAME);
				$('.plan-desc').html(data.PLAN_DESC);
				$('.plan-type').html(data.TYPE_NAME);
				$('.plan-belo').html(data.CITY_NAMES);
				$('.plan-startTime').html(data.PLAN_STARTDATE);
				$('.plan-endTime').html(data.PLAN_ENDDATE);
		
				$(".productDetail-dialog").dialog({
					width:800,
					height:300,
					resizable: false,
			        modal: true,
			        title:"营销产品详情"
				});
			
		}
		
	});
		}