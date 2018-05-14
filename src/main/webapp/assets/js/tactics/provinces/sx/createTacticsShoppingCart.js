var shopCarInfo={};
/**
 * 暂存架页面初始化
 */
shopCarInfo.initShopCar=function(){
	shopCarInfo.addChangePlanEvent();
	shopCarInfo.addChangeContentEvent();
	shopCarInfo.addChangeCustomerGroupEvent();
	shopCarInfo.addChangeChannelEvent();
	shopCarInfo.addSaveDialogEvent();
    shopCarInfo.queryActivityType();
    shopCarInfo.uploadBtnPicClickEvent();
    shopCarInfo.uploadPic();
    shopCarInfo.uploadDeletePic();
    
};
shopCarInfo.queryActivityTypeChange = function(){
    $('#activityType').change(function(){
        var thisVal = $(this).val();
        if(thisVal){
            $('#templateId').attr('disabled','disabled');
        }else{
            $('#templateId').attr('disabled',false);
        }
    })
};
shopCarInfo.queryTemplateChange = function(){
    $("#activityType").find("option:selected").removeAttr("selected");
    $('#templateId').change(function(){
        $("#activityType").find("option:selected").removeAttr("selected");
        var thisVal = $(this).val();
        var type = $(this).find("option:selected").attr("typeValue");
        if(thisVal){
        	if(type == 'null'){
                $("#activityType option[value=" + 9 + "]").attr("selected", true);
			}else{
                $("#activityType option[value=" + type + "]").attr("selected", true);
			}
            $('#activityType').attr('disabled','disabled');
        }else{
            $('#activityType').attr('disabled',false);
        }
    })
};
/**
 * 内容发生变化事件
 */
shopCarInfo.addChangeContentEvent=function(){
	$("#shopCar").bind("shopCarChangeContent",function(event,data){
		$("#selectedContent").html("");
		if(data==null){
			$("#selectedContent").html("");
			// 产品取消
			return ;
		}
		var contentId=data.contentId;
		//设置产品名称
		var liStr="<li id='selectedContent_"+contentId+"' shopCarContentId='"+contentId+"'><span>"+data.contentName+"</span></li>";
		$("#selectedContent").append(liStr);
		//将数据绑定到dom元素上
		$("#selectedContent_"+contentId).data("data",data);
	});
};
/**
 * 产品发生变化事件
 */
