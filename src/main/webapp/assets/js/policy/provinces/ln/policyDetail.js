/**
 *
 * Created by john0723@outlook.com on 2016/10/08.
 */
var detailView={};//详情内容对象
/**初始化视图*/
var planId = "";
detailView.initView=function(){
       planId = "";
       planId = plan_id;
	 console.log("-----初始化详细内容视图成功-----");
	    //初始化json数据
	    getDetailViewResult(planId);
	    //初始化详细主体视图
	    initDetailsView();
	    //初始化详细内容适合渠道视图
	    initDetailChannelView();
	    //初始化详细内容适合城市
	    initDetailCityView();
	    //初始化酬金和积分视图
	    initAwardScoreView();
	    //初始化策略视图
	    initCampsegView();

        //编辑图标的设定
        $("#detail_img").attr("src",""+contextPath+"/assets/images/edit_icon_u.png");
        //关闭内容编辑
        $("#type_name > option,#online_status > option,.checkbox_li,#manager,#plan_comment").attr("disabled",true);
        $("#deal_code_10086,#deal_code_1008611,#url_for_android,#url_for_ios").attr("disabled",true);
        $(".award,.award > input,.score,.score > input").attr("disabled",true);
        //对酬金积分不可编辑做背景处理
        $(".award,.award > input,.score,.score > input").css("background","#EBEBE4");
        //对类型不可编辑做背景处理
        $("#type_name,#online_status,#plan_busi_type,#channel_li,#city_li").css("background","#EBEBE4");
        //对保存按钮的处理
        $("#save-btn").removeClass("btn-blu");
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
    addSaveEventListener(plan_id);
    //绑定酬金和积分视图
    addAwardScoreChooseEventListener();

};

/**
 * 初始化json数据
 * @param planId
 */
var detailData = "";//json对象
function getDetailViewResult(planId){
    detailData = "";//初始化json对象
    $.ajax({
        url:contextPath+"/action/policy/policyManage/queryDetail.do",
        async:false,
        type:"POST",
        data:{
            "planId":planId
        },
        success:function(data){
            if(data == null){return;}
            detailData=data;
        },
        error:function(){alert("数据获取失败！");}
    });
}



/**
 * 初始化详细主体视图
 */
