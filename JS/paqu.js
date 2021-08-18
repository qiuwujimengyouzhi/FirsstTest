$(document).ready(function() {
    $(".nav li").mouseenter(function() {
        $(this).addClass("navhover").siblings("li").removeClass("navhover");
    });
    $(".nav").mouseleave(function() {
        $(".nav li:last").prev().addClass("navhover").siblings("li").removeClass("navhover");
    });
})