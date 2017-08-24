/************
*****************************************
页面扩展插件：1、首页图片轮播
******************************************************/
(function ($) {
    "use strict";
    jQuery.fn.slider = function (_a, _b) {
        var a = $(".s_icon").eq(0), b = $(".s_icon").eq(1), c = this, _width = $(window).width(), timer;
        $(".s_icon").css("opacity", 0.3);
        $(".slider_home").find(".item").each(function (i) {
            $(this).css({ width: $(window).width() + "px" });
        });
        function sliderPrev() {
            a.css("pointer-events", "none");
            var _active = $('.slider_home .item.active');
            var _width = _active.width();
            var _last = $(".slider_home .item").last();
            var _temp = _last.clone().addClass("active").css({ "margin-left": -1 * _width });
            _last.remove();
            $(_temp).insertBefore(".slider_home .item.active").stop().animate({ "margin-left": 0 }, 900, function () {
                _active.removeClass("active");
                setActive();
                a.css("pointer-events", "");
            });
        }
        function sliderNex() {
            b.css("pointer-events", "none");
            var _active = $('.slider_home .item.active');
            var _width = _active.width();
            var _temp = _active.clone().removeClass("active");
            _active.stop().animate({ "margin-left": -1 * _width }, 900, function () {
                _active.next().addClass("active"); _active.remove(); $(".item_box").append(_temp);
                setActive();
                b.css("pointer-events", "");
            });
        }
        function getIndex() {
            return $('.slider_home .item.active').attr("nav_index");
        }
        function setActive() {
            $(".slider_nav li").removeClass("active");
            $(".slider_nav li").eq(getIndex()).addClass("active");
        }
        a.bind("click", function (e) {
            //clearInterval(timer);
            sliderPrev();
        });
        b.bind("click", function (e) {
            sliderNex();
        });
        timer = setInterval(function () {
            sliderNex();
        }, 10000);
        $(window).resize(function () {
            $(".slider_home").find(".item").each(function (i) {
                $(this).css({ width: $(window).width() + "px" });
            });
        });
    };
})(jQuery);

/*****************************************************
页面扩展插件：2、酒店列表查看更多绑定事件
******************************************************/
(function ($) {
    "use strict";
    jQuery.fn.linkmore = function () {
        $(".hotel_list .hotel_item .item_img .item_img_see").css({ "opacity": 0.6 }).bind("mouseover", function () {
            $(this).css({ "opacity": 1 });
        }).bind("mouseout", function () {
            $(this).css({ "opacity": 0.8 });
        })
        var a = this;
        a.each(function (i) {
            var _num = i;
            $(this).find("tfoot>tr>td").each(function () {
                $(this).bind("click", function () {
                    if ($(this).find("a").text() == "查看更多") {
                        a.eq(_num).find(".hide").fadeIn();
                        $(this).find("a").text("收起列表");
                        //$(this).find("b").text("↑");
                    } else {
                        a.eq(_num).find(".hide").fadeOut();
                        $(this).find("a").text("查看更多");
                        //$(this).find("b").text("↓");
                    }
                });
            });
        });
    };
})(jQuery);

/*****************************************************
页面扩展插件：3、通用列表分页
参数列表：
PageNo: 当前页默认（1）；
TotalPage:总页数；
CallBack:回调函数；
******************************************************/
(function ($) {
    "use strict";
    jQuery.fn.querypage = function (_options) {
        //default param
        var defaults = {
            TotalPage: 0,
            PageNo: 1,
            CallBack: null
        };
        _options = $.extend(defaults, _options);
        var _html = new Common.Utils.MsBuilder(),
            _a = "<b><a href=\"javascript:void(0);\">{0}</a></b>",
            _b = "<span><a href=\"javascript:void(0);\">{0}</a></span>",
            _c = _options["TotalPage"],
            _d = this,
            _e = _options["CallBack"],
            _g = _options["PageNo"],
            _k = 10;
        if (_e == null) {
            //console.log("can not find callback function.");
            return;
        }
        if (_c > 0) {
            //create pages 
            _html.Append(_a.formatStr("上一页"));
            var cc = parseInt(_g / _k),
            ccc = _g % _k,
            _min = 1;
            _min = cc * 10 == 0 ? 1 : cc * 10;
            if (_min >= 10) { _min = _g - 4; }
            var c = 1;
            for (var i = _min; i <= _c ; i++) {
                if (c > 10)
                    break;
                _html.Append(_b.formatStr(i));
                c++;
                if (i % (_k + _min - 1) == 0 && i == ((1 + cc) * _k - cc * 5)) {
                    break;
                }
            }
            _html.Append(_a.formatStr("下一页"));
            _d.html(_html.toString());
            //bind pre、 next event
            if (_g > 1) {
                _d.find("b").eq(0).bind("click", (_g - 1), _e);
            } else {
                _d.find("b").eq(0).addClass("disabled");
            }
            if (_g < _c) {
                _d.find("b").eq(1).bind("click", (_g + 1), _e);
            } else {
                _d.find("b").eq(1).addClass("disabled");
            }
            //bind page num event
            _d.find("span").each(function (i) {
                if ((i + _min) == _g) {
                    $(this).addClass("active");
                }
                $(this).bind("click", (i + _min), _e);
            });
        } else {
            _d.html("");
            //console.log("empty data.");
            return;
        }
    };
})(jQuery);

