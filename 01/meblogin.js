//倒计时时间60秒  
var leftSeconds = 90;
var intervalId;
var mebID = 0;
var marketID = 25;

$(document).ready(function () {
    YD.MebLogin.InitUseInfo();
    YD.MebLogin.Init();
});

YD.NS("MebLogin");
YD.MebLogin = {
    Init: function () {
        $(".menu ul li").removeClass("active");
        $(".menu ul li").eq(6).addClass("active");

        $("#btn_mobile_code").attr("onclick", "YD.MebLogin.SendCode()");

        //添加验证码登录 zzy 2017-1-6 关闭 Start
       // $("#btn_mobileLogin_code").attr("onclick", "YD.MebLogin.SendLoginCode()");
        //zzy 2017-1-6 关闭 End
        $("#btn_serch").bind("click", function () {
            YD.MebLogin.Submit();
        });

        $("#btn_login").bind("click", function () {
            if (Common.Utils.getQueryStr("from") == "partial") {
                YD.MebLogin.Login(1);
            }
            else {
                YD.MebLogin.Login();
            }
        });
        $("#btn_register").bind("click", function () {
            window.location.href = "Register";
        });
    },
    SendCode: function () {
        var mobile = $("#txtQueryMobile").val();
        var codefhy = $("#codefhy").val();
        // 验证手机号码是否正确
        var isMobile = /1[0-9]{10}$/;
        if (!isMobile.test(mobile)) {
            Atour.Ui.Msg("请正确填写手机号码");
            return;
        }
        if (codefhy == "" || codefhy == undefined || codefhy == null) {
            Atour.Ui.Msg("请输入验证码");
            return;
        }
        // 调用后台发送手机验证码
        $("#btn_mobile_code").attr("onclick", "return false;");
        $("#btn_mobile_code").html("正在获取…");
        var rmParams = new Common.Query.M();
        rmParams.setParameters("moblie", mobile);     // 手机
        rmParams.setParameters("imgcode", codefhy);     // 验证码
        rmParams.setParameters("imgcodeID", "1");     // 验证码名称代码
        Atour.Ajax.Get({
            Url: "/yaduo/Meb/SendCode",
            DataParam: rmParams.getString(false),
            FuncName: "YD.MebLogin.SendCodeCallBack",
            FuncParams: "data"
        });
    },
    SendCodeCallBack: function (data) {
        if (data.State == 1) {
            leftSeconds = 90;//成功后重新恢复时间
            intervalId = setInterval("YD.MebLogin.CountDown()", 1000);//调用倒计时的方法  
        }
        else {
            $("#btn_mobile_code").attr("onclick", "YD.MebLogin.SendCode()");
            $("#btn_mobile_code").html("获取验证码");
            Atour.Ui.ShowBusErr(data, "获取手机验证码失败");
        }
    },

    //登录验证码获取 zzy 2017-1-6 关闭 Start

    //SendLoginCode: function () {
    //    var mobile = $("#userName").val();
    //    var codefhy = $("#code").val();
    //    // 验证手机号码是否正确
    //    var isMobile = /1[0-9]{10}$/;
    //    if (!isMobile.test(mobile)) {
    //        Atour.Ui.Msg("请正确填写手机号码");
    //        return;
    //    }
    //    if (codefhy == "" || codefhy == undefined || codefhy == null) {
    //        Atour.Ui.Msg("请输入验证码");
    //        return;
    //    }
    //    // 调用后台发送手机验证码
    //    $("#btn_mobileLogin_code").attr("onclick", "return false;");
    //    $("#btn_mobileLogin_code").html("正在获取…");
    //    var rmParams = new Common.Query.M();
    //    rmParams.setParameters("moblie", mobile);     // 手机
    //    rmParams.setParameters("imgcode", codefhy);     // 验证码
    //    rmParams.setParameters("imgcodeID", "5");     // 验证码名称代码
    //    Atour.Ajax.Get({
    //        Url: "/yaduo/Meb/SendCode",
    //        DataParam: rmParams.getString(false),
    //        FuncName: "YD.MebLogin.SendLoginCodeCallBack",
    //        FuncParams: "data"
    //    });
    //},
    //SendLoginCodeCallBack: function (data) {
    //    if (data.State == 1) {
    //        leftSeconds = 90;//成功后重新恢复时间
    //        intervalId = setInterval("YD.MebLogin.CountDownLogin()", 1000);//调用倒计时的方法  
    //    }
    //    else {
    //        $("#btn_mobileLogin_code").attr("onclick", "YD.MebLogin.SendLoginCode()");
    //        $("#btn_mobileLogin_code").html("获取验证码");
    //        Atour.Ui.ShowBusErr(data, "获取手机验证码失败");
    //    }
    //},
    //zzy 2017-1-6 关闭 End

    CountDown: function () {
        if (leftSeconds <= 0) {
            $("#btn_mobile_code").html("获取验证码"); //当时间<=0的时候改变按钮的value  
            $("#btn_mobile_code").attr("onclick", "YD.MebLogin.SendCode()"); //如果时间<=0的时候按钮可用  
            clearInterval(intervalId); //取消由 setInterval() 设置的 timeout  
            return;
        }
        leftSeconds--;
        $("#btn_mobile_code").html(leftSeconds + "秒后重新获取");
    },

    //zzy 2017-1-6 关闭 Start
    //CountDownLogin: function () {
    //    if (leftSeconds <= 0) {
    //        $("#btn_mobileLogin_code").html("获取验证码"); //当时间<=0的时候改变按钮的value  
    //        $("#btn_mobileLogin_code").attr("onclick", "YD.MebLogin.SendLoginCode()"); //如果时间<=0的时候按钮可用  
    //        clearInterval(intervalId); //取消由 setInterval() 设置的 timeout  
    //        return;
    //    }
    //    leftSeconds--;
    //    $("#btn_mobileLogin_code").html(leftSeconds + "秒后重新获取");
    //},
    //zzy 2017-1-6 关闭 End
    Submit: function () {
        var mobile = $("#txtQueryMobile").val();
        var code = $("#txtQueryCode").val();
        var isMobile = /1[0-9]{10}$/;
        if (!isMobile.test(mobile)) {
            Atour.Ui.Msg("请正确填写手机号码");
            return;
        }
        if (code == "" || code == undefined || code == null) {
            Atour.Ui.Msg("请输入手机验证码");
            return;
        }

        var rmParams = new Common.Query.M();
        rmParams.setParameters("moblie", mobile);
        rmParams.setParameters("code", code);
        Atour.Ajax.Get({
            Url: "/yaduo/Meb/CheckCode",
            DataParam: rmParams.getString(false),
            FuncName: "YD.MebLogin.CheckCodeCallBack",
            FuncParams: "data"
        });

    },
    CheckCodeCallBack: function (data) {
        if (data.State == 1) {
            window.location.href = "/meb/NonMebOrders?mobile=" + $("#txtQueryMobile").val() + "&code=" + $("#txtQueryCode").val();
        }
        else {
            Atour.Ui.ShowBusErr(data, "手机验证码错误");
        }
    },
    CheckLogin: function (userName, pwd, code) {
        if (userName == undefined || userName == null || userName == "") {
            Atour.Ui.Msg("请输入用户名");
            return false;
        }
        if (pwd == undefined || pwd == null || pwd == "") {
            Atour.Ui.Msg("请输入密码");
            return false;
        }
        if (code == undefined || code == null || code == "") {
            Atour.Ui.Msg("请输入验证码");
            return false;
        }
        return true;
    },
    Login: function (type) {
        var userName = $("#userName").val();
        var pwd = $("#pwd").val();
        var code = $("#code").val();
        var cutMobile = userName.substring(userName.length - 6);
        if (cutMobile == pwd) {
            Atour.Ui.Msg("登录失败 =。=！");
            return false;
        }
        if (!YD.MebLogin.CheckLogin(userName, pwd, code)) { return; }
        layer.load('正在登录…');
        var params = new Common.Query.M();
        params.setParameters("userName", userName);
        params.setParameters("pwd", pwd);
        params.setParameters("code", code);
        Atour.Ajax.Get({
            Url: "/Meb/AjaxLogin",
            DataParam: params.getString(false),
            Loading: false,
            Async: true,
            FuncName: "YD.MebLogin.CheckData",
            FuncParams: { type: type }
        });
    },
    CheckData: function (result, type) {
        var data = eval('(' + result + ')');
        if (data.State == 1) {
            var keepLogin = $("#keepLogin").is(":checked");
            mebID = data.Data.MebID;
            mebType = data.Data.MebType;
            if (keepLogin) {
                YD.MebLogin.SetCookie("username", $("#userName").val());
                YD.MebLogin.SetCookie("pwd", $("#pwd").val());
            }
            //局部登录
            if (type == 1) {
                //回调父窗体事件
                if (typeof window.parent.frames[0]._callback_partial === "function") {
                    window.parent.frames[0]._callback_partial(data);
                }
            }
            else {
                window.location = "/Meb/Index";
            }
        }
        else {
            Atour.Ui.ShowBusErr(data, "登录失败");
        }
    },
    InitUseInfo: function () {
        $("#userName").val(YD.MebLogin.GetCookie("username"));
        $("#pwd").val(YD.MebLogin.GetCookie("pwd"));
    },
    SetCookie: function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setHours(exp.setHours() + (24 * 7)); //保存7天
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=" + "/";
    },
    GetCookie: function (name) {
        var search = name + "=";
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search)
            if (offset != -1) {
                offset += search.length
                end = document.cookie.indexOf(";", offset)
                if (end == -1) end = document.cookie.length
                return unescape(document.cookie.substring(offset, end))
            }
            else return "";
        }
    },
    DelCookie: function () {
        var expdate = new Date();
        expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
        YD.MebLogin.SetCookie(name, "", expdate);
    }
}

