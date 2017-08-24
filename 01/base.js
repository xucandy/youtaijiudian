/*****************************************************
基类：Atour
******************************************************/
(function (a) {
    "use strict";
    if (typeof a.Atour !== "object") {
        a.Atour = {
            v: "1.0.0",
            authour: "Benjamin",
            date: "2014-12-01",
            ie6: !!a.ActiveXObject && !a.XMLHttpRequest,
            virpath: "http://localhost:8888/"
        }
    }

    if (typeof Atour.JsonEval !== "object") {
        Atour.JsonEval = {
            Exec: function (jsonStr) {
                try {
                    return eval('(' + jsonStr + ')');
                } catch (e) {
                    Atour.Ui.Alert(e.message);
                }
            }
        }
    }

    if (typeof Atour.Ajax !== "object") {
        Atour.Ajax = {
            Init: function (_options) {
                //默认参数配置
                var defaults = {
                    AjaxType: "GET",
                    // 异步请求类型：post:提交,get:查询，默认为get。 
                    Url: "",
                    //异步请求地址
                    DataParam: "",
                    //异步请求URL参数
                    IsAlpha: false,
                    //是否遮罩背景,默认为true
                    FuncName: "",
                    //异步请求后，回调的函数
                    FuncParams: null,
                    //异步请求回调函数，对应的参数（一一对应关系）。
                    Loading: false,
                    Async: true
                };
                _options = $.extend(defaults, _options);
                var data_param = _options["DataParam"] + "&rand=" + Math.floor(Math.random() * 1000);
                var _load = null;
                jQuery.ajax({
                    type: _options["AjaxType"],
                    url: _options["Url"],
                    cache: false,
                    //取消缓存
                    async: _options["Async"],
                    //异步使用同步方式，执行当前请求后、依次执行往后请求
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    data: data_param,
                    beforeSend: function (XMLHttpRequest) {
                        if (_options["Loading"] == true) {
                            _load = parent.layer.load("加载中，请稍后..", 3);
                        }
                    },
                    success: function (result) {
                        if (_options["FuncName"] != "") {
                            var obj_Method = null;
                            try {
                                obj_Method = eval('(' + _options["FuncName"] + ')');
                            } catch (e) {
                                Atour.Ajax.Out(e);
                                Atour.Ui.Alert("找不到回调函数！");
                                return;
                            }
                            if (_options["FuncParams"] != null) {
                                var obj_param = _options["FuncParams"];
                                var data_array = new Array();
                                data_array.push(result);
                                for (var i in obj_param) {
                                    data_array.push(obj_param[i]);
                                }
                                obj_Method.apply(arguments, data_array);
                            } else obj_Method(result);
                        }
                    },
                    complete: function () {
                        if (_options["Loading"] == true) {
                            parent.layer.close(_load);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (_options["Loading"] == true) {
                            parent.layer.close(_load);
                        }
                    }
                });
            },
            Post: function (_options) {
                var _this = this;
                if (_options == undefined) {
                    Atour.Ui.Alert("请求参数错误！");
                    return;
                } else {
                    _options = $.extend({
                        AjaxType: "POST"
                    },
                    _options);
                    _this.Init(_options);
                }
            },
            Get: function (_options) {
                var _this = this;
                if (_options == undefined) {
                    Atour.Ui.Alert("请求参数错误！");
                    return;
                } else {
                    _options = $.extend({
                        AjaxType: "GET"
                    },
                    _options);
                    _this.Init(_options);
                }
            },
            Out: function (e) { }
        }
    }
    if (typeof Atour.Json !== "object") {
        Atour.Json = {
            ToJson: function (singleObject) {
                var sMstr = new Common.Utils.MsBuilder();
                for (var p in singleObject) {
                    if (typeof (singleObject[p]) == " function ") singleObject[p]();
                    else {
                        if (sMstr.toString().length == 0) {
                            sMstr.Append('"' + p + '":"' + encodeURI(singleObject[p]) + '"');
                        } else {
                            sMstr.Append(',"' + p + '":"' + encodeURI(singleObject[p]) + '"');
                        }
                    }
                }
                if (sMstr.toString() != "") {
                    return "{" + sMstr.toString() + "}";
                } else return "";
            },
            ListToJson: function (lstObject) {
                if (lstObject.length > 0) {
                    var sMstr = new Common.Utils.MsBuilder();
                    sMstr.Append("[");
                    for (var i = 0; i < lstObject.length; i++) {
                        if (sMstr.toString().length == 1) {
                            sMstr.Append(Atour.Json.ToJson(lstObject[i]));
                        } else {
                            sMstr.Append(',' + Atour.Json.ToJson(lstObject[i]));
                        }
                    }
                    sMstr.Append("]");
                    return sMstr.toString();
                } else return "";
            }
        }
    }
    if (typeof Atour.Ui !== "object") {
        Atour.Ui = {
            Alert: function (sMsg) {
                layer.alert(sMsg, 9, !1);
            },
            Loading: function (sMsg) {
                layer.load(sMsg, 3);
            },
            Close: function () { },
            Message: function (sMsg) {
                layer.alert(sMsg, 1, !1);
            },
            Msg: function (sMsg) {
                layer.msg(sMsg);
            },
            //根据传入的对象弹出信息
            ShowBusErr: function (obj, defMsg) {
                if (obj != "" && obj != null && obj != undefined) {
                    switch (obj.ErrCode) {
                        case "202":
                            //业务错误
                            Atour.Ui.Alert(obj.ErrMsg);
                            break;
                        case "201":
                            //异常
                            {
                                if (defMsg == undefined || defMsg == null || defMsg == "") {
                                    Atour.Ui.Alert("操作失败");
                                } else {
                                    Atour.Ui.Alert(defMsg);
                                }
                                break;
                            }
                        case "203":
                            //未登录
                            Atour.Ui.Alert(obj.ErrMsg);
                            window.location = "/Meb/Login";
                            break;
                        default:
                            {
                                if (defMsg == undefined || defMsg == null || defMsg == "") {
                                    Atour.Ui.Alert("未知异常");
                                } else {
                                    Atour.Ui.Alert(defMsg);
                                }
                                break;
                            }
                    }

                }

            }
        }
    }

    if (typeof Atour.Use !== "function") {
        Atour.Use = function (a, b) {
            var d = $("head")[0],
            a = a.replace(/\s/g, ""),
            e = /\.css$/.test(a),
            f = document.createElement(e ? "link" : "script");
            if (e) {
                f.type = "text/css";
                f.rel = "stylesheet";
                f.href = /^http:\/\//.test(a) ? a : a;
            } else {
                f.type = "text/javascript";
                f.src = /^http:\/\//.test(a) ? a : a;
            }
            d.appendChild(f);
        }
    }

    if (typeof Atour.Running !== "function") {
        Atour.Running = function () {
            if (Atour.ie6) {
                window.location.href = "../../ie6update.html";
            }
            Atour.Use("../Script/common/hax_dec.js");
        }
    }

    if (typeof Atour.BackGround !== "object") {
        Atour.BackGround = {
            init: function (imgUrl) {
                var wallpaper = $("#wallpapers");
                var winWh = {
                    w: $(window).width(),
                    h: $(window).height()
                };
                var _this = this;
                if (imgUrl !== null) {
                    wallpaper.html("<img src='" + imgUrl + "'></img>");
                    var img = wallpaper.find("img");
                    _this.getImgWh(imgUrl,
                    function (imgW, imgH) {
                        if (imgW <= winWh.w) {
                            img.css('width', winWh.w);
                        } else {
                            img.css({
                                "margin-left": -(imgW - winWh.w) / 2
                            });
                        }
                        if (imgH <= winWh.h) {
                            img.css('height', winWh.h);
                        } else {
                            img.css({
                                "margin-top": -(imgH - winWh.h) / 2
                            });
                        }
                    });
                }
                //如果窗口大小改变，更新背景布局大小
                window.onresize = function () {
                    _this.init(imgUrl);
                };
            },
            getImgWh: function (url, callback) {
                var width, height, intervalId, check, div, img = new Image(),
                body = document.body;
                img.src = url;
                //从缓存中读取
                if (img.complete) {
                    return callback(img.width, img.height);
                };
                //通过占位提前获取图片头部数据
                if (body) {
                    $("#body_back").remove();
                    div = document.createElement('div');
                    div.id = "body_back";
                    div.style.cssText = 'visibility:hidden;position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden';
                    div.appendChild(img);
                    body.appendChild(div);
                    width = img.offsetWidth;
                    height = img.offsetHeight;
                    check = function () {
                        if (img.offsetWidth !== width || img.offsetHeight !== height) {
                            clearInterval(intervalId);
                            callback(img.offsetWidth, img.clientHeight);
                            img.onload = null;
                            div.innerHTML = '';
                            div.parentNode.removeChild(div);
                        };
                    };
                    intervalId = setInterval(check, 150);
                };
                // 加载完毕后方式获取
                img.onload = function () {
                    callback(img.width, img.height);
                    img.onload = img.onerror = null;
                    clearInterval(intervalId);
                    body && img.parentNode.removeChild(img);
                };
            }
        }
    }

    Atour.Running();

}(window));
/*****************************************************
公用函数：COMMON.UTILS
******************************************************/
(function (a) {
    "use strict";
    if (typeof a.Common !== "object") {
        a.Common = {}
    }
    if (typeof Common.Utils !== "object") {
        Common.Utils = {
            MsBuilder: function (sValue) {
                this.sValues = new Array();
            },
            getQueryStr: function (str) { //获取URL指定传递参数的值
                var url = window.location.href.replace("#", "");
                var rs = new RegExp("(^|[\&\?])" + str + "=([^\&]*)(\&|$)", "gi").exec(url),
                tmp;
                if (tmp = rs) return tmp[2];
                return "";
            },
            D: function () { }
        }
        Common.Utils.MsBuilder.prototype.Append = function (sVal) {
            this.sValues.push(sVal);
        }
        Common.Utils.MsBuilder.prototype.Insert = function (index, sVal) {
            this.sValues.splice(3, 0, sVal);
        }
        Common.Utils.MsBuilder.prototype.toString = function (sVal) {
            return this.sValues.join("");
        }
        //根据一个时间字符串获取时间对象
        Common.Utils.D.prototype.objToDate = function (date) {
            var newdate;
            if (date != undefined && date != null && date != "") {
                var arrdate = date.split("-");
                newdate = new Date(arrdate[1] + '/' + arrdate[2] + '/' + arrdate[0]);
            }
            return newdate;
        }
        //两个时间的差值
        Common.Utils.D.prototype.dayDiff = function (d1, d2) {
            var dd = 0,
            arrd1, arrd2, od1, od2;

            try {
                if (d1 != undefined && d1 != null && d1 != "" && d2 != undefined && d2 != null && d2 != "") {
                    arrd1 = d1.split("-");
                    od1 = new Date(arrd1[1] + '/' + arrd1[2] + '/' + arrd1[0]);
                    arrd2 = d2.split("-");
                    od2 = new Date(arrd2[1] + '/' + arrd2[2] + '/' + arrd2[0]);
                    dd = Math.ceil((od1 - od2) / 86400000);
                }
            } catch (e) { }
            return dd;
        }

    }

    if (typeof Common.Query !== "object") {
        Common.Query = {
            M: function () {
                this._qp = [];
                this._qn = [];
            }
        }
        Common.Query.M.prototype.getString = function (hax) {
            var url_p = "";
            if (this._qp == null || this._qp.length <= 0) {
                return "";
            }
            this._qn.sort();
            //如果有存储参数
            //那么就直接由参数进行
            for (var i = 0; i < this._qp.length; i++) {
                for (var j = 0; j < this._qn.length; j++) {
                    if (this._qp[i].name == this._qn[j]) {
                        if (url_p == "") url_p = this._qp[i].name + "=" + this._qp[i].value;
                        else url_p += "&" + this._qp[i].name + "=" + this._qp[i].value;
                        break;
                    }
                }
            }
            if (hax) {
                url_p = url_p + "&timespan=" + new Date().getTime();
                url_p = url_p.toLocaleLowerCase();
                url_p += "&token=" + hex_sha1(url_p).toLocaleLowerCase();
            }
            return url_p;
        }
        Common.Query.M.prototype.getJson = function () {
            var c = {};
            for (var i = 0; i < this._qp.length; i++) {
                c[this._qp[i].name] = this._qp[i].value;

            }
            return c;
        }
        Common.Query.M.prototype.clearParameters = function (a) {
            if (a == null) {
                this._qp = [];
                return;
            }
            if (this._qp == null || this._qp.length <= 0) {
                return false;
                for (var i = 0; i < this._qp; i++) {
                    if (this._qp[i].name == a) {
                        this._qp.splice(i, this._qp[i]);
                        return true;
                    }
                }
            }
            return false;
        }
        Common.Query.M.prototype.setParameters = function (a, b) {
            var p = {
                name: a,
                value: escape(b)
            };
            if (this._qp == null) {
                this._qp = [];
            }
            this.clearParameters(a);
            this._qp.push(p);
            this._qn.push(a);
        }
    }
}(window));
//给string添加占位符替换方法
String.prototype.formatStr = function () {
    if (arguments.length == 0) return this;
    for (var s = this,
    i = 0; i < arguments.length; i++) s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
};
String.prototype.toDate = function () {
    return new Date(this.replace(/-/g, "/").replace(/(^\s*)|(\s*$)/g, ""));
}
//给日期添加一个新增天数的方法
Date.prototype.addDay = function (value) {
    this.setDate(this.getDate() + value);
    return this;
}
//新增一个月
Date.prototype.addMonth = function (value) {
    this.setMonth(this.getMonth() + value);
    return this;
}
//格式化日期
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var currMonth = this.getMonth() + 1;
    var currYear = this.getFullYear();
    var currDay = this.getDate();
    str = str.replace(/yyyy|YYYY/, currYear);
    str = str.replace(/MM/, currMonth > 9 ? currMonth.toString() : '0' + currMonth);
    str = str.replace(/dd|DD/, currDay > 9 ? currDay.toString() : '0' + currDay);
    return str;
}
//获取下一个月的第一天
Date.prototype._dfk = function () {
    var _ny = this.getFullYear();
    var _nm = this.getMonth() + 1;
    if (_nm == 13) {
        _nm = 1;
        _ny += 1;
    }
    return new Date(_ny, _nm, 1);

}
Date.prototype._MaxDay = function () {
    var cy = this.getFullYear();
    var cm = this.getMonth();
    cm += 1;
    if (cm == 13) {
        cm = 1;
        cy += 1;
    }

    var d = new Date(cy, cm, 0);
    return d.getDate();
}
Date.prototype._Week = function (a, b, c) {
    var d = new Date(a, b, c);
    return d.getDay();
}
//字符串转时间 2012-09-09
Date.prototype.StringToDate = function (s) {
    return new Date(s.replace(/-/g, "/").replace(/(^\s*)|(\s*$)/g, ""));
}
//日期计算
Date.prototype.DateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 'd':
            return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w':
            return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'm':
            return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y':
            return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}