/*****************************************************
页面扩展插件：4、预订日历
参数列表：
//此处还需要优化的是，如果是会员登录，难道重新检索所有的数据？
******************************************************/
//{ notmeb: 999, yk: 999, jk: 999, bj: 999, zxk: 999 };
var mt_rate_meb = [
    { m: 1, r: 2, tag: "yk", name: "银卡（识君）", tips: "您是亚朵银会员（识君），享8.8折会员折扣" },
    { m: 2, r: 3, tag: "jk", name: "金卡（知己）", tips: "您是亚朵金会员（知己），享8.8折会员折扣" },
    { m: 3, r: 4, tag: "bj", name: "铂金卡（执手）", tips: "您是亚朵铂金员（执手），享8.8折会员折扣" },
    { m: 0, r: 100, tag: "notmeb", name: "首次预订", tips: "非会员亚朵官网自主预订，享9.2折房费折扣" },
    { m: 12, r: 3012, tag: "zxk", name: "业主尊享", tips: "您是亚朵业主尊享会员，享8折会员折扣" }];

(function ($) {
    "use strict";
    jQuery.fn.calendar = function (room_status, currdate, isfirst, selone, market) {
        //添加参数，是否允许一个界面只允许选择一天
        //获取mebtype
        var nMebType = $("#hidMebType").val();

        var _a = "<b class=\"title\">{0}</b>";
        var _b = "<table border=\"0\" cellspacing=\"5\" cellpadding=\"0\" class=\"tblcalendar\">";
        var _c = "<thead><tr><th><</th><th colspan=\"5\">{0}</th><th>></th></tr><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>";
        var _d = "<tbody>";
        var _e = "<tr>{0}</tr>";
        var _f = "<td {0} EndOfDay={1} RoomType={2} MebType={3} yk={4} jk={5} bj={6} zxk={7} notmeb={8} mshi={9} mebrate={10} ><b>{11}</b><b>{12}</b>{13}</td>";
        var _g = "<tfoot><tr><td colspan=\"7\">获取房态失败</td></tr></tfoot>";
        var _h = "</tbody>";
        var _i = "</table>";
        var _bf = '<b class="full">满</b>';
        var _cx = '<b class="speacil">特价</b>';
        var _html = new Common.Utils.MsBuilder();
        var _curr = new Date();
        var show = 'class="active"';
        var disable = 'class="disabled"';
        var full = 'class="full"';
        var canselect = "";
        var id = currdate.Format("yyyyMM");
        var mt_rate_ratetype = { mshi: 1, notmeb: 100, yk: 2, jk: 3, bj: 4, zxk: 3012 };
        var mk_rate_ratetype = [{ "key": 8, "value": 90 }];
        var currMebRateType = 100;//默认显示非会员首次预订价格
        var rt_rate = { mshi: 999, notmeb: 999, yk: 999, jk: 999, bj: 999, zxk: 999, mkrate: 0, pro: 0 };
        var is_canbook = false;//默认这一天是不可以预订的，此参数在
        var is_market = false;

        //获取一个月一共有多少天
        function dayNumOfMonth(year, month) {
            var d = new Date(year, month, 0);
            return d.getDate();
        }
        //获取一个月的某一天是星期几
        function weekNumOfMonth(year, month, day) {
            //month = month + 1;
            //if (month >= 12) month = 0;
            var d = new Date(year, month, day);
            return d.getDay();
        }

        function getMebRateType(_rtt, _mebt) {
            if (_rtt != undefined && _rtt.length > 0) {
                for (var i = 0; i < _rtt.length; i++) {

                    if (_rtt[i].m == _mebt)
                        return _rtt[i].r;
                }
            }
            return 100;
        }

        function getMebRateByMaket(_mid) {
            for (var i = 0; i < mk_rate_ratetype.length; i++) {
                if (_mid == mk_rate_ratetype[0].key) {
                    return mk_rate_ratetype[0].value;
                }
            }
        }

        function get_mebrate_formrtrate() {
            if (currMebRateType == mt_rate_ratetype.notmeb)
                return $(rt_rate).attr("notmeb");
            if (currMebRateType == mt_rate_ratetype.bj)
                return $(rt_rate).attr("bj");
            if (currMebRateType == mt_rate_ratetype.jk)
                return $(rt_rate).attr("jk");
            if (currMebRateType == mt_rate_ratetype.yk)
                return $(rt_rate).attr("yk");
            if (currMebRateType == mt_rate_ratetype.zxk)
                return $(rt_rate).attr("zxk");

            return 999;
        }

        function get_roomrate_bymarktet(mkt) {
            if (is_canbook)
                is_canbook = mkt > 0 ? rt_rate.pro == rt_rate.mkrate : is_canbook;
            return rt_rate.mkrate;
        }

        function set_rt_rate(datarate) {
            //{ notmeb: 999, yk: 999, jk: 999, bj: 999, zxk: 999 };
            if (datarate != undefined) {
                for (var i = 0; i < datarate.length; i++) {
                    var _datarate = datarate[i];
                    if (_datarate.RoomRateTypeID == 100) { rt_rate.notmeb = _datarate.RoomRate; continue; }
                    if (_datarate.RoomRateTypeID == 2) { rt_rate.yk = _datarate.RoomRate; continue; }
                    if (_datarate.RoomRateTypeID == 3) { rt_rate.jk = _datarate.RoomRate; continue; }
                    if (_datarate.RoomRateTypeID == 4) { rt_rate.bj = _datarate.RoomRate; continue; }
                    if (_datarate.RoomRateTypeID == 3012) { rt_rate.zxk = _datarate.RoomRate; continue; }
                    if (_datarate.RoomRateTypeID == 1) { rt_rate.mshi = _datarate.RoomRate; continue; }
                    rt_rate.mkrate = _datarate.RoomRate;
                    rt_rate.pro = _datarate.RoomRate;//0 则为满

                }
            }
        }

        //此处返回一个新的类型
        function InitRoomRate(d) {
            is_canbook = false;//循环进来时，即开始循环此操作
            if (room_status.Data != null && room_status.Data != undefined && room_status.Data.length > 0) {
                var r_data = room_status.Data;
                for (var i = 0; i < r_data.length; i++) {
                    var r_e_data = r_data[i];//获取具体的数据
                    if (r_e_data != undefined) {
                        var date = new Date(r_e_data.AccDate.replace(/-/g, "/"));
                        //此处是获取到对应这一天的房价和房态
                        if (date.getTime() == d.getTime()) {
                            is_canbook = r_e_data.CanBook;

                            if (r_e_data.LstRoomRate != undefined) {
                                set_rt_rate(r_e_data.LstRoomRate);
                                break;
                            }
                        }
                    }
                }
            }
            return null;
        }

        var _val = "";
        //to do  

        var currDate = new Date();
        if (room_status != undefined) {
            //外部传值过来的日期，将此作为当前日期进行循环 此值必须为当前月的第一天

            is_market = market > 0 ? true : false;

            if (currdate) { currDate = currdate; }
            var html = "";
            var pois = "0123456";
            var currDay = currDate.getDate(); //获取传递日期的天数
            var currYear = currDate.getFullYear();
            var currMonth = currDate.getMonth();
            var perYear = currMonth == 0 ? currYear - 1 : currYear;
            var perMonth = currMonth == 0 ? 11 : currMonth - 1;
            var nextYear = currMonth == 11 ? currYear + 1 : currYear;
            var nextMonth = currMonth == 11 ? 0 : currMonth + 1;
            //判断当前是否显示的为当前系统的本月份
            //如果不是显示为当前月份的，那么后续的处理中需要对系统的首日进行判断
            //原因为，之前的月份中可能已经包含了本月的前面几天了
            // var isShowTaday = true;
            var isShowTaday = !(currMonth != _curr.getMonth() || currYear != _curr.getFullYear());
            // { isShowTaday = false; }

            if (currMonth == _curr.getMonth() && currYear == _curr.getFullYear()) {
                //从服务器中的日期取
                currDay = parseInt($("#hidDays").val());
                if (currDay == undefined)
                    currDay = new Date().getDate();
            }

            var _minday = 1;
            //创建html
            //调用成功
            if (room_status.State == 1 && room_status.Data != undefined && room_status.Data.length >= 1) {

                //是否是积分兑换
                if (selone)
                    $("#tbRoomTypeName").html(room_status.Data[0].RoomTypeName + "(积分兑换)" );
                else
                    $("#tbRoomTypeName").html(room_status.Data[0].RoomTypeName);

                // 获取房价类型

                //if (market != undefined && market > 0) {
                //    currMebRateType = getMebRateByMaket(market);

                //} else {

                currMebRateType = getMebRateType(mt_rate_meb, nMebType);
                currMebRateType = (currMebRateType == undefined || currMebRateType == 0) ? 100 : currMebRateType;
                // }

                //本月第一天是星期几,开始固定第一排的位置
                var minWeek = weekNumOfMonth(currYear, currMonth, 1);
                var allDay = dayNumOfMonth(currYear, currMonth + 1);//获取到本月一共有多少天

                //获取上一个月的天数
                var allPerDay = dayNumOfMonth(perYear, perMonth + 1);//获取上一个月多少天
                var allNextDay = dayNumOfMonth(nextYear, nextMonth + 1);//获取上一个月多少天


                //开始组织日历实体
                for (var mindays = _minday; mindays <= allDay; mindays++) {
                    var fdate = new Date(currYear, currMonth, mindays);
                    // var d_index = fdate.Format("MMdd")
                    //获取循环的是星期几
                    var fweek = fdate.getDay()
                    //找出应该排在第几位
                    var index = pois.indexOf(fweek.toString(), 0);
                    //此处是补充前面的td
                    if (mindays == 1 && index != 0) {
                        for (var i = 0; i < index; i++) {
                            // html += _f.formatStr(disable, allPerDay - index + i + 1, "");
                            html += _f.formatStr(disable, "", "", "", "", "", "", "", "", "", "", "", "", "");
                            //continue;
                        }
                    }

                    //var _f = "<td {0} EndOfDay={1} RoomType={2} RoomRate={3} MebType={4}><b>{5}</b><b>{6}</b></td>";
                    if (mindays < currDay) {
                        html += _f.formatStr(disable, fdate.Format("yyyy-MM-dd"),
                            0, 0, 0, 0, 0, 0, 0, 0, 0, mindays, "", "");
                    } else {

                        InitRoomRate(fdate);
                        var del_CurrRate = 0;
                        if (market > 0)
                            del_CurrRate = get_roomrate_bymarktet(market);
                        else
                            del_CurrRate = get_mebrate_formrtrate();

                        if (del_CurrRate == 0) del_CurrRate = 999;
                        var _class = full;
                        var _full_text = _bf;//默认满房
                        if (is_canbook && del_CurrRate != 999 && del_CurrRate != undefined) {
                            _full_text = "";
                            _class = canselect;
                        }

                        html += _f.formatStr(_class, fdate.Format("yyyy-MM-dd"),
                            0, 0, rt_rate.yk, rt_rate.jk, rt_rate.bj, rt_rate.zxk, rt_rate.notmeb, rt_rate.mshi, del_CurrRate, mindays, "￥" + del_CurrRate, _full_text);
                    }

                    //最后一天 也处理一下，补齐后面的空格
                    if (mindays == allDay) {
                        if (index != 6) {
                            //如果是最后一天
                            for (var i = 0; i < 6 - index; i++) {
                                // allNextDay
                                html += _f.formatStr(disable, "", "", "", "", "", "", "", "", "", "", "", "", "");
                                //continue;
                            }
                        }

                    }
                    //一行已经结束
                    //这里还需要处理，如果是一个月的最后一天了
                    if (index == 6 || mindays == allDay) { _html.Append(_e.formatStr(html)); html = ""; }

                }

                //_html.Append(_h + _i);

                //_html.Append(_h);
                $(".tblcalendar tbody").hide();
                $("<tbody>" + _html.toString() + "</tbody>").insertBefore(".tblcalendar tfoot").attr("id", "tbody_0" + id);
                $(".tblcalendar tbody").last().show();
                $(".tblcalendar tfoot").hide();
            } else {

                $(".tblcalendar tbody").hide();
                $("<tbody><tr><td colspan=\"7\" class=\"disabled\">没有可用的房价信息</td></tr></tbody>").insertBefore(".tblcalendar tfoot").attr("id", "tbody_0" + id);
                $(".tblcalendar tbody").last().show();


            }
        }

        $(this).find("#tbody_0" + id + " tr td").each(function () {
            if ($(this).hasClass("full")) {
                $(this).css({ "pointer-events": "none" });
            }
            //$(this).bind("click", function () {
            //    whenTdClick($(this), selone);
            //    CreateData();
            //});
        });
        //var parDate = Common.Utils.getQueryStr("checkindate");
        //此处在增加一个判断.
        //如果当前传入的时间小于服务器的时间，则不能进行这样的操作 
        var selDate = $("#hidStart").val();
        if ($(this).data("Init") == undefined) {

            var serviceDate = $("#hidServDate").val(); //获取当前服务器的时间
            if (selDate == serviceDate && market == 8) {
                //如果是商务房，那么第一天是不能选择的
                // 如果对方选择的是当天，则默认要往后选择
                $(".tblcalendar>tbody>tr>td[endofday='" + selDate + "']").addClass("disabled").css({ "pointer-events": "none" });
                selDate = selDate.toDate().addDay(1).Format("yyyy-MM-dd");


            }//商务房
            $(this).data({ "Init": true });
            $(".tblcalendar>tbody>tr>td[endofday='" + selDate + "']").click();
        }

    };
})(jQuery);

