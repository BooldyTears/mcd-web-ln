/**
 * Created by john0723@outlook.com on 2016/9/28.
 */


//chooseView选择视图对像
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
        url:contextPath+"/action/policy/policyManage/queryPlanTypes.do",
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
         pageNum=1;
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
        pageNum=1;
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