shopCarInfo.addChangePlanEvent=function(){
	$("#shopCar").bind("shopCarChangePlan",function(event,data){
		$("#selectedPlan").html("");
		if(data==null){
			$("#selectedPlan").html("");
			// 产品取消
			return ;
		}
		var planId=data.planId;
		//设置产品名称
		var liStr="<li id='selectedPlan_"+planId+"' shopCarPlanId='"+planId+"'><span>"+data.planName+"</span></li>";
		$("#selectedPlan").append(liStr);
		
		//产品变化时候相对应的变化营销规则
		var ruleCon933 = $("#channelId_933_RULE").html();
		var ruleCon934 = $("#channelId_934_RULE").html();
		var ruleCon935 = $("#channelId_935_RULE").html();
		var ruleCon936 = $("#channelId_936_RULE").html();
		if(ruleCon933 !=undefined ||ruleCon934 !=undefined||ruleCon935 !=undefined || ruleCon936 !=undefined){
			var channelIdlist = [];
			//var channelId = 933;
			var ruleId =planId;	
			  $.ajax({
					url:contextPath+'/action/rule/createRule/getRuleInfo.do',
					type:"POST",
					data : {"ruleId":ruleId},
					async:false,
					success:function(data) {
						if(!data){return ;}
						 var ruleName = data.ruleName;
						 var strcondition = data.cityId;    
						 var ids = strcondition ? strcondition.split(',') : "";
						 var channelList = data.channelList;
						 var showRulesObjArr = [];
						 if(!channelList){return;}
						 
						 var channelDetailInfo ="";
						 var channelDetailInfoA ="";
						 
						 for(var i=0;i<channelList.length;i++){
							 var obj = channelList[i];
							 var channelId = obj.channelId;
							 var indexSet = obj.indexSet;
							 var ruleDetailList = obj.ruleDetailList;
							 
							 
							 var indexDetailAll="";
							 var indexDetailAllA="";
							 var indexDetailAllBtn="";
							 var indexDetailAllBtnA="";
							 var indexDetailAllBtnB="";
							 
							 var rd=0;
							 for(rd=0;rd<ruleDetailList.length;rd++){
								 var ruleInfo = ruleDetailList[rd].index;
								 var rulePlanName = ruleDetailList[rd].planName;
								 var indexDetailList="";
								 var indexDetailListBtn="";
								 var indexDetailListBtnA="";
								 var indexDetailListBtnB="";
								 var ins=0;
								 for(ins=0;ins<indexSet.length;ins++){
									    var indexName=indexSet[ins];
									    if(indexName=="SURPLUS_FLOW"){
									    	indexNameCh ="剩余流量";
									    }else if(indexName=="SURPLUS_FLOW_RATE"){
									    	indexNameCh ="剩余流量比例";
									    }else if(indexName=="SURPLUS_HUAFIE"){
									    	indexNameCh ="剩余话费";
									    }else if(indexName=="SURPLUS_HUAFIE_RARE"){
									    	indexNameCh ="剩余话费比例";
									    }else if(indexName=="OTHER"){
									    	indexNameCh ="其它指标";
									    }else if(indexName=="TCDQSYL1"){
									    	indexNameCh ="套餐当前使用量(M)";
									    }else if(indexName=="TCDQSYL2"){
									    	indexNameCh ="套餐当前剩余量(M)";
									    }else if(indexName=="DQSSHF"){
									    	indexNameCh ="当前实时话费(元) ";
									    }else if(indexName=="DQHFQF"){
									    	indexNameCh ="当前话费欠费(元)";
									    }
									    
									    var indexName1 =indexName +"1";
									    var indexName2 =indexName +"2";
									    var perIndexObj = {};
									    perIndexObj = ruleInfo[indexName];
									    var indexName1Value=perIndexObj[indexName1];
									    var indexName2Value= perIndexObj[indexName2];
									    var indexOperators=perIndexObj.operators;
									    
									    if(indexOperators==">="){
									    	indexOperatorsEn ="gte"
									    }else if(indexOperators==">"){
									    	indexOperatorsEn ="gt"
									    }else if(indexOperators=="<="){
									    	indexOperatorsEn ="lte"
									    }else if(indexOperators=="<"){
									    	indexOperatorsEn ="lt"
									    }else if(indexOperators=="=="){
									    	indexOperatorsEn ="eq"
									    }
									    else if(indexOperators=="-"){
									    	indexOperatorsA ="gt"
									        indexOperatorsB ="lt"
									    }
									    //页面展示拼接规则
									    indexDetailList+=indexNameCh+":"+indexName1Value + indexOperators + indexName2Value+";";
									    
									  //数据存储拼接规则
									    if(ins<indexSet.length-1){
									    	if(indexOperators=="-"){
									    		indexDetailListBtnA+=indexName1Value + ':'+  indexName2Value +':'+'between'+':'+indexName+',and,';
											     //indexDetailListBtnA+='{"min":"'+indexName1Value + '","max":"'+  indexName2Value +'","firstCalFormat":"'+ indexOperatorsA +'","secondCalFormat":"'+ indexOperatorsB+ '","attrCode":"'+indexName+'"},"and",';
										    }else if(indexOperators=="<="||indexOperators=="<"){
										    	indexDetailListBtnA+='{"min":"","max":"'+  indexName2Value +'","firstCalFormat":"'+ indexOperatorsEn +'","secondCalFormat":"","attrCode":"'+indexName+'"},"and",';
										    }else{
											     indexDetailListBtnA+='{"min":"'+indexName2Value + '","max":"","firstCalFormat":"'+ indexOperatorsEn +'","secondCalFormat":"","attrCode":"'+indexName+'"},"and",';
										    }
									    }else if(ins==indexSet.length-1){
									    	if(indexOperators=="-"){
									    		indexDetailListBtnB+=indexName1Value + ':'+  indexName2Value +':'+'between'+':'+indexName;
											     //indexDetailListBtnB+='{"min":"'+indexName1Value + '","max":"'+  indexName2Value +'","firstCalFormat":"'+ indexOperatorsA +'","secondCalFormat":"'+ indexOperatorsB+ '","attrCode":"'+indexName+'"}';
										    }else if(indexOperators=="<="||indexOperators=="<"){
										    	indexDetailListBtnB+='{"min":"","max":"'+  indexName2Value +'","firstCalFormat":"'+ indexOperatorsEn +'","secondCalFormat":"","attrCode":"'+indexName+'"}';
										    }else{
											    indexDetailListBtnB+='{"min":"'+indexName2Value + '","max":"","firstCalFormat":"'+ indexOperatorsEn +'","secondCalFormat":"","attrCode":"'+indexName+'"}';
										    }
									    	
									    }
									    indexDetailListBtn= indexDetailListBtnA+indexDetailListBtnB;
									}
								     
								   //页面展示拼接规则
								    indexDetailAll+= "【"+rulePlanName+"】:"+ indexDetailList+"</br>";
								    indexDetailAllA+= "【"+rulePlanName+"】:"+ indexDetailList;
								    
								    
//								   //===========将拼接好的规则放入页面=============
//								    $("#channelId_"+channelId+"_RULE").html(indexDetailAll);
								    
									  $("#channelId_"+933+"_RULE").html(indexDetailAll);
									  $("#selectedChannel_933 > div:nth-child(2) > p:nth-child(6) > em").html(indexDetailAll)
									   $("#channelId_"+934+"_RULE").html(indexDetailAll);
									  $("#selectedChannel_934 > div:nth-child(2) > p:nth-child(6) > em").html(indexDetailAll)
									   $("#channelId_"+935+"_RULE").html(indexDetailAll);
									  $("#selectedChannel_935 > div:nth-child(2) > p:nth-child(6) > em").html(indexDetailAll)
                                      $("#channelId_"+936+"_RULE").html(indexDetailAll);
                                      $("#selectedChannel_936 > div:nth-child(2) > p:nth-child(6) > em").html(indexDetailAll)
								    
								    //数据存储拼接规则
								    if(rd<ruleDetailList.length-1){
								    	indexDetailAllBtnA+=indexDetailListBtn+',"or",';
								    }else if(ins==rd<ruleDetailList.length-1){
								    	indexDetailAllBtnB=indexDetailListBtn;
								    }
								    
								    indexDetailAllBtn= indexDetailAllBtnA+indexDetailListBtn;
								     
								    //var indexDetailAllBtnEx ="("+indexDetailAllBtn+")";
								    
//								 //==============将拼接好的存储规则绑定在页面元素上===============
//								    $("#channelId_"+channelId+"_RULE").attr("ruleExpression",indexDetailAllBtnEx);

									 $("#channelId_"+933+"_RULE").attr("ruleExpression",indexDetailAllBtn);
									 $("#channelId_"+934+"_RULE").attr("ruleExpression",indexDetailAllBtn);
									 $("#channelId_"+935+"_RULE").attr("ruleExpression",indexDetailAllBtn);
									 $("#channelId_"+936+"_RULE").attr("ruleExpression",indexDetailAllBtn);

									 $("#channelId_"+933+"_RULE").attr("ruleCh",indexDetailAllA);
									 $("#channelId_"+934+"_RULE").attr("ruleCh",indexDetailAllA);
									 $("#channelId_"+935+"_RULE").attr("ruleCh",indexDetailAllA);
									 $("#channelId_"+936+"_RULE").attr("ruleCh",indexDetailAllA);

								  
							 } 
							 
//							   //页面展示拼接规则
//							  channelDetailInfo +=indexDetailAll;
//							    
//							  //===========将拼接好的规则放入页面=============
//							  $("#channelId_"+933+"_RULE").html(channelDetailInfo);
//							  $("#selectedChannel_933 > div:nth-child(2) > p:nth-child(6) > em").html(channelDetailInfo)
//							   $("#channelId_"+934+"_RULE").html(channelDetailInfo);
//							  $("#selectedChannel_934 > div:nth-child(2) > p:nth-child(6) > em").html(channelDetailInfo)
//							   $("#channelId_"+935+"_RULE").html(channelDetailInfo);
//							  $("#selectedChannel_935 > div:nth-child(2) > p:nth-child(6) > em").html(channelDetailInfo)
//						
//							 channelDetailInfoA +=indexDetailAllBtnEx;
//							 var channelDetailInfoAa = "["+channelDetailInfoA+"]";
//							//==============将拼接好的存储规则绑定在页面元素上===============
//							 $("#channelId_"+933+"_RULE").attr("ruleExpression",channelDetailInfoAa);
//							 $("#channelId_"+934+"_RULE").attr("ruleExpression",channelDetailInfoAa);
//							 $("#channelId_"+935+"_RULE").attr("ruleExpression",channelDetailInfoAa);
							 
							 
						 }
					}
				});
			
			
			
		}
		
		
		//将数据绑定到dom元素上
		$("#selectedPlan_"+planId).data("data",data);
	});
};
/**
 * 客户群发生变化事件
 */
