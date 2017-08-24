$(document).ready(function () {
    $(".menu ul li").removeClass("active");
    $(".menu ul li").eq(4).addClass("active");
    var _box = '<div class="product_city_box"><p class="city_name">{0}</p><ul>{1}</ul></div>',
        _item = '<li class="chain_item" chainid={0} cityname="{1}" >{2}</li>',
        products_data = GetData();
    $.each(products_data.Data.Citys, function (a, city) {
        var _str = "";
        $.each(city.Chains, function (b, chain) {
            _str += _item.formatStr(chain.ChainID, city.CityName, chain.ChainName)
        })
        $(".products_list").append(_box.formatStr(city.CityName, _str));
    })
    
    $(".chain_item").on("click", function () {
        var chainid = $(this).attr("chainid"),
            cityname = $(this).attr("cityname"),
            num = 0,
            arrayCitys = products_data.Data,
            hadget = false;
        for (var i in arrayCitys) {
            for (var j in arrayCitys[i]) {
                for (var k in arrayCitys[i][j].Chains) {
                    var objChain = arrayCitys[i][j].Chains[k];
                    if (!hadget) num += 1;
                    if (objChain.ChainID == chainid) {
                        hadget = true;
                    }
                }
            }
        }
        location.href = "/Experience/Products?chainid=" + chainid + "&cityname=" + cityname+"#"+num;
    });
    $(".city_name").on("click", function () {
        $(this).parents(".product_city_box").find(".chain_item").first().click();
    });
});