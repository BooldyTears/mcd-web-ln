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
            +" <select class='online_status' id='tr_"+content_id+"'>                                                                         "
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