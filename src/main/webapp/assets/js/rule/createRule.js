define(function(require, exports, module){
	require("xdate");
	require("purl");
	require("page");
	require("toast");
	require("modal");
	require("multiselectFilter");
	require("multiselect");
	require("placeholder");
	require("bootstrap");
	
	exports.init=function(){
		campManageRuleInfo.init();
	}
});

var campManageRuleInfo = {};//营销管理规则相关
var ruleId = "";
var isSee = "";//""-新建 1-修改 2-查看
var isEdit = "";//是否为策略页面编辑
var searchStr = window.location.search.replace("?","").split('&');
ruleId = searchStr[0] ? searchStr[0].split('=')[1] : "";
isSee = searchStr[1] ? searchStr[1].split('=')[1] : "";
isEdit = searchStr[2] ? searchStr[1].split('=')[1] : "";
channelId= searchStr[3] ? searchStr[1].split('=')[1] : "";
/**
 * 初始化函数
 */
campManageRuleInfo.init = function(){
	//加载适用地市选择下拉列表
	campManageRuleInfo.loadCityResourceList();
	//初始化渠道列表
	campManageRuleInfo.queryAllChannelList();
	//取消新建或修改弹窗
	campManageRuleInfo.cancelDlgShow();
	//关闭页面
	campManageRuleInfo.closeDlagShow();
	//新建或修改的保存
	campManageRuleInfo.saveRule();
	//获取修改时的信息
	campManageRuleInfo.getRuleInfo(ruleId);
	/**选择产品弹窗相关*/
    chooseView.addChooseView();
	tableView.addTableView();
	initKeyWordsEventListiener();
};
/**
 *适用地市选择下拉列表，从后台查询所有下列列表
 */
campManageRuleInfo.loadCityResourceList= function(){
  //获取地市数据
  $.ajax({
      url:contextPath+"/action/common/getAllCitys.do",
      type:"GET",
      async:false,
      success:function(data) {
          if(!data){return ;}
             var   cityView ="";
            for(var i=0;i<data.length;i++){ 
			   cityView +="<option value ="+data[i].cityId +">"+data[i].cityName +" </option>" 
          	 }
             $('#cityId').html(cityView);
             
             
             //====陕西暂时没有城市选择--隐藏=====
             $('#cityId').val("999");
             
             //地市用户，默认选中本地市
			 if (data.length == 1) {
				 var strcondition = data[0].cityId;    
				 var ids = strcondition.split(',');
				 $('#cityId').val(ids);
				 $('#cityId').multiselect("refresh");
			 }
      }
  });
  campManageRuleInfo.loadCitySelect();
  //陕西暂时没有城市选择--隐藏
  $("#citysId").hide();
};

/**
 * 适用地市选择下拉列表，从后台查询所有下列列表初始化多选框
 */
campManageRuleInfo.loadCitySelect= function(){
	   $("#cityId").multiselect({
           selectedList: 4,
           noneSelectedText:'请选择'
 });
};
/**
 * 加载规则指标列表
 */
campManageRuleInfo.loadRuleIndexlList = function(channelId){
	 $.ajax({
	      url:contextPath+"/action/rule/createRule/getRuleIndex.do",
	      type:"POST",
	      async:false,
	      success:function(data) {
	          if(!data){return ;}
	             var liStr = '';
	             var hiddenTemplateStr = '';
	            for(var i=0;i<data.length;i++){ 
	            	var indexName = data[i].indexName;
	            	var indexDisplayName = data[i].indexDisplayName+"("+data[i].indexUnit+")";
	            	liStr += '<li  class="li_ruelIndex_'+indexName+'" data-indexName="'+indexName+'">'+
				        		'<span class="type-title">'+indexDisplayName+'</span>'+
				        		'<img class="selected-img" src="../../assets/images/channelSelected.png">'+
				        	'</li>' 
				    var curClassName = "form-group-own J_"+indexName+"_box hidden";
	            	var inputNameLeft = indexName+"1";
	            	var inputNameRight = indexName+"2";
	            	var selectClassName = "form-control-own ft12 J_operatorSelect J_select_"+indexName;
				    hiddenTemplateStr += '<div class="'+curClassName+'">'+
										    '<label class="col-sm-own-12 control-label text-left">'+indexDisplayName+'</label>'+
										    '<div class="row margin-0">'+
										       '<div class="col-sm-own-4 control-label">'+
										       		'<input type="text" onkeyup="value=value.replace(/[^0-9]/g,\'\')" class="form-control-own" name='+inputNameLeft+'>'+
										       '</div>'+
										       '<div class="col-sm-own-4 control-label">'+
										       		'<select type="text" onchange="operatorSelectChangeEvent(this,event)" class="'+selectClassName+'"> </select>'+
										       '</div>'+
										       '<div class="col-sm-own-4 control-label">'+
										       		'<input type="text" onkeyup="value=value.replace(/[^0-9]/g,\'\')" class="form-control-own" name='+inputNameRight+'>'+
										       '</div>'+
										    '</div>'+
										'</div>';
	          	 }
	             $('#channelInfoBox-'+channelId+' .J_ruleIndexList').empty().append(liStr);
	             $('.J_forAddRuleLi .bot-li-bot .hidden').remove();
	             $('.J_forAddRuleLi .bot-li-bot').prepend(hiddenTemplateStr);
	             //加载运算符下拉列表
	             campManageRuleInfo.loadRuleOperatorList(channelId);
	      }
	  });
	 //绑定点击选择指标
	 campManageRuleInfo.addIndexClickEvent();
};
/**
 * 选择（点击）指标
 */
