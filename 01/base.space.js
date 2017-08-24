var YD = {
    NS: function (ns) {
        if (!ns || !ns.length) return null;
        var levels = ns.split("."), nsobj = YD;
        for (var i = (levels[0] == "YD") ? 1 : 0; i < levels.length; ++i) {
            nsobj[levels[i]] = nsobj[levels[i]] || {};
            nsobj = nsobj[levels[i]];
        }
        return nsobj;
    }
}