shopCarInfo.addChangeCustomerGroupEvent=function(){
	$("#shopCar").bind("shopCarChangeCustomerGroup",function(event,data){
		if(data==null){
			$("#selectedCg").html("");
			$("#selectedCg").data("data",null);
			return ;
		}
		//设置客户群名称
		$("#selectedCg").html(data.customGroupName);
		//将数据绑定到dom元素上
		$("#selectedCg").data("data",data);
	});
};
/**
 * 渠道发生变化
 */
shopCarInfo.addChangeChannelEvent=function(){
	$("#shopCar").bind("shopCarChangeChannel",function(event,data){
		if(data==null||data== undefined){
			return ;
		}
		var channelId=data.channelId;
		//先判断是取消还是增加
		if(data.hasOwnProperty('isCancell')&&data["isCancell"]=="1"){
			$("#selectedChannel_"+channelId).remove();
			return ;
		}
		var channelName=data.channelName;
		var channelColumns="";
		var channelInfoStr="<div>";
		if(data.keys!=null&&data.keys!=undefined){
			for(var i=0;i<data.keys["length"];i++){
				var key=data.keys[i];
				var value=data.values[i];
				var itemStr="<p class='right-p'><span class='color-666'>"+key+"：</span><em class='color-333'>"+value+"</em></p>";
				channelInfoStr=channelInfoStr+itemStr;
			}
			delete data.keys;
			delete data.values;
		}
		channelInfoStr=channelInfoStr+"</div>";
		var channelHtmlStr="<li id='selectedChannel_"+channelId+"'><p class='ft14'>"+channelName+"</p>"+channelInfoStr+"<div>"+channelColumns+"</div><hr/></li>";
		//<p><span class="color-666">短信触发时机：</span><em class="color-333">***********</em></p>
		//如果渠道已经存在就更新
		if($("#selectedChannel_"+channelId).length>0){
			$("#selectedChannel_"+channelId).html(channelHtmlStr);
		}else{
			$("#selectedChannels").append(channelHtmlStr);
		}
		//将数据绑定到dom元素上
		//$("#selectedChannels").data("data",data);
	});
};
/**
 * 点击保存弹出对话框事件
 */