campManageRuleInfo.addIndexClickEvent=function(){
	$(".J_ruleIndexList li").click(function(){
		var hasActive = $(this).hasClass("active");//原来是否已处于active状态	
		var indexName = $(this).attr('data-indexName');
		var showHiddenClass = 'J_'+indexName+'_box';
		if(hasActive){//已经选中直接返回
			$(this).removeClass("active")
			$(this).parents('.channelInfoBox').find('.'+showHiddenClass).addClass('hidden');
		}
		if(!hasActive){
			$(this).addClass("active");//激活active
			$(this).parents('.channelInfoBox').find('.'+showHiddenClass).removeClass('hidden');
		}
	});
};
campManageRuleInfo.addIndexClickEvent2 = function(indexName,channelId){
	var showHiddenClass = 'J_'+indexName+'_box';
	$('#channelInfoBox-'+channelId+' .li_ruelIndex_'+indexName+'').addClass("active");//激活active
	$('#channelInfoBox-'+channelId).find('.'+showHiddenClass).removeClass('hidden');
}
/**
 * 运算符选择下拉列表
 */
campManageRuleInfo.loadRuleOperatorList= function(channelId){
  $.ajax({
      url:contextPath+"/action/rule/createRule/getRuleOperator.do",
      type:"POST",
      async:false,
      success:function(data) {
          if(!data){return ;}
             var operatorView ="";
             //operatorView += "<option value='-1'>请选择</option>";
             for(var i=0;i<data.length;i++){ 
		          	  var operatorId =data[i].enumKey;
		          	  if("-"==operatorId){//陕西限制规则选择只能选择区间
		              var operatorName = data[i].enumValue;
		              operatorView +="<option value ='"+operatorId +"'>"+operatorName +" </option>" 
		          	  }
          	 }
             $('#channelInfoBox-'+channelId+' .J_operatorSelect').empty().append(operatorView);
      }
  });
 
};
/**
 * 运算符选择的change事件(只有value=='-'时两侧皆可以输入)
 */
function operatorSelectChangeEvent(obj,event){
	var target = event.target || event.srcElement;
	var curVal = obj.value;
	var $divLeft = $(target).parent('div').prev('div');
	if(curVal != '-' && curVal != '-1'){
		$divLeft.find('input').attr('disabled','disabled').val('');
	}else{
		$divLeft.find('input').removeAttr('disabled');
	}
};
/**
 *  加载所有渠道列表
 */
campManageRuleInfo.queryAllChannelList=function(){
	var url=contextPath+"/action/common/getChannels.do";
	$.post(url,null,function(result){
		var channelId = "";
		  
		   //过滤渠道类型
		  var resultList = [];
		  for(var i = 0;i<result.length;i++){
		   channelId = result[i].channelId;
		   if("933"==channelId||"934"==channelId||"935"==channelId||"936"==channelId){
			   resultList.push(result[i]);
		   }
		  }
		
		var ejsUrlChannels=contextPath+"/assets/js/rule/channelList.ejs";
		var channelListHtml = new EJS({url:ejsUrlChannels}).render({data:resultList});
		$("#channelList").html(channelListHtml);
		//绑定点击渠道事件
		campManageRuleInfo.addChannelClickEvent(resultList);
	});
};
/**
 * 选择（点击）渠道列表中的渠道，加载渠道对应的界面信息（包括ejs和js）
 */
campManageRuleInfo.addChannelClickEvent=function(obj){	
	$("#channelList li").click(function(event,data){
		var item=data;
		if(item==null){
			var index = $("#channelList li").index(this);
			item=obj[index];
		}
		var hasActive = $(this).hasClass("active");//原来是否已处于active状态		
		if(hasActive){//已经选中直接返回
			return ;
		}
		if(!hasActive){
			$(this).addClass("active")
		}
		//添加tab页签
		campManageRuleInfo.addChannelTab(item); //*****加载渠对应的ejs和js
	});
};
/**
 * 计算剩余字数
 */
campManageRuleInfo.countLeftWord = function(){
	$('.J_textarea').keyup(function(){
		var totalWord = $(this).attr('data-total');
		var hasWrittenWord = $.trim($(this).val()).length;
		var leftWord = totalWord-hasWrittenWord;
		$(this).parent().prev('div').find('.J_textareaHasWrittenWord').text(hasWrittenWord);
	});
};
/**
 * 选择渠道后默认展示一个空的规则列表
 */
