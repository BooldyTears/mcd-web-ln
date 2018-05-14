//优先级排序
define([ "backbone","my97","page","placeholder" ], function(require, exports,module) {
	module.exports = {
		init : function() {
			load_channel(1, 'content_online');
			load_channel(2, 'content_offline');
			initPriorityCampseg();
		}
	};
});

var channelId = "";
var adivId = "";
var pageNo = "1";
var pageSize = "1000";
var searchText = "";

//加载渠道列表
function load_channel(_online, _lct) {
	$.ajax({
		url : _ctx + '/action/sx/priorityOrder/queryChannelList.do',
		type : "POST",
		async: false,
		data : {online: _online},
		success : function(result) {
			if (!result) {
				alert('操作异常,请稍候重试!');
			}
			var data = result.data;
			var _html = '';
			var count = 0;
			for ( var d in data) {
				if (d % 5 == 0) {
					if (count >= 5) {
						_html += '<tr class="channel_tr" style="display: none;">';
					} else {
						_html += '<tr class="channel_tr">';
					}
				}
				_html += '<td onclick="clickChannel(this);" class="fleft content-type-box J_campType" '
					+ ' channel_Id="' + data[d].channelId + '" '
					+ ' adiv_count=' + data[d].adivList.length
					+ ' camp_num=' + data[d].channelCampNum + '>'
					+ data[d].channelName
					+ '('
					+ data[d].channelCampNum
					+ ')<span class="icon-down ' + (data[d].adivList.length > 0 ? '' : 'hidden') + '"></span></td>';
				if ((d % 5 == 4)) {
					_html += '</tr><tr class="adiv_tr" style="display: none;"></tr>';
				}
				count += 1;
			}
			if (count % 5 != 0) {
				_html += '</tr><tr class="adiv_tr" style="display: none;"></tr>';
			}
			$('#' + _lct).html(_html);
			if (_lct == 'content_online') { // 线上渠道
				var onlineTrLength = $("#content-type-right-online").prev().find("tr").length;
				if (onlineTrLength > 1) {
					$("#content-type-right-online").html("展开");
					$("#content-type-right-online").css("cursor", "pointer");
				}
			} else {// 线下渠道
				var offlineTrLength = $("#content-type-right-offline").prev().find("tr").length;
				if (offlineTrLength > 1) {
					$("#content-type-right-offline").html("展开");
					$("#content-type-right-offline").css("cursor", "pointer");
				}
			}
		}
	});
}

//第一次进入页面时选择第一个渠道，如果有运营位展开运营并选中第一个，加载相应的优先级活动列表
function initPriorityCampseg() {
	//绑定搜索框
    $("#search_sale_order_auto").change(function() {
    	searchText = "";
    	searchText = $("#search_sale_order_auto").val();;
        if(searchText.indexOf ("请输入策略名称或者编号") != -1) {
        	searchText = "";
    	}
    });
}
//点击渠道事件
function clickChannel(obj) {
    $(".channel_tr td").removeClass("active");
    $(obj).addClass("active");
    channelId = $(obj).attr("channel_id");
    //刷新内容区
    reloadPriorityCampsegView();
}