shopCarInfo.addSaveDialogEvent=function(){
	var saveBtnInfo={"class":"dialog-btn dialog-btn-blue","text":"保存","click":function(){
		shopCarInfo.saveOrCommitTactics(this,"0");
	}};
	var commitBtnInfo={"class":"dialog-btn dialog-btn-orange","text":"提交审批","click":function(){
		shopCarInfo.saveOrCommitTactics(this,"1");
	}};
	$("#saveDialogBtn").click(function(){
		//判断产品 客户群 渠道是否已经选择 
		/*if(tacticsInfo.plan==null){
			alert("请选择产品");
			return ;
		}*/
		var curTypeFor = $('.J_noContent').hasClass('hidden') ? $('#productOrContentDiv span.color-blue').attr('marketingType') : $('.J_noContent').attr("marketingType");//0-选产品 4-选内容
		if(curTypeFor=="0"){
			if(tacticsInfo.plan==null){
				alert("请选择产品");
				return ;
			}
		}
		if(tacticsInfo.custGroup==null){
			alert("请选择客户群");
			return ;
		}
		if(tacticsInfo.channels==null||tacticsInfo.channels.length==0){
			alert("请选择渠道");
			return ;
		}else{
			var channelIds = [];
			var channelNames = [];
			var channels =tacticsInfo.channels;
			for(var i = 0 ;i<channels.length;i++){
				channelIds.push(channels[i].channelId);
				channelNames.push(channels[i].channelName);
			}
			if(channelIds.length>=2&&containsIOP(channelNames,'IOP')){
				alert("策划IOP渠道时只能选择一个渠道!");
				return ;	
			}
			
			//判断数组是否包含某一个数据 IOP
			function containsIOP(arr, obj) {  
				var i = arr.length;  
				while (i--) { 
					if (arr[i].indexOf(obj)>-1) {   
						return true;   
			}  }  return false;}
			
			//判断数组是否包含某一个数据 非IOP
			function containsNoIOP(arr, obj) {  
				var i = arr.length;  
				while (i--) {    
					if (arr[i].indexOf(obj)==-1) {
						return true;   
			}  }  return false;}
			
		}
		//chenzq3 20170428 增加优先级编码校验
		for (var i = 0; i < tacticsInfo.channels.length; i++) {
			var _channelId = tacticsInfo.channels[i]["channelId"];
			var _priority = tacticsInfo.channels[i]["E_" + _channelId + "_PRIORITY"];
			if (_priority) {
				var result = shopCarInfo.checkPriority(_channelId, _priority);
				if (result && !result[0]) {
					alert(result[1]);
					return;
				}
			}
		}
		
		//选择营销模板
		shopCarInfo.showSelectTemplate();
		shopCarInfo.intiCampInfo();
		shopCarInfo.showDatePicker();

		//下一级审批人
		var MCD_NEXT_APRPROVE ="MCD_NEXT_APRPROVE";
		$.ajax({
			url:contextPath+"/action/sys/getDicValueByKey.do",
			data:{
				"key":MCD_NEXT_APRPROVE,
			},
			success:function(data) {
				if(!data){return ;}
				if(data !="" && data == "1"){
					shopCarInfo.showCheckSelect();
			    }
			}
		});
		
		$("#saveDialog").dialog({
			width:600,
			resizable: false,
			modal: true,
			title:"保存",
			buttons: [saveBtnInfo,commitBtnInfo]
		});
		
	});
};
shopCarInfo.uploadBtnPicClickEvent=function(){
	$('#uploadBtnPic').click(function(){
		$('#uploadFileInputPic').click();
	});
	$('#uploadFileInputPic').on("change",function(){
		shopCarInfo.uploadPic();
	});
};
shopCarInfo.uploadPic=function(){
	  var data = new FormData($('#uploadFormPic')[0]); 
	  if($("#uploadFileInputPic").val()){
		  if($("#uploadFileInputPic")[0].files[0].size>30*1024*1024){
			  alert("附件大小不能超过30M");
			  return;
		  } ;
		  var fileName = $("#uploadFileInputPic")[0].files[0].name;
		  var fileType = fileName.substring(fileName.lastIndexOf("."),fileName.length);
		  if(".doc"==fileType || ".docx"==fileType || ".rar"==fileType || ".xlsx"==fileType){
				
			}else{
				alert("选择文件的类型不正确，请重新选择");
				return;
			}
	  }
	  
	  
	  $.ajax({     
			  url : contextPath+"/action/sx/ftpUploadDown/uploadFtpFile.do",    
			  type : 'POST',     
			  data : data,     
			  dataType : 'JSON',     
			  cache : false,    
			  processData : false,     
			  contentType : false,     
			  success : function(data) { 
				  if(data.status == "1"){
					  var resourceUrl = data.resourceUrl;
					  var resourceName = data.resourceName;
					  $('.J_uploadShowPic').removeClass('hidden');
					  $(".J_uploadShowPic .up-pic-name").text(resourceName).attr('title',resourceName);
					  $("#resourceUrlPic").val(resourceUrl);
					  shopCarInfo.uploadDeletePic();//预览删除按钮
				  }
				  if(data.status == "0"){
					  alert(data.error);
				  }
			  },
			  error: function(data) {
	               alert("附件上传失败!");
		      }
	});
};
shopCarInfo.uploadDeletePic=function(){
	$('#uploadDeletePic').click(function(){
		$('.J_uploadShowPic').addClass('hidden');
		$("#resourceUrlPic").val("");
		$(".J_uploadShowPic .up-pic-name").text("");
		$("#uploadFileInputPic").val("");
	});
};