campManageRuleInfo.showDefaultTemplateLi = function(channelId){
	var $forAddLiHtml = $('#channelInfoBox-'+channelId).find('li.J_forAddRuleLi').clone();
	$forAddLiHtml.removeClass('hidden J_forAddRuleLi').addClass('save-template-li');
	$('#channelInfoBox-'+channelId).find('.J_addItem').before($forAddLiHtml);
};
/**
 * 选择渠道后其中的新建规则 
 */
campManageRuleInfo.addChannelInfoLi = function(){
	$('.J_addItem').off('click').on('click',function(){
		//$forAddLiHtml 新建规则的模板对象
		var channelId = $(this).attr('channelId');
		var $forAddLiHtml = $('#channelInfoBox-'+channelId).find('li.J_forAddRuleLi').clone();
		var maxLen = $('#channelInfoBox-'+channelId).find('li.save-template-li').length;
		if(maxLen >= 6){//最多可添加6个子规则
			alert('最多可添加6个子规则!');
			return;
		}else{
			$forAddLiHtml.removeClass('hidden J_forAddRuleLi').addClass('save-template-li');
			$(this).before($forAddLiHtml);
		}
		//选产品
		campManageRuleInfo.selectProShow();
		//计算剩余字数
		campManageRuleInfo.countLeftWord();
		//删除规则
		campManageRuleInfo.removeChannelInfoLi();
	});
};
/**
 * 选择渠道后 删除规则
 */
campManageRuleInfo.removeChannelInfoLi=function(){
	$('.J_closeItem').click(function(){
		$(this).parents('li').remove();
	});
};
/**
 * 添加渠道到TAB标签中
 */
campManageRuleInfo.addChannelTab=function(data){
	var channelId = data.channelId;
	if($("#channelInfoBox-"+channelId).length>0){
		return ;
	}
	//展示渠道页签
	$("#selectedChannelsDisplayDiv").show();
	$("#selectedChannelsDisplayUl li").filter(".active").removeClass("active");
	$('.channelInfoBox').hide();
	$('#channelInfoBox-'+channelId).show();
	//添加渠道标签
	var li_tabs_html = new EJS({element:"channelTabTemp"}).render({data:data});
	$("#selectedChannelsDisplayUl").append($(li_tabs_html));
	//页签点击事件和关闭事件
	campManageRuleInfo.addTabClickEvent(data);
	campManageRuleInfo.addCloseTabeClickEvent(data);
	var ejsChannelContentUrl = contextPath+"/assets/js/rule/provinces/"+provinces+"/channel/"+channelId+".ejs";
	var channelContentHtml = new EJS({url:ejsChannelContentUrl}).render({data:data});
	$("#selectedChannelsContentDisplayDiv").append(channelContentHtml);//渠道内容
	//加载规则指标列表
	campManageRuleInfo.loadRuleIndexlList(channelId);
	//展示默认规则模板
	campManageRuleInfo.showDefaultTemplateLi(channelId);
	//计算剩余字数
	campManageRuleInfo.countLeftWord();
	//新建规则
	campManageRuleInfo.addChannelInfoLi();
	//删除规则
	campManageRuleInfo.removeChannelInfoLi();
	//选产品
	campManageRuleInfo.selectProShow();
	//加载各个渠道操作对应的js
	var channelProcessJSUrl = contextPath + '/assets/js/rule/provinces/'+provinces+'/channel/'+channelId+'.js'
	loadJsFile(channelProcessJSUrl,campManageRuleInfo.loadChannelJsComplete,data);
};
/**
 * 加载渠道js信息成功
 */
campManageRuleInfo.loadChannelJsComplete=function(data){
	var initViewFun=window["initView"+data.channelId];
	if(typeof initViewFun == "function"){
		initViewFun.apply(window,[data]);
	}
};
/**
 * 动态保存各渠道信息
 */
campManageRuleInfo.saveChannelsJs=function(channelId){
	var saveChannelsFun=window["saveChannels"+channelId];
	if(typeof saveChannelsFun == "function"){
		saveChannelsFun.apply(window,[channelId]);
	}
};
/**
 * 渠道TAB页签点击事件
 */
campManageRuleInfo.addTabClickEvent=function(data){
	var channelId=data.channelId;
	$("#channelTab_"+channelId).bind("click",function(event){
		$("#selectedChannelsDisplayUl li").filter(".active").removeClass("active");
		$('.channelInfoBox').hide();
		$('#channelInfoBox-'+channelId).show();
	});
	 //绑定点击选择指标
	 campManageRuleInfo.addIndexClickEvent();
};
/**
 * 渠道页签关闭事件
 */
campManageRuleInfo.addCloseTabeClickEvent=function(data){
	var channelId=data.channelId;
	$("#channelClose_"+channelId).bind("click",function(event,dataObj){
		if(dataObj!=null){
			channelId=dataObj.channelId;
		}
		$("#li_channelId_"+channelId).removeClass("active");
		$("#channelTabDiv_"+channelId).remove();
		$("#channelInfoBox-"+channelId).remove();
		$("#selectedChannelsDisplayUl li").last().addClass("active");
		$("#selectedChannelsContentDisplayDiv > .channelInfoBox").last().show();
	});
};
/**
 * 取消弹窗
 */
