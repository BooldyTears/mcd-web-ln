<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
		<%
	      String contextPath=request.getContextPath().toString();
	      String provinces=application.getAttribute("APP_PROVINCES").toString();
	   %>
    <!--搜索+选策略-->
    <div class="myCustomQuery">
	    <div class="search-box-container">
		    <span class="search-title fleft">应用库</span>
		    <div id="search_all" class="content-type-search-box fright show">
			    <p class="fleft">
			    	<input type="text" name="search" class="keyWords"  placeholder="请输入内容名称">
			    </p>
			    <p>
			    	<i id="searchButton_all" class="searchBtn fright btn-blu">
			    	<%--  <img src="<%=contextPath%>/assets/images/search/search_icon.png"> --%>
			    </i>
			    </p>
		    </div>
	    </div><!--search end-->
	
	    <div class="select-item-wrp ft12">
		    <div class="item-box">
			    <span class="fleft select-left">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</span>
			    <div id="divDimContentTypes" class="fleft color-666 select-right">
			
			    </div>
		    </div>
		    <div class="item-box">
			    <span class="fleft select-left">发布时间：</span>
			    <div id="divTimeType" class="fleft color-666 select-right">
			
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
						    <div class="content-table-page">
						    	<%--<div class="fright clearfix centent-page-box divPlansPage" >--%>
						    	<%--</div>--%>
						    </div>
						
						    <div class="container-table">
							    <table class="table-content table-striped table-hover cust-table">
								    <thead>
									    <tr class="active">
										    <th ><span style="width:30px;" >序号</span></th>
										    <th ><span style="width:97px;">应用编码</span></th>
										    <th ><span style="width:130px;">应用名称(标题)</span></th>
										    <th ><span style="width:65px;">类别</span></th>
										    <th ><span style="width:60px;">类型</span></th>
										    <th ><span style="width:130px;">来源</span></th>
										    <th ><span style="width:90px;">生效时间</span></th>
										    <th ><span style="width:90px;">失效时间</span></th>
										    <th ><span style="width:82px;">单价(元/次)</span></th>
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


    <!-- 弹出窗的背景 -->
    <div class="popwin"  style="display: none">
	    <div class="poppage " id="poppage" style="display: none">
		    <div class="pop-page-header">
			    <div class="pop-page-header-content">
				    <div class="header-content-left">
					    <span id="header-content-detail">详情</span>
					    <span><img src="<%=contextPath%>/assets/images/edit_icon_u.png" id="detail_img" title="编辑"></span>
					    <span id="header-content-back"> < 返回 </span>
				    </div>
			    <div class="header-content-right">
			    	<span id="close" title="关闭"> X </span>
			    </div>
			    </div><!--pop-page-header-content end-->
		    </div><!--pop-page-header end-->
	
	    <div class="pop-page-content">
		    <div class="pop-page-content-top">
			    <div class="pop-page-content-top-div">
				    <div class="input-div">
				    	<label>应用编码：</label>
				    	<input type="text" class="min-input min-input-min-width " id="content_id" disabled>
				    </div>
			
			    <div class="input-div">
			    	<label>类型：</label>
			    	<input type="text" class="min-input min-input-min-width" id="content_class" disabled>
			    </div>
			
			    <div class="input-div">
			   	 	<label>应用三级分类：</label>
			    	<input type="text" class="min-input min-input-min-width" id="content_class3" disabled>
			    </div>
			
			    <div class="input-div">
			    	<label>发布时间：</label>
			    	<input type="text" class="min-input min-input-min-width" id="pub_time" disabled>
			    </div>
			
			    <div class="input-div">
			    	<label>URL长链接：</label>
			    	<input type="text" class="min-input min-input-min-width" id="content_url" disabled>
			    </div>
			
			    <div class="input-div">
			        <label>适用地市：</label>
			        <ul class="more_select" id="city">
			
			        </ul>
			    </div>
			    </div><!--1 end-->
			    <div class="pop-page-content-top-div">
				    <div class="input-div">
				    	<label>应用名称：</label>
				    	<input type="text" class="min-input min-input-min-width" id="content_name" disabled>
				    </div>
				    <div class="input-div">
				    	<label>内容一级分类：</label>
				    	<input type="text" class="min-input min-input-min-width" id="content_class1" disabled>
				    </div>
				    <div class="input-div">
				    	<label>内容四级分类：</label>
				    	<input type="text" class="min-input min-input-min-width" id="content_class4" disabled>
				    </div>
				    <div class="input-div">
				    	<label>失效时间：</label>
				    	<input type="text" class="min-input min-input-min-width" id="invalid_time" disabled>
				    </div>
				    <div class="input-div">
				    	<label>来源：</label>
				    	<input type="text" class="min-input min-input-min-width" id="content_source" disabled>
				    </div>
				    <div class="input-div">
				    	<label>状态：</label>
				    	<select name="" id="online_status" class="min-input " >
				
				    </select>
				    </div>
			    </div><!--2 end-->
			    <div class="pop-page-content-top-div " id="last">
				    <div class="input-div">
				    	<label>类别：</label>
				    	<input type="text" id="type_name" class="min-input min-input-min-width" disabled>
				    </div>
				    <div class="input-div">
				    	<label>内容二级分类：</label>
				    	<input type="text" class="min-input min-input-min-width" id="content_class2" disabled>
				    </div>
				    <div class="input-div">
				    	<label>单价(元/次)：</label>
				    	<input type="text" id="unit_price" class="min-input min-input-min-width" disabled>
				    </div>
				    <div class="input-div">
				    	<label>酬金(元)：</label>
				    	<input type="text" id="award_mount" class="min-input min-input-min-width" disabled>
				    </div>
				    <div class="input-div">
				    	<label>产品经理：</label>
				    	<input type="text" id="manager" class="min-input min-input-min-width" disabled>
				    </div>
				    	<div class="input-div">
				    	<label></label>
				    </div>
			    </div><!--3 end-->
		    </div><!--pop-page-content-top end-->
		
		    <div class="pop-page-content-center">
			    <div class="pop-page-content-center-top">
				    <div class="pop-page-content-center-top-div">
					    <div class="input-div">
					    	<label for="">摘要：</label>
					    	<input type="text" class="min-input min-input-lg-width"  id="content_remark"  disabled>
					    </div>
				    </div>
			    </div><!--pop-page-content-center-top  End-->
			    <div class="pop-page-content-center-foot">
				    <div class="container-fluid">
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
		seajs.use("app/provinces/<%=provinces%>/appmanage_extends.js",function(appmanage_extends){
	     appmanage_extends.init();
		});
	</script>