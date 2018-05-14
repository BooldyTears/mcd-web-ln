var contentInfo={};
/**
 * 初始化产品页面
 */
$(function(){
	loadZtreeContents();//加载树形结构
	contentsZtreeSearchBtnClickEvent();//树形上方的查询按钮事件
	contentInfo.addEventListenter();//事件
});
/**
 * 绑定事件
 */
contentInfo.addEventListenter=function(){
	contentInfo.addTabClickEvent();//选产品-选内容切换事件
};
/**
 * 选产品-选内容切换事件
 */
contentInfo.addTabClickEvent = function(){
	$('#productOrContentDiv span').click(function(){
        var isEditFlag=$.url().param("isEdit") ? $.url().param("isEdit") : "";
        if(isEditFlag != "1"){
            $("#divChoosedPlan,#divChoosedContent,#selectedPlan,#selectedContent,#selectedChannels").empty();
        }
		var isContentClass = $(this).hasClass('J_contentYes');
		
		//marketingType 3-选产品  4-选内容
		var marketingType = tacticsInfo.plan ? tacticsInfo.plan.planSrvType : "";
		if(isContentClass){
			tacticsInfo.marketingType="4";
			if(isEditFlag==""){
				//初始化左侧树 并清空右侧列表
				loadZtreeContents();
				$('#tbodyContentsList,#divContentsPage').empty();
			}
			if(isEditFlag=="1"&&marketingType=="4"){//在修改时是选内容时 触发树形插件
				var treeObj=$.fn.zTree.getZTreeObj("treeContents");
				var nodes0 = treeObj.getNodesByParam("name", tacticsInfo.camp.firstBusinessClass, null);
				treeObj.setting.callback.onClick(null, "treeContents", nodes0[0]);
        	}
			if(isEditFlag=="1"&&marketingType=="3"){//在修改时是选产品时 点击选内容 
				//初始化左侧树 并清空右侧列表
				loadZtreeContents();
				$('#tbodyContentsList,#divContentsPage').empty();
				$('#divChoosedContent .close').trigger('click');
        	}
			$('#boxWrpProduct,#selectedPlanBox').addClass('hidden');
			$('#boxWrpContent,#selectedContentBox').removeClass('hidden');
		}else{
			if(isEditFlag=="1"&&marketingType=="4"){
				$('#divChoosedPlan .close').trigger('click');
			}
			//如果是新建智能推荐
			var marketingType2=$.url().param("marketingType");
			if(marketingType2 != undefined && marketingType2 == 2){
				tacticsInfo.marketingType="2";
			}else{
				tacticsInfo.marketingType="0";
			}
			
			$('#boxWrpProduct,#selectedPlanBox').removeClass('hidden');
			$('#boxWrpContent,#selectedContentBox').addClass('hidden');
		}
		$(this).addClass('color-blue').siblings('span').removeClass('color-blue');
	})
};
/**
 * 查询内容列表
 */
contentInfo.queryPlan=function(pageNum){
	var treeObj=$.fn.zTree.getZTreeObj("treeContents");
	var nodes = treeObj.getSelectedNodes();//获取 zTree 当前被选中的节点数据集合
    var leafName = nodes[0].name;
	var ejsUrlPlans=contextPath + '/assets/js/tactics/provinces/' + provinces + '/tableContents.ejs';
	$.ajax({
		url:contextPath+"/action/sx/digProductContent/queryDataListByleafNode.do",
		data:{
			   "pageSize":"10",          //分页条数
			   "pageNum":pageNum,         //当前查询页
			   "leafName":leafName           //叶子节点名称  必填
		},
		type:"POST",
		success:function(data) {
			if(!data){
				return ;
			}
			// 渲染表格部分
			var planHtml = new EJS({url:ejsUrlPlans}).render({data:data.result});
			$("#tbodyContentsList").html(planHtml);
			$('.public-table tbody tr:nth-child(2n+1)').addClass('odd');
			$('.public-table tbody tr:nth-child(2n)').addClass('even');
			// 分页渲染
			contentInfo.renderPageView("#divContentsPage",data);
			contentInfo.addContentClickEvent();//确定添加事件
			//编辑情况下 有可能产品列表查询慢
			var isEdit=$.url().param("isEdit") ? $.url().param("isEdit") : "";
			if(isEdit){
				$('#tbodyContentsList .btn-a-blue[data-id='+tacticsInfo.camp.planId+']').trigger('click');
			}
		}
	});
};
/**
 * 确定添加事件
 */
contentInfo.addContentClickEvent = function(){
	$("#tbodyContentsList .btn-a-blue").click(function(){
		var dataInfo = $(this).parents('tr').attr("data-info");
		var isForDlg = $("#boxWrpContent").attr('isForDlg');
		var item = eval('(' + dataInfo + ')');
		tacticsInfo.content=item;
		if(isForDlg=="1"){ //如果确定按钮是渠道中点击热点推荐用语按钮弹出窗中的确定按钮
			var channeldId = $('body').data("openChannelId");
			var execContent = $("#channelId_"+channeldId+"_contentWords").val()+item.contentRecommendInfo;
			$("#channelId_"+channeldId+"_contentWords").val(execContent);
			var maxNum = $("#channelId_"+channeldId+"_contentWords").attr('maxNum');//最大可输入字数
			$("#channelId_"+channeldId+"_contentWords_wordSize").text(maxNum-execContent.length);//剩余可输入字数
			$('#boxWrpContent').dialog("destroy");
			$('#boxWrpContent .policy-selected-box').removeClass('hidden');
			$('#boxWrpContent').attr('isForDlg',"0");
		}else{
			contentInfo.addContentNormalClickEvent(item);
		}
		
	});
};
contentInfo.addContentNormalClickEvent = function(item){
	var isForDlg = $("#boxWrpContent").attr('isForDlg');
	//isForDlg 1-用于弹窗中  "0"-用于普通列表
	$("#divChoosedContent span").remove();
	$(".contenWords-area").val(item.contentRecommendInfo);
	var li=$("<i class=\"close\"\"> &times;</i>");
	li.on("click", function(){
		// 删除已选政策列表中的展示内容
		$("#divChoosedContent [contentId=" + item.contentId +"]").remove();
		$("#selectedContent [shopCarContentId=" + item.contentId +"]").remove();
	})
	var span=$("<span class=\"policy\" contentId=" + item.contentId + "><em>" + item.contentName + "</em></span>");
	span.append(li);
	$("#divChoosedContent").append(span);
	// 发布策略变更事件
	$("#shopCar").trigger("shopCarChangeContent",item);
}