campManageRuleInfo.cancelDlgShow = function(){
	$('.J_cancel').click(function(){
		$('#cancelDlg').dialog({
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
						$( this ).dialog( "close" );
						window.location.href = contextPath+"/jsp/rule/rulemanage.jsp"
					}
				}]
		})
	})
};


/**
 * 关闭弹窗
 */
campManageRuleInfo.closeDlagShow = function(){
	$('.J_close').click(function(){
		window.close();
	})
};


var campManageRuleSaveInfo = {};//存储各渠道的信息
/**
 * 保存前基本信息的验证
 */
campManageRuleSaveInfo.checkValidation = function(saveDataJson){
	var data = saveDataJson;
	var channelList = $("#channelList li.active");
	var result = [];
	result[0] = true;
	if(!data.ruleName){
		result[0]=false;
		result[1]="规则名称不能为空！";
		return result;
	}
//	if(!data.cityId){
//		result[0]=false;
//		result[1]="请选择适用分公司！";
//		return result;
//	}
	if(!data.ruleDesc){
		result[0]=false;
		result[1]="请输入规则描述！";
		return result;
	}
	if(channelList.length <= 0){
		result[0]=false;
		result[1]="请选择渠道！";
		return result;
	}
	return result;
}
/**
 * 保存已选渠道的信息
 */
campManageRuleInfo.saveChannlesInfo = function(){
	var activeChannels = $('#channelList li.active');
	for(var i=0;i<activeChannels.length;i++){
		var channelId = $(activeChannels[i]).attr('channelId');
		campManageRuleInfo.saveChannelsJs(channelId);
	}
};
/**
 * 保存
 */

var saveOrUpdateRuleData = {};
campManageRuleInfo.saveRule = function(){
	$('.J_confirm').click(function(){
		campManageRuleSaveInfo.channelList = [];
		var ruleName = $.trim($("#ruleName").val());
		var ruleDesc = $.trim($("#ruleDesc").val());
		var cityId = $("#cityId").val().toString();
		saveOrUpdateRuleData = {
        		"ruleId":ruleId,
        		"ruleName":ruleName,
        		"ruleDesc":ruleDesc,
        		"cityId":cityId,
        		"channelList":campManageRuleSaveInfo.channelList
        };
		//console.log(saveOrUpdateRuleData);
		var baseCheck = campManageRuleSaveInfo.checkValidation(saveOrUpdateRuleData);
		if(baseCheck[0] == false){
			alert(baseCheck[1]);
			return ;
		}else{
			//保存各渠道信息 并 验证各渠道信息
			campManageRuleInfo.saveChannlesInfo();
			//console.log(saveOrUpdateRuleData);
			var channelCheckFlag = saveOrUpdateRuleData.channelCheckFlag ? saveOrUpdateRuleData.channelCheckFlag[0] : false;
			if(channelCheckFlag == false){
	             alert(saveOrUpdateRuleData.channelCheckFlag[1]);
	             return ;
			}else{
				//验证通过时执行 
				campManageRuleInfo.saveOrUpdate(saveOrUpdateRuleData);
			}
		}
	})
};
/**
 * 新增或修改时的ajax
 */
