/**============================================  产品库主js  ========================================================*/
/**
 * 产品库主js
 * 1.绑定方法监听
 * 2.初始化视图
 */
define(function(require, exports, module){
	require("xdate");
	require("purl");
	require("page");
	require("toast");
	require("modal");
	
	exports.init=function(){
		$(document).ready(function(){
			initView();
		    addEventListener();
		});
	}
});


/**定义全局的政策视图对像*/
var planInfo={queryPlan:null,queryStatus:null,custManage:null};
var keyWords ="";//初始化搜索关键字
var planData ="";
/**
 * 初始化各个子页面
 */
function initView(){
    console.log("-----initView()------");
    /**添加选择视图*/
    chooseView.addChooseView();
    /**添加列表视图*/
    tableView.addTableView();
    /**添加详细内容视图*/
}
/**
 * 页面元素进行统一的绑定事件入口
 */
function addEventListener(){
    initKeyWordsEventListiener();//关键字查询
    tableView.addTableListener();//表格的监听事件
    initEditListiener();//新增产品
}
/**
 * 新增产品
 */
function initEditListiener(){
    $("#savePlan").click(function(){
	  //异步查询数据
        $.ajax({
			url: contextPath + "/action/plan/planManage/getPlanAllDetail.do",
			dataType: "json",
			data: {"planId": plan_id},
			type: "POST",
			success:function(data){
				if(data.status == "201"){
					alert(data.message);
				}else if(data.status == "200"){
					planData=data.data[0]
					var myHtmls = new EJS({url: contextPath + "/assets/js/plan/provinces/sx/planmanage_add.ejs"}).render({"planDetailBO": data.data[0]});
					$("#planEditContainer").empty().append(myHtmls);
					//显示适用渠道和城市下拉框
				    filledChannelAndCitySel(data,"add");
					//展示弹窗
					$("#addDiv").dialog({
			            width:1028,
			            height:500,
			            resizable: false,
			            draggable:false,
			            modal: true,
			            title:"新增"
			        });
			        //向头部增加 ---编辑按钮i，返回按钮em
				    $("#addDiv,.ui-dialog-title").removeClass("ui-dialog-title");
				    //绑定保存取消按钮事件
				    addBtnEventListiener();
				}
			},
			error: function(data){
				alert(data.message);
			}
		});
    });
}
/*
 * 给保存按钮调节事件
 * @returns
 */
function addBtnEventListiener(){
	$("#closePlan").click(function(){
		$("#addDiv").dialog('close').remove();//关闭弹窗
	});
	$("#addPlan").click(function(){
		var planId = $("#addPlanCode").val()!=null?$("#addPlanCode").val().trim():null;
		var planName=$("#addPlanName").val()!=null?$("#addPlanName").val().trim():null;
		var typeId = $("#addTypeName").val();
		var planStartDate = $("#planStartDate").val();
		var planEndDate = $("#planEndDate").val();
		var statusId = $("#addOnlineStatus").val();
		var planInUse = $("#planInUse").val();
		var channelIds = '';
		var cityIds='';
		$("input[name='multiselect_addCitySel']:checked").each(function(){
			cityIds += $(this).val() + "/";
		});
		cityIds = cityIds.substring(0, cityIds.lastIndexOf("/"));
		
		var manager = $("#addManager").val()!=null?$("#addManager").val().trim():null;
		var planDesc =$("#planDesc").val()!=null?$("#planDesc").val().trim():null;
		var reg=/^[0-9]*$/;
		if(planId == null ||planId=="" || planId.length > 30 || !reg.test(planId)){
			alert("产品编号必须是数字不能为空，并且不能超过30个字节！");
			return false;
		}
		if(planName == null || planName=="" || planName.length > 500){
			alert("产品名称不能为空，并且不能超过500个字节！");
			return false;
		}
		if(planStartDate == null || planStartDate==""){
			alert("生效时间不能为空！");
			return false;
		}
		if(planEndDate == null || planEndDate==""){
			alert("失效时间不能为空！");
			return false;
		}
		var d1 = new Date(planStartDate.replace(/\-/g, "\/"));  
		var d2 = new Date(planEndDate.replace(/\-/g, "\/"));
		if(d1 >d2)  
		{  
		  alert("失效时间不能小于生效时间！");  
		  return false;  
		}
		if(channelIds==''){
			for(var i=0;i<planData.channel.length;i++){
				channelIds+=planData.channel[i].CHANNEL_ID+"/";
			}
			channelIds=channelIds.substring(0, channelIds.lastIndexOf("/"));
		}
		if(cityIds==''){
			for(var i=0;i<planData.city.length;i++){
				cityIds+=planData.city[i].CITY_ID+"/";
			}
			cityIds=cityIds.substring(0, cityIds.lastIndexOf("/"));
		}
		if(manager.length > 80){
			alert("产品经理长度不能超过80个字节！");
			return false;
		}
		if(planDesc.length > 800){
			alert("描述长度不能超过800个字节！");
			return false;
		}
		var inputData = "{'planEndDate':'"+planEndDate+"','planId':'"+planId+"','planStartDate':'"+planStartDate+"','planName':'"+planName+"','typeId':'"+typeId+"', 'statusId':'"+statusId+"','channelIds':'"+channelIds+"', 'manager':'"+manager+"','cityIds':'"+cityIds+"','planDesc':'"+planDesc+"'}";
		$.ajax({
			url: contextPath + "/action/plan/planManage/addPlanDetail.do",
			type:"POST",
			dataType:"json",
			async:false,
			data:{"inputData":inputData},
			success:function(data){
				if(data.status!="200"){
					alert(data.message);
				}else{
					alert("新增产品成功！");
					$("#addDiv").dialog('close').remove();//关闭弹窗
					afterEditPlanDetail();
				}
			},
			error:function(data){
				alert(data.message);
			}
		});
	});
}
/**
 * 关键字查询
 */
