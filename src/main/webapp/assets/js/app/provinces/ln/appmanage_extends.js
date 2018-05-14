/**
 *
 * Created by john0723@outlook.com on 2016/10/08.
 */
/**
 * 菜单目录：
 * 1.应用库主js；
 * 2.appChoose.js  选择菜单的视图；
 * 3.appList.js  列表数据的视图；
 * 4.appDetail.js  弹窗数据的视图；
 */

/**============================================  应用库主js  ========================================================*/

/**
 * 内容库主js
 * 1.绑定方法监听
 * 2.初始化视图
 */

define(function(require, exports, module){
	require("xdate");
	require("purl");
	require("page");
	require("toast");
	require("modal");
	require("placeholder");
	
	exports.init=function(){
		$(document).ready(function(){
			initView();
		    addEventListener()
		});
	}
});


/**定义全局的内容视图对象*/
var planInfo={queryPlan:null,queryStatus:null,custManage:null};
var keyWords ="";//初始化搜索关键字

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
    detailView.addDetailListener();//详细内容事件监听
}

/**
 * 关键字查询
 */
function initKeyWordsEventListiener(){
    $(".searchBtn").click(function(){
        console.log("-----关键字查询开始------");
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
        
    });
    $(".keyWords").blur(function(){
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



/**=======================================  appChoose.js  选择菜单的视图  ==========================================*/
/**
 * Created by john0723@outlook.com on 2016/10/08.
 */

/**
 * chooseView选择视图对像
 */
var chooseView ={};
var statusId = "";//状态参数
var timeId ="";//发布时间参数
var appStatus = "";//状态

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
    chooseView.addContentTypeChooseView();
};

/**
 * 绑定选择视图事件
 */
chooseView.addChooseEventListiener = function () {
    //添加状态选择监听事件
    addStatusChooseEventListiener();
    //添加分类选择监听事件
    addTimeChooseEventListiener();
};


/**
 * 添加类被选择视图
 */
chooseView.addContentTypeChooseView = function(){

    //获取json数据
    $.ajax({
        url:contextPath+"/action/app/appManage/queryAppTypes.do",
        type:"GET",
        async:false,
        success:function(data) {
            if(!data){return ;}
            appStatus="";
            appStatus = data.appStatus;//状态

            /**状态视图*/
            var statusView = "<span statusId='' class='active'>全部</span>";//状态视图
            for(var i=0;i<appStatus.length;i++){
                var statusId = appStatus[i].statusId;
                var statusName = appStatus[i].statusName;
                statusView +="<span statusId="+statusId+" class=''>"+statusName+"</span>";
            }
            $('#divDimContentTypes').html(statusView);//动态替换状态视图的数据
            $('#divDimContentTypes').find("span").eq(0).addClass('active');//默认第一个添加active效果

//             /**发布时间视图*/
//            var timeView = "<span typeId='' class='active'>全部</span>";//发布时间视图
//            for(var i=0;i<planTypes.length;i++){
//                var planId = planTypes[i].typeId;
//                var planNames = planTypes[i].typeName;
//                timeView += "<span typeId="+planId+" >"+planNames+"</span>";
//            }
//            $('#divDimPlanSrvType').html(planView);
//            $('#divDimPlanSrvType').find('span').eq(0).addClass('active');//默认取第一个添加active效果
            /**发布时间视图*/
            var timeView = "<span timeId='' class='active'>全部</span><span timeId='1'>一天内</span><span timeId='2'>一周内</span><span timeId='3'>一月内</span>";//发布时间视图
            $('#divTimeType').html(timeView);
            $('#divTimeType').find('span').eq(0).addClass('active');//默认取第一个添加active效果
        }
    });

};

/**
 * 1.添加状态选择监听事件
 * 2.初始化表格视图
 */
function addStatusChooseEventListiener(){
    $('#divDimContentTypes span').click(function () {
        statusId="";//初始化状态
        //1.添加状态选择
        $(this).addClass('active').siblings('span').removeClass('active');
        statusId = $(this).attr("statusId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
        //初始化页面选择视图
        initSelectPageView(totalPage);
    });
}

/**
 * 1.添加发布时间选择监听事件
 * 2.初始化表格视图
 */
function addTimeChooseEventListiener() {
    $('#divTimeType span').click(function () {
        timeId = "";//初始化分类
        //添加分类选
        $(this).addClass('active').siblings('span').removeClass('active');
        timeId= $(this).attr("timeId");
        //初始化视图数据
        initTableViewData();
        //初始化列表视图
        initTableResultView(table_result);
    });
}



/**==================================   appList.js  列表数据的视图   ===============================================*/
/**
* Created by john0723@outlook.com on 2016/10/08.
*/

/**
 * tableView列表视图
 */
var tableView ={};

var params ="";//参数
var pageNum=1;//记录当前页码
var pageSize="";//记录每页多少条
var totalSize="";//总条数
var currentPage = "";//获取当前页码
var table_result="";//列表数据
var app_id = "";//全局内容id
var dom_tr="";//全局的当前的列表tr对象
var pub_time="";//发布时间

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
    addDetailPopWinEventListiener();
};


/**
 * 初始化视图数据：table_result，totalPage
 *                   列表数据    总页码数
 */
function initTableViewData() {
    console.log("keyWords:"+keyWords+"; pageNum:"+pageNum+"; pub_time:"+timeId+"; statusId:"+statusId);
    $.ajax({
        url:contextPath+"/action/app/appManage/queryTableList.do",
        data:{
            "keyWords":keyWords,
            "pageNum":pageNum,
            "timeId":timeId,
            "statusId":statusId
        },
        async:false,
        type:"POST",
        success:function(data) {
            if(!data){return;}
            table_result="";//列表数据
            pageSize = data.pageSize;//每页多少条
            totalSize= data.totalSize;//总条数
            totalPage = data.totalPage;
            table_result=data.result;
            //初始化翻页
            renderPageView(data);
        }
    });
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
        var content_id = table_result[i].CONTENT_ID;
        var content_name = table_result[i].CONTENT_NAME;
        var content_type=table_result[i].CONTENT_TYPE;
        var type_name= table_result[i].TYPE_NAME;
        var content_class=table_result[i].CONTENT_CLASS;
        var content_source=table_result[i].CONTENT_SOURCE;
        var pub_time = table_result[i].PUB_TIME;
        var invalid_time= table_result[i].INVALID_TIME;
        var unit_price= table_result[i].UNIT_PRICE;
        var online_status = table_result[i].ONLINE_STATUS;
        var status_name = table_result[i].STATUS_NAME;
        var plan_in_use = table_result[i].PLAN_IN_USE;//产品是否正在被使用【ture：是；false:否】

        //单价空值处理
        if(unit_price == null || unit_price ==""){
            unit_price="0.00";
        }
        //来源空值处理
        if(content_source == null || content_source ==""){
            content_source="无";
        }
        //内容名称空值处理
        if(content_name == null || content_name ==""){
            content_name="无";
        }

        //状态选择视图作处理
        var statusSelectView="";
        if(online_status == 0){
            statusSelectView=""
                +" <option value='1' >上线</option>                                                            "
                +" <option  value='0' selected>未上线</option>                                                          "
        }else if(online_status == 1){
            statusSelectView=""
                +" <option  value='1' selected>上线</option>                                                            "
                +" <option value='0' >未上线</option>                                                          "
        }
        //else if(online_status == 3 ){
        //    statusSelectView=""
        //        +"<option disabled value='3' selected>其它</option> "
        //        +" <option disabled value='1' >上线</option>                                                            "
        //        +" <option value='0' disabled>未上线</option>                                                          "
        //}

        //列表视图
        tableView += ""
            +"<tr app_id="+content_id+">                                                          "
            +"<td><span style='width:30px;' title="+index+">"+index+"</span></td>                             "
            +"<td><span style='width:97px;'class='content_id' title="+content_id+">"+content_id+"</span></td>       "
            +"<td><span style='width:160px;'class='content_name' title="+content_name+">"+content_name+"</span></td>                            "
            +"<td class='type_id'><span style='width:65px;' class='type_name' type_id='"+content_type+"' title="+type_name+">"+type_name+"</span></td>                       "
            +"<td><span style='width:90px;' class='content_class' title='"+content_class+"'>"+content_class+"</span></td>             "
            +"<td><span style='width:90px;' class='content_source' title='"+content_source+"'>"+content_source+"</span></td>             "
            +"<td><span style='width:120px;'  title='"+pub_time+"' class='content_stardate' >"+pub_time+"</span></td>                     "
            +"<td><span style='width:120px;'  title='"+invalid_time+"' class='content_enddate' >"+invalid_time+"</span></td>                     "
            +" <td><span style='width:55px;' class='unit_price' title='"+unit_price+"'>"+unit_price+"</span></td>                          "
            +" <td class='status' online_status='"+online_status+"'>                                                                             "
            +" <span>                                                                           "
            +" <select app_id='"+content_id+"' plan_in_use='"+plan_in_use+"' class='online_status' id='tr_"+content_id+"'>                                                                         "
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
    $(".detail_a").click(function(){
        app_id="";//应用id
        dom_tr ="";//列表tr
        dom_tr=$(this).parents("tr");
        app_id =dom_tr .attr("app_id");
        $(".popwin").show();
        $(".poppage").show();
        //初始化详细内容视图
        detailView.initView();
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

    $(".online_status").bind({
        click:function(){
            planInUse = $(this).attr("plan_in_use");
            b_status =  $(this).val();//change前的状态值
            this_plan_id = $(this).attr("app_id");//当前的content_id
        },
        change:function(){
            f_status = $(this).val();//change后的状态值
            if(planInUse == "true"){
                alert("该产品已在营销策略中使用，不允许进行编辑。");
                $(this).val(b_status);
            }else if(planInUse == "false"){
                //实施状态更新
                var result = upStatusEventListener(this_plan_id,f_status);
                //对结果判断及处理结果
                if(result == false){
                    $(this).val(b_status);
                }else{
                }
            }
        }
    });
}


/**
 * 实施状态更新
 */
function upStatusEventListener( this_plan_id,f_status){
    $.ajax({
        url:contextPath+"/action/app/appManage/saveStatus.do",
        data:{
            "appId":this_plan_id,
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
        //cssStyle: 'light-theme',
        onPageClick:function(currentNum,event){
            pageNum=currentNum;//更新当前页码
            //初始化视图数据
            initTableViewData();
            //初始化列表视图
            initTableResultView(table_result);
        }
    });
}



/**==================================   appDetail.js  弹窗数据的视图 ===============================================*/
/**
 *
 * Created by john0723@outlook.com on 2016/10/08.
 */

/**
 * 内容详情js
 */
var detailView={};//详细内容页面视图
var $campsegContent ="";//策略div对象
var banner_length ="";//轮播的长度
var broadcastTimes = "";//次数标签
var detailData = "";//详情视图数据


/**初始化视图*/
detailView.initView=function(){
    console.log("-----初始化详细内容视图成功-----");
    //初始化详情视图数据
    initDetailViewResult();
    //初始化详情内容视图
    initDetailView();

    //关闭内容编辑
    $("#online_status > option").attr("disabled",true);
    //对保存按钮的处理
    $("#save-btn").removeClass("btn-blu");
    //编辑图标的设定
    $("#detail_img").attr("src",""+contextPath+"/assets/images/edit_icon_u.png");
    //对类型不可编辑做背景处理
    $("#online_status").css("background","#EBEBE4");
};

/**初始化监听事件*/
detailView.addDetailListener=function(){
    //编辑内容事件
    addEditEventListener();
    //详细内容返回
    addBackEventListener();
    //关闭弹窗页面
    addCloseEventListener();
    //轮播实现
    addBannerEventListener();
    //保存内容事件
    addSaveEventListener(app_id);
}

/**
 * 初始化详情视图数据
 */
function  initDetailViewResult(){
    detailData = "";//初始化json对象
    $.ajax({
        url:contextPath+"/action/app/appManage/queryDetailApp.do",
        async:false,
        type:"POST",
        data:{
            "appId":app_id
        },
        success:function(data){
            if(data == null){return;}
            detailData=data;
        },
        error:function(){alert("数据获取失败！");}
    });
}

/**
 * 初始化详情内容视图
 */
function initDetailView(){
    var queryAppStatus = detailData.queryAppStatus;//内容详情状态 【数组】
    var queryContentCity = detailData.queryCity;//内容详情适用地市 【数组】
    var queryAppDef = detailData.queryAppDef;//内容详情整体内容
    var queryCampseg = detailData.queryCampseg;//内容详情策略 【数组】
    var planInUse = detailData.planInUse;//判断该产品是否正在被使用

    //内容详情整体内容
    var d_content_id = queryAppDef[0].CONTENT_ID;
    var d_content_name = queryAppDef[0].CONTENT_NAME;
    var d_content_type = queryAppDef[0].CONTENT_TYPE;
    var d_type_name = queryAppDef[0].TYPE_NAME;
    var d_content_class = queryAppDef[0].CONTENT_CLASS;
    var d_content_class1 = queryAppDef[0].CONTENT_CLASS1;
    var d_content_class2 = queryAppDef[0].CONTENT_CLASS2;
    var d_content_class3 = queryAppDef[0].CONTENT_CLASS3;
    var d_content_class4 = queryAppDef[0].CONTENT_CLASS4;
    var d_unit_price = queryAppDef[0].UNIT_PRICE;
    var d_pub_time = queryAppDef[0].PUB_TIME;
    var d_invalid_time = queryAppDef[0].INVALID_TIME;
    var d_award_mount = queryAppDef[0].AWARD_MOUNT;
    var d_content_url = queryAppDef[0].CONTENT_URL;
    var d_manager = queryAppDef[0].MANAGER;
    var d_content_source = queryAppDef[0].CONTENT_SOURCE;
    var d_content_remark = queryAppDef[0].CONTENT_REMARK;
    var d_city_id = queryAppDef[0].CITY_ID;
    var d_city_name = queryAppDef[0].CITY_NAME;

    //给编辑图标添加产品是否正在被使用标签：
    $("#detail_img").attr("plan_in_use",planInUse);

    //状态视图
    var statusView = "";//状态视图
    var d_online_status = queryAppDef[0].ONLINE_STATUS;
    var d_status_name = queryAppDef[0].STATUS_NAME;
    if(d_online_status == 0 || d_online_status == 1){
        for(var i=0;i<queryAppStatus.length;i++){
            var statusId = queryAppStatus[i].STATUS_ID;
            var statusName = queryAppStatus[i].STATUS_NAME;
            statusView += "<option value='"+statusId+"' class='status' disabled>"+statusName+"</option>";
        }
    }else if(d_online_status == '3'){
        statusView +="<option value='"+d_online_status+"'   disabled>"+d_status_name+"</option>";
        for(var i=0;i<queryAppStatus.length;i++){
            var statusId = queryAppStatus[i].STATUS_ID;
            var statusName = queryAppStatus[i].STATUS_NAME;
            statusView += "<option value='"+statusId+"' class='status' disabled>"+statusName+"</option>";
        }
    }

    $('#online_status').html(statusView);
    $('#online_status').val(d_online_status);



    //适用地市
    var city = queryContentCity;
    var cityView = " ";
    if(city.length == 0){
        //第一条展示结果的主li
        cityView=" "
            +"<li class='one_li' id='city_li'>"
            +"      <input type='text'  class='channel_input' id='city_result' value='无' disabled>"
            +"      <img src='"+contextPath+"/assets/images/select.png'>"
            + "</li>";
        //checked的结果li
        cityView+=" "
            +"<li value='' style='display:none' >"
            +"      <input type='checkbox' checked disabled plan_id='' class='checkbox_li' id=' ' name='city' value='无'>"
            +       "无"
            +"</li>";
    }else{
        //第一条展示结果的主li
        cityView=" "
            +"<li class='one_li' id='city_li'>"
            +"      <input type='text' class='channel_input' id='city_result' disabled>"
            +"      <img src='"+contextPath+"/assets/images/select.png'>"
            +"</li>";
        //checked的结果li
        for(var i =0;i<city.length;i++){
            var city_id = city[i].CITY_ID;
            var city_name = city[i].CITY_NAME;
            cityView+=" "
                +"<li value='' style='display:none' >"
                +"      <input type='checkbox' checked disabled plan_id='' class='checkbox_li' id="+city_id+" name='city' value="+city_name+">"
                +       city_name
                +"</li>";
        }
    }
    $("#city").html(cityView);

    var city_li_name="city";//获取选择li
    var city_check_result = $("#city_result");//结果的input标签
    //渠道结果事件
    channelResult(city_li_name,city_check_result);
    //城市选择的监听事件
    cityResultCheckEventListener();
    console.log("-----cityView:"+cityView+"-------");

    //内容详情整体
    $("#content_id").val(d_content_id);//编码
    $("#content_name").val(d_content_name);//名称
    $("#type_name").attr("content_type",d_content_type);//类别id
    $("#type_name").val(d_type_name);//类别
    $("#content_class").val(d_content_class);//类型
    $("#content_class1").val(d_content_class1);//一级分类
    $("#content_class2").val(d_content_class2);//二级分类
    $("#content_class3").val(d_content_class3);//三级分类
    $("#content_class4").val(d_content_class4);//四级分类
    $("#unit_price").val(d_unit_price);//单价
    $("#pub_time").val(d_pub_time);//发布时间
    $("#invalid_time").val(d_invalid_time);//失效时间
    $("#award_mount").val(d_award_mount);//酬金
    $("#content_url").val(d_content_url);//UTL长链接
    $("#content_source").val(d_content_source);//来源
    $("#manager").val(d_manager);//产品经理
    //$("#city").attr("city_id",d_city_id);//适用地市id
    // $("#city").val(d_city_name);//适用地市
    $("#content_remark").val(d_content_remark);//摘要


    //初始化酬金视图
    var campsegView="";
    if(queryCampseg.length == null){
        campsegView="";
    }else{
        for(var i=0;i<queryCampseg.length;i++){
            var campseg_ids = queryCampseg[i].CAMPSEG_ID;
            var campseg_names = queryCampseg[i].CAMPSEG_NAME;
            var campseg_stat_names = queryCampseg[i].CAMPSEG_STAT_NAME;
            var num=i+1;
            campsegView+=""
                +"<a href='"+contextPath+"/jsp/tactics/tacticsInfo.jsp?campsegId="+campseg_ids+"' target='_blanck'>"
                +"<div class='campseg-li-div'>"
                +"<div >"
                +"<div class='content-num-div'><img src='"+contextPath+"/assets/images/tips_icon.png'><span>"+num+"</span></div><!--tips div  End-->"
                +"<ul class=''>"
                +"<li><span class='content-title span-title'>策略名称</span>:<span class='content-title span-content' title="+campseg_names+">"+campseg_names+"</span></li>"
                +"<li><span class='content-title span-title'> 策略编码</span>:<span class='content-title span-content' title="+campseg_ids+">"+campseg_ids+"</span></li>"
                +"<li><span class='content-status-title'>状态：</span><span class='content-status-content'>"+campseg_stat_names+"</span></li>"
                +"</ul>"
                +"</div>"
                +"</div>"
                +"</a>"
        }
    }
    $("#campsegContent").html(campsegView);
    //触发轮播方法
    $campsegContent=$("#campsegContent > a");
    banner_length=$campsegContent.length;
    broadcastTimes=banner_length-5;//有5个页面展示

    //开启/关闭上下页按钮
    if(banner_length > 5){
        $("#btn-pref ,#btn-next").css({
            "display":" "
        });
    }else {
        $("#btn-pref ,#btn-next").css({
            "display":"none"
        });
    }
}


/**
 * 选择城市点击事件
 */
function cityResultCheckEventListener(){
    $("#city_li > img").click(function() {
        name="";
        result="";
        $(this).parents("li").nextAll().toggle();
        $(this).parents("li").nextAll().css("padding-left","3px");
    });

    $(".checkbox_li").click(function(){
        var name="";
        var result="";
        var channel_li_id=$(this).attr("id");
        name= $(this).attr("name");
        result=$(this).parents("li").siblings(".one_li").find("input");
        console.log("-----result:"+result.attr('id')+"-------");
        console.log("---------ResultCheck的li 的id:"+channel_li_id+"--------------");
        channelResult(name,result);
    })
}


/**
 * 渠道结果事件
 */
function channelResult(name,result){
    console.log("-----channelResult:开始！-------");
    var checkResult="";//获取选择的结果
    var channel_id="";//获取选择的结果的渠道id
    var str=document.getElementsByName(name);
    for(var i=0;i<str.length;i++){
        if(str[i].checked==true){
            checkResult += str[i].value+"/";
            channel_id += str[i].getAttribute("id")+"/";
        }
    }
    checkResult=checkResult.substring(0,checkResult.length-1);
    channel_id=channel_id.substring(0,channel_id.length-1);
    result.val(checkResult);//放入result的input
    result.attr("channel_id",channel_id);
    console.log("-----channelResult:结束！-------");
    console.log("-----channelResult:"+checkResult+"-------");
}




/**
 * 详细内容返回
 */
function addBackEventListener(){
    console.log("----详细内容返回-------");
    $("#header-content-back").click(function(){
        $(".popwin").hide();
        $(".poppage").hide();
    });
}

/**
 * 关闭弹窗页面
 */
function addCloseEventListener(){
    $("#close").click(function(){
        console.log("-----关闭弹窗页面----");
        $(".popwin").hide();
        $(".poppage").hide();
    });
}

/**
 * 保存内容事件
 * 1.先保存
 * 2.关闭弹窗
 * 3.初始化列表
 */
function addSaveEventListener(){
    $("#save-btn").click(function(){
        var btnBlu = $(this).attr("class");
        if(btnBlu == null || btnBlu == ""){
            alert("请先编辑再保存！");
        }else if(btnBlu == "btn-blu") {
            //获取内容状态值
            var typeId = $(".type_id span").attr("type_id");//类别
            var statusId = $("#online_status").val();//状态


            var save_Data = {
                "appId": app_id,
                "typeId": typeId,
                "statusId": statusId
            }
            console.log(statusId);
            //将数据传入后台保存
            $.ajax({
                url: contextPath + "/action/app/appManage/appSave.do",
                data: {
                    "saveData": save_Data
                },
                async: false,
                type: "POST",
                success: function (data) {
                    alert(data);
                    console.log("------保存内容事件-----");
                    $(".popwin").hide();
                    $(".poppage").hide();

                    //初始化视图数据
                    initTableViewData();
                    //初始化列表视图
                    initTableResultView(table_result);
                    //初始化页面选择视图
                    initSelectPageView(totalPage);
                },
                error: function () {
                    alert("保存失败！")
                }
            });
        }
    });

}


/**
 * 编辑内容事件
 */
function addEditEventListener(){
    $("#detail_img").click(function(){
        var plan_in_use = $("#detail_img").attr("plan_in_use");
        if(plan_in_use == 'true'){
            alert("该产品已在营销策略中使用，不允许进行编辑。");
        }else if(plan_in_use == 'false') {
            //开启内容编辑
            $("#online_status > .status").attr("disabled", false);
            //对保存按钮的处理
            $("#save-btn").addClass("btn-blu");
            //编辑图标的设定
            $("#detail_img").attr("src", "" + contextPath + "/assets/images/edit_icon_d.png");
            //对类型不可编辑做背景处理
            $("#online_status").css("background", "#fff");
        }
    });
}

/**
 * 轮播实现
 */
function addBannerEventListener(){
    console.log("------addBannerEventListener():开始！------");
    //获取内容块的个数
    var offWidth=0;
    //下一页
    $("#btn-next").click(function(){
        if(broadcastTimes >0 && banner_length>5){
            offWidth-=171;
            $campsegContent.eq(0).animate({
                marginLeft:offWidth+"px"
            });
            broadcastTimes=broadcastTimes-1;
        }else{
            alert("已经是最后一页！");
        }
    });

    //上一页
    $("#btn-pref").click(function(){
        if(broadcastTimes <banner_length-5 && banner_length>5){
            offWidth+=171;
            $campsegContent.eq(0).animate({
                marginLeft:offWidth+"px"
            });
            broadcastTimes=broadcastTimes+1;
        }else{
            alert("已经是第一页！");
        }
    });
}