campManageRuleInfo.saveOrUpdate = function(data){
	var dataStr=JSON.stringify(data);
	$.ajax({
		url:contextPath+"/action/rule/createRule/saveOrUpdate.do",
		type:"POST",
		data:{"data":dataStr},
		success:function(result) {
			if(result.result=="1"){
//				if("1"==isEdit){
//					$('#sucDlg').dialog({
//						width:400,
//						height:200,
//						resizable: false,
//						modal: true,
//						title:"提示",
//					});
//					//window.location.href=contextPath+"/jsp/tactics/createTactics.jsp";
//					//window.history.back(-1);
//					
//					//window.opener.document.getElementById("channelId_933_RULE").innerHTML='bbb';
//					
//					
//				    $.ajax({
//						url:contextPath+'/action/rule/createRule/getRuleInfo.do',
//						type:"POST",
//						data : {"ruleId":ruleId},
//						async:false,
//						success:function(data) {
//							if(!data){return ;}
//							 var ruleName = data.ruleName;
//							 var strcondition = data.cityId;    
//							 var ids = strcondition ? strcondition.split(',') : "";
//							 var channelList = data.channelList;
//							 var showRulesObjArr = [];
//							 if(!channelList){return;}
//							 
//							 var channelDetailInfo ="";
//							 var channelDetailInfoA ="";
//							 
//							 for(var i=0;i<channelList.length;i++){
//								 var obj = channelList[i];
//								 var channelId = obj.channelId;
//								 var indexSet = obj.indexSet;
//								 var ruleDetailList = obj.ruleDetailList;
//								 
//								 
//								 var indexDetailAll="";
//								 var indexDetailAllBtn="";
//								 var indexDetailAllBtnA="";
//								 var indexDetailAllBtnB="";
//								 
//								 var rd=0;
//								 for(rd=0;rd<ruleDetailList.length;rd++){
//									 var ruleInfo = ruleDetailList[rd].index;
//									 var rulePlanName = ruleDetailList[rd].planName;
//									 var indexDetailList="";
//									 var indexDetailListBtn="";
//									 var indexDetailListBtnA="";
//									 var indexDetailListBtnB="";
//									 var ins=0;
//									 for(ins=0;ins<indexSet.length;ins++){
//										    var indexName=indexSet[ins];
//										    if(indexName=="SURPLUS_FLOW"){
//										    	indexNameCh ="剩余流量";
//										    }else if(indexName=="SURPLUS_FLOW_RATE"){
//										    	indexNameCh ="剩余流量比例";
//										    }else if(indexName=="SURPLUS_HUAFIE"){
//										    	indexNameCh ="剩余话费";
//										    }else if(indexName=="SURPLUS_HUAFIE_RARE"){
//										    	indexNameCh ="剩余话费比例";
//										    }else if(indexName=="OTHER"){
//										    	indexNameCh ="其它指标";
//										    }else if(indexName=="TCDQSYL1"){
//										    	indexNameCh ="套餐当前使用量(M)";
//										    }else if(indexName=="TCDQSYL2"){
//										    	indexNameCh ="套餐当前剩余量(M)";
//										    }else if(indexName=="DQSSHF"){
//										    	indexNameCh ="当前实时话费(元) ";
//										    }else if(indexName=="DQHFQF"){
//										    	indexNameCh ="当前话费欠费(元)";
//										    }
//										    
//										    var indexName1 =indexName +"1";
//										    var indexName2 =indexName +"2";
//										    var perIndexObj = {};
//										    perIndexObj = ruleInfo[indexName];
//										    var indexName1Value=perIndexObj[indexName1];
//										    var indexName2Value= perIndexObj[indexName2];
//										    var indexOperators=perIndexObj.operators;
//										    
//										    if(indexOperators==">="){
//										    	indexOperatorsEn ="gte"
//										    }else if(indexOperators==">"){
//										    	indexOperatorsEn ="gt"
//										    }else if(indexOperators=="<="){
//										    	indexOperatorsEn ="lte"
//										    }else if(indexOperators=="<"){
//										    	indexOperatorsEn ="lt"
//										    }else if(indexOperators=="=="){
//										    	indexOperatorsEn ="eq"
//										    }
//										    else if(indexOperators=="-"){
//										    	indexOperatorsA ="gt"
//										        indexOperatorsB ="lt"
//										    }
//										    //页面展示拼接规则
//										    indexDetailList+=indexNameCh+":"+indexName1Value + indexOperators + indexName2Value+";";
//										    
//										    //数据存储拼接规则
//										    if(ins<indexSet.length-1){
//										    	
//										    	if(indexOperators=="-"){
//												     indexDetailListBtnA+='{"min":"'+indexName1Value + '","max":"'+  indexName2Value +'","firstCalFormat:"'+ indexOperatorsA +'","secondCalFormat:"'+ indexOperatorsB+ '","attrCode":"'+indexName+'"},"and",';
//											    }else if(indexOperators=="<="||indexOperators=="<"){
//											    	indexDetailListBtnA+='{"min":"","max":"'+  indexName2Value +'","firstCalFormat:"'+ indexOperatorsEn +'","secondCalFormat:"","attrCode":"'+indexName+'"},"and",';
//											    }else{
//												     indexDetailListBtnA+='{"min":"'+indexName2Value + '","max":"","firstCalFormat:"'+ indexOperatorsEn +'","secondCalFormat:"","attrCode":"'+indexName+'"},"and",';
//											    }
//										    }else if(ins==indexSet.length-1){
//										    	if(indexOperators=="-"){
//										    		indexDetailListBtnB+='{"min":"'+indexName1Value + '","max":"'+  indexName2Value +'","firstCalFormat:"'+ indexOperatorsA +'","secondCalFormat:"'+ indexOperatorsB+ '","attrCode":"'+indexName+'"}';
//											    }else if(indexOperators=="<="||indexOperators=="<"){
//											    	indexDetailListBtnB+='{"min":"","max":"'+  indexName2Value +'","firstCalFormat:"'+ indexOperatorsEn +'","secondCalFormat:"","attrCode":"'+indexName+'"}';
//											    }else{
//											    	indexDetailListBtnB+='{"min":"'+indexName2Value + '","max":"","firstCalFormat:"'+ indexOperatorsEn +'","secondCalFormat:"","attrCode":"'+indexName+'"}';
//											    }
//										    	
//										    }
//										    indexDetailListBtn= indexDetailListBtnA+indexDetailListBtnB;
//										}
//									     
//									   //页面展示拼接规则
//									    indexDetailAll+= "【"+rulePlanName+"】:"+ indexDetailList+"</br>";
//									    
//									    
////									   //===========将拼接好的规则放入页面=============
////									    $("#channelId_"+channelId+"_RULE").html(indexDetailAll);
//									    window.opener.document.getElementById("channelId_933_RULE").innerHTML=channelDetailInfo;
//										window.opener.document.getElementById("channelId_934_RULE").innerHTML=channelDetailInfo;
//										window.opener.document.getElementById("channelId_935_RULE").innerHTML=channelDetailInfo;
//									    
//									    //数据存储拼接规则
//									    if(rd<ruleDetailList.length-1){
//									    	indexDetailAllBtnA+=indexDetailListBtn+',"or",';
//									    }else if(ins==rd<ruleDetailList.length-1){
//									    	indexDetailAllBtnB=indexDetailListBtn;
//									    }
//									    
//									    indexDetailAllBtn= indexDetailAllBtnA+indexDetailListBtn;
//									     
//									    var indexDetailAllBtnEx =indexDetailAllBtn;
//									    
////									 //==============将拼接好的存储规则绑定在页面元素上===============
////									    $("#channelId_"+channelId+"_RULE").attr("ruleExpression",indexDetailAllBtnEx);
//									    window.opener.document.getElementById("channelId_933_RULE").setAttribute("ruleExpression",channelDetailInfoAa);
//									     window.opener.document.getElementById("channelId_934_RULE").setAttribute("ruleExpression",channelDetailInfoAa);
//									     window.opener.document.getElementById("channelId_935_RULE").setAttribute("ruleExpression",channelDetailInfoAa);
//									  
//								 } 
////								 
////								   //页面展示拼接规则
////								  channelDetailInfo +=indexDetailAll;
////								    
////								  //===========将拼接好的规则放入页面=============
////								 // $("#channelId_"+channelInfo933.baseInfo.channelId+"_RULE").html(channelDetailInfo);
////								//window.opener.document.getElementById("channelId_"+channelId+"_RULE").innerHTML=channelDetailInfo;
////								window.opener.document.getElementById("channelId_933_RULE").innerHTML=channelDetailInfo;
////								window.opener.document.getElementById("channelId_934_RULE").innerHTML=channelDetailInfo;
////								window.opener.document.getElementById("channelId_935_RULE").innerHTML=channelDetailInfo;
////
////								
////								//window.opener.document.getElementsByTagName("selectedChannel_"+channelId+" > div:nth-child(2) > p:nth-child(6)").innerHTML(channelDetailInfo);
////					
////								 channelDetailInfoA +=indexDetailAllBtnEx;
////								 
////								 var channelDetailInfoAa ="["+indexDetailAllBtnEx+"]";
////								//==============将拼接好的存储规则绑定在页面元素上===============
////								// $("#channelId_"+channelInfo933.baseInfo.channelId+"_RULE").attr("ruleExpression",channelDetailInfoA);
////							     //window.opener.document.getElementById("channelId_"+channelId+"_RULE").setAttribute("ruleExpression",channelDetailInfoA);
////							     window.opener.document.getElementById("channelId_933_RULE").setAttribute("ruleExpression",channelDetailInfoAa);
////							     window.opener.document.getElementById("channelId_934_RULE").setAttribute("ruleExpression",channelDetailInfoAa);
////							     window.opener.document.getElementById("channelId_935_RULE").setAttribute("ruleExpression",channelDetailInfoAa);
//							 }
//						}
//					});
//				
//					window.location.href=contextPath+"/jsp/rule/rulemanage.jsp";
//				}else{
					$('#sucDlg').dialog({
						width:400,
						height:200,
						resizable: false,
						modal: true,
						title:"提示",
					});
					window.location.href=contextPath+"/jsp/rule/rulemanage.jsp";
//				 }
			}else if(result.result=="3"){
				alert('该规则名称已存在！请重新输入')
			}else{
                alert("保存规则失败");
			}
		},
		error:function (event) {
			alert("保存规则失败");
		}
	});
};
/**
 * 查看时禁用编辑
 */
