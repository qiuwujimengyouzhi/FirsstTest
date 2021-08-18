$(document).ready(function() {
    $('.nav>a').click(function() {
        $(this).stop().addClass("connav").siblings("a").removeClass("connav");
        var indexNO = $(this).index();
        $(".con-all>.con").eq(indexNO).css("display", "block").siblings().css("display", "none");
    })
})