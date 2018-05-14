<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String contextPath=request.getContextPath().toString();
	String provinces=application.getAttribute("APP_PROVINCES").toString();
%>


<link rel="stylesheet" type="text/css" href="<%=contextPath%>/assets/css/bootstrap/multiselect/jquery.multiselect.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/assets/css/bootstrap/multiselect/jquery.multiselect.filter.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/assets/css/provinces/<%=provinces%>/plan/plan_detail.css"><!-- 产品样式 -->

<script type="text/javascript" src="<%=contextPath%>/assets/js/lib/bootstrap.min.js"></script>	
<script type="text/javascript" src="<%=contextPath%>/assets/js/lib/DateUtil.js"></script>
<script type="text/javascript" src="<%=contextPath%>/assets/js/lib-ext/my97/WdatePicker.js"></script>
<script type="text/javascript" src="<%=contextPath%>/assets/js/lib-ext/jquery.multiselect.js"></script>
<%--主JS--%>
<script type="text/javascript">
	 seajs.use("plan/provinces/<%=provinces%>/planmanage_extends.js",function(planmanage_extends){
	    planmanage_extends.init();
	 });
</script>

<!-- 搜索+选策略 -->
<div class="myCustomQuery">
    <div class="search-box-container">
        <span class="search-title fleft">产品库</span>
        <div id="search_all" class="content-type-search-box fright show">
            <p class="fleft">
                <input type="text" name="search" class="keyWords"  placeholder="请输入产品编码或产品名称">
            </p><p>
            <i id="searchButton_all" class="searchBtn fright btn-blu">
               <%-- <img src="<%=contextPath%>/assets/images/search_icon.png"> --%>
            </i>
        </p></div>
    </div><!--search end-->

    <div class="select-item-wrp ft12">
        <div class="item-box">
            <span class="fleft ">状态：</span>
            <div id="divDimPlanTypes" class="fleft color-666 select-right">

            </div>
        </div>
        <div class="item-box">
            <span class="fleft ">类别：</span>
            <div id="divDimPlanSrvType" class="fleft color-666 select-right">

            </div>
        </div>
        <div class="item-box" style="margin-left:92%;margin-bottom: 0px;">
            <button type="button" id="savePlan" class="btn-a btn-a-blue" style="width:80px;height:30px;">新建</button>
        </div>
    </div><!--select end-->

</div><!--myCustomQuery end-->


<!--内容table-->
<div class="container customManageContainer">
    <div class="content">
        <div id="customManageTabCT" class="content-main">
            <div class="box active">
                <div class="content-table">
                    <div id="customTable_all" class="content-table-box customManageTable">
                        <div class="container-table">
                            <table class="table-content table-striped table-hover cust-table">
                                <thead>
                                <tr class="active">
                                    <th ><span style="width:30px;" >序号</span></th>
                                    <th ><span style="width:97px;">单产品编码</span></th>
                                    <th ><span style="width:160px;">单产品名称</span></th>
                                    <th ><span style="width:65px;">类别</span></th>
                                    <th ><span style="width:130px;">生效时间</span></th>
                                    <th ><span style="width:130px;">失效时间</span></th>
                                    <th ><span style="width:90px;">描述</span></th>
                                    <th ><span style="width:90px;">推荐语</span></th>
                                    <th ><span style="width:60px;">产品经理</span></th>
                                    <th><span style="width:100px;">操作</span></th>
                                </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div><!--container-table end-->

                       <div class="content-table-page">
                             <div class="content-table-page">
                                 <div class="fright clearfix centent-page-box divPlansPage" >
                                 </div>
                             </div>
                        </div><!--content-table-page end-->
                    </div>
                </div><!-- content-table end -->
            </div><!--box end -->

            <div class="box">
                <div class="content-table">
                    <div id="customTable_mine" class="content-table-box customManageTable"></div>
                </div><!-- content-table end -->
            </div><!--box end -->

            <div class="box">
                <div class="content-table">
                    <div id="customTable_abnormal" class="content-table-box customManageTable"></div>
                </div><!-- content-table end -->
            </div><!--box end -->
        </div>
    </div>
</div><!--container End-->

<!-- 产品详情弹出窗 -->
<div id="planDetailContainer"></div>
<!-- 产品新增弹出窗 -->
<div id="planEditContainer"></div>