define(["backbone","my97","page","form","placeholder"],function(require, exports, module) {      
	module.exports={
		value_campseg_type:{},
		init:function(){
			this.loadAvoidBotherUserType({currentDom:".avoidBotherUserType"});
			this.loadAllChannelType();
			//2016/10/11时点，不需要营销类型。但以后可能需要所以暂时先注释掉。
			//this.loadCampsegType({currentDom:".avoidBotherCampsegType"});
			window.tableViewManage  = this.loadTable({
				currentDom:"#avoidBotherCustomerTable",
				ejsUrl:_ctx + '/assets/js/avoidbother/avoidBotherCustomer.ejs',
				ajaxData:{
					"isSelectMy":"0",
					"sortColumn":$("#sortColumn").val(),
					"sortOrderBy":$("#sortOrderBy").val(),
					"userTypeId" : 1,
					"channelId" : 933
				},
				domCallback:function(htmlobj){}
			});
			this.goSearchEvent();
			$("#handInput").on("click", function(){
				if ("请输入手机号码，多个号码用逗号分开。" == $("#handInput").val()) {
					$("#handInput").val("")
				}
			})

			$("#filterFile").attr({"onchange":"showFilePath()"});
			
			$("#avoidBotherType").on("change", function() {
				var typeVal=$("#avoidBotherType").val();
				if("901"==typeVal) {
					if($("#avoidCustType option[value='0']").length > 0) {
						module.exports.value_campseg_type=$("#avoidCustType option[value='0']").get(0);
						$("#avoidCustType option[value='0']").remove();
						if($("#avoidCustType").val()=='0'){
							$("#avoidCustType").val($("#avoidCustType option").first().attr("value"));
						}
					}
				} else {
					if(module.exports.value_campseg_type) {
						if($("#avoidCustType option[value='0']").length > 0) {
						}else {
							$("#avoidCustType").prepend(module.exports.value_campseg_type);
							module.exports.value_campseg_type={};
						}
					}
				}
				
			});
			$("#edit-avoid-bother-customer-select-channel-type").on("change", function() {
				var typeVal=$("#edit-avoid-bother-customer-select-channel-type").val();
				if("901"==typeVal) {
					if($("#edit-avoid-bother-customer-select-campseg-type option[value='0']").size() > 0) {
						module.exports.value_campseg_type=$("#edit-avoid-bother-customer-select-campseg-type option[value='0']").get(0);
						$("#edit-avoid-bother-customer-select-campseg-type option[value='0']").remove();
						if($("#edit-avoid-bother-customer-select-campseg-type").val()=='0'){
							$("#edit-avoid-bother-customer-select-campseg-type").val($("#edit-avoid-bother-customer-select-campseg-type option").first().attr("value"));
						}
					}
				} else {
					if(module.exports.value_campseg_type) {
						if($("#edit-avoid-bother-customer-select-campseg-type option[value='0']").size() > 0) {
						}else {
							$("#edit-avoid-bother-customer-select-campseg-type").prepend(module.exports.value_campseg_type);
							module.exports.value_campseg_type={};
						}
						
						
					}
				}
				
			});
			$("#showAddBtn").on("click", function(){
				module.exports.showNewCustomer();
			});
			
			$("#edit_btn").on("click", function(){
				module.exports.updateCustomer();
			});
			
			$("#batchRmBtn").on("click", function(){
				module.exports.showBatchRemoveCustomer();
			});
			
			$(".close-add-btn").on("click", function(){
				module.exports.hideNewCustomer();
			});
			
			$(".close_edit_btn").on("click", function(){
				module.exports.hideEditCustomer();
			});
			
			$(".close_rm_btn").on("click", function(){
				module.exports.hideRemoveCustomer();
			});
			
	        //切换手机添加方式
	        $("#handBtn").on("click",function(event) {
	        	$(this).addClass('none');
	        	$("#downloadModelBtn").removeClass('none');
	        	$("#importBtn").removeClass('none');
	        	$("#handInput").addClass('none');
	        	$("#importInput").removeClass('none');
	        	$("#addBtn").unbind("click");
	        	$("#addBtn").bind("click", function(){
	        		module.exports.uploadNewCustomer();
	        	});
	        });
	        $("#importBtn").on("click",function(event) {
	        	$(this).addClass('none');
	        	$("#importInput").addClass('none');
	        	$("#downloadModelBtn").addClass('none');
	        	$("#handBtn").removeClass('none');
	        	$("#handInput").removeClass('none');
	        	$("#addBtn").unbind("click");
	        	$("#addBtn").bind("click", function(){
	        		module.exports.addNewCustomer();
	        	});
	        	
	        });
	        $(".sel-box").find("a").on("click",function(){
	        	  var _selTxt = $(this).parents("ol").prev();
	                  _selTxt.text($(this).text());
	                  $(this).parents("ol").parent().removeClass('active');
	        });
	        
	        $("#selectAll").on("click",function(event) {
            	if ($("#selectAll").prop("checked")) {
        			$(".checkbox_row1").prop("checked", "true");
        		} else {
        			$(".checkbox_row1").prop("checked", false);
        		}
            });
	        $(".sel-txt").on("click",function(event) {
            	var _selfPar = $(this).parent();
            	if(_selfPar.hasClass('active')){
            		$("#sortOrderBy").val("desc");
                	$("#searchButton_mine").click();
                	_selfPar.removeClass('active');
                }else{
                	$("#sortOrderBy").val("asc");
                 	$("#searchButton_mine").click();
                 	_selfPar.addClass("active");
                }
            });
	        $("#centent-page-box-div").on("click", function(){
	        	
	        });
		},
		loadTable:function(options){
			var defaults = {
				urlRoot:_ctx+"/action/BotherAvoidList",
				id:"searchBotherAvoidUser.do",
				currentDom:"#avoidBotherCustomerTable",
				ejsUrl:_ctx + '/assets/js/avoidbother/avoidBotherCustomer.ejs',
				ajaxData:{
					"sortColumn":$("#sortColumn").val(),
					"sortOrderBy":$("#sortOrderBy").val()},
				addData:"",
				complete:function(){
					$('#conten').hide();
				},
				isSelectMy:"0",
				domCallback:function(dom){}
			};
			options = $.extend(defaults, options);
			var avoidBothorCustomerTableModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var avoidBathorTableView = Backbone.View.extend({
				model : new avoidBothorCustomerTableModel({id : options.id}), 
				events : { 
					"click" : "click"
				},
				click : function(obj) {
					var $target = $(obj.target);
					if ($target.hasClass("icon_del")) {
                    	var productNo = $target.attr("productNo");
                    	var userType = $target.attr("userType");
                    	var channelType = $target.attr("channelType");
                    	var campSegType = $target.attr("campSegType");
                    	
                    	module.exports.showRemoveCustomer(productNo, userType, channelType, campSegType);
                    } else if ($target.hasClass("icon_edit")) {
                    	var productNo = $target.attr("productNo");
                    	var userType = $target.attr("userType");
                    	var channelType = $target.attr("channelType");
                    	var campSegType = $target.attr("campSegType");
                    	
                    	module.exports.showEditCustomer(productNo, userType, channelType, campSegType);
                    }
				},
				initialize : function() {
					this.render(1);
				},
				render : function(pageNum) { 
					this.setDomList(pageNum,this.model);
					return this;
				} ,
				setDomList:function(pageNum,tableModel){
					var thisObj=this;
					var pageFlag = pageNum==1 ? "F" : "G";
					var defaultData = {cmd:options.cmd,pageNum:pageNum,pageFlag:pageFlag};
					var ajaxData = $.extend(defaultData, options.ajaxData);
					tableModel.fetch({
						type : "post",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						dataType:'json',
						complete:function(){
							$('#conten').hide();
						},
						data:ajaxData
					});
					tableModel.on("change", function(model) {
						var tableHtml = ""; 
						var attributes = model.attributes;
						if(attributes.hasOwnProperty("date")){
							attributes.data.date = attributes.date ;
						}
						if(attributes.hasOwnProperty("dateType")){
							attributes.data.dateType = attributes.dateType ;
						}
						if(options.addData!=""){
							model.set(options.addData);
						//	console.log(model.attributes);
							tableHtml = new EJS({
								url : options.ejsUrl
							}).render({result:model.attributes});
						}else{
							tableHtml = new EJS({
								url : options.ejsUrl
							}).render(model.attributes);
						}
						var htmlobj=$(tableHtml);
						$(options.currentDom).empty().append(htmlobj);
						/*
						var _Html1 = new EJS({
							url : _ctx + '/assets/js/avoidbother/avoidBotherCustomerPage.ejs'
						}).render(model.attributes);
						$("#centent-page-box-div").html(_Html1);
						*/
						thisObj.renderPageView(model.attributes,thisObj);
						options.domCallback(htmlobj);
					});
					
				},
				/**
				 * 分页显示组件
				 */
				renderPageView:function(data,obj){
					$("#centent-page-box-div").pagination({
				        items: data.totalSize,
				        itemsOnPage: data.pageSize,
				        currentPage:data.pageNum,
				        prevText:'上一页',
				        nextText:'下一页',
				        cssStyle: 'light-theme',
				        onPageClick:function(pageNumber,event){
				        	$("#selectAll").prop("checked", false);
				        	obj.setDomList(pageNumber,new avoidBothorCustomerTableModel({id : options.id}));
				        }
				    });
				},
				showMoreTips:function(obj){},
				hideMoreTips:function(){}
			}); 
			var tableView = new avoidBathorTableView({el:"#batchRmBotherAvoidUserForm"});
			return tableView;
		},
		goSearchEvent:function(){
			var _that=this;
			var goSearchEventView = Backbone.View.extend({
				events : { 
					"click" : "click"
				},
				click : function(obj) {
					var target=$(obj.target);
					if(!(target.attr("id") == "searchButton_mine" || target.hasClass("J_campType"))){
						return;
					}
					var ajaxData = {};
					var searchIndex=0;
					var _topparent=target.parents(".content-type-outer-box");

					//渠道类型
					var channelId=$("#channelIdDiv .active").attr("channelid");
					if(target.attr("id") == "searchButton_mine"){
						var userTypeId=$(".avoidBotherUserType").find(".content-type-box.active").attr("userTypeId")||"";
						var custTypeId=$(".avoidBotherCampsegType").find(".content-type-box.active").attr("custTypeId")||"";
						
						var keywords = $("#tacticsManageTabCT .box.active input").val();
						if(keywords.indexOf ("请输入") !=-1){
							keywords ="";
						}
						ajaxData = {"isSelectMy":searchIndex,"channelId":channelId,"keywords":keywords,"userTypeId":userTypeId,"custTypeId":custTypeId,"sortColumn":$("#sortColumn").val(),"sortOrderBy":$("#sortOrderBy").val()};
					}
					if(target.hasClass("J_campType")){
						var userTypeId=$(".avoidBotherUserType").find(".content-type-box.active").attr("userTypeId")||"";
						var custTypeId=$(".avoidBotherCampsegType").find(".content-type-box.active").attr("custTypeId")||"";
						
						var keywords = $("#tacticsManageTabCT .box.active input").val();
						if(keywords.indexOf ("请输入") !=-1){
							keywords ="";
						}
						ajaxData = {"isSelectMy":searchIndex,"channelId":channelId,"keywords":keywords,"userTypeId":userTypeId,"custTypeId":custTypeId,"sortColumn":$("#sortColumn").val(),"sortOrderBy":$("#sortOrderBy").val()};
					}
					if(window.tableViewManage ){
						window.tableViewManage.undelegateEvents();  
					}
					window.tableViewManage = _that.loadTable({
						currentDom:"#avoidBotherCustomerTable",
						ejsUrl:_ctx + '/assets/js/avoidbother/avoidBotherCustomer.ejs',
						ajaxData:ajaxData,
						domCallback:function(htmlobj){
						}
					});
				},
				initialize : function() {
					this.render();
				},
				render : function() { 
					return this;
				} 
			});
			new goSearchEventView({el:"#searchButton_mine,.avoidBotherCampsegType,.avoidBotherUserType"});
		},
		loadAvoidBotherUserType:function(options){
			var defaults = {
					urlRoot:_ctx+"/action/BotherAvoidList",
					id:"searchBotherAvoidUserType.do",
					currentDom:".avoidBotherUserType",
					ejsUrl:_ctx + '/assets/js/avoidbother/avoidBotherUserType.ejs',
					ajaxData:{}
			};
			options = $.extend(defaults, options);
			var searchCampsegStatModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var searchCustomerTypeView = Backbone.View.extend({
				events : { 
					"click" : "click"
				},
				click : function(obj) {
					var $target = $(obj.target);
					$target.siblings().removeClass("active");
					$target.addClass("active");
					
				},
				model : new searchCampsegStatModel({id : options.id}), 
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
							var _Html1 = new EJS({
								url : _ctx + '/assets/js/avoidbother/avoidBotherUserTypeSelect.ejs'
							}).render(model.attributes);
							$(".avoidBotherUserTypeSelect").html(_Html1);
						}
					});
				}
			});
			new searchCustomerTypeView({el:options.currentDom});
		},
		loadAllChannelType:function(){
			/*var url=_ctx+"/action/StcPlan/initChannel?isDoubleSelect=0";*/
			var url=_ctx+"/action/common/getChannels.do"
			$.ajax({
				type:"POST",
			    url: url ,
			    success:function(result){
			    	var jsonData=$.parseJSON(result);
			    	var len=jsonData.length;
			    	var str="";
			    	var selectStr="";
			    	for(var i=0;i<len;i++){
			    		var item=jsonData[i];
			    		if(i == 0){
                            selectStr = selectStr + '<option value="' + 0 + '">'+"全部"+'</option>'
                            str=str+"<span class=\"fleft content-type-box active\" onclick=\"channelChange(this)\" channelId=\""+item.channelId+"\">"+item.channelName+"</span>";
						}else{
                            str=str+"<span class=\"fleft content-type-box\" onclick=\"channelChange(this)\" channelId=\""+item.channelId+"\">"+item.channelName+"</span>";
						}
			    		selectStr=selectStr+'<option value="' + item.channelId + '">'+item.channelName+'</option>';
			    	}
			    	$("#channelIdDiv").append(str);
			    	$(".avoidBotherChannelTypeSelect").append(selectStr);
			    },
			    dataType:"text"
			});
		},
		loadCampsegType:function(options) {
			var defaults = {
					urlRoot:_ctx+"/action/BotherAvoidList",
					id:"searchCampsegType.do",
					currentDom:".avoidBotherCampsegType",
					ejsUrl:_ctx + '/assets/js/avoidbother/avoidBotherCampsegType.ejs',
					ajaxData:{}
			};
			options = $.extend(defaults, options);
			var searchCampsegStatModel = Backbone.Model.extend({
				urlRoot : options.urlRoot,
				defaults : {
					_ctx : _ctx
				}
			}); 
			var searchCampsegTypeView = Backbone.View.extend({
				events : { 
					"click" : "click"
				},
				click : function(obj) {
					var $target = $(obj.target);
					$target.siblings().removeClass("active");
					$target.addClass("active");
				},
				model : new searchCampsegStatModel({id : options.id}), 
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
							var _Html1 = new EJS({
								url : _ctx + '/assets/js/avoidbother/avoidBotherCampsegTypeSelect.ejs'
							}).render(model.attributes);
							$(".avoidBotherCampsegTypeSelect").html(_Html1);
						}
					});
				}
			});
			new searchCampsegTypeView({el:options.currentDom});
		},
		fileupload:function() {
			var filePath=$("#filterFile").val();
			if(""==filePath || null==filePath) {
				alert("请选择一个要上传的文件!");
				return;
			}
			var filePathStr=new String(filePath);
			if(filePathStr.length <5 || (filePathStr.substring(filePathStr.length-4).toLowerCase() != ".csv" && filePathStr.substring(filePathStr.length-4).toLowerCase() != ".txt")) {
				alert("文件类型应该是.csv或者.txt!");
				return;
			}
			var data = {
				userTypeId: $("#userTypeId").val(),
				avoidBotherType: $("#avoidBotherType").val(),
				avoidCustType: $("#avoidCustType").val(),
			};
			
			var ver = window.navigator.appVersion.toLowerCase();
			var data = 'json';
			if (ver.indexOf("msie 9.") != -1){//浏览器是IE9
				data = 'text/plain';
			}
			
			$("#newBotherAvoidUserForm").ajaxSubmit({
		        url : _ctx+"/action/BotherAvoidList/uploadBotherAvoidUser.do",
		        data: data,
		        dataType : 'json',
		        success : function(data) {
					if(data.status=="200") {
		        		module.exports.hideNewCustomer();
						alert("添加免打扰客户成功");
						$("#show_upload_file").val("");
					} else {
						alert("添加免打扰客户失败！");
					}
					$("#searchButton_mine").click();
		        },  
		        error : function(data, status, e) {
		        	alert("添加免打扰客户失败！");
		        }
		    });
		},
		showNewCustomer:function() {
			$("#addDialog").removeClass("fade");
			$("#addDialog").addClass("show");
			$("#importBtn").click();
			$("#addBtn").unbind("click");
			$("#addBtn").bind("click", function(){
				module.exports.addNewCustomer();
			});

			$("#userTypeId").val($("#userTypeId option").first().attr("value"));
			$("#avoidBotherType").val($("#avoidBotherType option").first().attr("value"));
			$("#avoidCustType").val($("#avoidCustType option").first().attr("value"));
			$("#handInput").val("请输入手机号码，多个号码用逗号分开。");
			$("#show_upload_file").val("");
			$("#filterFile").val("");
			
		},
		hideNewCustomer:function() {
			$("#addDialog").removeClass("show");
			$("#addDialog").addClass("fade");
		},
		showEditCustomer:function(productNo, userTypeId, channelTypeId, campsegTypeId) {
			$("#editDialog").removeClass("fade");
			$("#editDialog").addClass("show");
			$(".avoidBotherproductNo").html(productNo);
			$("#edit-avoid-bother-customer-select-user-type").val(userTypeId);
			$("#edit-avoid-bother-customer-select-channel-type").val(channelTypeId);
			$("#edit-avoid-bother-customer-select-campseg-type").val(campsegTypeId);
			$("#productNoBef").val(productNo);
			$("#avoidBotherTypeBef").val(channelTypeId);
			$("#avoidCustTypeBef").val(campsegTypeId);
			
			var typeVal=$("#edit-avoid-bother-customer-select-channel-type").val();
			if("901"== typeVal) {
				var optionEles= $("#edit-avoid-bother-customer-select-campseg-type option[value='0']");
				var length= optionEles.length;
				if(length > 0) {
					module.exports.value_campseg_type=$("#edit-avoid-bother-customer-select-campseg-type option[value='0']").get(0);
					$("#edit-avoid-bother-customer-select-campseg-type option[value='0']").remove();
				}
			}
		},
		hideEditCustomer:function() {
			$("#editDialog").removeClass("show");
			$("#editDialog").addClass("fade");
		},
		showRemoveCustomer:function(productNo, userTypeId, channelTypeId, campsegTypeId) {
			$("#delDialog").removeClass("fade");
			$("#delDialog").addClass("show");
			$("#rmProductNo").val(productNo);
			$("#rmAvoidBotherType").val(channelTypeId);
			$("#rmAvoidCustType").val(userTypeId);
			$("#remove_btn").unbind("click");
			$("#remove_btn").bind("click", function(){
				module.exports.removeCustomer();
			});
		},
		showBatchRemoveCustomer:function() {
			if($(".checkbox_row1").is(":checked")) {
				// do nothing
			} else {
				alert("请先选中要删除的免打扰客户");
				return;
			}
			$("#delDialog").removeClass("fade");
			$("#delDialog").addClass("show");
			$("#remove_btn").unbind("click");
			$("#remove_btn").bind("click", function(){
				module.exports.batchRemoveCustomer();
			});
		},
		hideRemoveCustomer:function() {
			$("#delDialog").removeClass("show");
			$("#delDialog").addClass("fade");
		},
		addNewCustomer:function() {
			var productVal=$("#handInput").val();
			var productArr=productVal.split(",");
			var regExp='^[0-9]{11}$';
			for(var i=0;i<productArr.length;i++) {
				if(productArr[i].length!=11) {
					alert("请确认手机号长度是否正确");
					return;
				}
				if(!productArr[i].match(regExp)) {
					alert("请确认手机号格式是否正确");
					return;
				}
			}
			$.ajax({
				url: _ctx+"/action/BotherAvoidList/addBotherAvoidUser.do",
				dataType: "json",
				async: true,
				data:  $("#newBotherAvoidUserForm").serialize() ,
				type: "POST",
				success: function(response)  {
					if("200"==response.status) {
						module.exports.hideNewCustomer();
						alert("添加免打扰客户成功");
						$("#searchButton_mine").click();
					} else if(null != response.message && ""!=response.message) {
						alert(response.message);
					} else {
						alert("添加免打扰客户失败！");
					}
					$("#searchButton_mine").click();
				},
				error: function() {
					alert("添加免打扰客户失败！");
				}
			});
		},
		uploadNewCustomer:function() {
			module.exports.fileupload();
		},
		updateCustomer:function() {
			$.ajax({
				url: _ctx+"/action/BotherAvoidList/mdfBotherAvoidUser.do",
				dataType: "json",
				async: true,
				data:  $("#mdfBotherAvoidUserForm").serialize() ,
				type: "POST",
				success: function(response)  {
					if("200"==response.status && (null == response.message || ""==response.message)) {
						module.exports.hideEditCustomer();
						alert("更新完成");
						$("#searchButton_mine").click();
					} else if("202"==response.status && null != response.message && ""!=response.message) {
						if(confirm(response.message)) {
							$("#updateConfirmFlg").val("1");
							module.exports.updateCustomer();
							return;
						} else {
							return;
						}
					} else {
						alert("更新免打扰客户失败！");
					}
					$("#updateConfirmFlg").val("");
					$("#productNoBef").val("");
					$("#avoidBotherTypeBef").val("");
					$("#avoidCustTypeBef").val("");
					$("#searchButton_mine").click();
				},
				error: function() {
					alert("更新免打扰客户失败！");
				}
			});
		},
		removeCustomer:function() {
			$.ajax({
				url: _ctx+"/action/BotherAvoidList/delBotherAvoidUser.do",
				dataType: "json",
				async: true,
				data: $("#rmBotherAvoidUserForm").serialize() ,
				type: "POST",
				success: function(response)  {
					alert("删除免打扰客户成功！");
					$("#searchButton_mine").click();
				},
				error: function() {
					alert("删除免打扰客户失败！");
				}
				
			});
			module.exports.hideRemoveCustomer();
		},
		batchRemoveCustomer:function () {
			if($(".checkbox_row1").is(":checked")) {
				// do nothing
			} else {
				alert("请先选中要删除的免打扰客户");
				return;
			}
			$.ajax({
				url: _ctx+"/action/BotherAvoidList/batchDelBotherAvoidUser.do",
				dataType: "json",
				async: true,
				data: $("#batchRmBotherAvoidUserForm").serialize() ,
				type: "POST",
				success: function(response)  {
					alert("删除免打扰客户成功！");
					$("#searchButton_mine").click();
				},
				error: function() {
					alert("删除免打扰客户失败！");
				}
				
			});
			$("#selectAll").prop("checked", false);
			module.exports.hideRemoveCustomer();
		}
	};
});

/**
 * 我的策略渠道类型切换
 * @param obj
 */
function channelChange(obj){
	var $target = $(obj);
	$target.addClass("active").siblings().removeClass("active");
	$("#searchButton_mine").click();
}
/**
 * 显示选取的文件路径
 * @param 无
 */
function showFilePath(){
	var filepath=$("#filterFile").val();
	var index=filepath.lastIndexOf("\\");
	if (index > 1) {
		filepath=filepath.substring(index+1);
	}
	$("#show_upload_file").val(filepath); 
}