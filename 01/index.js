$(document).ready(function () {
    var list_02 = ["./01/003.jpg", "./01/004.jpg", "./01/005.jpg"];
    var imgs2 = [];
    $.when(preloadImg(list_02, imgs2)).done(function () {
        var _height = window.screen.availHeight;
        var _width = window.screen.availWidth;
        var _top = (_height - 322) / 2 - 50;
        var _left = _width - (_width * 0.382) - 200;
        $(".bd ul li").eq(1).append(imgs2[0]).append("<div class=\"pict_01\" style=\"top:" + _top + "px;left:" + (_left + 200) + "px;\"><img src=\"./01/index_01.png\" style='height:auto;'></div>");
        $(".bd ul li").eq(2).append(imgs2[1]).append("<div class=\"pict_01\" style=\"top:" + _top + "px;left:" + (_left - 400) + "px;\"><img src=\"./01/index_02.png\" style='height:auto;'></div><div class=\"pict_02\">入境尤似归故里，偷闲半日做小童</div>");
        $(".bd ul li").eq(3).append(imgs2[2]).append("<div class=\"pict_01\" style=\"top:" + _top + "px;left:" + _left + "px;color: #000;\"><img src=\"./01/index_03.png\" style='height:auto;'></div><div class=\"pict_02\" style=\"color: #000;\"> 闲来亚朵书边卧，日落黄昏自成眠</div>");
        //$(".pict_01").css({ "top": _top, "left": _left });
        //图片宽高判断
        AutoResizeImg(imgs2[0]);

        YD.Home.InitSlider();//首页轮播广告
    });
    YD.Home.Init();
    YD.Home.InitDate();//初始化日期
    YD.Home.InitSerchBar();//酒店搜索
    YD.Home.DelaySerchBar();//延时动画
    lock_delay = false;
    $('.serch_form').mouseover(function () {
        if (!lock_delay) {
            $(".serch_hotel").stop().animate({ "margin-right": "0px" }, 800, function () { });
            lock_delay = true;
        }
    });

    $(window).on("resize", function () {
        YD.Home.Resize();

    });
});

