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