/*//点击渠道事件，如果有运营位并且已展开，则收起，否则展开运营位列表
function clickChannelOld(obj, _ctx_adiv_id) {
	channelId = $(obj).attr("channel_id");
	adivId = "";
	var adivCount = $(obj).attr('adiv_count');
	if (adivCount > 0) {
		if ($(obj).hasClass("active") && (_ctx_adiv_id == undefined || _ctx_adiv_id == "" || _ctx_adiv_id == null)) {
			$(obj).removeClass("active");
			var attr_tr = $(obj).parents('tr').next();
			attr_tr.hide();
		} else {
			$("td.fleft.content-type-box.J_campType.active").removeClass("active");
			$(obj).addClass("active");
			$('.adiv_tr').empty().hide();
			var _adiv_tr = $(obj).parents('tr').next();
			//var _url = (channelId == "916" || channelId == "917" ) ? (_ctx + '/action/sx/priorityOrder/queryIopAdivInfoList.do') : (_ctx + '/action/sx/priorityOrder/queryAdivInfoList.do');
			var _url = _ctx + '/action/sx/priorityOrder/queryAdivInfoList.do';
			$.ajax({
				url : _url,
				type : "POST",
				async: false,
				data : {
					channelId : channelId,
				},
				success : function(data) {
					if (!data) {
						alert('操作异常,请稍候重试!');
						return;
					}
					if (data.status == "201") {
						alert('操作异常,请稍候重试!');
						return;
					}
					var _html = '';
					var adivList = data.data;
					for (var i = 0; i < adivList.length; i++) {
						_html += '<td class="fleft content-type-box J_adivType" onclick="clickAdiv(this)"' 
							+ ' channel_id="' + channelId + '"' 
							+ ' adiv_id="' + adivList[i].adivId + '">'
							+ adivList[i].adivName + '(' + adivList[i].adivCampNum + ')</td>';
					}
					_adiv_tr.html(_html).show();
					//点击渠道时直接选择第一个运营位
					var _adiv_td = "";
					if (_ctx_adiv_id && _ctx_adiv_id != "" && _ctx_adiv_id != null) {
						_adiv_td = _adiv_tr.find('td[adiv_id=' + _ctx_adiv_id + ']');
					} else {
						_adiv_td = _adiv_tr.find('td:first-child');
					}
					clickAdiv(_adiv_td);
				},
				error : function() {
					alert("操作异常,请稍候重试!");
				}
			});
		}
	} else {
		$("td.fleft.content-type-box.J_campType.active").removeClass("active");
		$('.adiv_tr').hide();
		$(obj).addClass("active");
		//刷新内容区
		reloadPriorityCampsegView();
	}
}

//点击运营位
function clickAdiv(obj) {
	$(".adiv_tr td").removeClass("active");
	$(obj).addClass("active");
	channelId = $(obj).attr("channel_id");
	//adivId = $(obj).attr("adiv_id");
	//刷新内容区
	reloadPriorityCampsegView();
}*/



//置顶活动
function top_campseg(ele) {
	var _url = _ctx + '/action/sx/priorityOrder/topCampseg.do';
	var _campsegId = $(ele).attr('campseg_id');
	var _channelId = $(ele).attr('channel_id');
	var _adivId = $(ele).attr('adiv_id');
	
	$.ajax({
		url : _url,
		type : "POST",
		async: false,
		data : {
			campsegId : _campsegId,
			channelId : _channelId,
			adivId : _adivId,
		},
		success : function(data) {
			if (!data) {
				alert('操作异常,请稍候重试!');
				return;
			}
			if (data.status == "200") {
				//置顶成功重置活动内容区
				reloadPriorityCampsegView();
			} else if (result.status == 201) {
				alert('操作异常,请稍候重试!');
			}
		},
		error : function() {
			alert("任务置顶失败");
		}
	});
}