campManageRuleInfo.seeDisabledEdit = function(channelId){
	var $curBox = $('#channelInfoBox-'+channelId);
	$('input,select,textarea,#cityId_ms').attr('disabled','disabled');
	$('#channelList li').off('click').css('cursor','default');
	$curBox.find('.J_ruleIndexList li,#selectedChannelsDisplayUl .close,.J_selectedPro,.comment-pro').off('click').css('cursor','default');
	$curBox.find('#selectedChannelsDisplayUl .close,.J_closeItem,.J_addItem,.J_cancel,.J_confirm').remove();
};
/**
 * 进入页面加载函数-判断是新建""-修改1-查看2
 */
campManageRuleInfo.getRuleInfo = function(ruleId){
	$('.J_hdTitle span').removeClass('active');
	if(!ruleId && !isSee){
		$('.J_close').hide();
		$('.J_create').addClass('active');
	}
	if(ruleId && isSee == '1'){
		$('.J_close').hide();
		$('.J_mod').addClass('active');
		campManageRuleInfo.showRuleInfoAjax(ruleId);
	}
	if(ruleId && isSee == '2'){
		$('.J_cancel').hide();
		$('.J_confirm').hide();
		$('.J_view').addClass('active');
		campManageRuleInfo.showRuleInfoAjax(ruleId);
	}
};
/**
 * 回显修改时获取信息的ajax
 */