function initKeyWordsEventListiener(){
    $(".searchBtn").click(function(){
        console.log("-----关键字查询开始------");
        statusId = "";//状态参数
        typeId ="";//类型参数
        pageNum=1;
        keyWords="";
        keyWords=$(".keyWords").val();
        if(keyWords.indexOf ("请输入") !=-1){
    		keyWords ="";
    	}
        console.log("-----keyWords："+keyWords+"------");
       //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
        return true;
    });
    $(".savePlan").click(function(){
        console.log("-----关键字查询开始------");
        statusId = "";//状态参数
        typeId ="";//类型参数
        pageNum=1;
        keyWords="";
        keyWords=$(".keyWords").val();
        if(keyWords.indexOf ("请输入") !=-1){
    		keyWords ="";
    	}
        console.log("-----keyWords："+keyWords+"------");
       //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
        return true;
    });
    $(".keyWords").change(function(){
        keyWords="";//初始化关键字
        keyWords=$(".keyWords").val();
        if(keyWords.indexOf ("请输入") !=-1){
    		keyWords ="";
    	}
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}



/**=======================================  planChoose.js  选择菜单的视图  ==========================================*/
/**
 * Created by john0723@outlook.com on 2016/11/01.
 */

/**
 * chooseView选择视图对像
 */
var chooseView ={};
var statusId = "";//状态参数
var typeId ="";//类型参数
var planTypes ="";//类型数据
var planStatus = "";//状态

/**
 * 添加选择视图
 */
chooseView.addChooseView=function(){
    //初始化选择视图
    chooseView.initView();
    //绑定选择视图事件
    chooseView.addChooseEventListiener();
};
/**
 * 初始化选择视图
 */
chooseView.initView=function(){
    //添加类别选择视图
    chooseView.addPlanTypeChooseView();
};

/**
 * 绑定选择视图事件
 */
chooseView.addChooseEventListiener = function () {
    //添加状态选择监听事件
    addStatusChooseEventListiener();
    //添加分类选择监听事件
    addPlanChooseEventListiener();
};


/**
 * 添加类被选择视图
 */
chooseView.addPlanTypeChooseView = function(){

    //获取json数据
    $.ajax({
        url:contextPath+"/action/plan/planManage/queryPlanTypes.do",
        type:"GET",
        async:false,
        success:function(data) {
            if(!data){return ;}
            planTypes="";
            planStatus="";
            planTypes =data.planTypes;//类型数据
            planStatus = data.planStatus;//状态


            var planView = "<span typeId='' class='active'>全部</span>";//类型视图
            /**类型视图*/
            for(var i=0;i<planTypes.length;i++){
                var planId = planTypes[i].typeId;
                var planNames = planTypes[i].typeName;
                planView += "<span typeId="+planId+" >"+planNames+"</span>";
            }
            $('#divDimPlanSrvType').html(planView);
            $('#divDimPlanSrvType').find('span').eq(0).addClass('active');//默认取第一个添加active效果

            /**状态视图*/
            var statusView = "<span statusId='' class='active'>全部</span>";//状态视图
            for(var i=0;i<planStatus.length;i++){
                var statusId = planStatus[i].statusId;
                var statusName = planStatus[i].statusName;
                statusView +="<span statusId="+statusId+" class=''>"+statusName+"</span>";
            }
            $('#divDimPlanTypes').html(statusView);//动态替换状态视图的数据
            $('#divDimPlanTypes').find("span").eq(0).addClass('active');//默认第一个添加active效果
        }
    });

};

/**
 * 1.添加状态选择监听事件
 * 2.初始化表格视图
 */
function addStatusChooseEventListiener(){
    $('#divDimPlanTypes span').click(function () {
        pageNum=1;//记录当前页码
        statusId="";//初始化状态
        //1.添加状态选择
        $(this).addClass('active').siblings('span').removeClass('active');
        statusId = $(this).attr("statusId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}

/**
 * 1.添加分类选择监听事件
 * 2.初始化表格视图
 */
function addPlanChooseEventListiener() {
    $('#divDimPlanSrvType span').click(function () {
        pageNum=1;//记录当前页码
        typeId = "";//初始化分类
        //添加分类选
        $(this).addClass('active').siblings('span').removeClass('active');
        typeId= $(this).attr("typeId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}


/**==================================   planList.js  列表数据的视图   ===============================================*/
/**
 * Created by john0723@outlook.com on 2016/11/01.
 */
//tableView列表视图
var tableView ={};

var jsp_page ="planmanage_detail.jsp";//内容详情jsp
var iframe_src = " ";//内同详情iframe路径

var params ="";//参数
var pageNum=1;//记录当前页码
var pageSize="";//记录每页多少条
var totalSize="";//总条数
var currentPage = "";//获取当前页码
var table_result="";//列表数据
var plan_id = "";//全局政策id
var dom_tr="";//全局的当前的列表tr对象

/**
 * 1.一开始就加载视图
 * 添加列表视图
 */
tableView.addTableView=function(){
    //初始化视图数据
    initTableViewData();
    //初始化列表视图
    initTableResultView(table_result);
};

/**
 * 表格的监听事件
 */
tableView.addTableListener=function(){
    //详细内容弹窗事件监听
    //addDetailPopWinEventListiener();
};


/**
 * 初始化视图数据：table_result，totalPage
 *                   列表数据    总页码数
 */
function initTableViewData() {
    $.ajax({
        url:contextPath+"/action/plan/planManage/queryTableList.do",
        data:{
            "keyWords":keyWords,
            "pageNum":pageNum,
            "typeId":typeId,
            "statusId":statusId
        },
        async:false,
        type:"POST",
        success:function(data) {
            if(!data){return;}
            table_result="";//列表数据
            totalPage = "";//总页码数
            pageSize = data.pageSize;//每页多少条
            totalSize= data.totalSize;//总条数
            table_result=data.result;//列表数据
            pageNum=data.pageNum;//当前页码

            //初始化翻页
            renderPageView(data);
        }
    });
}


function formatDate(ttDate) {
	if(ttDate != null && ttDate !=""){
	    ttDate = ttDate.match(/\d{4}.\d{1,2}.\d{1,2}/mg).toString();
	    ttDate = ttDate.replace(/[^0-9]/mg, '-'); 
	}else{
		ttDate = "--";
	}
	return ttDate;
	    
	}

/**
 * 初始化列表视图
 *
 */
function initTableResultView(table_result){
    var tableView ="";//列表视图
    for(var i=0;i<table_result.length;i++){
        var tr_id="";
        var index = i+1;
        var plan_id = table_result[i].PLAN_ID;
        if(plan_id == null || plan_id ==" "){ plan_id =""}
        var plan_name = table_result[i].PLAN_NAME;
        if(plan_name == null || plan_name ==" "){ plan_name =""}
        var type_name= table_result[i].TYPE_NAME;
        if(type_name == null || type_name ==" "){ type_name =""}
        var type_id=table_result[i].TYPE_ID;
        if(type_id == null || type_id ==" "){ type_id =""}
        var plan_stardate = formatDate(table_result[i].STARTDATE);
        if(plan_stardate == null || plan_stardate ==" "){ plan_stardate =""}
        var plan_enddate = formatDate(table_result[i].ENDDATE);
        if(plan_enddate == null || plan_enddate ==" "){ plan_enddate =""}
        var plan_desc = table_result[i].PLAN_DESC;
        if(plan_desc == null || plan_desc ==" "){ plan_desc =""}
        var plan_comment = table_result[i].PLAN_COMMENT;
        if(plan_comment == null || plan_comment ==" "){ plan_comment =""}
        var manager = table_result[i].MANAGER;
        if(manager == null || manager ==" "){ manager =""}
        var online_status = table_result[i].ONLINE_STATUS;
        if(online_status == null || online_status ==" "){ online_status =""}
        var status_name = table_result[i].STATUS_NAME;
        if(status_name == null || status_name ==" "){ status_name =""}
        var plan_in_use = table_result[i].PLAN_IN_USE;//产品是否正在被使用【ture：是；false:否】
        var plan_busi_type = table_result[i].PLAN_BUSI_TYPE;//营业侧业务类型是否为空【ture：是；false:否】

        //状态选择视图作处理
        var statusSelectView="";
        if(online_status === '0'){
            statusSelectView=""
                +" <option value='1' >上线</option>                                                            "
                +" <option   value='0' selected>未上线</option>                                                          "

        }else if(online_status === '1'){
            statusSelectView=""
                +" <option  value='1' selected>上线</option>                                                            "
                +" <option value='0' >未上线</option>                                                          "
        } else if(online_status === ""){
             statusSelectView=""
                 +"<option disabled value='' selected style='background: #EBEBE4'></option> "
                 +" <option  value='1' >上线</option>                                                            "
                 +" <option value='0' >未上线</option>                                                          "
         }else{
            statusSelectView=""
                +"<option disabled value='' selected style='background: #EBEBE4'></option> "
                +" <option  value='1' >上线</option>                                                            "
                +" <option value='0' >未上线</option>    "
        }

        //列表视图
        tableView += ""
            +"<tr plan_id="+plan_id+">                                                          "
            +"<td><span style='width:30px;' title="+index+">"+index+"</span></td>                             "
            +"<td><span style='width:97px;'class='plan_id' title="+plan_id+">"+plan_id+"</span></td>       "
            +"<td><span style='width:160px;'class='plan_name' title="+plan_name+">"+plan_name+"</span></td>                            "
            +"<td class='type_id'><span style='width:65px;' class='type_name' type_id='"+type_id+"' title="+type_name+">"+type_name+"</span></td>                       "
            +"<td><span style='width:130px;'  title='"+plan_stardate+"' class='plan_stardate' >"+plan_stardate+"</span></td>                     "
            +"<td><span style='width:130px;'  title='"+plan_enddate+"' class='plan_enddate' >"+plan_enddate+"</span></td>                     "
            +"<td><span style='width:90px;' class='plan_desc' title='"+plan_desc+"'>"+plan_desc+"</span></td>             "
            +"<td><span style='width:90px;' class='plan_comment' title='"+plan_comment+"'>"+plan_comment+"</span></td>             "
            +" <td><span style='width:55px;' class='manager' title='"+manager+"'>"+manager+"</span></td>                          "
            +" <td class='status' online_status='"+online_status+"'>                                                                             "
            +" <span>                                                                           "
            +" <select plan_id='"+plan_id+"' plan_in_use='"+plan_in_use+"' plan_busi_type='"+plan_busi_type+"' type_id='"+type_id+"' class='online_status' id='tr_"+plan_id+"'>                                                                         "
            +statusSelectView
            +" </select>                                                                        "
            +" <span>                                                                           "
            +" <a href='javascript:;' class='detail_a'>详情</a></span>                                           "
            +" </span>                                                                          "
            +" </td>                                                                            "
            +" </tr>		                                                                        "
    }
    $(".cust-table tbody").html(tableView);

    //详情内容弹窗事件
    addDetailPopWinEventListiener();
    //状态更新事件监听
    addUpSatatusEventListiener();
}


/**
 * 详细内容弹窗
 * 1.弹窗开启
 * 2.初始化弹窗内容
 */
function addDetailPopWinEventListiener(){
    $(".detail_a").off('click').on('click',function(){
        plan_id="";//产品id
        dom_tr ="";//列表tr
        dom_tr=$(this).parents("tr");
        plan_id =dom_tr.attr("plan_id");

        //异步查询数据
        $.ajax({
			url: contextPath + "/action/plan/planManage/getPlanDetail.do",
			dataType: "json",
			data: {"planId": plan_id},
			type: "POST",
			success:function(data){
				if(data.status == "201"){
					alert(data.message);
				}else if(data.status == "200"){
					var myHtml = new EJS({url: contextPath + "/assets/js/plan/provinces/sx/planmanage_extends_detail.ejs"}).render({"planDetailBO": data.data[0]});
					$("#planDetailContainer").empty().append(myHtml);
					//显示适用渠道和城市下拉框
				    filledChannelAndCitySel(data,"view");
					//展示弹窗
					$("#edit-dialog").dialog({
			            width:1028,
			            height:710,
			            resizable: false,
			            draggable:false,
			            modal: true,
			            title:""
			        });
			      
			        //向头部增加 ---编辑按钮i，返回按钮em
				    var headerStr='';
				    headerStr+='<span class="detail-header-title">详情</span>'+
						 '<img class="mleft_10 detail-header-edit hand" title="编辑" src="../../assets/images/edit_icon_u.png">'+
						 '<span class="detail-header-back hand" id="above_return_btn"> &lt; 返回 </span>'
				    $('.ui-dialog-title').append(headerStr).css("text-align","left");
					//重写弹窗右上角关闭按钮事件
				  	$('.ui-dialog-titlebar-close').off('click').click(function(){
				  		$("#edit-dialog").dialog('close').remove();//关闭弹窗
					});
				  	
				  	//产品详情的查看状态和修改状态切换
				  	addPlanView2EditEventListiener();
				  	//初值为查看状态
		  			$("#type_name").attr("disabled","disabled");
			  		$("#online_status").attr("disabled","disabled");
			  		$("#channelSel").attr("disabled","disabled");
			  		$("#channelSel_ms").attr("disabled","disabled");
			  		$("#channelSel_ms").addClass("ui-state-disabled");
			  		$("#manager").attr("disabled","disabled");
				    $("#chenScore").attr("disabled","disabled");
				    $("#smsScore").attr("disabled","disabled");
				    //推荐语翻页方法（产品详情页面）
				    addTurnPageEventListiener();
				    
				    //给保存按钮调节事件
				    addSaveBtnEventListiener();
				}
			},
			error: function(data){
				alert(data.message);
			}
		});
        
        //initPlanDetailView();
        
    });
}

/*
 * 绑定产品详情的查看状态和修改状态切换事件
 */
function addPlanView2EditEventListiener(){
	$(".detail-header-edit").click(function(){
  		var src = $(".detail-header-edit").attr("src");
  		if(src == "../../assets/images/edit_icon_u.png"){//由查看状态切换到编辑状态
  			src = "../../assets/images/edit_icon_d.png";
  			$("#type_name").removeAttr("disabled");
	  		$("#online_status").removeAttr("disabled");
	  		$("#channelSel").removeAttr("disabled");
	  		$("#channelSel_ms").removeAttr("disabled");
	  		$("#channelSel_ms").removeClass("ui-state-disabled");
	  		$("#manager").removeAttr("disabled");
            $("#chenScore").removeAttr("disabled");
            $("#smsScore").removeAttr("disabled");
	  		$("#save-div").css("display","");
	  		$("#return-div").css("display","none");
  		}else if(src == "../../assets/images/edit_icon_d.png"){//由编辑状态切换到查看状态
  			src = "../../assets/images/edit_icon_u.png";
  			$("#type_name").attr("disabled","disabled");
	  		$("#online_status").attr("disabled","disabled");
	  		$("#channelSel").attr("disabled","disabled");
	  		$("#channelSel_ms").attr("disabled","disabled");
	  		$("#channelSel_ms").addClass("ui-state-disabled");
	  		$("#manager").attr("disabled","disabled");
            $("#chenScore").attr("disabled","disabled");
            $("#smsScore").attr("disabled","disabled");
	  		
	  		$("#save-div").css("display","none");
	  		$("#return-div").css("display","");
  		}
  		$(".detail-header-edit").attr("src", src);
  	});
}

/*
 * 显示适用渠道和城市下拉框
 */
function filledChannelAndCitySel(data,type){
	var chanName="channelSel";
	var cityName=type!="view"?"addCitySel":"citySel";
	var channelSelDivName="channelSelDiv";
	var citySelDivName=type!="view"?"addCitySelDiv":"citySelDiv";
	/*适用渠道多选下拉框  */
    $("#"+chanName).multiselect({
       		selectedList: 4,//可多选的个数
       		noneSelectedText:type!="view"?'全部':'请选择',
       		showCheckAll: false,
            showUncheckAll: false,
            header:false,
            minWidth:type!="view"?157:225
    });
    //适用城市多选下拉框
    $("#"+cityName).multiselect({
   		selectedList: 4,//可多选的个数
   		noneSelectedText:type!="view"?'全部':'请选择',
   		showCheckAll: false,
        showUncheckAll: false,
        header:false,
        minWidth:type!="view"?157:225
	});
    
    var channels = data.data[0].channel;
    var citys = data.data[0].city;
    
    var channelArray = new Array();
    var channelNames = '';
    var cityArray = new Array();
    var cities = '';
    //遍历获取适用渠道ID数组
    if(channels != null && channels.length > 0){
    	for(var i = 0;i < channels.length;i++){
    		if(channels[i].PLAN_ID != null && channels[i].PLAN_ID != ""){
    			channelArray[i] = channels[i].CHANNEL_ID;
    			channelNames += channels[i].CHANNEL_NAME + ",";
    		}
    	}
    }
    channelNames = channelNames.substring(0, channelNames.lastIndexOf(","));
    //遍历获取适用城市数组
    if(citys != null && citys.length > 0){
    	for(var i = 0;i < citys.length;i++){
    		if(citys[i].PLAN_ID != null && citys[i].PLAN_ID != ""){
    			cityArray[i] = citys[i].CITY_ID;
    			cities += citys[i].CITY_NAME + ",";
    		}
    	}
    }
    cities = cities.substring(0, cities.lastIndexOf(","));
    //选择多选项
    $('#'+chanName).val(channelArray);
    $('#'+cityName).val(cityArray);
    $("#"+channelSelDivName).attr("title",channelNames);
    $("#"+citySelDivName).attr("title", cities);
    //如果添加界面能去掉一些样式
    if(type!="view"){
    	$("#"+chanName+"_ms").removeClass("ui-state-disabled");
    	$("#"+chanName+"_ms").css("height", "34");
    	$("#"+cityName+"_ms").removeClass("ui-state-disabled");
    	$("#"+cityName+"_ms").css("height", "34");
    }
    //刷新数组
    $('#'+chanName).multiselect("refresh");
    $('#'+cityName).multiselect("refresh");
    if(type=="view"){
    	var citySelNum=0;
        $("input[name='multiselect_citySel']:checked").each(function(){
        	citySelNum+=1;
    	});
        if(citys.length==citySelNum){
        	$(">span",$("#citySel_ms")).eq(1).text("全部");
        }
        var channelSelNum=0;
        $("input[name='multiselect_channelSel']:checked").each(function(){
        	channelSelNum+=1;
    	});
        if(channels.length==channelSelNum){
        	$(">span",$("#channelSel_ms")).eq(1).text("全部");
        }
    }
    
}

/**
 * 推荐语翻页方法（产品详情页面）
 * @returns
 */
function addTurnPageEventListiener(){
	//上一页
    $('.J_prevPage').click(function(){
    	//alert('J_prevPage');
	    var curPage = $(this).parents('.camp-page-box').find('.J_activePage').text();
	    if(curPage == '1'){
	        alert('已是第1页！');
	        return;
		}else{
		   var planId = $("#planId").val();
		   var channelId = $(this).parents('.tab-pane').attr("id");
	       var curPageNew = curPage-1;
	       $(this).parents('.camp-page-box').find('.J_activePage').text(curPageNew);
	       
	       //刷新列表
	       //alert(curPageNew);
	       if(channelId != null && channelId != '' && channelId.length > 8){
		       channelId = channelId.substring(8);
		       callServerTurnPage(planId, channelId, 3, curPageNew);
	       }
		}
	});
	//下一页
	$('.J_nextPage').click(function(){
		//alert('J_nextPage');
	    var curPage = $(this).parents('.camp-page-box').find('.J_activePage').text();
	    var totalPage = $(this).parents('.camp-page-box').find('.J_totalPage').text();
	    if(curPage == totalPage){
	        alert('已是最后一页！');
	        return;
	    }else{
	    	var planId = $("#planId").val();
	    	var channelId = $(this).parents('.tab-pane').attr("id");
	        var curPageNew = parseInt(curPage)+1;
	        $(this).parents('.camp-page-box').find('.J_activePage').text(curPageNew);
	        //刷新列表
	        //alert(curPageNew);
	       if(channelId != null && channelId != '' && channelId.length > 8){
	    	   channelId = channelId.substring(8);
	    	   callServerTurnPage(planId, channelId, 3, curPageNew);
	       }
	    }
	});
	//页数下拉点击
	$('.J_pageSelect').click(function(){
	    var isHidden = $(this).find('.page-item-sel').is(':hidden');
	    var $selBox = $(this).find('.page-item-sel');
	    if(isHidden){
	        $selBox.show();
		}else{
	        $selBox.hide();
		}
	});
	$('.page-item-sel li').click(function(){
		var planId = $("#planId").val();
    	var channelId = $(this).parents('.tab-pane').attr("id");
	    var curPage = $(this).find('b').text();
	    $(this).parents('.J_pageSelect').find('.J_activePage').text(curPage);
	    //alert(curPage);
	    //刷新列表
	    if(channelId != null && channelId != '' && channelId.length > 8){
	    	channelId = channelId.substring(8);
	    	callServerTurnPage(planId, channelId, 3, curPage);
	    }
	});
	
}

/*
 * 调用服务端推荐语翻页方法
 */
function callServerTurnPage(planId, channelId, pageSize, pageNum){
	 $.ajax({
			url: contextPath + "/action/plan/planManage/queryMarketTerms.do",
			dataType: "json",
			contentType: "application/json; charset=UTF-8",
			data: JSON.stringify({"planId": planId, "channelId":channelId, "pageSize":pageSize, "pageNum": pageNum}),
			type: "POST",
			success:function(data){
				if(data.status == 201){
					alert(data.message);
				}else if(data.status == 200){
					var myHtml = new EJS({url: contextPath + "/assets/js/plan/provinces/sx/markets.ejs"}).render({"planChannelMarketTermsBO": data.data[0]});
					$("#channel-" + channelId).remove();
					$(".tab-content").append(myHtml);
					addTurnPageEventListiener();
				}
			},
			error: function(data){
				alert(data.message);
			}
	 });
}

/*
 * 给保存按钮调节事件
 * @returns
 */
function addSaveBtnEventListiener(){
	$("#above_return_btn").click(function(){
		$("#edit-dialog").dialog('close').remove();//关闭弹窗
	});
	$("#return-btn").click(function(){
		$("#edit-dialog").dialog('close').remove();//关闭弹窗
	});
	$("#save-btn").click(function(){
		var src = $(".detail-header-edit").attr("src");
		if(src == "../../assets/images/edit_icon_u.png"){
			alert("请先编辑再保存！");
		}else if(src == "../../assets/images/edit_icon_d.png"){
			var planId = $("#planId").val();
			var typeId = $("#type_name").val();
			var statusId = $("#online_status").val();
			var planInUse = $("#planInUse").val();
			var channelIds = '';
			$("input[name='multiselect_channelSel']:checked").each(function(){
				channelIds += $(this).val() + "/";
			});
			channelIds = channelIds.substring(0, channelIds.lastIndexOf("/"));
			var manager = $("#manager").val();
			if(manager != null && manager.length > 80){
				alert("产品经理长度不能超过80个字节！");
				return false;
			}
			if(typeId == null || typeId == ""){
				alert("请选择产品类别！");
				return false;
			}
			
			if(planInUse == "true" || planInUse == true){
				 alert("该产品已在营销策略中使用，不允许进行编辑。");
				 return false;
			}
            $("#chenScore").removeAttr("disabled");
            $("#smsScore").removeAttr("disabled");
			var chenScore = $("#chenScore").val();
            var smsScore = $("#smsScore").val();
            var regex = /^[1-9]+[0-9]*]*$/;
            if(chenScore.length > 1 && (!regex.test(chenScore) || chenScore > 1000)){
                alert("请输入合法的0-1000之内的数字！");
                $("#chenScore").focus();
                return;
            }
            if(smsScore.length > 1 && (!regex.test(smsScore) || smsScore > 1000)){
                alert("请输入合法的0-1000之内的数字！");
                $("#smsScore").focus();
                return;
            }
			var inputData = {"planId":planId, "typeId":typeId, "statusId":statusId,"channelIds":channelIds, "manager":manager, "chenScore" : chenScore, "smsScore" : smsScore};
			$.ajax({
				url: contextPath + "/action/plan/planManage/updatePlanDetail.do",
				type:"POST",
				dataType:"json",
				async:false,
				data:inputData,
				success:function(data){
					alert("修改成功！");
					$("#edit-dialog").dialog('close').remove();//关闭弹窗
					afterEditPlanDetail();
				},
				error:function(data){
					alert(data.message);
				}
			});
		}
	});
}

/**
 * 状态更新事件监听
 */
function addUpSatatusEventListiener(){
    //产品是否正在被使用
    var planInUse = " ";
    //change前的状态值
    var b_status = " ";
    //change后的状态值
    var f_status =" ";
    //当列的plan_id值
    var this_plan_id = " ";
    //营业侧业务类型
    var planBusiType="";
    //当前对象
    var this_object="";

    $(".online_status").bind({
        click:function(){
            planInUse = $(this).attr("plan_in_use");
            b_status =  $(this).val();//change前的状态值
            this_plan_id = $(this).attr("plan_id");//当前的plan_id
            plan_type_id=$(this).attr("type_id");//当前的type_id
            planBusiType=$(this).attr("plan_busi_type");//营业侧业务类型
            this_object=this;//当前对象
        },
        change:function(){
            f_status = $(this).val();//change后的状态值
            if(planInUse == "true"){
                alert("该产品已在营销策略中使用，不允许进行编辑。");
                $(this).val(b_status);
            }else if(planInUse == "false"){
            	//陕西没有判断是否有编辑权限
            	//checkDetailEditAccess(this_plan_id,b_status,f_status,plan_type_id,planBusiType,this_object);
            	
            	upStatusEventListener(this_plan_id, f_status);
            }

        }
    });

}

/**
 * 产品/政策详情页面编辑权限校验
 */
function checkDetailEditAccess(this_plan_id,b_status,f_status,plan_type_id,planBusiType,this_object){
	//将数据传入后台进行权限校验
	var flag="";
    $.ajax({
        url:contextPath+"/action/privilege/login/checkDetailEditAccess.do",
        data:{
            "planId":this_plan_id
        },
        async:false,
        type:"POST",
        success:function(result) {
        	if (result==true) {
        		flag=true;
			}else{
	        	flag=false;
			}
        },
        error:function(){
            alert("权限获取异常！");
        }
    });
    
    if (flag) {
    	//判断详情页面两个必选项(类别、营业侧业务类型)是否选择
    	if (planBusiType=="true"||plan_type_id==""||plan_type_id==null) {
    		alert("请先完善详情页面的内容！");
    		$(this_object).val(b_status);
    	}else{
    		//实施状态更新
            var result = upStatusEventListener(this_plan_id,f_status);
            //对结果判断及处理结果
            if(result == false){
                $(this).val(b_status);
            }else{

            }
    	}
	}else{
		alert("您没有编辑权限！");
		$(this_object).val(b_status);
	}
}

/**
 * 实施状态更新
 */
function upStatusEventListener( this_plan_id,f_status){
    $.ajax({
        url:contextPath+"/action/plan/planManage/saveStatus.do",
        data:{
            "planId":this_plan_id,
            "statusId":f_status
        },
        async:false,
        type:"POST",
        success:function(data){
            return true;
        },
        error:function(){
            alert("更新操作失败！");
            return false;
        }
    });
}


/**
 * 翻页实现
 * @param data
 */
function renderPageView(data){
    $(".divPlansPage").pagination({
        items: data.totalSize,
        itemsOnPage: data.pageSize,
        currentPage:data.pageNum,
        prevText:'上一页',
        nextText:'下一页',
        cssStyle: 'light-theme',
        onPageClick:function renderPage(currentNum,event){
            pageNum=currentNum;//更新当前页码
            //初始化视图数据
            initTableViewData();
            //初始化列表视图
            initTableResultView(table_result);
        }
    });
}

/*
 * 编辑产品信息成功后，刷新列表
 */
function afterEditPlanDetail(){
	keyWords="";//初始化关键字
    keyWords=$(".keyWords").val();
    if(keyWords.indexOf ("请输入") !=-1){
		keyWords ="";
	}
    //初始化视图数据
    initTableViewData();
    //初始化列表视图
    initTableResultView(table_result);
}