//终止活动
function stop_task(ele) {
	var _campsegId = $(ele).attr('campseg_id');
	var _channelId = $(ele).attr('channel_id');
	var _adivId = $(ele).attr('adiv_id');
	var _taskId = $(ele).attr('task_id');
	
	$("#delayDialog").remove();
	var dlg = $('<div id="delayDialog" class="tacttics-delay-dialog"><div class="clearfix">确定要终止该任务吗？</div></div>');
	$("body").append(dlg);
	dlg.dialog({
		title : "终止操作确认",
		modal : true,
		width : 450,
		height : 240,
		position : {
			my : "center",
			at : "center",
			of : window
		},
		buttons : [{
			text : "确定",
			"class" : "ok-small-button",
			click : function() {
				$.ajax({
					url : _ctx + "/action/sx/priorityOrder/terminateCampseg.do",
					type : "POST",
					async: false,
					data : {
						campsegId : _campsegId,
						channelId : _channelId,
						adivId : _adivId,
						taskId : _taskId
					},
					success : function(data) {
						if (!data) {
							alert('操作异常,请稍候重试!');
							return;
						}
						if (data.status == "200") {
							//终止成功重置活动内容区
							//reloadPriorityCampsegView();
							//渠道和运营选择栏的活动数减1
							try {
								var _channel_td = $("td.fleft.content-type-box.J_campType.active");
								var _camp_num = $(_channel_td).attr('camp_num');
								var _regexp = new RegExp('\\(' + _camp_num + '\\)$');
								_camp_num = (_camp_num - 1) < 0 ? 0 : (_camp_num - 1);
								$(_channel_td).attr('camp_num', _camp_num);
								var _td_html = $(_channel_td).html();
								_td_html = _td_html.replace(_regexp, '(' + _camp_num + ')');
								$(_channel_td).html(_td_html);
							} catch(error) {
								alert("刷新渠道、运营位时出现异常，请重新刷新页面！");
							}
							//刷新渠道下的运营位
							clickChannel(_channel_td);
						} else {
							alert('操作异常,请稍候重试!');
						}
					},
					error : function() {
						alert("任务终止失败");
					}
				});
				$(this).dialog("close");
			}
		},
		{
			text : "取消",
			"class" : "gray-small-button",
			click : function() {
				$(this).dialog("close");
				$("#delayDialog").remove();
			}
		} ],
		close : function(event, ui) {
			//$dp.hide();
			$(this).dialog("destroy");
			$("#delayDialog").remove();
		}
	});
}

//重新加载活动内容区
function reloadPriorityCampsegView() {
	var _url = _ctx + '/action/sx/priorityOrder/queryCampsegPriorityOrderList.do';
	$.ajax({
		url : _url,
		type : "POST",
		async: false,
		data : {
			searchText : searchText,
			pageNo : pageNo,
			pageSize : pageSize,
			channelId : channelId
		},
		success : function(result) {
			
			var html = new EJS(
					{
						url : _ctx + '/assets/js/priority-order/provinces/'+provinces+'/priorityOrder.ejs'
					}).render({
				data : result.data
			});
			$("#manualList").html(html);
			
			//绑定操作按钮
			//bindOperaterEventListener();

			//记录调整前的优先级顺序
			var _beforeArray = [];
			for (var i = 0, len = result.data.length; i < len; i++) {
				_beforeArray.push(result.data[i].priority);
			}
			//绑定表格单元拖动事件
			$("#priorityCampsegListTbody").sortable({
				items : "> tr.ui-sortable-handle",
				cursor : "move",
				placeholder : "ui-state-highlight",
				opacity: 0.5,
				revert: true,
				scroll: true,
				containment : "parent",
				axis : "y",
				start : function(event, ui) {
					$(ui.item).addClass("bulk-bg-style");
				},
				stop : function(event, ui) {
					var _trs = $(this).find(">tr");
					var _afterArray = [];
					var _campsegIdArr = [];
					var _channelId = "";
					var _adivId = "";
					for (var i = 0, len = _trs.length; i < len; i++) {
						if ($(_trs[i]).attr("campseg_id")) {
							_campsegIdArr.push($(_trs[i]).attr("campseg_id"));
							_channelId = $(_trs[i]).attr("channel_id");
							_adivId = $(_trs[i]).attr("adiv_id");
							_afterArray.push($(_trs[i]).attr("priority"));
						}
					}
					//重排序参数
					var _reorderIdArr = [];
					//判断哪些活动发生了移动
					var _start = 0;
					var _end = _beforeArray.length - 1;
					if (_beforeArray.length == _afterArray.length) {
						for (; _start < _beforeArray.length; _start++) {
							if (_beforeArray[_start] != _afterArray[_start]) {
								break;
							}
						}
						for (; _end >= _start; _end--) {
							if (_beforeArray[_end] != _afterArray[_end]) {
								break;
							}
						}
					}
					for (;_start <= _end; _start++) {
						_reorderIdArr.push(_campsegIdArr[_start]);
					}
					$.ajax({
						url : _ctx + "/action/sx/priorityOrder/reorderCampseg.do",
						type : "POST",
						async: false,
						data : {
							campsegIds : _reorderIdArr.join(","),
							channelId : _channelId,
							adivId : _adivId
						},
						success : function(data) {
							if (!data || data.status == "201") {
								alert("排序错误！");
							}
							reloadPriorityCampsegView();
						}
					});
				}
			}).disableSelection();
		}
	});
}

