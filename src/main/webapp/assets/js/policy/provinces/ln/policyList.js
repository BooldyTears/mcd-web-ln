/**
 * Created by john0723@outlook.com on 2016/9/28.
 */
//tableView列表视图
var tableView ={};

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
    addDetailPopWinEventListiener();
};


/**
 * 初始化视图数据：table_result，totalPage
 *                   列表数据    总页码数
 */
function initTableViewData() {
    $.ajax({
        url:contextPath+"/action/policy/policyManage/queryTableList.do",
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


/**
 * 初始化页面选择视图
 *
 * <option class="page-num" value="1">1</option>
 */
function initSelectPageView(totalPage){
    var pageView ="";//初始化页码视图
    //对页码选择视图处理
    if(totalPage>10){
        for(var i=1;i<10;i++){
            pageView+="<option class='page-num' value="+i+">"+i+"</option>";
        }
        pageView += "<option class='page-more' >......</option>";
        pageView += "<option class='page-num' value="+i+">"+totalPage+"</option>";
        $(".select-page-num").html(pageView);
    }else if(totalPage == 0){
        pageView += "<option class='page-num' value="+i+">"+1+"</option>";
    } else{
        for(var i=1;i<=totalPage;i++){
            pageView+="<option class='page-num' value="+i+">"+i+"</option>";
        }
        $(".select-page-num").html(pageView);
    }
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
        var plan_name = table_result[i].PLAN_NAME;
        var type_name= table_result[i].TYPE_NAME;
        var type_id=table_result[i].TYPE_ID;
        var plan_stardate = table_result[i].PLAN_STARTDATE;
        var plan_enddate = table_result[i].PLAN_ENDDATE;
        var plan_desc = table_result[i].PLAN_DESC;
        var plan_comment = table_result[i].PLAN_COMMENT;
        var manager = table_result[i].MANAGER;
        var online_status = table_result[i].ONLINE_STATUS;
        var status_name = table_result[i].STATUS_NAME;

        //描述数据空值处理
        if(plan_desc == null || plan_desc ==""){
            plan_desc="无";
        }
        //推荐语空值处理
        if(plan_comment == null || plan_comment ==""){
            plan_comment="无";
        }
        //产品经理空值处理
        if(manager == null || manager ==""){
            manager="无";
        }

        //状态选择视图作处理
        var statusSelectView="";
        if(online_status == 0){
            statusSelectView=""
                +" <option value='1' disabled>上线</option>                                                            "
                +" <option disabled value='0' selected>未上线</option>                                                          "
        }else if(online_status == 1){
            statusSelectView=""
                +" <option disabled value='1' selected>上线</option>                                                            "
                +" <option value='0' disabled>未上线</option>                                                          "
        }else if(online_status == 3 ){
            statusSelectView=""
                +"<option disabled value='3' selected>其它</option> "
                +" <option disabled value='1' >上线</option>                                                            "
                +" <option value='0' disabled>未上线</option>                                                          "
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
            +" <select class='online_status' id='tr_"+plan_id+"'>                                                                         "
            +statusSelectView
            +" </select>                                                                        "
            +" <span>                                                                           "
            +" <a href='javascript:;' class='detail_a'>详情</a></span>                                           "
            +" </span>                                                                          "
            +" </td>                                                                            "
            +" </tr>		                                                                        "
    }
    $(".cust-table tbody").html(tableView);
    addDetailPopWinEventListiener();

}


/**
 * 详细内容弹窗
 * 1.弹窗开启
 * 2.初始化弹窗内容
 */
function addDetailPopWinEventListiener(){
    $(".detail_a").click(function(){
        plan_id="";//产品id
        dom_tr ="";//列表tr
        dom_tr=$(this).parents("tr");
        plan_id =dom_tr .attr("plan_id");
        $(".popwin").show();
        $(".poppage").show();
        //初始化详细内容视图
        detailView.initView();
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

