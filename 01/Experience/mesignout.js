
$(function () {
    var mebid = $("#_mebid").val();
    if (mebid == undefined || mebid == null || mebid == "" || mebid < 1) {
        $(".login_place a").eq(1).hide();
        $(".login_place a").eq(0).show();
    } else {
        $(".login_place a").eq(0).hide();
        $(".login_place a").eq(1).show();
    }

    $(".login_place a").eq(0).bind("click", function () {
        window.location = "/Meb/Login";
    })
    $(".login_place a").eq(1).bind("click", function () {
        window.location = "/Meb/SignOut";
        $(this).hide();
        $(".login_place a").eq(0).show();
    })
})