campManageRuleInfo.showRuleInfoAjax = function(ruleId){
	var data={"ruleId":ruleId};
	$.ajax({
		url:contextPath+"/action/rule/createRule/getRuleInfo.do",
		type:"POST",
		data:data,
		success:function(result) {
			if(result){
				campManageRuleInfo.showRuleInfo(result);
			}
		},
		error:function (event) {
			alert("保存策略失败");
		}
	});
};
/**
 * 回显修改时获取信息的ajax
 */
campManageRuleInfo.showRuleInfo = function(data){
	 $('#ruleName').val(data.ruleName);
	 var strcondition = data.cityId;    
	 var ids = strcondition ? strcondition.split(',') : "";
	 $('#cityId').val(ids);
	 $('#cityId').multiselect("refresh");
	 $('#ruleDesc').val(data.ruleDesc);
	 var channelList = data.channelList;
	 var showRulesObjArr = [];
	 if(!channelList){return;}
	 for(var i=0;i<channelList.length;i++){
		 var obj = channelList[i];
		 var channelId = obj.channelId;
		 var indexSet = obj.indexSet;
		 var ruleDetailList = obj.ruleDetailList;
		 $('#channelList #li_channelId_'+channelId).trigger('click');
		 $('#channelInfoBox-'+channelId).data({"ruleDetailList":ruleDetailList,"indexSet":indexSet});
		 $('#channelInfoBox-'+channelId).find('.save-template-li').remove();
	}
	campManageRuleInfo.selectProShow();
};
/**
 * 选择产品弹窗
 */
campManageRuleInfo.selectProShow = function(){
	$('.J_selectedPro').click(function(){
		var _this = $(this);
		$('#divChoosedPlan').empty();
		var dataPlanId =_this.parents('li.save-template-li').find('b.J_selectedPro').attr("data-planId");
		var dataName =_this.parents('li.save-template-li').find('b.J_selectedPro').text();
		if(dataPlanId){
			$('.btn-a-blue[planId='+dataPlanId+']').trigger('click');
		}
		$(".selectPro-dialog").dialog({
			width:1200,
			resizable: false,
		    modal: true,
		    title:'选择产品',
		    height:750,
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
					var hasSelect = $('#divChoosedPlan span');
					if(hasSelect.length>0){
						var selPlanName = $('#divChoosedPlan span em').text();
						var selPlanId = $('#divChoosedPlan span').attr('planId');
						_this.parents('li.save-template-li').find('b.J_selectedPro').attr({"data-planId":selPlanId,'title':selPlanName}).text(selPlanName);
					}else{
						_this.parents('li.save-template-li').find('b.J_selectedPro').attr({"data-planId":'','title':'选产品'}).text('选产品');
					}
					$( this ).dialog( "close" );
					
				}
			}]
		});
	});
};
/**选择菜单的视=========================  关键字查询  ===============================================================*/
var keyWords = "";
/**
 * 关键字查询
 */
function initKeyWordsEventListiener() {
    $(".searchBtn").click(function() {
        pageNum = 1;
        keyWords = "";
        keyWords = $.trim($(".keyWords").val());
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
    });
}
/**选择菜单的视图  ===============================================================*/
/**
 * chooseView选择视图对像
 */
var chooseView = {};
var typeId = "";//产品类别
var styleId = "";//产品类型
/**
 * 添加选择视图
 */
chooseView.addChooseView = function() {
    //初始化选择视图
	addPlanTypeSrvChooseView();
    //添加产品类别选择监听事件
	addPlanTypeChooseEventListiener();
    //添加产品类型选择监听事件
	addPlanStyleChooseEventListiener();
};

/**
 * 产品类别和类型数据视图
 */
function addPlanTypeSrvChooseView() {
  $.ajax({
      url:contextPath+"/action/tactics/createTactics/queryPlanTypes.do",
      type:"GET",
      async:false,
      success:function(data) {
    	  var planTypesStr = '';
    	  var planStylesStr = '';
    	  var planTypes = data.planTypes;//产品类别
    	  var planStyles = data.planStyles;//产品类型
    	  /**产品类别视图*/
    	  var planTypesStr = "<span typeId='' class='active'>全部</span>";
          for(var i=0;i<planTypes.length;i++){
        	  planTypesStr += "<span typeId=" + planTypes[i].typeId + ">" + planTypes[i].typeName+"</span>";
          }
          $('#divPlanTypesList').html(planTypesStr);
          $('#divPlanTypesList').find('span').eq(0).addClass('active');//默认取第一个添加active效果
          /**产品类型视图*/
    	  var planStylesStr = "<span styleId='' class='active'>全部</span>";
          for(var i=0;i<planStyles.length;i++){
        	  if (planStyles[i].styleId == '3') {
        		  continue;
        	  }
        	  planStylesStr += "<span styleId=" + planStyles[i].styleId + ">" + planStyles[i].styleName+"</span>";
          }
          $('#divPlanStylesList').html(planStylesStr);
          $('#divPlanStylesList').find('span').eq(0).addClass('active');//默认取第一个添加active效果
      }
  });
}

