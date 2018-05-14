define(["purl","backbone"],function(require, exports, module) {      
	module.exports={
		init:function(){
			//详情
			var getcampsegId=window.location.search.substr(1).split("=")[1];
			this.loadTacticDetail({
				ajaxData:{
					campsegId:getcampsegId
				},
				domCallback:this.getSubCampsegId
			});
			
			//选项卡功能
			this.tacticsInfoTab();
			
			$(document).on("click","#channelExeStateDiv .content-table-tr",function(){//TODO
				var statDate = $(this).find(">td:first").html();
				var channelId = $(this).attr("channelId");
				var currentObj = $(this);
				var subCampsegIds=module.exports.getsubCampsegIds();
				//如果当前行的子信息已经展示 就收缩起来
				if(currentObj.next().hasClass("J_policy_box")){
					$(".J_policy_box").remove();
					return ;
				}
				$.ajax({
				    type: 'post',
				    url: _ctx+"/action/tactics/tacticsInfo/getCampsChannelSituation.do",
				    data: {subCampsegIds:subCampsegIds,channelId:channelId,statDate:statDate} ,
				    success: function(result){
				    	console.log(result);
				    	var data=result.data;
						var headerTexts=data.headerTexts;
						var dataFields=data.dataFields;
						var datas=data.datas;
						
						// ["PLAN_NAME", "EXPOSURE_NUMS", "CUMULAT_EXPOSURE_NUMS", "CK_NUMS", "CUMULAT_CK_NUMS", "SAILSUCC_NUMS", "CUMULAT_SAILSUCC_NUMS"]
						var datas2=[
						       {PLAN_NAME:"策略名称",EXPOSURE_NUMS:16,CUMULAT_EXPOSURE_NUMS:12,CK_NUMS:43,CUMULAT_CK_NUMS:87,SAILSUCC_NUMS:1,CUMULAT_SAILSUCC_NUMS:65},
						       {PLAN_NAME:"策略名称2",EXPOSURE_NUMS:16,CUMULAT_EXPOSURE_NUMS:12,CK_NUMS:43,CUMULAT_CK_NUMS:87,SAILSUCC_NUMS:1,CUMULAT_SAILSUCC_NUMS:65},
						       {PLAN_NAME:"策略名称3",EXPOSURE_NUMS:16,CUMULAT_EXPOSURE_NUMS:12,CK_NUMS:43,CUMULAT_CK_NUMS:87,SAILSUCC_NUMS:1,CUMULAT_SAILSUCC_NUMS:65}
						       ];
				    	$(".J_policy_box").remove();
				    	// 表格列头
				    	if($.isArray(datas)){
					    	var  $tr = $('<tr class=" J_policy_box " channelid="902"><td colspan= "7" class="content-table-td2 J_tableBox"></td></tr>');
					    	currentObj.after($tr);
					    	$(".J_tableBox").html('<div class="ui-div-table ui-sub-table"><table class="content-table2 J_policy_tables"></table></div>');
							var trStr="";
							for(var j = 0;j <datas.length;j++){
								var rowData=datas[j];
								trStr+="<tr class=\"ui-sub-table\" channelId='"+channelId+"'>";
								for(var m = 0;m <headerTexts.length;m++){
									var dataField=dataFields[m];
									var td=rowData[dataField];
									trStr+="<td channelId='"+channelId+"' class=\"content-table-td2\">"+td+"</td>";
								}
								trStr+="</tr>";
							}
							if(trStr!=""){
								trStr+="</tr>";
							}
					    	$(".J_policy_tables").html(trStr);
				    	}
				    }
				});
				
			});
		},
		getsubCampsegIds:function(){
			var spans=$("#subCampsegIdCT").children("span");
			if(spans==null||spans.length==0){
				return ;
			}
			var subIds="";
			for(var i=0;i<spans.length;i++){
				var subId=$(spans[i]).text();
				if(i<spans.length-1){
					subIds=subIds+subId+",";
				}else{
					subIds=subIds+subId;
				}
			}
			return subIds;
		},
		loadCampsegChannels:function(campsegId,subCampsegIds){
			var url=_ctx+"/action/tactics/tacticsInfo/getCampChannels.do";
			var data={campsegId:campsegId,subCampsegIds:subCampsegIds};
			$.ajax({
			    type: 'GET',
			    url: url ,
			    data: data ,
			    success: function(data){
			    	if(data.status!="200"){
			    		return ;
			    	}
			    	var channels=data.data;
			    	if(channels==null||channels.length==0){
			    		return ;
			    	}
			    	var channelInfoDiv="";
			    	var channelTitleHtml = "";
			    	var channelQuotaInfoOf901Div = "";
			    	$("#channelExeStateList").empty();
			    	$("#channelExeStateDiv").empty();
			    	for(var i = 0;i <channels.length;i++){
			    		var item=channels[i];
			    		channelInfoDiv="<div class=\"content-title\"> ";
			    		channelInfoDiv+=item.CHANNEL_NAME+"执行情况"+
			    		"<ul class='ui-content-title-date J_channel_date_ul' data-id='"+item.CHANNEL_ID+"'><li class='active J_channel_date'date-type='w'>近一周</li><li class='J_channel_date' date-type='M'>近一月</li><li>自定义日期</li><li><input id='d4311"+item.CHANNEL_ID+"' type='text' ></li><li>-</li><li><input type='text' id='d4312"+item.CHANNEL_ID+"'></li></ul></div>";
			    		channelInfoDiv+="<div class=\"content-main\" >";
			    		channelInfoDiv+="<table class=\"content-table2 mt20\" id=\"channel_"+item.CHANNEL_ID+"\" ></table><div>";
//			    		if(i != (channels.length -1)){
//			    			if(i == 0){
//			    				channelTitleHtml ='	<div class="left-nav-box left-nav-box2 left-nav-active" id="'+item.CHANNEL_ID+'"><a href="#channel_'+item.CHANNEL_ID+'">'+item.CHANNEL_NAME+'</a><i class="fright left-nav-bg left-nav-bg2" data-num="'+(i+1)+'"></i></div>'+
//			    				'<div class="left-nav-line"></div>';
//			    			}else{
//			    				channelTitleHtml ='	<div class="left-nav-box left-nav-box2" id="'+item.CHANNEL_ID+'"><a href="#channel_'+item.CHANNEL_ID+'">'+item.CHANNEL_NAME+'</a><i class="fright left-nav-bg left-nav-bg2 " data-num="'+(i+1)+'"></i></div>'+
//			    				'<div class="left-nav-line"></div>';
//			    			}
//			    		}else{
//			    			if(i == 0){
//			    				channelTitleHtml ='	<div class="left-nav-box left-nav-box2 left-nav-active" id="'+item.CHANNEL_ID+'"><a href="#channel_'+item.CHANNEL_ID+'">'+item.CHANNEL_NAME+'</a><i class="fright left-nav-bg left-nav-bg2" data-num="'+(i+1)+'"></i></div>';
//			    			}else{
//			    				channelTitleHtml ='	<div class="left-nav-box left-nav-box2" id="'+item.CHANNEL_ID+'"><a href="#channel_'+item.CHANNEL_ID+'">'+item.CHANNEL_NAME+'</a><i class="fright left-nav-bg left-nav-bg2" data-num="'+(i+1)+'"></i></div>';
//			    			}
//			    		}
			    		$("#channelExeStateDiv").append(channelInfoDiv);
			    		if("901" == item.CHANNEL_ID && data.province == 'bj'){
			    			//添加实时短信判断
			    			var realtime = (item.CEP_EVENT_ID != undefined && "" != item.CEP_EVENT_ID) ? true : false;
			    			if (!realtime) {
				    			channelQuotaInfoOf901Div+="<div style=\"margin-top:20px\" >";
				    			channelQuotaInfoOf901Div+="<div><span class='J_showQuota hand toggleDown'><i></i>配额情况</span></div>";
				    			channelQuotaInfoOf901Div+="<div class='J_showQuotaBox hidden'><table class='quota-table' style='width:100%;' id=\"channel_"+item.CHANNEL_ID+"_quota\" ></table></div><div>";
			    			}
			    			module.exports.loadChannelQuotaOf901TableData("901",campsegId,subCampsegIds);
			    			$("#channelExeStateDiv").append(channelQuotaInfoOf901Div);
			    		}
			    		
			    		$("#channelExeStateList").append(channelTitleHtml);
			    		$('.J_showQuota').click(function(){
			    			$('.J_showQuotaBox').toggleClass('hidden');
			    			$('.J_showQuota').toggleClass('show');
			    		})
			    	}
			    	module.exports.loadChannelTableData(channels,campsegId,subCampsegIds);
			    	$(document).on("click",".J_channel_date_ul .J_channel_date",function(){
			    		$(".J_channel_date_ul[data-id='"+$(this).parent().attr("data-id")+"'] li.active").removeClass("active");
			    		$(this).addClass("active");
			    		$(".J_channel_date_ul input").val("");
			    		//加载每个渠道下的执行信息
			    		var myDate = new Date();
			    		var startDate =   new Date(Date.parse(myDate) + ((86400000 * 7) * -1) + 86400000);
			    		if($(this).attr("date-type") == "M"){
			    			startDate =   new Date(myDate.getFullYear(), (myDate.getMonth()) - 1, myDate.getDate(), myDate.getHours(), myDate.getMinutes(), myDate.getSeconds());
			    		} 
				    	module.exports.loadChannelTableData([{
				    		CHANNEL_ID:$(this).parent().attr("data-id"),
				    		startDate:startDate.Format("yyyyMMdd"),
				    		endDate:myDate.Format("yyyyMMdd")
				    	}],campsegId,subCampsegIds);
			    	});

			    	 var fromDate = $("[id *='d4311']").datepicker({changeMonth: true,numberOfMonths:1,dateFormat:"yymmdd"}).on( "change", function(event){
			    		 var channelId=$(event.target).attr("id").substring(5,8);
			    		 var endDateValue=$("#d4312"+channelId).val();
			    		 module.exports.loadChannelTableData([{
					    		CHANNEL_ID:channelId,
					    		startDate:this.value,
					    		endDate:endDateValue
					    	}],campsegId,subCampsegIds);
			    		 $("#d4312"+channelId).datepicker( "option", "minDate", $.datepicker.parseDate("yymmdd", this.value));
			    		 $(event.target).parent().parent().find("li").removeClass("active"); 
			         });
			    	 var toDate = $("[id *='d4312']").datepicker({changeMonth: true,numberOfMonths:1,dateFormat:"yymmdd"}).on( "change", function(event){
			    		 var channelId=$(event.target).attr("id").substring(5,8);
			    		 var startDate=$("#d4311"+channelId).val();
			    		 module.exports.loadChannelTableData([{
					    		CHANNEL_ID:channelId,
					    		startDate:startDate,
					    		endDate:this.value
					    	}],campsegId,subCampsegIds);
			    		 $("#d4311"+channelId).datepicker( "option", "maxDate", $.datepicker.parseDate("yymmdd", this.value));
			    		 $(event.target).parent().parent().find("li").removeClass("active"); 
			         });
			    	 
			    	 $.datepicker.dpDiv.addClass("ui-datepicker-box");
	
			    	$(document).on("click","#channelExeStateList .left-nav-box",function(){
			    		$('#channelExeStateList .left-nav-box').removeClass("left-nav-active");
			    		$(this).addClass("left-nav-active");
			    	});
			    	//加载每个渠道下的执行信息
			    },
			    dataType: 'json'
			});
		},
		
		getUipRecord:function(options){

			var defaults = {
					urlRoot:_ctx+"/action/sx/tactics/tacticsInfo/",
					id:"getUipLogRecord.do",
//					cmd:"getLogRecord",
					currentDom:"#uipRecordLog",
					ejsUrl:_ctx +"/assets/js/tactics/provinces/uipLogRecord.ejs",
					ajaxData:{}
			};
			
			
			options = $.extend(defaults, options);
			var getLogRecordModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var getLogRecordView = Backbone.View.extend({
				model : new getLogRecordModel({id : options.id}), 
				initialize : function() {
					this.render();
				},
				render : function() { 
					this.setDomList(this.model);
					return this;
				} ,
				setDomList:function(md){
					var defaultData = {cmd:options.cmd};
					var ajaxData = $.extend(defaultData, options.ajaxData);
					md.fetch({
						type : "post",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:'json',
						data:ajaxData,
						success:function(model) {
							if(model.attributes.status == 200){
								var _Html = new EJS({
									url : options.ejsUrl
								}).render(model.attributes);
								$(options.currentDom).html(_Html);
							}else{
								alert("请求错误");
							}
						}
					});
				}
			});
			new getLogRecordView({el:options.currentDom});
		},
		
		loadChannelTableData:function(channels,campsegId,subCampsegIds){
			for(var i = 0;i <channels.length;i++){
	    		var item=channels[i];
	    		var channelId=item.CHANNEL_ID;
	    		var url=_ctx+"/action/tactics/tacticsInfo/getCampChannelDetail.do";
	    		//默认查询一个月的数据
	    		var myDate = new Date();
	    		var startDate =   new Date(Date.parse(myDate) + ((86400000 * 7) * -1) + 86400000).Format("yyyyMMdd");
	    		if(channels[i].startDate){
	    			startDate = channels[i].startDate;
	    		}
	    		var endDate=myDate.Format("yyyyMMdd");
	    		if(channels[i].endDate){
	    			endDate = channels[i].endDate;
	    		}
				var data={campsegId:campsegId,subCampsegIds:subCampsegIds,
						channelId:channelId,startDate:startDate,endDate:endDate};
				$.post(url, data, module.exports.loadChannelTableDataSuc(channelId));
	    	}
		},
		loadChannelTableDataSuc:function(channelId){
			return function(obj){
				if(obj.status!="200"){
		    		return ;
		    	}
				var data=obj.data;
				var headerTexts=data.headerTexts;
				var dataFields=data.dataFields;
				//"DATA_DATE", "EXPOSURE_NUMS", "CUMULAT_EXPOSURE_NUMS", "CK_NUMS", "CUMULAT_CK_NUMS", "SAILSUCC_NUMS", "CUMULAT_SAILSUCC_NUMS"]
				data.datas2=[
				            {DATA_DATE:"20160627",EXPOSURE_NUMS:12,CUMULAT_EXPOSURE_NUMS:13,CK_NUMS:0,CUMULAT_CK_NUMS:123,SAILSUCC_NUMS:32,CUMULAT_SAILSUCC_NUMS:35},
				            {DATA_DATE:"20160628",EXPOSURE_NUMS:11,CUMULAT_EXPOSURE_NUMS:13,CK_NUMS:0,CUMULAT_CK_NUMS:123,SAILSUCC_NUMS:32,CUMULAT_SAILSUCC_NUMS:35},
				            {DATA_DATE:"20160629",EXPOSURE_NUMS:10,CUMULAT_EXPOSURE_NUMS:13,CK_NUMS:0,CUMULAT_CK_NUMS:123,SAILSUCC_NUMS:32,CUMULAT_SAILSUCC_NUMS:35}
				            ];
				var datas=data.datas;
				//<th class="content-table-th">序号</th>
				// 表格列头
				var thStr="<tr channelId='"+channelId+"'>";
				for(var i = 0;i <headerTexts.length;i++){
					var th=headerTexts[i];
					thStr+="<th class=\"content-table-th2\">"+th+"</th>";
				}
				thStr+="</tr>";
				//表格行
				var trStr="";
				for(var j = 0;j <datas.length;j++){
					var rowData=datas[j];
					trStr+="<tr class=\"content-table-tr\" channelId='"+channelId+"'>";
					for(var m = 0;m <headerTexts.length;m++){
						var dataField=dataFields[m];
						var td=rowData[dataField];
						trStr+="<td channelId='"+channelId+"' class=\"content-table-td2\">"+td+"</td>";
					}
					trStr+="</tr>";
				}
				if(trStr!=""){
					trStr+="</tr>";
				}
				$("#channel_"+channelId).html(thStr+trStr);
			};
		},
		loadChannelQuotaOf901TableData:function(channelId,campsegId,subCampsegIds){
			var url=_ctx+"/action/tactics/tacticsInfo/getCampChannelQuota.do";
			var data={campsegId:campsegId,subCampsegIds:subCampsegIds,channelId:channelId};
			$.post(url, data, module.exports.loadChannelQuotaOf901TableDataSuc(channelId));
		},
		loadChannelQuotaOf901TableDataSuc:function(channelId){
			return function(obj){
				if(obj.status!="200"){
		    		return ;
		    	}
				var data=obj.data;
				var headerTexts=data.headerTexts;
				var dataFields=data.dataFields;
				var datas = null;
				if(data.datas.length > 0){
					datas = data.datas[0].E_901_QUOTA_OCCUPANCY;
				}
				
				if(datas == null){
					return;
				}
					
				//<th class="content-table-th">序号</th>
				// 表格列头
				var thStr="<tr>";
				for(var i = 0;i <headerTexts.length;i++){
					var th=headerTexts[i];
					thStr+="<th class=\"content-table-th2\">"+th+"</th>";
				}
				thStr+="</tr>";
				//表格行
				var trStr="";
				for(var j = 0;j <datas.length;j++){
					var rowData=datas[j];
					if("***" == rowData["DEPT_QUOTA_NUM"] || "***" == rowData["OCCUPY_QUOTA_NUM"]){
						break;
					}
					trStr+="<tr class=\"content-table-tr\" channelId='"+channelId+"'>";
					for(var m = 0;m <headerTexts.length;m++){
						var dataField=dataFields[m];
						var td=rowData[dataField];
						trStr+="<td channelId='"+channelId+"' class=\"content-table-td2\">"+td+"</td>";
					}
					trStr+="</tr>";
				}
				if(trStr!=""){
					trStr+="</tr>";
				}
				$("#channel_"+channelId+"_quota").html(thStr+trStr);
			};
		},
		tacticsInfoTab:function(){
			var tacticsInfoView = Backbone.View.extend({
				events : { 
					"click" : "click"
				},
				click : function(obj) {
					var $target =  $(obj.target);
					if($target.hasClass("active")) return;
					var _index=$target.parent().find("li").index($target[0]);
					if(_index==-1){
						return ;
					}
					$target.addClass("active").siblings(".active").removeClass("active");
					$("body").find("> .tabbox").eq(_index).addClass("active").siblings(".active").removeClass("active");
					var data_type = $target.attr("data-type");
					var subCampsegIds=module.exports.getsubCampsegIds();
					if(data_type == "tacticsLog"){
						module.exports.getLogRecord({
							ajaxData:{campsegId : $("#campsegId").attr("campsegId")}
						});
					}else if(data_type=="tacticsRunInfo"){
						module.exports.loadCampsegChannels($("#campsegId").attr("campsegId"),
								subCampsegIds);
					}else if(data_type=="tacticsUipLog"){
						module.exports.getUipRecord({
							ajaxData:{campsegId : $("#campsegId").attr("campsegId")}
						});
					}
				},
				initialize : function() {
					this.render();
				},
				render : function() { 
					return this;
				} 
			});
			new tacticsInfoView({el:"#tactics-state-tab"});
		},
		loadTacticDetail:function(options){
			var defaults = {
					urlRoot:_ctx+"/action/tactics/tacticsInfo/",
					id:"viewPolicyDetail.do",
//					cmd:"viewPolicyDetail",
					currentDom:"#tacticsDetail",
					ejsUrl:_ctx +"/assets/js/tactics/provinces/"+provinces+"/tacticsInfoDetail.ejs",
					ajaxData:{},
					domCallback:function(){}
			};
			options = $.extend(defaults, options);
			var tacticsInfoDetailModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var tacticsInfoDetailView = Backbone.View.extend({
				model : new tacticsInfoDetailModel({id : options.id}), 
				initialize : function() {
					this.render();
				},
				render : function() { 
					this.setDomList(this.model);
					return this;
				} ,
				setDomList:function(md){
					var defaultData = {cmd:options.cmd};
					var ajaxData = $.extend(defaultData, options.ajaxData);
					md.fetch({
						type : "post",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:'json',
						data:defaultData,
						success:function(model) {
							var _Html = new EJS({
								url : options.ejsUrl
							}).render(model.attributes);
							$(options.currentDom).html(_Html);
							options.domCallback();
						}
					});
				}
			});
			new tacticsInfoDetailView({el:options.currentDom});
		},
		getSubCampsegId:function(){
			//根据子id获取每个规则下面的数据:
			var subCampsegIdCTList=$("#subCampsegIdCT span");
			var boxesCT=$("#subCamsegBoxesCT");
			var subSegtabCT=$("#subCamsegTab");
			for(var i=0;i<subCampsegIdCTList.length;i++){
				var subCampsegId=subCampsegIdCTList.eq(i).html();
				var _htm='<div class="box">';
				_htm+='<div class="content">';
				_htm+='<div class="content-title-little">产品</div>';
				_htm+='<div class="content-main">';
				_htm+='<div class="mtlStcPlan content-table"></div>';
				_htm+='</div></div>';
				
				_htm+='<div class="content">';
				_htm+='<div class="content-title-little">客户群</div>';
				_htm+='<div class="content-main">';
				_htm+='<div class="targetCustomerbase content-table"></div>';
				_htm+='</div></div>';
				
				_htm+='<div class="content">';
				_htm+='<div class="content-title-little">渠道</div>';
				_htm+='<div class="content-main">';
				_htm+='<div class="deliveryChannelView content-table"></div>';
				_htm+='</div></div>';
				
				_htm+='</div>';
				var _htmobj=$(_htm);
				
				module.exports.getMtlStcPlan({
					currentDom:_htmobj.find(".mtlStcPlan"),
					ajaxData:{
						campsegId:subCampsegId
					}
				});
				module.exports.getTargetCustomerbase({
					currentDom:_htmobj.find(".targetCustomerbase"),
					ajaxData:{
						campsegId:subCampsegId
					}
				});
				module.exports.getDeliveryChannel({
					currentDom:_htmobj.find(".deliveryChannelView"),
					ajaxData:{
						campsegId:subCampsegId
					}
				});
				if(i==0) _htmobj.addClass("active");
				boxesCT.append(_htmobj);
				
				var _html='';
				if(i>0){
					_html+='<div class="left-nav-line"></div>';
					_html+='<div class="left-nav-box">';
				}else{
					_html+='<div class="left-nav-box left-nav-active">';
				}
				_html+='<span>规则'+(i+1)+'</span>';
				_html+='<i class="fright left-nav-bg" data-num="2"></i>';
				_html+='</div>';
				var _htmlobj=$(_html);
				
				subSegtabCT.append(_htmlobj);
				
				//规则列表选项卡
				
				$("#subCamsegTab .left-nav-bg").on("click",function(){
					if($(this).parent().hasClass(".left-nav-active")) return;
					var _index=$(this).parents("#subCamsegTab").find(".left-nav-bg").index($(this)[0]);
					var cdnTxt="业务类型："+$("#cdnTd").attr("data-cdn").split(",")[_index];
					$("#cdnTd").html(cdnTxt);
					$(this).parents("#subCamsegTab").find(".left-nav-box").eq(_index).addClass("left-nav-active").siblings(".left-nav-active").removeClass("left-nav-active");
					$("#subCamsegBoxesCT .box").eq(_index).addClass("active").siblings(".active").removeClass("active");
				});
			}
			//end
		},
		getMtlStcPlan:function(options){
			var defaults = {
					urlRoot:_ctx+"/action/tactics/tacticsInfo",
					id:"getMtlStcPlan.do",
//					cmd:"getMtlStcPlan",
					currentDom:"#mtlStcPlan",
					ejsUrl:_ctx +"/assets/js/tactics/provinces/"+provinces+"/getMtlStcPlan.ejs",
					ajaxData:{}
			};
			options = $.extend(defaults, options);
			var tacticsInfoMtlStcPlanModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var tacticsInfoMtlStcPlanView = Backbone.View.extend({
				events : { 
					"click" : "click"
				},
				click:function(obj){
					var $target =  $(obj.target);
					var showtar=$target.parents(".J_click").next(".mtlStcPlanDetailTr");
					if(showtar.hasClass("active")){
						showtar.hide().removeClass("active");
					}else{
						showtar.show().addClass("active");
					}
				},
				model : new tacticsInfoMtlStcPlanModel({id : options.id}), 
				initialize : function() {
					this.render();
				},
				render : function() { 
					this.setDomList(this.model);
					return this;
				} ,
				setDomList:function(md){
					var defaultData = {cmd:options.cmd};
					var ajaxData = $.extend(defaultData, options.ajaxData);
					md.fetch({
						type : "post",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:'json',
						data:ajaxData,
						success:function(model) {//console.log(options.ajaxData.campsegId);
							var _Html = new EJS({
								url : options.ejsUrl
							}).render(model.attributes);
							$(options.currentDom).html(_Html);
						}
					});
				}
			});
			new tacticsInfoMtlStcPlanView({el:options.currentDom});
		},
		getTargetCustomerbase:function(options){
			var defaults = {
					urlRoot:_ctx+"/action/tactics/tacticsInfo/",
					id:"getTargetCustomerbase.do",
//					cmd:"getTargetCustomerbase",
					currentDom:"#targetCustomerbase",
					ejsUrl:_ctx +"/assets/js/tactics/provinces/"+provinces+"/gettargetCustomerbase.ejs",
					ajaxData:{}
			};
			options = $.extend(defaults, options);
			var tacticsInfoGetTargetCustomerbaseModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var tacticsInfoGetTargetCustomerbaseView = Backbone.View.extend({
				model : new tacticsInfoGetTargetCustomerbaseModel({id : options.id}), 
				initialize : function() {
					this.render();
				},
				render : function() { 
					this.setDomList(this.model);
					return this;
				} ,
				setDomList:function(md){
					var defaultData = {cmd:options.cmd};
					var ajaxData = $.extend(defaultData, options.ajaxData);
					md.fetch({
						type : "post",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:'json',
						data:defaultData,
						success:function(model) {
							var _Html = new EJS({
								url : options.ejsUrl
							}).render(model.attributes);
							$(options.currentDom).html(_Html);
						}
					});
				}
			});
			new tacticsInfoGetTargetCustomerbaseView({el:options.currentDom});
		},
		getDeliveryChannel:function(options){
			var defaults = {
					urlRoot:_ctx+"/action/tactics/tacticsInfo/",
					id:"getDeliveryChannel.do",
//					cmd:"getDeliveryChannel",
					currentDom:"#deliveryChannelView",
					ejsUrl:_ctx +"/assets/js/tactics/provinces/"+provinces+"/getDeliveryChannel.ejs",
					ajaxData:{}
			};
			options = $.extend(defaults, options);
			var getDeliveryChannelModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var getDeliveryChannelView = Backbone.View.extend({
				model : new getDeliveryChannelModel({id : options.id}), 
				initialize : function() {
					this.render();
				},
				render : function() { 
					this.setDomList(this.model);
					return this;
				} ,
				setDomList:function(md){
					var defaultData = {cmd:options.cmd};
					var ajaxData = $.extend(defaultData, options.ajaxData);
					md.fetch({
						type : "post",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:'json',
						data:ajaxData,
						success:function(model) {
							var _Html = new EJS({
								url : options.ejsUrl
							}).render(model.attributes);
							$(options.currentDom).html(_Html);
							//本活动占用配额修改  -mcd-web-bj
							if($('.J_modMount').length>0){
								module.exports.quotaInOperation();
								
							}
							//当是短信渠道时修改策略描述为执行目的
							if($("#campDescText").text()!=''){
								module.exports.updateCampDescText(model.attributes.data);
							}
						}
					});
				}
			});
			new getDeliveryChannelView({el:options.currentDom});
		},
		
		//当是短信渠道时修改策略描述为执行目的
		updateCampDescText:function(data){
			var channelIds = "";
			$("#campDescText").text('策略描述');
			//渠道信息
			for(var i=0;i<data.length;i++){
				var channelItem=data[i];
				channelIds += channelItem.channel_id;
			}
			//当只有短信渠道时策略描述 为:执行目的
			if(channelIds == "901"){
				$("#campDescText").text('执行目的');
			}
		},
		
		quotaInOperation:function(){//本活动占用配额修改  -mcd-web-bj
			var oldVal = "";
			//编辑
			$('.J_modMount').click(function(){
				oldVal = $(this).siblings('.inputNone').val();
				$(this).siblings('.inputNone').addClass('inputEdit');
				$(this).addClass('visibility-hidden');
				$(this).siblings('.J_modMountCanel,.J_modMountSave').removeClass('visibility-hidden');
				$('.inputNone').removeAttr('readonly');
			});
			//取消修改
			$('.J_modMountCanel').click(function(){
				console.log(oldVal)
				$(this).siblings('.inputNone').removeClass('inputEdit');
				$(this).addClass('visibility-hidden');
				$(this).siblings('.J_modMountSave').addClass('visibility-hidden');
				$(this).siblings('.J_modMount').removeClass('visibility-hidden');
				$(this).siblings('.inputNone').val(oldVal);
				$('.inputNone').attr('readonly','readonly');
			});
			//保存
			$('.J_modMountSave').click(function(){
				var campsegId = $.url().param("campsegId");
				var month = $(this).siblings('.inputMonth').val();//修改后的数值
				var mountNum = $(this).siblings('.inputNone').val();//修改后的数值
				var _this = $(this);
				$.ajax({
					url:_ctx+"/action/tactics/createTactics/updateQuota.do",
					data:{"campsegId":campsegId,"month":month,"mountNum":mountNum},
					success:function(data){
						if(!data){return;}
						if(data.status == "200"){
							alert('保存成功');
							_this.siblings('.inputNone').removeClass('inputEdit');
							_this.addClass('visibility-hidden');
							_this.siblings('.J_modMountCanel').addClass('visibility-hidden');
							_this.siblings('.J_modMount').removeClass('visibility-hidden');
							$('.inputNone').attr('readonly','readonly');
							//_this.siblings('.inputNone').val(mountNum);
						}else{
							alert("保存失败");
						}
					},
					error:function (e){
						alert("保存失败");
					}
				});
			});
		},
		getLogRecord:function(options){
			var defaults = {
					urlRoot:_ctx+"/action/tactics/tacticsInfo/",
					id:"getLogRecord.do",
//					cmd:"getLogRecord",
					currentDom:"#logRecordCT",
					ejsUrl:_ctx +"/assets/js/tactics/provinces/logRecord.ejs",
					ajaxData:{}
			};
			options = $.extend(defaults, options);
			var getLogRecordModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var getLogRecordView = Backbone.View.extend({
				model : new getLogRecordModel({id : options.id}), 
				initialize : function() {
					this.render();
				},
				render : function() { 
					this.setDomList(this.model);
					return this;
				} ,
				setDomList:function(md){
					var defaultData = {cmd:options.cmd};
					var ajaxData = $.extend(defaultData, options.ajaxData);
					md.fetch({
						type : "post",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:'json',
						data:ajaxData,
						success:function(model) {
							if(model.attributes.status == 200){
								var _Html = new EJS({
									url : options.ejsUrl
								}).render(model.attributes);
								$(options.currentDom).html(_Html);
							}else{
								alert("请求错误");
							}
						}
					});
				}
			});
			new getLogRecordView({el:options.currentDom});
		}
	};
});
//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
var o = {   
 "M+" : this.getMonth()+1,                 //月份   
 "d+" : this.getDate(),                    //日   
 "h+" : this.getHours(),                   //小时   
 "m+" : this.getMinutes(),                 //分   
 "s+" : this.getSeconds(),                 //秒   
 "q+" : Math.floor((this.getMonth()+3)/3), //季度   
 "S"  : this.getMilliseconds()             //毫秒   
};   
if(/(y+)/.test(fmt))   
 fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
for(var k in o)   
 if(new RegExp("("+ k +")").test(fmt))   
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
return fmt;   
}  
