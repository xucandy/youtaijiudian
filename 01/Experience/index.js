$(document).ready(function () {
    $(".menu ul li").removeClass("active");
    $(".menu ul li").eq(2).addClass("active");
    var v_w = $(window).width();
    var v_h = $(window).height();
    $("#img1,#img2,#img3,#img4,#img5,#img6,#img7,#img8,#img9").css({ "height": v_h, "width": v_w }).each(function () {
        $($(this).find("img")[0]).css({ "width": v_w, "height": "auto" });
    });
    /********************** 感受亚朵 ***********************/
    $(".experience").experience();
    /********************** 感受亚朵 ***********************/
});
//function InitData() {
//    var strVar = "";
//    strVar += "<li><div id=\"img1\" style=\"overflow:hidden;text-overflow:ellipsis;white-space:nowrap\"><img src=\"../../skin/images/exper/01.jpg\"><\/div><div class=\"current_content\"><div class=\"current_info\"><div class=\"clear cri_01\"><span style=\"font-size:32px;font-weight:700;padding-bottom:15px\">【产品理念】<\/span> <span>亚朵酒店，倡导自然、健康的生活方式<\/span> <span>我们有清新、舒适的环境<\/span> <span>雅致、开放的空间；真诚、有爱的服务<\/span> <span>在亚朵休憩、充电，您能得到身心的放松和愉悦的体验<\/span><\/div><\/div><\/div><div class=\"cr_bg\"><\/div><\/li><li><\/li>";
//}
//function GetData() {
//}




