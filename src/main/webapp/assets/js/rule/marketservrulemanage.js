var marketservrulemanageInfo = {};
/**
 * 列表初始化加载 
 */
var tableView ={};//tableView列表视图
/**
* 初始化视图数据
*/
tableView.initTableViewData = function(){
    $.ajax({
      url:contextPath+"/action/rule/ruleManage/queryBusinessRule.do",
      data:{},
      async:false,
      type:"POST",
      success:function(data) {
          if (!data) { return;}
          var ejsUrlList=contextPath+"/assets/js/rule/marketservrulemanage.ejs";
  		  var materialListHtml = new EJS({url:ejsUrlList}).render({data:data});
  		  $(".J_tableWrp").html(materialListHtml);
  		  marketservrulemanageInfo.startOrEndClickEvent();//启动或停止操作
      },
      error: function(){
	    	alert("加载数据时发生异常，请尝试刷新页面！");
	    	return;
	}
  });
};
/**
 *启动或停止
 */
marketservrulemanageInfo.startOrEndClickEvent = function(){
    $('.J_startOrEnd').click(function(){
        var id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        status = status == "1" ? 0 : 1;
        var ajaxData = {"id":id,"status":status};
        marketservrulemanageInfo.startOrEndAjax(ajaxData);
    });
};
/**
* 启动或停止的ajax
*/
marketservrulemanageInfo.startOrEndAjax = function(ajaxData){
    $.ajax({
      url:contextPath+"/action/rule/ruleManage/updateBusinessRule.do",
      data:ajaxData,
      async:false,
      type:"POST",
      success:function(data) {
          if(data.status == '200'){
        	  tableView.initTableViewData();//刷新列表
          }else{
        	  alert(data.message);
          }
      },
      error: function(){
	    	alert("操作发生异常，请尝试刷新页面！");
	    	return;
	 }
  });
};
$(document).ready(function(){
	tableView.initTableViewData();//初始化列表数据
});