/**
 * 策略保存页面默认数据
 */
shopCarInfo.intiCampInfo=function(){
	if(tacticsInfo.camp!=null){
		var camp=tacticsInfo.camp;
		if(camp.campName!=undefined){
			$("#tacticsName").val(camp.campName);
		}
		
		if(camp.campsegDesc!=undefined){
			$("#tacticsDesc").val(camp.campsegDesc);
		}
		if(camp.startDate!=undefined){
			$("#startDate").val(camp.startDate);
		}
		if(camp.endDate!=undefined){
			$("#endDate").val(camp.endDate);
		}
        if(camp.activityType != undefined){
        	$("#activityType").val(camp.activityType);
        }
        if(camp.attachment != undefined){
        	var fileNames  =   camp.attachment.split(",");  
        	if(fileNames.length>0){
        		 $('.J_uploadShowPic').removeClass('hidden');
        		var defaultName = fileNames[0];
        		var downLoadName =fileNames[1];
        		$(".J_uploadShowPic .up-pic-name").text(defaultName);
        		$("#resourceUrlPic").val(downLoadName);
        	}
        	
        	}
		return ;
	}
};

/**
 * 保存或提交审批
 * @param dialog
 * @param isCommit 是否提交审批
 */
shopCarInfo.saveOrCommitTactics=function(dialog,isCommit){
	
	var campName=$("#tacticsName").val();
	campName=campName.replace(/\n/gi,"");
	if(campName==""){
		alert("策略名称不能为空");
		return ;
	} 
	
	var len = 0;  
	var channel = "";
	var channels ="";
    for (var i=0; i<campName.length; i++) {    
    	 var c = campName.charCodeAt(i);
    	 if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
    	       len++;   
    	     }   
    	     else {   
    	      len+=2;   
    	     }   
     }    
	for(var i=0;i<tacticsInfo.channels.length;i++){
		channel = tacticsInfo.channels[i]["channelId"]+",";
		channels+=channel;
	}
	if(channels.indexOf("932")!="-1"&& campName.length > 18){
		alert("策略名称不得超过18个汉字");
		return
	}else if(channels.indexOf("933")!="-1"&&campName.length > 20){
		alert("策略名称不得超过20个汉字");
		return
	}else if(len>40){
		alert("策略名称过长");
		return
	}
	
	var putDateStart=$("#startDate").val();
	var putDateEnd=$("#endDate").val();
	var campsegDesc = $("#tacticsDesc").val();
	//chenzq3 增加策略描述不能为空的校验
	if(campsegDesc==""){
		alert("策略描述不能为空");
		return ;
	}
	var curTypeFor = $('.J_noContent').hasClass('hidden') ? $('#productOrContentDiv span.color-blue').attr('marketingType') : $('.J_noContent').attr("marketingType");//0-选产品 4-选内容
	if(curTypeFor=="0"){
		var planId=tacticsInfo.plan["planId"];
	}
	if(curTypeFor=="4"){
		var planId=tacticsInfo.content["contentId"];
	}
	var customGroupId = tacticsInfo.custGroup["customGroupId"];
	if(putDateStart==""){
		alert("开始日期不能为空");
		return ;
	}
	if(putDateEnd==""){
		alert("结束日期不能为空");
		return ;
	}
	if(putDateStart>putDateEnd){
		alert("开始日期不能大于结束日期");
		return;
	}

	//chenzq3 增加活动结束日期与产品的失效日期提示
	if(curTypeFor=="0"){
		if (tacticsInfo.plan.planEnddate != null && tacticsInfo.plan.planEnddate != "" 
			&& putDateEnd > tacticsInfo.plan.planEnddate) {
			var tipPlanEndDate = tacticsInfo.plan.planEnddate.substring(0, 10);
			alert("活动结束日期不能大于产品失效日期，产品失效日期为：" + tipPlanEndDate);
			return;
		}
	}
	var selectedTemplate = $("#templateId").val();
	var selectedActivityType = $("#activityType").val();
	if(selectedTemplate == "" && selectedActivityType == ""){
		alert("请选择营销模板或活动类型！");
		return;
	}
	//附件上传
	var fileName = $(".J_uploadShowPic .up-pic-name").text();
	var fileUrl = $("#resourceUrlPic").val();
	var fileAttachment ="";
	
	if(fileName==""||fileUrl==""){
		fileAttachment="";
	}else{
		fileAttachment= fileName + ","+fileUrl;
	}
	

	//禁用保存和提交按钮，防止表单重复提交
	$("button.dialog-btn-orange").attr('disabled','disabled');
	$("button.dialog-btn-blue").attr('disabled','disabled');
	
	//chenzq3 增加活动结束日期与客户群失效日期提示
	var tipStr = "";
	var commitStr = "";
	if (isCommit=="1") {
		commitStr = "确认提交审批吗？";
	} else {
		commitStr = "确认保存吗？";
	}
	if (tacticsInfo.custGroup.failTime != null && tacticsInfo.custGroup.failTime != ""
		&& putDateEnd > tacticsInfo.custGroup.failTime) {
		
		var tipCustFailTime = tacticsInfo.custGroup.failTime.substring(0, 10);
		tipStr = "活动结束日期大于客户群失效日期(" + tipCustFailTime + ")，";
		
		//调用coc开关
		var invokeCoc = "0";
		$.ajax({
			url:contextPath+"/action/tactics/tacticsManager/isInvokeCocCustgroupDelayOpen.do",
			type:"GET",
			async:false,
			success:function(result) {
				invokeCoc = result;
			},
			error:function (event) {
				alert("查询调用coc客户群延期开关时发生异常！");
				//chenzq3 按钮的disable下移到校验之后，防止校验失败时返回操作窗口时，按钮不能点的bug
				$("button.dialog-btn-orange").removeAttr('disabled');
				$("button.dialog-btn-blue").removeAttr('disabled');
			}
		});
		
		if (invokeCoc == "1") {
			tipStr += "在审批完成后会自动进行客户群延期，";
		}
		tipStr += commitStr;
		if (!confirm(tipStr)) {
			//chenzq3 按钮的disable下移到校验之后，防止校验失败时返回操作窗口时，按钮不能点的bug
			$("button.dialog-btn-orange").removeAttr('disabled');
			$("button.dialog-btn-blue").removeAttr('disabled');
			return;
		}
	}
	
	//chenzq3 20170428 陕西增加购物车保存、提交时的优先级编码是否被占用的校验
	for (var i = 0; i < tacticsInfo.channels.length; i++) {
		var _channelId = tacticsInfo.channels[i]["channelId"];
		var _priority = tacticsInfo.channels[i]["E_" + _channelId + "_PRIORITY"];
		if (_priority) {
			var result = shopCarInfo.checkPriority(_channelId, _priority);
			if (result && !result[0]) {
				alert(result[1]);
				//chenzq3 按钮的disable下移到校验之后，防止校验失败时返回操作窗口时，按钮不能点的bug
				$("button.dialog-btn-orange").removeAttr('disabled');
				$("button.dialog-btn-blue").removeAttr('disabled');
				return;
			}
		}
	}
	
	var approvelist=[];
	var objList = $('.approve_person');
	objList.each(function(){
		var _this = $(this);
		var data={
			 nodeId:_this.attr('nodeId'),
			 approveId:_this.val(),
			 approveName:_this.find("option:selected").text(),			 
		};
		approvelist.push(data);
	});

   
	var campInfo=new Object();
	if(tacticsInfo.camp!=null){
		//编辑需要传入策略ID
		if(tacticsInfo.camp.hasOwnProperty("campId")){
			campInfo.campId=tacticsInfo.camp.campId;
		}
	}
	var templateId = $("#templateId").val();
	var activityTypeId = $("#activityType").val();
	campInfo.activityTemplateId=templateId;
	campInfo.campName=campName;
	campInfo.campsegDesc=campsegDesc;
	campInfo.startDate=putDateStart;
	campInfo.endDate=putDateEnd;
	campInfo.custgroupId=customGroupId;
	campInfo.isApprove=isCommit;
	campInfo.planId=planId;
	campInfo.isFilterDisturb="0";//是否免打扰
    campInfo.activityType=activityTypeId;//活动类型
    campInfo.attachment = fileAttachment; //附件上传
	//0表示选产品活动  4 是选内容活动-2017-08-21
	//campInfo.marketingType = $('.J_noContent').hasClass('hidden') ? $('#productOrContentDiv span.color-blue').attr('marketingType') : $('.J_noContent').attr("marketingType");
    campInfo.marketingType=tacticsInfo.marketingType;
    
	var dataObj=new Object();
	dataObj.channelsInfo=tacticsInfo.channels;
	dataObj.campInfo=campInfo;
	dataObj.assignNodesApprover=approvelist;//下一级审批人
	var dataStr=JSON.stringify(dataObj);
	$.ajax({
		url:contextPath+"/action/tactics/createTactics/saveOrUpdate.do",
		type:"POST",
		data:{"data":dataStr},
		success:function(result) {
			var code=parseInt(result.code);
			if(code==1){//保存成功、或者提交成功
				$(dialog).dialog("close");
				var tacticsManagerUrl=contextPath+"/jsp/tactics/tacticsManage.jsp";
				window.location.href=tacticsManagerUrl;
			}else if(code==0){//保存异常				
				alert(result.msg);
				$("button.dialog-btn-orange").removeAttr('disabled');
				$("button.dialog-btn-blue").removeAttr('disabled');
			}else{
				alert(result.msg);
				$(dialog).dialog("close");
				var tacticsManagerUrl=contextPath+"/jsp/tactics/tacticsManage.jsp";
				window.location.href=tacticsManagerUrl;
			}
		},
		error:function (event) {
			alert("保存策略失败");
			//chenzq3 按钮的disable下移到校验之后，防止校验失败时返回操作窗口时，按钮不能点的bug
			$("button.dialog-btn-orange").removeAttr('disabled');
			$("button.dialog-btn-blue").removeAttr('disabled');
		}
	});
};
/**
 * 显示日期组件
 */
