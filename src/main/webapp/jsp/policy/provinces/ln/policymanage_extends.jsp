<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%
	       String contextPath=request.getContextPath().toString();
	       String provinces=application.getAttribute("APP_PROVINCES").toString();
	    %>
<!--搜索+选策略-->
<div class="myCustomQuery">
    <div class="search-box-container">
        <span class="search-title fleft">政策库</span>
        <div id="search_all" class="content-type-search-box fright show">
            <p class="fleft">
                <input type="text" name="search" class="keyWords"  placeholder="请输入政策编码或政策名称">
            </p><p>
            <i id="searchButton_all" class="searchBtn fright btn-blu">
              <%--  <img src="<%=contextPath%>/assets/images/search_icon.png"> --%>
            </i>
        </p></div>
    </div><!--search end-->

    <div class="select-item-wrp ft12">
        <div class="item-box">
            <span class="fleft select-left">状态：</span>
            <div id="divDimPlanTypes" class="fleft color-666 select-right">

            </div>
        </div>
        <div class="item-box">
            <span class="fleft select-left">类别：</span>
            <div id="divDimPlanSrvType" class="fleft color-666 select-right">

            </div>
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
                                    <th ><span style="width:97px;">政策编码</span></th>
                                    <th ><span style="width:160px;">政策名称</span></th>
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
                                     <div class="fright clearfix centent-page-box divPlansPage" >
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