function initDetailsView(){
	var details = detailData.queryDefExt[0];//详细主体数据对象
    //获取详细主体数据
    var plan_id = details.PLAN_ID;  
    var plan_name = details.PLAN_NAME;
    var type_name = details.TYPE_NAME;
    var curtype_id = details.TYPE_ID;
    var curplan_status = details.PLAN_STATUS;
    var plan_startdate = details.PLAN_STARTDATE;
    var plan_enddate = details.PLAN_ENDDATE;
    var plan_desc = details.PLAN_DESC;
    var plan_comment = details.PLAN_COMMENT;
    var manager  = details.MANAGER;
    var curonline_status = details.ONLINE_STATUS;
    var curstatus_name = details.STATUS_NAME;
    var city_id = details.CITY_ID;
    var city_name = details.CITY_NAME;
    var plan_busi_type_subcode = details.PLAN_BUSI_TYPE_SUBCODE;
    var deal_code_10086 = details.DEAL_CODE_10086;
    var deal_code_1008611 = details.DEAL_CODE_1008611;
    var url_for_android = details.URL_FOR_ANDROID;
    var url_for_ios = details.URL_FOR_IOS;

    var planInUse = detailData.planInUse;//判断该产品是否正在被使用
    var planTypes = detailData.planTypes;//类型数据对象 【数组】
    var planStatus = detailData.planStatus;//状态数据对象 【数组】
    var planBusiType = detailData.planBusiType;//营业侧 【数组】

    //给编辑图标添加产品是否正在被使用标签：
    $("#detail_img").attr("plan_in_use",planInUse);

    //初始化详细主体内容视图
    $("#plan_id").val(plan_id);//单产品编码
    $("#plan_name").val(plan_name);//单产品名称
    $("#plan_stardate").val(plan_startdate);//生效时间
    $("#plan_enddate").val(plan_enddate);//失效时间
    $("#plan_desc").val(plan_desc);//单产品描述
    $("#plan_comment").val(plan_comment);//推荐语
    $("#manager").val(manager);//项目经理

    //类型选择视图
    var planView = "<option disabled value='' >全部</option>";
    for(var i=0;i<planTypes.length;i++){  //类型select
        var type_id = planTypes[i].typeId;
        var type_name = planTypes[i].typeName;
        planView += "<option disabled  value="+type_id+" id='"+type_id+"' >"+type_name+"</option>";
    }
    $("#type_name").html(planView);

    //状态选择视图
    var statusView = "";//状态视图
    if(curonline_status == 3){
        statusView= "<option value="+curonline_status+" disabled>"+curstatus_name+"</option>";
        for(var i=0;i<planStatus.length;i++){
            var status_id = planStatus[i].statusId;
            var status_name = planStatus[i].statusName;
            statusView += "<option value="+status_id+" class='status' disabled>"+status_name+"</option>";
        }
    }else{
        for(var i=0;i<planStatus.length;i++){
            var status_id = planStatus[i].statusId;
            var status_name = planStatus[i].statusName;
            statusView += "<option value="+status_id+" class='status' disabled>"+status_name+"</option>";
        }
    }
    $('#online_status').html(statusView);//动态替换状态视图的数据


    //默认状态/类型选择选择结果
    $("#type_name").val(curtype_id);//当前类型
    $("#online_status").val(curonline_status);//当前状态


    //10086、1008611......
    var type_name="";
    var plan_busi_type="";
   if(details == null){
       type_name="无";
       plan_busi_type='0';
       plan_busi_type_subcode="无";
       deal_code_10086="无";
       deal_code_1008611="无";
       url_for_android="无";
       url_for_ios="无";
   }else{//用于判断是否有值
       if(planBusiType.length == 0){
           type_name ='无';
           plan_busi_type = '0';
       }else{
           for(var i=0;i<planBusiType.length;i++){
               type_name+=planBusiType[i].TYPE_NAME;
               plan_busi_type+=planBusiType[i].PLAN_BUSI_TYPE;
           }
       }
   }

    //装入10086、1008611......数据
    $("#deal_code_10086").val(deal_code_10086);
    $("#deal_code_1008611").val(deal_code_1008611);
    $("#url_for_android").val(url_for_android);
    $("#url_for_ios").val(url_for_ios);
    $("#plan_busi_type_subcode").val(plan_busi_type_subcode);

    var planBusiTypeView="";//营业侧产品归属业务类型视图
    //对营业侧产品归属业务类型视图进行装载
    if(type_name == null || type_name == '无' ){
        planBusiTypeView="<option value='0' disabled>无</option>";
    }else{
        for(var i=0;i<planBusiType.length;i++){
            planBusiTypeView+="<option value="+planBusiType[i].PLAN_BUSI_TYPE+" disabled>"+planBusiType[i].TYPE_NAME+"</option>";
        }
    }
    $("#plan_busi_type").html(planBusiTypeView);

    //营业侧产品归属业务类型进行默认展示处理
    if(plan_busi_type == null || plan_busi_type == '0'){
        $("#plan_busi_type").val('0');
    }else{
        $("#plan_busi_type").val(planBusiType[0].PLAN_BUSI_TYPE);//默认展示第一个
    }
}


/**
 * 初始化详细内容适合渠道视图
 */