/**
 * 1.添加产品类别选择监听事件
 * 2.初始化表格视图
 */
function addPlanTypeChooseEventListiener() {
    $('#divPlanTypesList span').click(function () {
        pageNum = 1;//记录当前页码
        typeId = "";//初始化分类
        //添加分类选
        $(this).addClass('active').siblings('span').removeClass('active');
        typeId = $(this).attr("typeId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}

/**
 * 1.添加产品类型选择监听事件
 * 2.初始化表格视图
 */
function addPlanStyleChooseEventListiener() {
    $('#divPlanStylesList span').click(function () {
        pageNum = 1;//记录当前页码
        styleId = "";//初始化分类
        //添加分类选
        $(this).addClass('active').siblings('span').removeClass('active');
        styleId = $(this).attr("styleId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}
/**=========================================   列表数据的视图   ===============================================*/
//tableView列表视图
var tableView ={};
var pageNum = 1;//记录当前页码
var pageSize = "10";//记录每页多少条
var totalSize = "";//总条数
var currentPage = "";//获取当前页码
var table_result = "";//列表数据
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
 * 点击添加事件
 */
tableView.addPlanClickEvent=function(){
	$("#tbodyPlansList .btn-a-blue").bind("click",function(){
        var planId = $(this).attr('planId');
        var planName = $(this).attr('planName');
        $("#divChoosedPlan span").remove();
        var li=$("<i class=\"close\"\"> &times;</i>");
        li.on("click", function(){
            // 删除已选政策列表中的展示内容
            $("#divChoosedPlan [planId=" + planId +"]").remove();
        })
        var span=$("<span class=\"policy\" planId=" + planId + "><em>" + planName + "</em></span>");
        span.append(li);
        $("#divChoosedPlan").append(span);
	});
}
/**
* 初始化视图数据：table_result，totalPage
*                   列表数据    总页码数
*/
function initTableViewData() {
  $.ajax({
      url:contextPath+"/action/tactics/createTactics/queryPlansByCondition.do",
      data:{
          "keyWords":keyWords,
          "planTypeId":typeId,//产品类别
          "planSrvType":styleId,//产品类型
          "isEliminateRule": "true" ,  //过滤规则类型, 需要过滤
          "pageSize":pageSize,                 //每页多少条
          "pageNum":pageNum              //第几页
      },
      async:false,
      type:"POST",
      success:function(data) {
          if (!data) { return;}
          table_result = "";//列表数据
          totalPage = "";//总页码数
          pageSize = data.pageSize;//每页多少条
          totalSize= data.totalSize;//总条数
          table_result = data.result;//列表数据
          pageNum = data.pageNum;//当前页码
          //初始化翻页
          renderPageView(data, "divSelProPage");
      },
      error: function(){
	    	alert("加载规则时发生异常，请尝试刷新页面！");
	    	return;
		}
  });
};
/**
* 初始化列表视图
*
*/
function initTableResultView(data) {
  var tableHtml = '';
  for(var i = 0; i < data.length; i++) {
	  var planId = data[i].planId;
	  data[i].planStartdate = (data[i].planStartdate == null || data[i].planStartdate == "null") ? "" : data[i].planStartdate;
	  data[i].planEnddate = (data[i].planEnddate == null || data[i].planEnddate == "null") ? "" : data[i].planEnddate;
      //列表视图
      tableHtml += 
            '<tr>'+
            	'<td class="text-center">'+planId+'</td>'+
            	'<td class="text-overflow text-left" title = "'+data[i].planName+'"><a href="javascript:;" class="showPlanInfo">'+
                    '<em>'+planId+'</em>&nbsp;&nbsp;'+data[i].planName+
            	'</a></td>'+
            	'<td class="text-center">'+data[i].typeName+'</td>'+
            	'<td class="text-center">'+data[i].planSrvTypeName+'</td>'+
            	'<td class="text-center">'+data[i].planStartdate+'</td>'+
            	'<td class="text-center">'+data[i].planEnddate+'</td>'+
            	'<td class="text-center">'+data[i].isUsed+'</td>'+
            	'<td class="text-center"><button planName = "'+data[i].planName+'" planId="'+planId+'" type="button" class="btn-a btn-a-blue">添加</button></td>'+
           '</tr>';
  }
  $(".J_selectProTab tbody").html(tableHtml);
  $('.public-table tbody tr:nth-child(2n+1)').addClass('odd');
  $('.public-table tbody tr:nth-child(2n)').addClass('even');
  //点击添加事件
  tableView.addPlanClickEvent();
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
          pageNum = currentNum;//更新当前页码
          //初始化视图数据
          initTableViewData();
          //初始化列表视图
          initTableResultView(table_result);
      }
  });
}




