// JavaScript Document
$(document).ready(function() {
    $(".con-nav>.chufa").click(function() {
        //  $(this).stop().addClass("connava").siblings("a").removeClass("connava");
        var indexNO = $(this).index();
        $(".connent>.con ").eq(indexNO).css("display", "block").siblings().css("display", "none");
    });
})