/**
 * 分页显示组件
 */
contentInfo.renderPageView=function(obj,data){
	$(obj).pagination({
        items: data.totalSize,
        itemsOnPage: data.pageSize,
        currentPage:data.pageNum,
        prevText:'上一页',
        nextText:'下一页',
        cssStyle: 'light-theme',
        onPageClick:function(pageNumber,event){
        	contentInfo.queryPlan(pageNumber);
        }
    });
};
/*树形结构相关=============================================================================================*/
var ztreeContesSetting = {
		async: {
			enable: true,
			url: getUrl
		},
		check: {
			enable: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		view: {
			expandSpeed: ""
		},
		callback: {
			beforeExpand: beforeExpand,
			onAsyncSuccess: onAsyncSuccess,
			onAsyncError: onAsyncError,
			onClick:ztreeOnClick
		}
	};
/**
 * 节点被点击的事件回调函数
*/
function ztreeOnClick(event, treeId, treeNode){
	if(!treeNode){return;}
	if(treeNode.level=="2"){//如果不是父节点
		contentInfo.queryPlan("1")
	}else{//触发双击事件 展开子节点
		var obj = treeNode.tId;
		$('#'+obj+"_switch").trigger('click');
	}
}
/**
 * 拼接异步加载的url
 */
function getUrl(treeId, treeNode) {
	var keyWords = $.trim($('#contentsZtreeKeywords').val());
	var param = "treeLevel="+treeNode.treeLevel+"&nodeName="+ treeNode.name +"&keyWords=" + keyWords;
	return contextPath+"/action/sx/digProductContent/queryTreeNodeData.do?" + param;
}
/**
 * 父节点展开前
 */
function beforeExpand(treeId, treeNode) {
	if (!treeNode.isAjaxing) {
		startTime = new Date();
		treeNode.times = 1;
		ajaxGetNodes(treeNode, "refresh");
		return true; 
	} else {
		alert("zTree 正在下载数据中，请稍后展开节点。。。");
		return false;
	}
}
/**
 * 异步加载成功
 */
function onAsyncSuccess(event, treeId, treeNode, msg) {
	if (!msg || msg.length == 0) {
		return;
	}
	var zTree = $.fn.zTree.getZTreeObj("treeContents");
	treeNode.icon = "";
	var zTree = $.fn.zTree.getZTreeObj("treeContents");
	//修改状态下的树形
	var isEdit=$.url().param("isEdit") ? $.url().param("isEdit") : "";
	var curType = $('.J_noContent').hasClass('hidden') ? $('#productOrContentDiv span.color-blue').attr('marketingType') : $('.J_noContent').attr("marketingType");//0-选产品 4-选内容
	if(isEdit&&curType=="4"){
		if(treeNode.treeLevel=="1"){
			var nodes1 = zTree.getNodesByParam("name", tacticsInfo.camp.secondBusinessClass, treeNode);
			zTree.setting.callback.onClick(null, "treeContents", nodes1[0]);
		}
		if(treeNode.treeLevel=="2"){
			var nodes2 = zTree.getNodesByParam("name", tacticsInfo.camp.thirdBusinessClass, treeNode);
			zTree.selectNode(nodes2[0]);
			zTree.setting.callback.onClick(null, "treeContents", nodes2[0]);
		}
	}
	zTree.updateNode(treeNode);
} 
/**
 * 异步加载失败
 */
function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	var zTree = $.fn.zTree.getZTreeObj("treeContents");
	alert("异步获取数据出现异常。");
	treeNode.icon = "";
	zTree.updateNode(treeNode);
}
/**
 * 获取节点
 */
function ajaxGetNodes(treeNode, reloadType) {
	var zTree = $.fn.zTree.getZTreeObj("treeContents");
	if (reloadType == "refresh") {
		treeNode.icon = contextPath+"/assets/css/lib/zTreeStyle/img/loading.gif";
		zTree.updateNode(treeNode);
	}
	zTree.reAsyncChildNodes(treeNode, reloadType, true);
}
/**
 * 加载树形结构
 */
function loadZtreeContents(){
	var keyWords = $.trim($('#contentsZtreeKeywords').val());
	$.ajax({
		url:contextPath+"/action/sx/digProductContent/queryTreeNodeData.do",
		data:{
			"keyWords":keyWords,            //关键字
            "treeLevel":"0",           //节点等级   目前树形结构分为3级 初始化页面(弹窗) 默认加载父节点树 该字段不传即可
            "nodeName":   ""            //节点名称   当查询子节点、叶子节点时必填
		},
		type:"POST",
		success:function(data) {
			$.fn.zTree.init($("#treeContents"),ztreeContesSetting , data);
		}
	});
};
/**
 * 树形结构上方的查询按钮
 */
function contentsZtreeSearchBtnClickEvent(){
	$('#contentsZtreeSearchBtn').click(function(){
		loadZtreeContents();
	})
};