shopCarInfo.showDatePicker=function(){
	 var fromDate = $("#startDate" ).datepicker({changeMonth: true,numberOfMonths:1,dateFormat:"yy-mm-dd"}).on( "change", function(){
		 toDate.datepicker("option", "minDate", $.datepicker.parseDate("yy-mm-dd", this.value));
     });
	 fromDate.datepicker("option", "minDate", new Date());
     var toDate = $( "#endDate" ).datepicker({changeMonth: true,numberOfMonths:1,dateFormat:"yy-mm-dd"}).on( "change", function() {
    	 fromDate.datepicker( "option", "maxDate", $.datepicker.parseDate("yy-mm-dd", this.value));
     });
	 $.datepicker.dpDiv.addClass("ui-datepicker-box");
};

/**
 * 显示审批人下拉菜单
 */
shopCarInfo.showCheckSelect=function(){
	var dataObj=new Object();
	dataObj.channelsInfo=tacticsInfo.channels;
	var instanceId = tacticsInfo.camp==null?"": tacticsInfo.camp.approveFlowId;
	var channelIdas  = [];
	for(var chani = 0 ; chani< dataObj.channelsInfo.length; chani++){
			var channelId =dataObj.channelsInfo[chani].channelId;
			var channelName =dataObj.channelsInfo[chani].channelName;
			var dataChannel = channelId;
		    channelIdas.push(dataChannel);
	}   
	var channelIds=channelIdas.join(",");

	//获取下级审批人数据
	  $.ajax({
	      url:contextPath+"/action/TacticsApprove/getNextApprovers.do",
	      data:{"channelIds":channelIds,"instanceId":instanceId},
	      type:"GET",
	      async:false,
	      success:function(data) {
	    	  $('#approver-List').empty();
	          if(!data){return ;}
	          var   Approver="";
	          for(var i=0;i<data.length;i++){ 
	             var ApproverA = "<div class='form-group'><label class='col-sm-4 control-label'>"+ data[i].nodeName +"：</label> <div class='col-sm-6'> " +
	             		     "<select class='form-control approve_person' nodeId=" +data[i].nodeId+">";
	             var ApproverB="";
	              for(var j=0;j<data[i].approvers.length;j++){
		          	  var   approveId =data[i].approvers[j].id;
		              var   approveName = data[i].approvers[j].name;
		              ApproverB +=  "<option value ="+approveId +">"+approveName +" </option>";
	          	  }
	              var ApproverC  =" </select></div> </div>";
	              Approver += ApproverA + ApproverB +  ApproverC;
	          }
	          $('#approver-List').html(Approver);
	      }
	
	  });
};