/*****************************************************
页面扩展插件：4、预订日历(公寓)
参数列表：
******************************************************/
(function ($) {
    "use strict";
    jQuery.fn.calendaryu = function (rrtype,room_status, currdate, isfirst, selone, market) {
        //添加参数，是否允许一个界面只允许选择一天

        var _a = "<b class=\"title\">{0}</b>";
        var _b = "<table border=\"0\" cellspacing=\"5\" cellpadding=\"0\" class=\"tblcalendar\">";
        var _c = "<thead><tr><th><</th><th colspan=\"5\">{0}</th><th>></th></tr><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>";
        var _d = "<tbody>";
        var _e = "<tr>{0}</tr>";
        var _f = "<td {0} EndOfDay={1} RoomType={2} MebType={3} yk={4} jk={5} bj={6} zxk={7} notmeb={8} mshi={9} mebrate={10} ><b>{11}</b><b>{12}</b>{13}</td>";
        var _g = "<tfoot><tr><td colspan=\"7\">获取房态失败</td></tr></tfoot>";
        var _h = "</tbody>";
        var _i = "</table>";
        var _bf = '<b class="full">满</b>';
        var _cx = '<b class="speacil">特价</b>';
        var _html = new Common.Utils.MsBuilder();
        var _curr = new Date();
        var show = 'class="active"';
        var disable = 'class="disabled"';
        var full = 'class="full"';
        var canselect = "";
        var id = currdate.Format("yyyyMM");
        var mt_rate_ratetype = { mshi: 1, notmeb: 100, yk: 2, jk: 3, bj: 4, zxk: 3012 };
        var mk_rate_ratetype = [{ "key": 8, "value": 90 }];
        var currMebRateType = 100;//默认显示非会员首次预订价格
        var rt_rate = { mshi: 999, notmeb: 999, yk: 999, jk: 999, bj: 999, zxk: 999, mkrate: 0, pro: 0 };
        var is_canbook = false;//默认这一天是不可以预订的，此参数在
        var is_market = false;

        //获取一个月一共有多少天
        function dayNumOfMonth(year, month) {
            var d = new Date(year, month, 0);
            return d.getDate();
        }
        //获取一个月的某一天是星期几
        function weekNumOfMonth(year, month, day) {
            //month = month + 1;
            //if (month >= 12) month = 0;
            var d = new Date(year, month, day);
            return d.getDay();
        }

        function getMebRateByMaket(_mid) {
            for (var i = 0; i < mk_rate_ratetype.length; i++) {
                if (_mid == mk_rate_ratetype[0].key) {
                    return mk_rate_ratetype[0].value;
                }
            }
        }

        function get_roomrate_bymarktet(mkt) {
            if (is_canbook)
                is_canbook = mkt > 0 ? rt_rate.pro == rt_rate.mkrate : is_canbook;
            return rt_rate.mkrate;
        }

        function set_rt_rate(datarate) {
            if (datarate != undefined) {
                for (var i = 0; i < datarate.length; i++) {
                    var _datarate = datarate[i];
                    rt_rate.mkrate = _datarate.RoomRate;
                    rt_rate.pro = _datarate.RoomRate;//0 则为满

                }
            }
        }

        //此处返回一个新的类型
        function InitRoomRate(d) {
            is_canbook = false;//循环进来时，即开始循环此操作
            if (room_status.Data != null && room_status.Data != undefined && room_status.Data.length > 0) {
                var r_data = room_status.Data;
                for (var i = 0; i < r_data.length; i++) {
                    var r_e_data = r_data[i];//获取具体的数据
                    if (r_e_data != undefined) {
                        var date = new Date(r_e_data.AccDate.replace(/-/g, "/"));
                        //此处是获取到对应这一天的房价和房态
                        if (date.getTime() == d.getTime()) {
                            is_canbook = r_e_data.CanBook;

                            if (r_e_data.LstRoomRate != undefined) {
                                set_rt_rate(r_e_data.LstRoomRate);
                                break;
                            }
                        }
                    }
                }
            }
            return null;
        }

        var _val = "";
        //to do  

        var currDate = new Date();
        if (room_status != undefined) {
            //外部传值过来的日期，将此作为当前日期进行循环 此值必须为当前月的第一天

            is_market = market > 0 ? true : false;

            if (currdate) { currDate = currdate; }
            var html = "";
            var pois = "0123456";
            var currDay = currDate.getDate(); //获取传递日期的天数
            var currYear = currDate.getFullYear();
            var currMonth = currDate.getMonth();
            var perYear = currMonth == 0 ? currYear - 1 : currYear;
            var perMonth = currMonth == 0 ? 11 : currMonth - 1;
            var nextYear = currMonth == 11 ? currYear + 1 : currYear;
            var nextMonth = currMonth == 11 ? 0 : currMonth + 1;
            //判断当前是否显示的为当前系统的本月份
            //如果不是显示为当前月份的，那么后续的处理中需要对系统的首日进行判断
            //原因为，之前的月份中可能已经包含了本月的前面几天了
            // var isShowTaday = true;
            var isShowTaday = !(currMonth != _curr.getMonth() || currYear != _curr.getFullYear());
            // { isShowTaday = false; }

            if (currMonth == _curr.getMonth() && currYear == _curr.getFullYear()) {
                //从服务器中的日期取
                currDay = parseInt($("#hidDays").val());
                if (currDay == undefined)
                    currDay = new Date().getDate();
            }

            var _minday = 1;
            //创建html
            //调用成功
            if (room_status.State == 1 && room_status.Data != undefined && room_status.Data.length >= 1) {

                //是否是积分兑换
                if (selone)
                    $("#tbRoomTypeName").html(room_status.Data[0].RoomTypeName + "(积分兑换)");
                else
                    $("#tbRoomTypeName").html(room_status.Data[0].RoomTypeName);

                // 获取房价类型

                currMebRateType = rrtype;
                currMebRateType = (currMebRateType == undefined || currMebRateType == 0) ? 100 : currMebRateType;

                //本月第一天是星期几,开始固定第一排的位置
                var minWeek = weekNumOfMonth(currYear, currMonth, 1);
                var allDay = dayNumOfMonth(currYear, currMonth + 1);//获取到本月一共有多少天

                //获取上一个月的天数
                var allPerDay = dayNumOfMonth(perYear, perMonth + 1);//获取上一个月多少天
                var allNextDay = dayNumOfMonth(nextYear, nextMonth + 1);//获取上一个月多少天


                //开始组织日历实体
                for (var mindays = _minday; mindays <= allDay; mindays++) {
                    var fdate = new Date(currYear, currMonth, mindays);
                    // var d_index = fdate.Format("MMdd")
                    //获取循环的是星期几
                    var fweek = fdate.getDay()
                    //找出应该排在第几位
                    var index = pois.indexOf(fweek.toString(), 0);
                    //此处是补充前面的td
                    if (mindays == 1 && index != 0) {
                        for (var i = 0; i < index; i++) {
                            // html += _f.formatStr(disable, allPerDay - index + i + 1, "");
                            html += _f.formatStr(disable, "", "", "", "", "", "", "", "", "", "", "", "", "");
                            //continue;
                        }
                    }

                    //var _f = "<td {0} EndOfDay={1} RoomType={2} RoomRate={3} MebType={4}><b>{5}</b><b>{6}</b></td>";
                    if (mindays < currDay) {
                        html += _f.formatStr(disable, fdate.Format("yyyy-MM-dd"),
                            0, 0, 0, 0, 0, 0, 0, 0, 0, mindays, "", "");
                    } else {

                        InitRoomRate(fdate);
                        var del_CurrRate = get_roomrate_bymarktet(market);

                        if (del_CurrRate == 0) del_CurrRate = 999;
                        var _class = full;
                        var _full_text = _bf;//默认满房
                        if (is_canbook && del_CurrRate != 999 && del_CurrRate != undefined) {
                            _full_text = "";
                            _class = canselect;
                        }

                        html += _f.formatStr(_class, fdate.Format("yyyy-MM-dd"),
                            0, 0, rt_rate.yk, rt_rate.jk, rt_rate.bj, rt_rate.zxk, rt_rate.notmeb, rt_rate.mshi, del_CurrRate, mindays, "￥" + del_CurrRate, _full_text);
                    }

                    //最后一天 也处理一下，补齐后面的空格
                    if (mindays == allDay) {
                        if (index != 6) {
                            //如果是最后一天
                            for (var i = 0; i < 6 - index; i++) {
                                // allNextDay
                                html += _f.formatStr(disable, "", "", "", "", "", "", "", "", "", "", "", "", "");
                                //continue;
                            }
                        }

                    }
                    //一行已经结束
                    //这里还需要处理，如果是一个月的最后一天了
                    if (index == 6 || mindays == allDay) { _html.Append(_e.formatStr(html)); html = ""; }

                }

                //_html.Append(_h + _i);

                //_html.Append(_h);
                $(".tblcalendar tbody").hide();
                $("<tbody>" + _html.toString() + "</tbody>").insertBefore(".tblcalendar tfoot").attr("id", "tbody_0" + id);
                $(".tblcalendar tbody").last().show();
                $(".tblcalendar tfoot").hide();
            } else {

                $(".tblcalendar tbody").hide();
                $("<tbody><tr><td colspan=\"7\" class=\"disabled\">没有可用的房价信息</td></tr></tbody>").insertBefore(".tblcalendar tfoot").attr("id", "tbody_0" + id);
                $(".tblcalendar tbody").last().show();


            }
        }

        $(this).find("#tbody_0" + id + " tr td").each(function () {
            if ($(this).hasClass("full")) {
                $(this).css({ "pointer-events": "none" });
            }
            //$(this).bind("click", function () {
            //    whenTdClick($(this), selone);
            //    CreateData();
            //});
        });
        //var parDate = Common.Utils.getQueryStr("checkindate");
        //此处在增加一个判断.
        //如果当前传入的时间小于服务器的时间，则不能进行这样的操作 
        var selDate = $("#hidStart").val();
        if ($(this).data("Init") == undefined) {

            var serviceDate = $("#hidServDate").val(); //获取当前服务器的时间
            if (selDate == serviceDate && market == 8) {
                //如果是商务房，那么第一天是不能选择的
                // 如果对方选择的是当天，则默认要往后选择
                $(".tblcalendar>tbody>tr>td[endofday='" + selDate + "']").addClass("disabled").css({ "pointer-events": "none" });
                selDate = selDate.toDate().addDay(1).Format("yyyy-MM-dd");


            }//商务房
            $(this).data({ "Init": true });
            $(".tblcalendar>tbody>tr>td[endofday='" + selDate + "']").click();
        }

    };
})(jQuery);
/*****************************************************
页面扩展插件：5、感受亚朵
******************************************************/
(function ($) {
    "use strict";
    jQuery.fn.experience = function () {
        var PLAYER_TIME = 3500;
        window.onerror = function () {
            return true
        };
        var Slider = function () {
            var DURATION = 500,
            count = $('#slider li').length,
            current = 0, animating = false, timer;
            function slideTo(idx) {
                if (animating || idx == current) {
                    return;
                }
                if (idx < 0) {
                    idx = count - 1;
                } else if (idx >= count) {
                    idx = 0;
                }
                var up = (idx > current) || (idx == current - count + 1);
                var $lis = $('#slider li');
                var $current = $lis.eq(idx);
                var $prev = $('#slider li.current');
                var offset = $current.height();
                animating = true;

                $current.show().css({
                    top: up ? offset : -offset
                }).animate({
                    top: 0
                }, DURATION, function () {
                    $(this).addClass('current');
                    $('#nav li').removeClass('current').eq(idx).addClass('current');
                    animating = false;
                });
                $prev.animate({
                    top: up ? -offset : offset
                }, DURATION, function () {
                    $(this).removeClass('current').hide();
                });
                var $arrow = $('.arrow');
                if (idx == count - 1) {
                    $arrow.hide();
                } else {
                    $arrow.show();
                }
                current = idx;
                child_animating(idx);
            }
            return {
                slideTo: slideTo,
                slidePrev: function () {
                    if (current == 0) return;
                    slideTo(current - 1);
                },
                slideNext: function () {
                    slideTo(current + 1);
                }
            }
        }();
        //bind event
        $(document).on('mousewheel', function (e) {
            if (e.originalEvent.wheelDelta > 0) {
                Slider.slidePrev();
            } else {
                Slider.slideNext();
            }
        });
        $('.arrow').on('click', function () {
            Slider.slideNext();
        });
        $('#nav a').on('mousedown', function () {
            Slider.slideTo($(this).parent().index());
        });
        setInterval(function () {
            $('.arrow').animate({
                opacity: 1
            }, 800, function () {
                $('.arrow').css({ opacity: 0.4 });
            });
        }, 800);
        $(".current_info div").css({
            opacity: 0
        });
        $(".cr_bg").css({
            opacity: 0.6
        });
        $(".current_info").find("span").css({
            opacity: 0
        });
        function child_animating(_eq) {
            if (_eq == 0) {
                if (!$(".cr_bg").eq(_eq).hasClass("exec")) {
                    $(".current_info .cri_01").eq(0).css({ opacity: 0, "margin-top": "-100px" });
                    $(".current_info .cri_02").css({ opacity: 0, "margin-left": "-100px" });
                    $(".current_info .cri_03").css({ opacity: 0, "height": "0px" });
                    $(".current_info .cri_01").eq(0).animate({ opacity: 1, "margin-top": "0px" }, 800, function () {
                        $(".current_info .cri_02").animate({ opacity: 1, "margin-left": "0px" }, 800, function () {
                            $(".current_info .cri_03").animate({ opacity: 1, "height": "100px" }, 1200, function () {
                                $(".cr_bg").eq(0).animate({ opacity: 0.5 }).addClass("exec");
                            });
                        });
                    });
                }
            } else {
                $(".current_info").eq(_eq).find("div").animate({
                    opacity: 1
                }, 800);
                if (!$(".cr_bg").eq(_eq).hasClass("exec")) {
                    var _spans = $(".current_info").eq(_eq).find("div").find("span");
                    _spans.eq(0).animate({
                        opacity: 1
                    }, 800, function () {
                        1 < _spans.length ? _spans.eq(1).animate({ opacity: 1 }, 700, function () {
                            2 < _spans.length ? _spans.eq(2).animate({ opacity: 1 }, 700, function () {
                                3 < _spans.length ? _spans.eq(3).animate({ opacity: 1 }, 700, function () {
                                    4 < _spans.length ? _spans.eq(4).animate({ opacity: 1 }, 700, function () {
                                        5 < _spans.length ? _spans.eq(5).animate({ opacity: 1 }, 700, function () {
                                            6 < _spans.length ? _spans.eq(6).animate({ opacity: 1 }, 700, function () { }) : $(".cr_bg").eq(_eq).animate({ opacity: 0 }).addClass("exec");
                                        }) : $(".cr_bg").eq(_eq).animate({ opacity: 0.5 }).addClass("exec");
                                    }) : $(".cr_bg").eq(_eq).animate({ opacity: 0.5 }).addClass("exec");
                                }) : $(".cr_bg").eq(_eq).animate({ opacity: 0.5 }).addClass("exec");
                            }) : $(".cr_bg").eq(_eq).animate({ opacity: 0.5 }).addClass("exec");
                        }) : $(".cr_bg").eq(_eq).animate({ opacity: 0.5 }).addClass("exec");
                    });
                }
            }
        }

        child_animating(0);
        $("#cri_href_01").bind("click", function () {
            Slider.slideTo(5);
        });
        $("#cri_href_02").bind("click", function () {
            window.location.href = "/Experience/Products";
        });
    }
})(jQuery);