//绑定操作按钮事件
function bindOperaterEventListener() {
	// 点击终止任务
	$(".stick_on_stop_task").bind("click", function() {
		var _campsegId = $(this).attr('campseg_id');
		var _channelId = $(this).attr('channel_id');
		var _adivId = $(this).attr('adiv_id');
		var _taskId = $(this).attr('taskId');
		
		$("#delayDialog").remove();
		var dlg = $('<div id="delayDialog" class="tacttics-delay-dialog"><div class="clearfix">确定要终止该任务吗？</div></div>');
		$("body").append(dlg);
		dlg.dialog({
			title : "终止操作确认",
			modal : true,
			width : 450,
			height : 240,
			position : {
				my : "center",
				at : "center",
				of : window
			},
			buttons : [{
				text : "确定",
				"class" : "ok-small-button",
				click : function() {
					$.ajax({
						type : "POST",
						url : _ctx + "/action/sx/priorityOrder/terminateCampseg.do",
						async: false,
						data : {
							campsegId : _campsegId,
							channelId : _channelId,
							adivId : _adivId,
							taskId : _taskId
						},
						success : function(data) {
							if (!data) {
								alert("任务终止失败");
							};
							if (data != null && data.status == "200") {
								//刷新页面活动内容区
								reloadPriorityCampsegView();
							} else {
								alert("任务终止失败");
							}
						},
						error : function() {
							alert("任务终止失败");
						}
					});
					$(this).dialog("close");
				}
			},
			{
				text : "取消",
				"class" : "gray-small-button",
				click : function() {
					$(this).dialog("close");
					$("#delayDialog").remove();
				}
			} ],
			close : function(event, ui) {
				$(this).dialog("destroy");
				$("#delayDialog").remove();
			}
		});
	});
}

//翻页
function renderPageView(data, obj) {
	$("#priorityOrderAutoPage").pagination({
        items: data.total,
        itemsOnPage: data.pageSize,
        currentPage:data.pageNo,
        prevText:'上一页',
        nextText:'下一页',
        cssStyle: 'light-theme',
        onPageClick: function(pageNumber, event) {
        	pageNum = currentNum;//更新当前页码
        	reloadPriorityCampsegView();
        }
    });
}

function click_search_order(obj) {
	var placeholderText = $("#search_sale_order_auto").attr("placeholder");
	searchText = $("#search_sale_order_auto").val();
	if (searchText == placeholderText) {
		searchText = "";
	}
	reloadPriorityCampsegView();
}

function clickOpen(obj) {
	var text = $(obj).html();
	var trLength = $(obj).prev().find("tr.channel_tr").length;
	if (trLength * 1 > 1) {
		if (text == "收缩") {
			$(obj).html("展开");
			$(obj).prev().find("tr.channel_tr").hide();
			$(obj).prev().find("tr.channel_tr").eq(0).show();
		} else {
			$(obj).html("收缩");
			$(obj).prev().find("tr.channel_tr").show();
		}
	} else {
		if (text == "收缩") {
			$(obj).html("展开");
			//$("td.fleft.content-type-box.J_campType.active").removeClass("active");
			//$('.adiv_tr').hide();
		} else {
			$(obj).html("收缩");
		}
	}
}