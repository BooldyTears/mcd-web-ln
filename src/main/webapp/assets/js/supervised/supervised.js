$(function(){
    switchDatepicker();//日期选择组件
    if(provinces=='sx'){
        loadSpecifyChannel_sx();
    }
});

// 选择渠道事件
$("#supervisedChannels").off().on("click", "span.J_campType", function (event, channelId) {
    $("#supervisedChannels .J_campType").removeClass("active");
    if (!$(this).hasClass("active")) {
        $(this).addClass("active");
    }
    if (channelId != undefined) {
        loadAdivList(channelId);
    } else {
        loadAdivList($(this).attr("channelId"));
    }
});

/**
 * 选择运营位事件
 */
$("#supervisedOperation").off().on("click", "span.J_campType", function (event, adviId) {
    var data = new Object();
    data.channelId = $(this).attr("channelId"); // 添加渠道Id
    $("#supervisedOperation .J_campType").removeClass("active");
    if (!$(this).hasClass("active")) {
        $(this).addClass("active");
    }
    if (adviId != undefined) {
        data.adivId = adviId;
    } else {
        data.adivId = $(this).attr("adiv-id");
    }
    loadSupervisedList(data);
    loadSupervisedCamp(data);
});


/**
 * 加载指定渠道和运营位
 */
function loadSpecifyChannel_sx () {
    $.ajax({
        type: "POST",
        url:  _ctx +"/action/sx/supervised/displaySpecifyChannel.do",
        data: {},
        async: false,
        dataType:"json",
        success: function(result){
            new EJS({url:_ctx + '/assets/js/supervised/supervisedChannels.ejs'}).update('supervisedChannels',{data:result});// 渲染加载开始
            var channelId = $("#supervisedChannels .J_campType").eq(0).attr("channelId");
            $("#supervisedChannels .J_campType").eq(0).addClass("active");
            $("#supervisedChannels .J_campType").eq(0).trigger("click", channelId);
        }
    });
}

/**
 * 加载运营位
 *
 * @param channelId 渠道Id
 */
function loadAdivList(channelId) {
    $.ajax({
        type: "POST",
        url:  _ctx +"/action/sx/supervised/diplayAdivByChannelId.do",
        data: {"channelId" :  channelId},
        async: false,
        dataType:"json",
        success: function(adivNames){
            new EJS({url:_ctx + '/assets/js/supervised/supervisedOperation.ejs'}).update('supervisedOperation',{data: adivNames, channelId : channelId});// 渲染加载开始
            var adivId = $("#supervisedOperation .J_campType").eq(0).attr("adiv-id");
            $("#supervisedOperation .J_campType").eq(0).addClass("active");
            $("#supervisedOperation .J_campType").eq(0).trigger("click", adivId);
        }
    });
}

/**
 * 加载运营位监控列表
 */
function loadSupervisedList(data) {
    var channelId = "";
    var adivId = "";
    if (data == undefined) { // 从查询进入
        channelId = $("#supervisedOperation .active").attr("channelId");
        adivId = $("#supervisedOperation .active").attr("adiv-id");
    } else { // 点击事件进入
        channelId = data['channelId']; // 当前选择渠道
        adivId = data['adivId']; // 当前选择运营位
    }
    var day_startS = $("#effectPageDate_day_startS").val();
    var day_StratE = $("#effectPageDate_day_StratE").val();
    var month_s = day_startS.split("-")[1];
    var month_e = day_StratE.split("-")[1];
    if (month_s != month_e) {
        alert("按月统计,请重新输入日期");
        return;
    }
    var effectPageDate_day = day_startS + "," + day_StratE;
    $("#channelEvlTable").tableExpand({
        tableClass : "comTable2",
        isDrag : false,
        async : false,
        pager: 'page1',
        url : _ctx + "/action/sx/supervised/getSupervisedAdivInfo.do",
        ajaxData : {
            theader : [ [ {
                width : "100",
                "key" : "ADIV_NAME",
                "title" : "运营位名称",
                "align":"CENTER"
            }, {
                width : "100",
                "key" : "TOTALNUM",
                "title" : "监控活动总数",
                "formatter":"formatInteger",
                "align":"CENTER"
            },{
                width : "100",
                "key" : "SUCCESSNUM",
                "title" : "成功活动数",
                "align":"CENTER",
                "formatter":"formatInteger"
            }, ] ],
            data : {
                // pageNum : 1,
                date : effectPageDate_day || "",
                channelId : channelId || -1,
                adivId : adivId || -1
            }
        }
    });
    loadSupervisedCamp(data);
}


/**
 * 统计当前运营位下的活动列表
 */
function loadSupervisedCamp(data) {
    var channelId = "";
    var adivId = "";
    var keywords = $("#search_id").val();
    if (data == undefined) { // 从查询进入
        channelId = $("#supervisedOperation .active").attr("channelId");
        adivId = $("#supervisedOperation .active").attr("adiv-id");
    } else { // 点击事件进入
        channelId = data['channelId']; // 当前选择渠道
        adivId = data['adivId']; // 当前选择运营位
    }
    var day_startS = $("#effectPageDate_day_startS").val();
    var day_StratE = $("#effectPageDate_day_StratE").val();
    var month_s = day_startS.split("-")[1];
    var month_e = day_StratE.split("-")[1];
    if (month_s != month_e) {
        alert("按月统计,请重新输入日期");
        return;
    }
    var effectPageDate_day = day_startS + "," + day_StratE;
    $("#campEvlTable").tableExpand({
        tableClass : "comTable2",
        isDrag : false,
        pager: 'page2',
        url : _ctx + "/action/sx/supervised/getSupervisedCampseg.do",
        ajaxData : {
            theader : [ [ {
                width : "100",
                "key" : "CAMPSEG_NAME",
                "title" : "活动名称",
                "align":"CENTER"
            }, {
                width : "100",
                "key" : "SUCCTOTAL",
                "title" : "活动成功数",
                "formatter":"formatInteger",
                "align":"CENTER"
            } ] ],
            data : {
                pageNum : 1,
                date : effectPageDate_day || "",
                channelId : channelId || -1,
                adivId : adivId || -1,
                keywords :  keywords
            }
        }
    });
}










