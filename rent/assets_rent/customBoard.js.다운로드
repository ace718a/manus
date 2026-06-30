

document.addEventListener("DOMContentLoaded", function(e){

    /* 목록, 상세 페이지 메뉴 */
    $('.menuBox .menuList .item').click(function(){
        $('.menuBox .menuList .item').not(this).siblings('.subMenu').removeClass('show');
        $(this).siblings('.subMenu').toggleClass('show');
    })
    $('body').click(function(){ $('.menuBox .menuList .subMenu').removeClass('show'); })
    $('.menuBox .menuList').click(function(e){ e.stopPropagation(); })

    /* 댓글 메뉴 */
    $('.boardViewArti .commentArti .commentBox .commentTitle .btnWrap').click(function(){
        $('.boardViewArti .commentArti .commentBox .commentTitle .btnWrap').not(this).children('.subMenu').removeClass('show')
        $(this).children('.subMenu').toggleClass('show')
    })
    $('body').click(function(){ $('.boardViewArti .commentArti .commentBox .commentTitle .btnWrap .subMenu').removeClass('show') })
    $('.boardViewArti .commentArti .commentBox .commentTitle .btnWrap').click(function(e){ e.stopPropagation(); })
    /* 댓글 토글 */
    $('.boardViewArti .commentArti .commentBtn .toggleBtn').click(function(){
        $('.boardViewArti .commentArti .commentList').toggle()
        $('.boardViewArti .commentArti .commentBtn .toggleBtn').toggleClass('show');
    })
})