<!-- 弹出窗的背景 -->
<div class="popwin"  style="display: none">
    <div class="poppage " id="poppage" style="display: none">
        <div class="pop-page-header">
            <div class="pop-page-header-content">
                <div class="header-content-left">
                    <span id="header-content-detail">详情</span>
                    <span><img src="<%=contextPath%>/assets/images/edit_icon_u.png" id="detail_img"></span>
                    <span id="header-content-back"> < 返回 </span>
                </div>
                <div class="header-content-right">
                    <span id="close"> X </span>
                </div>
            </div><!--pop-page-header-content end-->
        </div><!--pop-page-header end-->

        <div class="pop-page-content">
            <div class="pop-page-content-top">
                <div class="pop-page-content-top-div">
                    <div class="input-div">
                        <label>政策编码：</label>
                        <input type="text" class="min-input min-input-min-width " id="plan_id" disabled>
                    </div>

                    <div class="input-div">
                        <label>生效时间：</label>
                        <input type="text" class="min-input min-input-min-width" id="plan_stardate" disabled>
                    </div>

                    <div class="input-div">
                        <label>适用渠道：</label>
                        <ul class="more_select" id="channel">
                             <li class="one_li"><input type="text" class="channel_input"><img src="<%=contextPath%>/assets/images/select.png"></li>
                             <li value="" style="display:none" class="checkbox_li"><input type="checkbox">1</li>
                             <li value="" style="display:none" class="checkbox_li"><input type="checkbox">1</li>
                        </ul>
                    </div>
                </div><!--1 end-->
                <div class="pop-page-content-top-div">
                    <div class="input-div">
                        <label>政策名称：</label>
                        <input type="text" class="min-input min-input-min-width" id="plan_name" disabled>
                    </div>
                    <div class="input-div">
                        <label>失效时间：</label>
                        <input type="text" class="min-input min-input-min-width" id="plan_enddate" disabled>
                    </div>
                    <div class="input-div">
                        <label>适用地市：</label>
                         <ul class="more_select" id="city">

                         </ul>
                    </div>
                </div><!--2 end-->
                <div class="pop-page-content-top-div " id="last">
                    <div class="input-div">
                        <label>类别：</label>
                        <select name="" id="type_name" class="min-input ">

                        </select>
                    </div>
                    <div class="input-div">
                        <label>状态：</label>
                        <select name="" id="online_status" class="min-input " >

                        </select>
                    </div>
                    <div class="input-div">
                        <label>产品经理：</label>
                        <input type="text" id="manager" class="min-input min-input-min-width" disabled>
                    </div>
                </div><!--3 end-->
            </div><!--pop-page-content-top end-->

            <div class="pop-page-content-center">
                <div class="pop-page-content-center-top">
                    <div class="pop-page-content-center-top-div">
                        <div class="input-div">
                            <label for="">描述：</label>
                            <input type="text" class="min-input min-input-lg-width"  id="plan_desc"  disabled>
                        </div>
                        <div class="input-div">
                            <label for="">推荐语：</label>
                            <input type="text" class="min-input min-input-lg-width" id="plan_comment" disabled>
                        </div>
                    </div>
                </div><!--pop-page-content-center-top  End-->

                <div class="pop-page-content-center-center">
                    <div class="pop-page-content-center-center-div">
                        <div class="input-div">
                            <label for="">10086短厅办理代码：</label>
                            <input type="text" class="min-input" id="deal_code_10086" disabled>
                        </div>
                        <div class="input-div">
                            <label for="" >1008611短厅办理代码：</label>
                            <input type="text" class="min-input" id="deal_code_1008611" disabled>
                        </div>
                    </div>
                    <div class="pop-page-content-center-center-div">
                        <div class="input-div">
                            <label for="">办理链接地址(安卓)：</label>
                            <input type="text" class="min-input" id="url_for_android" disabled>
                        </div>
                        <div class="input-div">
                            <label for="">办理链接地址(苹果)：</label>
                            <input type="text" class="min-input" id="url_for_ios" disabled>
                        </div>
                    </div>
                    <div class="pop-page-content-center-center-div" id="pop-page-content-center-center-div-last">
                        <div class="input-div">
                            <label for="">营业侧产品归属业务类型：</label>
                            <select name="" id="plan_busi_type" class="min-input">

                            </select>
                        </div>
                        <div class="input-div">
                            <label for="">归属业务子类代码：</label>
                            <input type="text" class="min-input" disabled id="plan_busi_type_subcode">
                        </div>
                    </div>
                </div><!--pop-page-content-center-center  End-->

                <div class="pop-page-content-center-foot">
                    <div class="container-fluid">
                        <div class="pop-page-content-center-foot-btn ">
                            <span class="active choseScore">员工积分</span>
                            <span class="choseAward">酬金</span>
                        </div><!--pop-page-content-center-foot-btn(span)  End-->

                        <table class="table table-striped table-bordered">
                            <tbody>
                            <tr id="city_name">

                            </tr>
                            <tr id="score">

                            </tr>
                            <tr id="award" style="display:none">

                            </tr>
                            </tbody>
                        </table><!--table  End-->

                        <div class="pop-page-content-center-foot-btn">
                            <div class="btn-div">
                                <button type="button" class="btn-blu" id="save-btn" >保存</button>
                            </div>

                        </div>
                    </div>
                </div><!--pop-page-content-center-foot  End-->
            </div><!--pop-page-content-center-->

            <div class="container-fluid pop-page-content-foot ">
                <div class=" pop-page-content-foot-content">
                    <div class="pop-page-content-foot-btn-div btn-pref"> <span id="btn-pref"> < </span></div>
                    <div class="pop-page-content-foot-content-div">
                        <div class="pop-page-content-foot-content-div-list">
                           <div class="pop-page-content-foot-content-div-list-div" id="campsegContent">

                           </div>
                        </div>
                    </div>
                    <div class="pop-page-content-foot-btn-div btn-next"> <span id="btn-next"> > </span></div>
                </div><!--pop-page-content-foot-content  End-->
            </div><!--pop-page-content-foot-->
        </div>
    </div><!-- poppage end -->
</div><!--popwin end-->

<%--主JS--%>
    <script type="text/javascript">
        seajs.use("policy/provinces/<%=provinces%>/policymanage_extends.js",function(policymanage_extends){
        policymanage_extends.init();
        });
    </script>