function initDetailChannelView(){
    var channel = detailData.channel;//渠道的json数据对象
    var channelView="";
    if(channel.length == 0){
        channelView=" <li class='one_li' id='channel_li'><input type='text' class='channel_input' id='channel_result' value='无' disabled channel_id=''><img src='"+contextPath+"/assets/images/select.png'></li>";
        $("#channel").html(channelView);
    }else{
        channelView="<li class='one_li' id='channel_li'><input type='text' class='channel_input' id='channel_result' disabled channel_id=''><img src='"+contextPath+"/assets/images/select.png'></li>";
        for(var i=0;i<channel.length;i++){
            var channel_id = channel[i].CHANNEL_ID;
            var channel_name = channel[i].CHANNEL_NAME;
            var channel_plan_id = channel[i].PLAN_ID;
            //console.log("-----channel_plan_id 循环:"+channel_plan_id+"--------");

            //对已有的进行默认勾选
            if(channel_plan_id == null || channel_plan_id == " " ){
                channelView+="<li value='' style='display:none' ><input type='checkbox' disabled  plan_id='0' class='checkbox_li' id="+channel_id+" name='channel' value="+channel_name+">"+channel_name+"</li>";
            }else{
                channelView+="<li value='' style='display:none' ><input    type='checkbox' disabled checked   class='checkbox_li' id="+channel_id+" name='channel' value="+channel_name+" plan_id='"+channel_plan_id+"'>"+channel_name+"</li>";
            }
            $("#"+channel_id).attr("checked","checked");
        }
        $("#channel").html(channelView);

        var channel_li_name="channel";//获取选择li
        var channel_check_result = $("#channel_result");//结果的input标签
        //渠道结果事件
        channelResult(channel_li_name,channel_check_result);
    }
    channelResultCheckEventListener();
    console.log("-----channelView:"+channelView+"-------");
}


/**
 * 初始化详细内容适合城市
 */
function initDetailCityView(){
    var city_id = detailData.queryDefExt[0].CITY_ID;
    var city_name = detailData.queryDefExt[0].CITY_NAME;
    var cityView="";
    if(city.length == 0){
        cityView="<li class='one_li' id='city_li'><input type='text'  class='channel_input' id='city_result' value='无' disabled><img src='"+contextPath+"/assets/images/select.png'></li>";
        $("#city").html(cityView);
    }else{
        cityView="<li class='one_li' id='city_li'><input type='text' class='channel_input' id='city_result' disabled><img src='"+contextPath+"/assets/images/select.png'></li>";

        cityView+="<li value='' style='display:none' ><input type='checkbox' checked disabled plan_id='' class='checkbox_li' id="+city_id+" name='city' value="+city_name+">"+city_name+"</li>";

        $("#city").html(cityView);

        var city_li_name="city";//获取选择li
        var city_check_result = $("#city_result");//结果的input标签
        //渠道结果事件
        channelResult(city_li_name,city_check_result);
        //渠道选择的监听事件
    }
    cityResultCheckEventListener();
    console.log("-----cityView:"+cityView+"-------");
}


/**
 * 初始化酬金和积分视图
 */
var awardScoreView="";
var awardResult="";//酬金数据
var scoreResult="";//积分数据
var cityResult="";//匹配的城市的数据
var awardView="<td>酬金</td>";
var scoreView="<td>积分</td>";
function initAwardScoreView(){
    var award_score = detailData.awardScore;//酬金、积分json数据对象 【数组】
    var city_id ="";//城市id
    var city_name = "";//城市名称
    var award = "";//酬金
    var score = "";//积分

    console.log("---awardScoreView开始！----");
    var cityNameView="<td >地市</td>";
    awardScoreView="";
    awardResult="";//酬金数据
    scoreResult="";//积分数据
    cityResult= "";//匹配的城市数据
    awardView="<td style='background: #fff;'>酬金</td>";
    scoreView="<td style='background: #fff;'>积分</td>";
    for(var i=0;i<award_score.length;i++){
         city_id = award_score[i].CITY_ID;
         city_name = award_score[i].CITY_NAME;
         award = award_score[i].AWARD;
         score = award_score[i].SCORE;

        //为空处理
        if(award == "" || award== null ){
            award='0.00';
        }
        if(score == "" || score == null){
            score='0.00';
        }

        //画城市、积分、酬金视图
        cityResult+=city_id+"/";
        scoreResult+=score+"/";
        awardResult+=award+"/";

        cityNameView+="<td >"+city_name+"</td>";
        scoreView+=""
            +"<td class='score'>"
            +"<input type='text' disabled class="+city_id+" value="+score+" >"
            +"</td>";
        awardView+=""
            +"<td class='award'>"
            +"<input type='text' disabled class="+city_id+" value="+award+" >"
            +"</td>";
    }
    console.log("----awardView:"+awardView+"----");
    console.log("----scoreView:"+scoreView+"----");
    $("#city_name").html(cityNameView);
    awardScoreView=scoreView;
    //初始化酬金和积分视图
    initAwardScoreChooseView(scoreView,awardView);
}