YD.NS("Home");
YD.Home = {
    Init: function () {
        $(".menu ul li").removeClass("active");
        $(".menu ul li").eq(0).addClass("active");
        $(".header").css({ "position": "fixed" });
        //检查是否为 IE 6-8
        if (!$.support.leadingWhitespace || navigator.userAgent.indexOf("MSIE 9.0") != -1) {
            $(".index_focus").css({ "height": $(window).height() });
            window.onresize = function () {
                $(".index_focus").css({ "height": $(window).height() });
            }
        }
    },
    InitDate: function () {
        $("#CheckInDate").val(new Date().Format("yyyy-MM-dd"));
        $("#CheckOutDate").val(new Date().addDay(1).Format("yyyy-MM-dd"));
        laydate.skin('molv');
        var start = {
            elem: '#CheckInDate',
            format: 'YYYY-MM-DD',
            isclear: false, //是否显示清空
            min: laydate.now(), //设定最小日期为当前日期
            max: laydate.now(+89), //最大日期 
            choose: function (dates) {
                var startDate = dates.toDate();
                var nextDate = startDate.addDay(1).Format("yyyy-MM-dd");
                var maxDate = startDate.addDay(89).Format("yyyy-MM-dd");
                end.min = nextDate;//设定最小日期为当前日期
                end.max = maxDate; //最大日期
                if ($('#CheckOutDate').val() < nextDate) {
                    $('#CheckOutDate').val(nextDate).click();
                }
                if ($('#CheckOutDate').val() > maxDate) {
                    $('#CheckOutDate').val(maxDate).click();
                }
                //RefreshData();
            }
        };
        laydate(start);
        var minDate = laydate.now(+1);
        var maxDate = laydate.now(+90);
        if ($('#CheckInDate').val()) {
            var checkInDate = $('#CheckInDate').val().toDate();
            minDate = checkInDate.addDay(1).Format("yyyy-MM-dd");
            // maxDate = checkInDate.addMonth(3).Format("yyyy-MM-dd");
        }
        var end = {
            elem: '#CheckOutDate',
            format: 'YYYY-MM-DD',
            isclear: false, //是否显示清空
            istoday: false,//是否显示今天
            min: minDate, //设定最小日期为当前日期
            max: maxDate, //最大日期 
            choose: function (dates) {
                var startDate = $('#CheckInDate').val().toDate();
                var nextDate = startDate.addDay(1).Format("yyyy-MM-dd");
                var maxDate = startDate.addDay(89).Format("yyyy-MM-dd");
                if ($('#CheckInDate').val() >= dates) {
                    $('#CheckOutDate').val(nextDate);
                }
                if (maxDate < dates) {
                    $('#CheckOutDate').val(maxDate);
                    Atour.Ui.Alert("入住时间大于一年，请分多个订单预定。");
                }
                // RefreshData();
            }
        };
        laydate(end);
    },
    InitSlider: function () {
        //var _height = window.screen.availHeight;
        //var _width = window.screen.availWidth;
        //var _top = (_height - 322) / 2 - 50 + "px";
        //var _left = _width - (_width * 0.382) - 200 + "px";
        //$(".pict_01").css({ "top": _top, "left": _left });
        //$(".index_focus").hover(function () {
        //    $(this).find(".index_focus_pre,.index_focus_next").stop(true, true).fadeTo("show", 1);
        //}, function () {
        //    $(this).find(".index_focus_pre,.index_focus_next").fadeOut();
        //});
        //$(".slide_nav a").eq(0).addClass("on");
        $(".bd ul li").eq(0).addClass("active");
        //$(".index_focus_pre").bind("click", function () {
        //    var _index = $(".bd ul .active").index();
        //    if (_index == 0) {
        //        $(".bd ul li").eq(_index).fadeOut("slow").removeClass("active");
        //        $(".bd ul li").last().fadeIn("slow").addClass("active");
        //    } else {
        //        $(".bd ul li").eq(_index).fadeOut("slow").removeClass("active");
        //        $(".bd ul li").eq(_index).prev().fadeIn("slow").addClass("active");
        //    }
        //    _index = $(".bd ul .active").index();
        //    $(".slide_nav a").removeClass("on");
        //    $(".slide_nav a").eq(_index).addClass("on");
        //});
        //$(".index_focus_next").bind("click", function () {
        //    var _total = $(".bd ul li").length;
        //    var _index = $(".bd ul .active").index();
        //    if (_index == _total - 1) {
        //        $(".bd ul li").eq(_index).fadeOut("slow").removeClass("active");
        //        $(".bd ul li").eq(0).fadeIn("slow").addClass("active");
        //    }
        //    else {
        //        $(".bd ul li").eq(_index).fadeOut("slow").removeClass("active");
        //        $(".bd ul li").eq(_index).next().fadeIn("slow").addClass("active");
        //    }
        //    _index = $(".bd ul .active").index();
        //    $(".slide_nav a").removeClass("on");
        //    $(".slide_nav a").eq(_index).addClass("on");
        //});
        //$(".slide_nav a").each(function (i) {
        //    $(this).bind("click", function () {
        //        var _index = $(".bd ul .active").index();
        //        $(".bd ul li").eq(_index).fadeOut("slow").removeClass("active");
        //        $(".bd ul li").eq(i).fadeIn("slow").addClass("active");
        //        $(".slide_nav a").removeClass("on");
        //        $(this).addClass("on");
        //    });
        //});
        //设置轮播时间
        var _inter = setInterval(function () {
            var _total = $(".bd ul li").length;
            var _index = $(".bd ul .active").index();
            if (_index == _total - 1) {
                $(".bd ul li").eq(_index).fadeOut("slow").removeClass("active");
                $(".bd ul li").eq(0).fadeIn("slow").addClass("active");
            }
            else {
                $(".bd ul li").eq(_index).fadeOut("slow").removeClass("active");
                $(".bd ul li").eq(_index).next().fadeIn("slow").addClass("active");
            }
            _index = $(".bd ul .active").index();
            $(".slide_nav a").removeClass("on");
            $(".slide_nav a").eq(_index).addClass("on");
        }, 5000);
    },
    InitSerchBar: function () {
        $(".book_icon").bind("click", function () {
            if ($(".serch_hotel").css("margin-right") == "0px") {
                $(".serch_hotel").stop().animate({ "margin-right": "-300px" }, 800, function () { });
            } else {
                $(".serch_hotel").stop().animate({ "margin-right": "0px" }, 800, function () { });
            }
        });

        $("#CityName").bind("click", function () {
            GetCityList(this);
        }).bind("keyup", function () {
            GetCityList(this);
        }).bind("blur", function () {
            YD.Home.SerchCity();
        }).bind("focus", function () {
            this.value = "";
        });
        $("#btnQuery").bind("click", function (e) {
            YD.Home.QueryChain(e);
        });
    },
    DelaySerchBar: function () {
        setTimeout(function () {
            if (!lock_delay) {
                $(".book_icon").click();
            }
        }, 2000);
    },
    SerchCity: function () {//城市文本框失去焦点事件
        var city = $("#CityName").val();
        YD.Home.GetCityIDbyName(city);
        if (city == null || city == "" || city == undefined) {
            $("#CityName").val("")
            $("#hcity").val("0");
        }
    },
    GetCityIDbyName: function (cityName) {//根据名称获取id
        $("#divAddressMenu div a").each(function () {
            if ($(this).text().toLowerCase().indexOf(cityName.toLowerCase()) >= 0) {
                $(this).click();
            }
        });
    },
    QueryChain: function () {//查询分店列表
        var CityID = $("#hcity").val();
        var CheckInDate = $("#CheckInDate").val();
        var CheckOutDate = $("#CheckOutDate").val();
        //var dateCount = $("#DateCount").val();
        if (CheckInDate == null || CheckInDate == "" || CheckInDate == undefined) {
            CheckInDate = new Date().Format("yyyy-MM-dd");
            $("#CheckInDate").val(CheckInDate);
        }
        if (CheckOutDate == null || CheckOutDate == "" || CheckOutDate == undefined) {
            CheckOutDate = $("#CheckInDate").val().toDate().addDay(1).Format("yyyy-MM-dd");
            $("#CheckOutDate").val(CheckOutDate);
        }
        var d = new Common.Utils.D();
        var CurrentDate = new Date().Format("yyyy-MM-dd");
        var diffdate = d.dayDiff(CheckInDate, CurrentDate);
        if (diffdate < 0) {
            CheckInDate = new Date().Format("yyyy-MM-dd");
            $("#CheckInDate").val(CheckInDate);
        }
        diffdate = d.dayDiff(CheckOutDate, CheckInDate);
        if (diffdate < 0) {
            CheckOutDate = $("#CheckInDate").val().toDate().addDay(1).Format("yyyy-MM-dd");
            $("#CheckOutDate").val(CheckOutDate);
        }


        //var t = /^\+?[1-9][0-9]*$/;
        //if (dateCount == "" || !t.test(dateCount)) {
        //    dateCount = 1;
        //}
        var cityname = $("#CityName").val();
        window.location.href = "/Hotel/Index?cityname=" + cityname + "&checkindate=" + CheckInDate + "&cityid=" + CityID + "&checkoutdate=" + CheckOutDate;
    },
    Resize: function () {
        var ele = this.elements[i];
        var rect = ele.getBoundingClientRect();
        if (this.trigger === 'auto' && (rect.top >= this.DISTANCE && rect.left >= this.DISTANCE
          && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
          && rect.left <= (window.innerWidth || document.documentElement.clientWidth) || rect.top < 0 && (rect.top + rect.height) >= this.DISTANCE)) {
            this.loadItem(ele, i);
            this.elements.splice(i, 1);
            i--; len--;
        }
    }
}
//图片宽高判断
function AutoResizeImg(img) {
    //笔记本
    var maxNoteWidth = "1366";
    var maxNoteHeight = "653";
    //台式
    var maxTAWidth = "1920";
    var maxTAHeight = "965";
    //浏览器宽度
    var PCWid = $(window).width();
    //电脑分辨率宽度
    var scrWid = window.screen.width;
    //电脑宽度 大于 笔记本宽度 取台式尺寸
    if (parseInt(scrWid) > parseInt(maxNoteWidth)) {
        //台式宽
        $(".index_focus .pic").css({ "width": maxTAWidth });
        $(".index_focus .pic").css("margin-left", "" + (-parseInt(maxTAWidth) / 2) + "px");
        //台式高
        $(".index_focus").css({ "height": maxTAHeight + "px" });
        $(".index_focus .bd").css({ "height": maxTAHeight + "px" });
        $(".index_focus .pic").css({ "height": maxTAHeight + "px" });
    }
    else {
        //笔记本宽
        $(".index_focus .pic").css({ "width": maxNoteWidth });
        $(".index_focus .pic").css("margin-left", "" + (-parseInt(maxNoteWidth) / 2) + "px");
        //笔记本高
        $(".index_focus").css({ "height": maxNoteHeight + "px" });
        $(".index_focus .bd").css({ "height": maxNoteHeight + "px" });
        $(".index_focus .pic").css({ "height": maxNoteHeight + "px" });
    }
}


