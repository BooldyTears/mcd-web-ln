/**============================================  产品库主js  ========================================================*/
/**
 * 产品库主js
 * 1.绑定方法监听
 * 2.初始化视图
 */
define(function(require, exports, module) {
	require("xdate");
	require("purl");
	require("page");
	require("toast");
	require("modal");
	
	exports.init = function() {
		$(document).ready(function() {
			initView();
		    addEventListener();
		});
	}
});


var keyWords = "";//初始化搜索关键字

/**
 * 初始化各个子页面
 */
function initView() {
    /**添加选择视图*/
    chooseView.addChooseView();
    /**添加列表视图*/
    tableView.addTableView();
}
/**
 * 页面元素进行统一的绑定事件入口
 */
function addEventListener() {
    initKeyWordsEventListiener();//关键字查询
    tableView.addTableListener();//表格的监听事件
}

/**
 * 关键字查询
 */
function initKeyWordsEventListiener() {
    $(".searchBtn").click(function() {
        pageNum = 1;
        keyWords = "";
        keyWords = $(".keyWords").val();
        if(keyWords.indexOf ("请输入") != -1) {
    		keyWords = "";
    	}

       //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
    $(".keyWords").change(function() {
        keyWords = "";//初始化关键字
        keyWords = $(".keyWords").val();
        if(keyWords.indexOf ("请输入") != -1) {
    		keyWords = "";
    	}
        //初始化视图数据
        //initTableViewData();
        //初始化列表视图
        //initTableResultView(table_result);
    });
}


/**=======================================  planChoose.js  选择菜单的视图  ==========================================*/
/**
 * chooseView选择视图对像
 */
var chooseView = {};
var channelId = "";//适用渠道参数
var cityId = "";//适用地市参数
var statusId = "";//使用状态
var ruleCitys = "";//地市维度数据
var ruleChannels = "";//渠道维度数据
var ruleStatuss = "";//状态维度数据

/**
 * 添加选择视图
 */
chooseView.addChooseView = function() {
    //初始化选择视图
	addCityChannelStatusChooseView();
	//添加地市选择监听事件
    addCityChooseEventListiener();
    //添加渠道选择监听事件
    addChannelChooseEventListiener();
    //添加状态选择监听事件
    addStatusChooseEventListiener();
};

/**
 * 添加地市、渠道选择视图
 */
function addCityChannelStatusChooseView() {

    //获取json数据
    $.ajax({
        url: contextPath+"/action/rule/ruleManage/queryRuleFilterTypes.do",
        type: "GET",
        async: false,
        success: function(data) {
            if (!data) { return; }
            ruleCitys = "";
            ruleChannels = "";
            ruleStatuss = "";
//          ruleCitys = data.cityList;//适用地市
            

            ruleChannels = data.channelList;//适用渠道
            ruleStatuss = data.statusList;//使用状态

            var cityView = "<span cityId='' class='active'>全部</span>";//地市视图
            /**地市视图*/
            for(var i = 0; i < ruleCitys.length; i++) {
                var cityId = ruleCitys[i].cityId;
                var cityName = ruleCitys[i].cityName;
                cityView += "<span cityId=" + cityId + ">" + cityName+"</span>";
            }
            $('#divDimCityList').html(cityView);
            $('#divDimCityList').find('span').eq(0).addClass('active');//默认取第一个添加active效果
            
            
            //陕西暂时没有地市
        	$("#citysId").hide();
        	$("#customTable_all table th:nth-child(3)").text("产品名称");

            /**渠道视图*/
            var channelView = "<span channelId='' class='active'>全部</span>";//渠道视图
            for(var i=0 ; i < ruleChannels.length; i++){
                var channelId = ruleChannels[i].channelId;
                var channelName = ruleChannels[i].channelName;
                //过滤渠道
                if("933"==channelId||"934"==channelId||"935"==channelId||"936"==channelId){
                channelView += "<span channelId=" + channelId + " class=''>" + channelName + "</span>";
                }
            }
            $('#divDimChannelList').html(channelView);
            $('#divDimChannelList').find("span").eq(0).addClass('active');//默认第一个添加active效果
            
            /**状态视图*/
            var statusView = "<span statusId='' class='active'>全部</span>";//渠道视图
            for(var i=0 ; i < ruleStatuss.length; i++){
                var statusId = ruleStatuss[i].statusId;
                var statusName = ruleStatuss[i].statusName;
                statusView += "<span statusId=" + statusId + " class=''>" + statusName + "</span>";
            }
            $('#divDimStatusList').html(statusView);
            $('#divDimStatusList').find("span").eq(0).addClass('active');//默认第一个添加active效果
        }
    });

}

/**
 * 1.添加状态选择监听事件
 * 2.初始化表格视图
 */
function addCityChooseEventListiener() {
    $('#divDimCityList span').click(function () {
        pageNum = 1;//记录当前页码
        cityId = "";//初始化状态
        //1.添加地市选择
        $(this).addClass('active').siblings('span').removeClass('active');
        cityId = $(this).attr("cityId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}

/**
 * 1.添加渠道选择监听事件
 * 2.初始化表格视图
 */
function addChannelChooseEventListiener() {
    $('#divDimChannelList span').click(function () {
        pageNum = 1;//记录当前页码
        channelId = "";//初始化分类
        //添加分类选
        $(this).addClass('active').siblings('span').removeClass('active');
        channelId = $(this).attr("channelId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}

/**
 * 1.添加渠道选择监听事件
 * 2.初始化表格视图
 */
function addStatusChooseEventListiener() {
    $('#divDimStatusList span').click(function () {
        pageNum = 1;//记录当前页码
        statusId = "";//初始化分类
        //添加分类选
        $(this).addClass('active').siblings('span').removeClass('active');
        statusId = $(this).attr("statusId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}
/**==================================   planList.js  列表数据的视图   ===============================================*/
//tableView列表视图
var tableView ={};

var jsp_page ="rule_detail.jsp";//内容详情jsp
var iframe_src = " ";//内同详情iframe路径

var params ="";//参数
var pageNum = 1;//记录当前页码
var pageSize = "";//记录每页多少条
var totalSize = "";//总条数
var currentPage = "";//获取当前页码
var table_result = "";//列表数据
var ruleId = "";//规则id
var dom_tr="";//当前的列表tr对象

/**
 * 1.一开始就加载视图
 * 添加列表视图
 */
tableView.addTableView = function() {
    //初始化视图数据
    initTableViewData();
    //初始化列表视图
    initTableResultView(table_result);
};

/**
 * 表格的监听事件
 */
tableView.addTableListener = function() {
	//添加全选框监听事件
	addCbxAllEventListener();
};

function addCbxAllEventListener() {
	//全选cbx
	$('.J_cbxAll').click(function(){
		if($(this).prop("checked")){
			$(".J_listCbx").prop("checked", true);
	    }else{
	    	$(".J_listCbx").prop("checked", false);
	    }
	});
}

/**
 * 初始化视图数据：table_result，totalPage
 *                   列表数据    总页码数
 */
function initTableViewData() {
    $.ajax({
        url:contextPath+"/action/rule/ruleManage/queryRuleList.do",
        data:{
            "keyWords":keyWords,
            "pageNum":pageNum,
            "cityId":cityId,
            "channelId":channelId,
            "statusId":statusId
        },
        async:false,
        type:"POST",
        success:function(data) {
            if (!data) { return;}
            table_result = "";//列表数据
            totalPage = "";//总页码数
            pageSize = data.pager.pageSize;//每页多少条
            totalSize= data.pager.totalSize;//总条数
            table_result = data.pager.result;//列表数据
            pageNum = data.pager.pageNum;//当前页码

            //初始化翻页
            renderPageView(data.pager, "divPlansPage");
        },
        error: function(){
	    	alert("加载规则时发生异常，请尝试刷新页面！");
	    	return;
		}
    });
}


/**
 * 初始化列表视图
 *
 */
function initTableResultView(data) {

    var tableHtml = "";
    var index = (pageNum == 0 ? 0 : pageNum - 1) * pageSize;
    for(var i = 0; i < data.length; i++) {
        var tr_id = "";
        var cityNames = data[i].cityNames||'';
        var channelNames = data[i].channelNames||'';

        //列表视图
        tableHtml += ""
            + "<tr class='text-center'>"
            + " <td ><span style='width:50px;'><input type='checkbox' ruleId='" + data[i].ruleId + "' " + (data[i].opType == "2" ? "class='J_listCbx'" : "disabled") + " /></span></td>"
            + "	<td ><span class='plan_desc unline color-link hand J_see' style='width:150px;' ruleId='" + data[i].ruleId + "' title='" + data[i].ruleName + "'>" + data[i].ruleName + "</span></td>"
            //+ "	<td ><span class='plan_desc' style='width:150px;' title='" + cityNames.replace(/,/g, "，") + "'>" + cityNames.replace(/,/g, "，") + "</span></td>"
            + "	<td ><span class='plan_desc' style='width:150px;' title='" + data[i].planNames  + "'>" + data[i].planNames + "</span></td>"
            + "	<td ><span class='plan_desc' style='width:150px;' title='" + channelNames.replace(/,/g, "，") + "'>" + channelNames.replace(/,/g, "，") + "</span></td>"
            + "	<td ><span " + ((data[i].status == "1") ? "class='span-in-use J_inUse'" : "") + " style='width:100px;' ruleId='" + data[i].ruleId + "' ruleName='" + data[i].ruleName + "'>" + data[i].statusName + "</span></td>"
            + "	<td ><span class='plan_desc' style='width:220px;' title='" + data[i].ruleDesc + "'>" + data[i].ruleDesc + "</span></td>"
            + "	<td ><span style='width:100px;' title='" + data[i].opType + "'>"
            + " 	<span class='icon_btn J_modify " + ((data[i].opType == "2") ? "" : "disabled") + "' title='修改' ruleId='" + data[i].ruleId + "'>修改</span>"
            + " 	<span class='icon_btn J_delete " + ((data[i].opType == "2") ? "" : "disabled") + "' title='删除' ruleId='" + data[i].ruleId + "'>删除</span>"
            + "</span></td>"
            + "</tr>";
    }
    $(".J_campManageRuleTab tbody").html(tableHtml);
    //管理按钮点击事件
    addManageEventListener();
    
    //详情内容弹窗事件
    //addDetailPopWinEventListiener();
}

function addManageEventListener() {
	//管理列表，在暂时不使用
	/*$(".J_manageBtn").click(function(obj) {
		var target = $(obj.target);
		if(target.hasClass("J_manageBtn")) {
			getManageList(target, "J_manageBtn");
			stopBubble(obj);
		}
	});*/
	
	//已使用活动弹窗监听
	addManageInUseShowEventListener();
	//修改/删除按钮监听
	addManageBtnEventListener();
	//删除选择框监听
	addCbxCheckedEventListener();
}

//管理列表，暂时不使用
function getManageList(currentDom, currentClass) {
	var ruleId = currentDom.attr("rule_id");
	var html = '<div class="tactics-manage-list" id="tacticsManageBtnList"><ul id="tacticsManageUL"></ul></div>';
	if(!currentDom.hasClass("controls")){
		currentDom = currentDom.parents(".controls")
	}
	var left = currentDom.offset().left;
	var top = currentDom.offset().top + 26 - $(window).scrollTop();
	$("body").append($(html).css({left:left,top:top,width:66}));
	var li = '';
	li += '<li ruleId="' + ruleId + '" btnType="view">查看</li>';
	li += '<li ruleId="' + ruleId + '" btnType="modify">修改</li>';
	li += '<li ruleId="' + ruleId + '" btnType="delete">删除</li>';
	$("#tacticsManageUL").html(li);
	
	addManageItemEventListener();
	
	$(window).scroll(function() {
		if(!currentDom.hasClass("controls")) {
			currentDom = currentDom.parents(".controls")
		}
		$("#tacticsManageBtnList").css({top:currentDom.offset().top + 26 - $(window).scrollTop()});
	});
	$(document).click(function(e) {
		$("#tacticsManageBtnList").remove();
		stopBubble(e);
	});
}

//管理列表，暂时不使用
function addManageItemEventListener() {
	$("#tacticsManageUL li").bind("click",function() {
		var btnType = $(this).attr("btnType");
		
		if (btnType == "modify") {//---------------------修改
			var ruelId = $(this).attr("ruleId");
			var _url = contextPath + "/jsp/rule/rulemanage.jsp?isEdit=1&ruleId=" + ruelId;
			//var openNewWin = window.open(_url);
			window.location.href = _url;
			return;
		} else if (btnType == "view") {//---------------------查看
			var ruelId = $(this).attr("ruleId");
			var _url = contextPath + "/jsp/rule/rulemanage.jsp?isEdit=0&ruleId=" + ruelId;
			var openNewWin = window.open(_url);
			return;

		    /*iframe_src = contextPath + "/jsp/rule/rulemanage.jsp?isEdit=0&ruleId=" + ruelId + "&popPage=true";
		    $("#poppage").attr("src",iframe_src);
		    $(".popwin").show();
		    $(".poppage").show();
		    $(".main-body").css("overflow","hidden");
		    return;*/
		} else if (btnType == "delete") {//---------------------删除
			if (!confirm("确认删除吗？")) {
				return;
			} else {
				saveWait('wait_content');
				var ruelId = $(this).attr("ruleId");
				$.ajax({
					url: contextPath + "/ruleManage/delete?ruleId=" + ruleId,
					data: {},
				    type: "POST",
				    async: false,
				    success: function(data) {
				    	$("#wait_content").remove();
				    	if (!data) {
				    		alert("删除规则发生异常，请联系管理员！");
				    		return;
				    	}
				    	if (data.result == "200") {
				    		alert(data.message);
				    		//return;
				    	}
				    	
				    	//删除成功重新加载页面
				    	//initTableViewData();
				        //initTableResultView(table_result);
				    },
				    error: function(){
				    	$("#wait_content").remove();
				    	alert("删除规则发生异常，请联系管理员！");
				    	return;
					}
				  });
			}
		}
	});
}

//保存/删除等待窗口，暂时不使用
function saveWait(id) {
	var div = '<div id=' + id + ' style="display:none;position:fixed;top:0px;left:0px;background-color:#2B2921;opacity:.4;z-index:999;width:100%;height:100%;"></div>';
	$(div).appendTo('body');
	var img = '<img style="position:fixed;left:48%;top:48%;" src="../../images/uploading.jpg"/>';
	$('#' + id + '').append(img);
	$('#' + id + '').fadeIn(300);
}

/*---------------------------
功能:停止事件冒泡
---------------------------*/
function stopBubble(e) {
    //如果提供了事件对象，则这是一个非IE浏览器
		e = e || window.event; // firefox下window.event为null, IE下event为null
    if ( e && e.stopPropagation ){
        //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    }else{
        //否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
      //阻止默认浏览器动作(W3C)
    if ( e && e.preventDefault ){
        e.preventDefault();
    //IE中阻止函数器默认动作的方式
    }else{
        window.event.returnValue = false;
    }
    return false;
}


/**
 * 翻页实现
 * @param data
 */
function renderPageView(data, className) {
    $("." + className).pagination({
        items: data.totalSize,
        itemsOnPage: data.pageSize,
        currentPage:data.pageNum,
        prevText:'上一页',
        nextText:'下一页',
        cssStyle: 'light-theme',
        onPageClick: function renderPage(currentNum, event) {
        	$(".J_cbxAll").prop("checked",false);;//翻页后全选按钮取消
            pageNum = currentNum;//更新当前页码
            //初始化视图数据
            initTableViewData();
            //初始化列表视图
            initTableResultView(table_result);
        }
    });
}

/**
 * 单选 checkbox 监听
 */
function addCbxCheckedEventListener(){
	//全选cbx，放在初始化页面时
//	$('.J_cbxAll').click(function(){
//		if($(this).prop("checked")){    
//			$(".J_listCbx").prop("checked", true);
//	    }else{    
//	    	$(".J_listCbx").prop("checked", false);
//	    }  
//	});
	//单选cbx
	$('.J_listCbx').click(function(){
		var chknum = $(".J_campManageRuleTab .J_listCbx").length;//选项总个数 
	    if($(this).prop("checked")){ 
	         $(this).prop("checked", true);
	    }else{   
	    	 $(this).prop("checked", false); 
	    } 
	    var chk = $(".J_campManageRuleTab .J_listCbx:checked").length;//选中的总个数 
	    if(chknum==chk){ 
	    	$(".J_cbxAll").prop("checked",true); 
	    }else{
	    	$(".J_cbxAll").prop("checked",false); 
	    } 
	});
}


/**
 * 使用中弹窗
 */
function addManageInUseShowEventListener() {
	$('.J_inUse').click(function(){
		var ruleId = $(this).attr('ruleId');
		var ruleName = $(this).attr('ruleName');
		$(".inUse-dialog").dialog({
			width:800,
			resizable: false,
		    modal: true,
		    title:'使用『' + ruleName + '』的策略'
		});
		//加载活动页面数据
		campseg_pageNum = "1";
		loadCampsegViewData(ruleId);
		renderCampsegResultView(campseg_result);
	});
}

//活动页面参数
var campseg_result = "";//活动列表数据
var campseg_pageNum = "";//页码
var campseg_pageSize = "";//
var campseg_totalSize = "";
var campseg_ruleId = "";
/**
 * 加载活动数据
 */
function loadCampsegViewData(ruleId) {
    $.ajax({
        url:contextPath+"/action/rule/ruleManage/queryCampsegList.do",
        data:{
            "pageNum":campseg_pageNum,
            "ruleId":ruleId
        },
        async:false,
        type:"POST",
        success:function(data) {
            if (!data) { return;}
            campseg_result = "";//列表数据
            campseg_pageSize = data.pager.pageSize;//每页多少条
            campseg_totalSize = data.pager.totalSize;//总条数
            campseg_result = data.pager.result;//列表数据
            campseg_pageNum = data.pager.pageNum;//当前页码
            campseg_ruleId = data.ruleId;
            //初始化翻页
            renderCampsegPageView(data.pager, "divCampsegPage");
        },
        error: function(){
	    	alert("加载策略时发生异常，请联系管理员！");
	    	return;
		}
    });
}

/**
 * 活动翻页实现
 * @param data
 */
function renderCampsegPageView(data, className) {
    $("." + className).pagination({
        items:data.totalSize,
        itemsOnPage:data.pageSize,
        currentPage:data.pageNum,
        prevText:'上一页',
        nextText:'下一页',
        cssStyle: 'light-theme',
        onPageClick: function renderPage(currentNum, event) {
        	campseg_pageNum = currentNum;//更新当前页码
            //初始化视图数据
        	loadCampsegViewData(campseg_ruleId);
            //初始化列表视图
        	renderCampsegResultView(campseg_result);
        }
    });
}

/**
 * 显示活动列表视图
 *
 */
function renderCampsegResultView(data) {
    var tableHtml = "";
    for(var i = 0; i < data.length; i++) {
        //列表视图
        tableHtml += ""
            + "<tr class='text-center'>"
            + " <td ><a href='"+contextPath+"/jsp/tactics/tacticsInfo.jsp?campsegId="+data[i].CAMPSEG_ID+"' target='_blank'><span class='plan_desc' campsegId='" + data[i].CAMPSEG_ID + "' title='" + (data[i].CAMPSEG_DESC == null ? "" : data[i].CAMPSEG_DESC) + "'>" + data[i].CAMPSEG_NAME + "</span></a></td>"
            + " <td ><span class='plan_desc' title='" + data[i].CAMPSEG_STAT_ID + "'>" + data[i].CAMPSEG_STAT_NAME + "</span></td>"
            + " <td ><span class='plan_desc' >" + (data[i].START_DATE.replace(/-/g,".") + " - " + data[i].END_DATE.replace(/-/g,".")) + "</span></td>"
            + "</tr>";
    }
    $(".J_campViewListTab tbody").html(tableHtml);
}

/**
 * 删除和批量删除
 */
function addManageBtnEventListener() {
	var deleteIds = [];
	//单个删除
	$('.J_delete').click(function(){
		deleteIds = [];
		var hasDisabled = $(this).hasClass('disabled');
		if(hasDisabled){return;}
		var ruleId = $(this).attr('ruleId');
		deleteIds.push(ruleId);
		deleteDlgShow(deleteIds);
	});
	//批量删除
	$('.J_deleteBatch').off('click').on('click',function(){
		deleteIds = [];
		var chkedBox = $('.J_campManageRuleTab').find('.J_listCbx:checked');
		if(chkedBox.length == 0){
			alert('请选择要删除的规则');
			return;
		}else{
			for(var i=0;i<chkedBox.length;i++){
				var chkedId = chkedBox.eq(i).attr('ruleId')
				deleteIds.push(chkedId)
			}
		}
		deleteDlgShow(deleteIds);
	});
	//新增
	$('.J_newAdd').off('click').on('click',function(){
			//window.location.href=contextPath+"/jsp/rule/createRule.jsp";
		window.open(contextPath+"/jsp/rule/createRule.jsp");
	});
	//修改
	$('.J_modify').click(function(){
		var hasDisabled = $(this).hasClass('disabled');
		if(hasDisabled){return;}
		var ruleId = $(this).attr('ruleId');
		//window.location.href = contextPath+"/jsp/rule/createRule.jsp?ruleId="+ruleId+'&isSee=1';
		window.open(contextPath+"/jsp/rule/createRule.jsp?ruleId="+ruleId+'&isSee=1');
	});
	//点击规则名称查看
	$('.J_see').click(function(){
		var ruleId = $(this).attr('ruleId');
		//window.location.href = contextPath+"/jsp/rule/createRule.jsp?ruleId="+ruleId+'&isSee=2';
		window.open(contextPath+"/jsp/rule/createRule.jsp?ruleId="+ruleId+'&isSee=2');
	});
}

/**
 * 删除弹窗
 */
function deleteDlgShow(deleteIdsArr){
	$('#deleteDlg').dialog({
		width:400,
		height:200,
		resizable: false,
		modal: true,
		title:"提示",
		buttons: [{
			 "class":"dialog-btn dialog-btn-gray",
			 "text":"取消",
			 "click": function() {
					$( this ).dialog( "close" );
				}
			 },{
			"class":"dialog-btn dialog-btn-blue",
			"text":"确定",
			"click": function() {
				    //1关闭弹窗
					$( this ).dialog( "close" );
					//2执行删除ajax
					$.ajax({
						url: contextPath + "/action/rule/ruleManage/deleteRule.do",
						data: {ruleIds:deleteIdsArr.join(",")},
						type: "POST",
						async: false,
						success: function(data) {
							//删除成功
							if (data.status == "200") {
								//取消全选
								$(".J_cbxAll").prop("checked",false);
								//重新加载页面
						    	initTableViewData();
						        initTableResultView(table_result);
								return;
						    }
						    //删除失败，弹出提示信息
						    alert(data.message);
						    return;
						},
						error: function(){
							alert("删除规则发生异常，请联系管理员！");
							return;
						}
					});
				}
			}]
	})
};