/**
 * 初始化awardScoreView
 * @param awardScoreView
 */
function initAwardScoreChooseView(scoreView,awardView){
    $("#score").html(scoreView);
    $("#award").html(awardView);
};


/**
 * 初始化策略视图
 */
var $campsegContent ="";//策略div对象
var banner_length ="";//轮播的长度
var broadcastTimes = "";//次数标签
function initCampsegView(){
    var campseg=detailData.campseg;//策略json数据对象 【数组】
    console.log("-----campsegView开始！------");
    console.log("-----campseg.length:"+campseg.length+"------");
    var campsegView="";
    if(campseg.length == null){
        campsegView="";
    }else{
        for(var i=0;i<campseg.length;i++){
            var campseg_ids = campseg[i].CAMPSEG_ID;
            var campseg_names = campseg[i].CAMPSEG_NAME;
            var campseg_stat_names = campseg[i].CAMPSEG_STAT_NAME;
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
    $campsegContent=$("#campsegContent > .campseg-li-div");
    banner_length=$campsegContent.length;
    broadcastTimes=banner_length-6;//有5个页面展示

    console.log("------campsegView:END-------");
}


/**
 * 详细内容返回
 */
function addBackEventListener(){
    console.log("----详细内容返回-------");
    $("#header-content-back").click(function(){
        $(".popwin").hide();
        $(".poppage").hide();
        //if(confirm("您确定要关闭本页吗？")){
        //    window.top.opener = null;
        //    window.open("","_self");
        //    window.close();
        //}
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
        //if(confirm("您确定要关闭本页吗？")){
        //    window.top.opener = null;
        //    window.open("","_self");
        //    window.close();
        //}

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
            //获取内容值
            var typeId = $('#type_name').val();
            var statusId = $("#online_status").val();
            var channelId = $("#channel > .one_li > #channel_result").attr("channel_id");
            var cityId = $("#city > .one_li > #city_result").attr("channel_id");
            var managerName = $("#manager").val();
            var planDesc = $("#plan_desc").val();
            var planComment = $("#plan_comment").val();
            var dealCode_10086 = $("#deal_code_10086").val();
            var dealCode_1008611 = $("#deal_code_1008611").val();
            var urlForAndroid = $("#url_for_android").val();
            var urlForIos = $("#url_for_ios").val();

            //酬金积分的数据
            var cityIds = "";//酬金积分城市ids
            var scores = "";//积分值
            var awards = "";//筹集值
            var scoreTds = $("#score > .score");
            var awardTds = $("#award > .award");
            for (var i = 0; i < scoreTds.length; i++) {
                cityIds += $(scoreTds[i]).find("input").attr("class") + "/";
                var score = $(scoreTds[i]).find("input").val();//获取积分值
                var award = $(awardTds[i]).find("input").val();//获取酬金值

                //对空值作处理
                if (score == null || score == "" || score == undefined) {
                    score = "0.00";
                }
                if (award == null || award == "" || award == undefined) {
                    award = "0.00";
                }
                scores += score + "/";
                awards += award + "/";

            }
            cityIds = cityIds.substring(0, cityIds.length - 1);//酬金积分城市ids
            scores = scores.substring(0, scores.length - 1);//积分值
            awards = awards.substring(0, awards.length - 1);//筹集值

            console.log("cityIds" + cityIds + ";scores" + scores + ";awards" + awards);

            //对空值作处理
            if (managerName == "无" || managerName == null) {
                managerName = ""
            }
            if (planDesc == "无" || planDesc == null) {
                planDesc = ""
            }
            if (planComment == "无" || planComment == null) {
                planComment = ""
            }
            if (dealCode_10086 == "无" || dealCode_10086 == null) {
                dealCode_10086 = ""
            }
            if (dealCode_1008611 == "无" || dealCode_1008611 == null) {
                dealCode_1008611 = ""
            }
            if (urlForAndroid == "无" || urlForAndroid == null) {
                urlForAndroid = ""
            }
            if (urlForIos == "无" || urlForIos == null) {
                urlForIos = ""
            }

            var save_Data = {
                "planId": planId,
                "typeId": typeId,
                "statusId": statusId,
                "channelId": channelId,
                "cityId": cityId,
                "managerName": managerName,
                "planDesc": planDesc,
                "planComment": planComment,
                "dealCode_10086": dealCode_10086,
                "dealCode_1008611": dealCode_1008611,
                "urlForAndroid": urlForAndroid,
                "urlForIos": urlForIos,
                "cityIds": cityIds,
                "scores": scores,
                "awards": awards
            };
            console.log(typeId + statusId + channelId + cityId + managerName + planDesc + planComment + dealCode_10086 + dealCode_1008611 + urlForAndroid + urlForIos);
            //将数据传入后台保存
            $.ajax({
                url: contextPath + "/action/policy/policyManage/policySaveContent.do",
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
                },
                error: function () {
                    alert("保存失败！");
                }
            });
        }
    });

}