/**
 * 显示营销模板
 */
shopCarInfo.showSelectTemplate=function(){
	var MCD_TEMPLATE ="MCD_TEMPLATE";
	$.ajax({
		url:contextPath+"/action/sys/getDicValueByKey.do",
		data:{
			"key":MCD_TEMPLATE,
		},
		success:function(data) {
			if(!data){return ;}
			if(data !="" && data == "1"){
				//在mcd_sys_dic数据字典用配置 key为:MCD_TEMPLATE 且值为1时,才启用营销模板
				shopCarInfo.getTemplateData();
                shopCarInfo.queryTemplateChange();
                var selectedActivityType = $('#activityType').val();
                var template = $('#templateId').val();
                if(selectedActivityType && template == ''){
                    $('#templateId').attr('disabled','disabled');
                }
		    }
		}
	});
};

/**
 * 获取营销模板数据
 */
shopCarInfo.getTemplateData = function(){

	var   htmlData="";
    var   htmlDataA ="";
    var   htmlDataB ="";
    var campsegId = "";
    if(tacticsInfo.camp!=null){
		//编辑需要传入父策略ID
		if(tacticsInfo.camp.hasOwnProperty("pid")){
			campsegId = tacticsInfo.camp.pid;
		}
	}
    
	//获取下营销模板数据
	$.ajax({
		url:contextPath+"/action/tactics/createTactics/getTemplate.do",
		data:{"campsegId":campsegId},
		type:"GET",
		async:false,
		success:function(data) {
			if(!data){return ;}
			htmlDataA = "<div class='form-group'><label class='col-sm-4 control-label'>营销模板：</label> <div class='col-sm-6'> " +
				"<select class='form-control approve_person' id='templateId'> <option value =''>请选择 </option>";
			for(var i=0;i<data.length;i++){
				var activityTemplateId =data[i].ACTIVITY_TEMPLATE_ID;
				var activityTemplateName = data[i].ACTIVITY_NAME;
				var activityType = data[i].ACTIVITY_TYPE;
				htmlDataB +=  "<option typeValue=" + activityType + " value ="+activityTemplateId +">"+activityTemplateName +" </option>";
			}
			htmlDataC  =" </select></div> </div>";
			htmlData += htmlDataA + htmlDataB +  htmlDataC;
		}
	});
	  
	 $('#activity_template_id').html(htmlData);
	 
	 //修改时回显已选营销模板
	if(tacticsInfo.camp!=null){
		var camp=tacticsInfo.camp;
		if(camp.activityTemplateId!=undefined){
			$("#templateId option").each(function(){
				if(this.value==camp.activityTemplateId){
					$(this).attr("selected","selected");
					return;
				}
			});
            var selectedTemplate = $('#templateId').val();
            if(selectedTemplate){
                $('#activityType').attr('disabled','disabled');
            }
		}
	}
};
//优先级编码校验
shopCarInfo.checkPriority = function(_channelId, _priority) {
	var _campsegId = "";
	if (tacticsInfo.isEdit) {
		_campsegId = tacticsInfo.camp.campId;
	}
	var result = new Array();
	result[0]=true;
	//优先级编码数字验证、是否被占用验证
	/*$.ajax({
		url:contextPath+"/action/sx/priorityOrder/isPriorityUsed.do",
		type: "POST",
		async: false,
		data:{
			"campsegId": _campsegId,
			"channelId": _channelId,
			"priority": _priority
		},
		success:function(data) {
			if (!data) {return ;}
			if (data != "" && data.status == "200") {
				if (data.result==true) {
					result[0]=false;
			    	result[1]="优先级编码(" + _priority + ")已被使用时，请选择其他的优先级编码!";
			    	return result;
				}
		    } else {
		    	result[0]=false;
		    	result[1]="查询优先级编码是否已使用时出现异常!";
		    	return result;
		    }
		}
	});*/
	return result;
};

//查询活动类型
shopCarInfo.queryActivityType = function () {
    $.ajax({
        type:"POST",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url:contextPath+"/action/iop/approve/template/queryIopActivityType.do",
        dataType:"json",
        async:false,
        success:function(data) {
            var type="";
            type="<option value=''>全部</option>";

            for(i=0;i<data.length;i++){
                type=type+"<option value='"+data[i].ENUMORDER+"'>"+data[i].ENUMVALUE+"</option>"
            }
            $('#activityType').html(type);
            shopCarInfo.queryActivityTypeChange();
        }
    });
};
