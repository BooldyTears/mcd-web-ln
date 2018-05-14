<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String contextPath = request.getContextPath().toString();
	String provinces = application.getAttribute("APP_PROVINCES").toString();
%>
<!-- 弹出窗的背景 -->
<div class="popwin"  style="display: ">
     <div class="head">
         <div class="pop-page-header">
             <div class="pop-page-header-content">
                 <div class="header-content-left">
                     <span id="header-content-detail">详情</span>
                    <%--  <span><img src="<%=contextPath%>/assets/images/edit_icon_u.png" id="detail_img"></span> --%>
                     <!-- <span id="header-content-back"> < 返回 </span> -->
                 </div>
                 <div class="header-content-right">
                     <!-- <span id="close"> X </span> -->
                 </div>
             </div><!--pop-page-header-content end-->
         </div><!--pop-page-header end-->
     </div>
     <div class="main">
       <div class="poppage " id="poppage" style="display: ">
        <div class="pop-page-content">
            <div class="pop-page-content-top">
                <div class="pop-page-content-top-div">
                    <div class="input-div">
                        <label>单产品编码：</label>
                        <input type="text" class="min-input min-input-min-width " id="plan_id" disabled>
                    </div>

                    <div class="input-div">
                        <label>生效时间：</label>
                        <input type="text" class="min-input min-input-min-width" id="plan_stardate" disabled>
                    </div>
                </div><!--1 end-->
                <div class="pop-page-content-top-div">
                    <div class="input-div">
                        <label>单产品名称：</label>
                        <input type="text" class="min-input min-input-min-width" id="plan_name" disabled>
                    </div>
                    <div class="input-div">
                        <label>失效时间：</label>
                        <input type="text" class="min-input min-input-min-width" id="plan_enddate" disabled>
                    </div>
                    
                </div><!--2 end-->
                <div class="pop-page-content-top-div " id="last">
                    <div class="input-div">
                        <label>类别：</label>
                        <select name="" id="type_name" class="min-input ">

                        </select>
                    </div>
                    <div class="input-div">
                        <label>适用地市：</label>
                        <ul class="more_select" id="city">

                        </ul>
                    </div>
                    <div class="input-div" style="display:none">
                        <label>状态：</label>
                        <select name="" id="online_status" class="min-input " >

                        </select>
                    </div>
                    <div class="input-div" style="display:none">
                        <label>产品经理：</label>
                        <input type="text" id="manager" class="min-input min-input-min-width" disabled>
                    </div>
                </div><!--3 end-->
                
                 <div class="pop-page-content-top-div " id="last">
                       <div class="input-div" >
                        <label>适用渠道：</label>
                        <ul class="more_select" id="channel">
                            <li class="one_li"><input type="text" class="channel_input"><img src="<%=contextPath%>/assets/images/select.png"></li>
                            <li value="" style="display:none" class="checkbox_li"><input type="checkbox">1</li>
                            <li value="" style="display:none" class="checkbox_li"><input type="checkbox">1</li>
                        </ul>
                    </div>
                </div><!--4 end-->
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

                <div class="pop-page-content-center-center" style="display:none">
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

                <div class="pop-page-content-center-foot" style="display:none">
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
                                <button type="button" class="btn-blu" id="save-btn" style="display:none"  >保存</button>
                            </div>

                        </div>
                    </div>
                </div><!--pop-page-content-center-foot  End-->
            </div><!--pop-page-content-center-->
                <br>
                <br>
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
     
     </div>
    
</div><!--popwin end-->
     <%--主JS--%>
     <script type="text/javascript">
         seajs.use("plan/provinces/<%=provinces%>/planmanage_extends_detail.js",function(planmanage_extends_detail){
         planmanage_extends_detail.init();
         });
     </script>