/************
*****************************************
页面扩展插件：6、睡我所爱
******************************************************/
(function ($) {
    "use strict";
    jQuery.fn.topic_slider = function (_a, _b) {
        var a = $(".t_icon").eq(0), b = $(".t_icon").eq(1), c = this, _def_width = 280, timer;
        $(".t_icon").css("opacity", 0.3);
        function sliderPrev() {
            a.css("pointer-events", "none");
            var _active = $('.slider_topics .topics_item.active');
            var _width = _active.width() + 20;
            var _last = $(".slider_topics .topics_item").last();
            var _temp = _last.clone().addClass("active").css({ "margin-left": -1 * _width });
            _last.remove();
            $(_temp).insertBefore(".slider_topics .topics_item.active").stop().animate({ "margin-left": 0 }, 500, function () {
                _active.removeClass("active");
                a.css("pointer-events", "");
            });
        }
        function sliderNex() {
            b.css("pointer-events", "none");
            var _active = $('.slider_topics .topics_item.active');
            var _width = _active.width() + 20;
            var _temp = _active.clone().removeClass("active");
            _active.stop().animate({ "margin-left": -1 * _width }, 500, function () {
                _active.next().addClass("active"); _active.remove(); $(".topics_item_box").append(_temp);
                b.css("pointer-events", "");
            });
        }
        a.bind("click", function (e) {
            sliderPrev();
        });
        b.bind("click", function (e) {
            sliderNex();
        });
        $(window).resize(function () {
            $(".slider_topics").find(".topics_item").each(function (i) {
                $(this).css({ width: _def_width + "px" });
            });
        });
        $('.slider_topics .topics_item .item_cover').css({ opacity: 0 });
        $('.slider_topics .topics_item').each(function () {
            $(this).bind("mouseover", function () {
                $(this).find(".item_cover").stop().animate({ opacity: 0.4 });
            }).bind("mouseout", function () {
                $(this).find(".item_cover").stop().animate({ opacity: 0 });
            });
        });
    };
})(jQuery);