/**
 * 事件绑定酬金和积分视图
 */
function addAwardScoreChooseEventListener(){
    $(".choseScore").click(function(){
        console.log("----choseScore.click()----");
        $(this).addClass("active").siblings().removeClass("active");
        $("#score").show();
        $("#award").hide();
    });

    $(".choseAward").click(function(){
        console.log("----choseAward.click()----");
        $(this).addClass("active").siblings().removeClass("active");
        $("#score").hide();
        $("#award").show();
    });
}


/**
 * 选择渠道点击事件
 */
function channelResultCheckEventListener(){
    $("#channel_li > img").click(function() {
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
 * 编辑内容事件
 */
function addEditEventListener(){
    $("#detail_img").click(function(){
        var plan_in_use = $("#detail_img").attr("plan_in_use");
        if(plan_in_use == 'true'){
           alert("该产品已在营销策略中使用，不允许进行编辑。");
        }else if(plan_in_use == 'false'){
            //开启内容编辑
            $("#type_name > option,#online_status > .status,#channel .checkbox_li,#manager,#plan_comment").attr("disabled",false);
            $("#deal_code_10086,#deal_code_1008611,#url_for_android,#url_for_ios").attr("disabled",false);
            $(".award,.award > input,.score,.score > input").attr("disabled",false);
            //对酬金积分不可编辑做背景处理
            $(".award,.award > input,.score,.score > input").css("background","#fff");
            //对类型不可编辑做背景处理
            $("#type_name,#online_status,#channel_result,#channel li").css("background","#fff");
            //执行保存按钮处理
            $("#save-btn").addClass("btn-blu");
            //编辑图标的设定
            $("#detail_img").attr("src",""+contextPath+"/assets/images/edit_icon_d.png");
        }
    });
}


/**
 * 轮播实现
 */
function addBannerEventListener(){
    broadcastTimes=banner_length-5;//有5个页面展示
    console.log("------addBannerEventListener():开始！------");
    //获取内容块的个数
    var offWidth=0;
    //下一页
    $("#btn-next").click(function(){
        if(broadcastTimes >0 && banner_length>6){
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
        if(broadcastTimes <= banner_length-7 && banner_length>6){
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
