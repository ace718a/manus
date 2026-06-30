

document.addEventListener("DOMContentLoaded", function(e){
    mainVisualSlide ();
    guideSlide ();
    allSlide ();
    partnerSlide ();
    rightMenuHandler();
    headerMenu();
    headerMenu2();
    qnaToggleSlide();
    // allCarTab();
    bestCarTab();
    popUp();
    show();
    applyPopupHandler();

    scroll_end();
    back();
})

const scroll_end = () => { 
    $(document).ready(function () {
        $(window).on("scroll", function () {
          // 현재 스크롤 위치
          const scrollTop = $(this).scrollTop();
      
          // 문서 전체 높이
          const documentHeight = $(document).height();
      
          // 뷰포트 높이
          const windowHeight = $(this).height();
      
          // 스크롤이 맨 끝에 닿았는지 확인
          if (scrollTop + windowHeight >= documentHeight - 10) { // 여유 10px 설정
            $('.apply_sec').hide();
          }else{
            $('.apply_sec').show();
          }
        });
      });
}

const applyPopupHandler = () => {

    //팝업닫기 
    $('.applyPopupSection .btnDiv .closeBtn').click(function(){
        $('.applyPopupSection').addClass('hide');
    })
    $('.applyPopupSection .popupCloseBtn').click(function(){
        $('.applyPopupSection').addClass('hide');
    })

    let now = 0; //팝업 현재 페이지 

    $('.applyPopupSection .item .answerList input[type="radio"] + .content').click(function(){
        showHidePopup();
    })
    $('.applyPopupSection .nextBtn').click(function(){
        showHidePopup();
    })


    const showHidePopup = () => {

        if(now === 1 && $("#car").val() == ""){
            alert('원하시는 차종을 입력해주세요.'); return false;
        }else if(now === 2 && $("#phone").val() == ""){
            alert('핸드폰 번호를 입력해주세요.'); return false;
        }else if(now === 3 && $("#name").val() == ""){
            alert('성함을 입력해주세요.'); return false;
        }
        now = now + 1;
        if(now==4){
            var wr_3 = $('input[name=wr_3]:checked').val(); //출고 희망시기 
            var wr_name=$('#name').val();
            var wr_subject=$('#phone').val();
            var wr_content=$('#car').val();
            $.ajax({
                url:g5_bbs_url + '/quick_inquiry_update.php',
                type:'POST',
                data:{
                    'wr_name' : wr_name,
                    'wr_subject' : wr_subject, 
                    'wr_content' : wr_content,  
                    'wr_3' : wr_3 ,
                    'bo_table' : 'apply', 
                },
                success:function(result){
                    console.log(result);
                    if(result==='OK'){
                        console.log(result);
                        $('.applyPopupSection .stepList > li').removeClass('active');
                        $('.applyPopupSection .contentList > li').removeClass('active');
                        $('.applyPopupSection .stepList > li').eq(now).addClass('active');
                        $('.applyPopupSection .contentList > li').eq(now).addClass('active');
                    }else {
                        return false;
                    }
    
                }
            });
        }else{
            $('.applyPopupSection .stepList > li').removeClass('active');
            $('.applyPopupSection .contentList > li').removeClass('active');
            $('.applyPopupSection .stepList > li').eq(now).addClass('active');
            $('.applyPopupSection .contentList > li').eq(now).addClass('active');
        }
    }

}


    const mainVisualSlide = () => {
        var swiper = new Swiper(".mainSwiper", {
            loop: true,
            loopedSlides: 30,
            centeredSlides: true,
            slidesPerView: 1,
            spaceBetween: 20,
            loopedSlides: 5,
            autoplay: {
                // delay: 2500,
                // disableOnInteraction: false,
            },
            pagination: {
                el: ".main-pagination",
                type: "fraction",
            },
            navigation: {
                nextEl: ".main-button-next",
                prevEl: ".main-button-prev",
            },
            breakpoints: {
                1250: {
                    slidesPerView: 1.1,
                    spaceBetween: 10,
                },
            },
        });
    
    }

    const guideSlide = () => {
        var swiper = new Swiper(".guideSwiper", {
            loop: true,
            loopedSlides: 5,
            // centeredSlides: true,
            // slidesPerView: 1,
            spaceBetween: 20,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            
            navigation: {
                nextEl: ".guide-button-next",
                prevEl: ".guide-button-prev",
            },
        });
    
    }


    const allSlide = () => {
        var swiper1 = new Swiper(".allSwiper.slide1_pc", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide1_pc  .all-button-next",
                prevEl: ".allSwiper.slide1_pc .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper1_mo = new Swiper(".allSwiper.slide1_mo", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide1_mo .all-button-next",
                prevEl: ".allSwiper.slide1_mo .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper2 = new Swiper(".allSwiper.slide2_pc", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide2_pc .all-button-next",
                prevEl: ".allSwiper.slide2_pc .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper2_mo = new Swiper(".allSwiper.slide2_mo", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide2_mo .all-button-next",
                prevEl: ".allSwiper.slide2_mo .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper3 = new Swiper(".allSwiper.slide3_pc", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide3_pc .all-button-next",
                prevEl: ".allSwiper.slide3_pc .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper3_mo = new Swiper(".allSwiper.slide3_mo", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide3_mo .all-button-next",
                prevEl: ".allSwiper.slide3_mo .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper4 = new Swiper(".allSwiper.slide4_pc", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide4_pc .all-button-next",
                prevEl: ".allSwiper.slide4_pc .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper4_mo = new Swiper(".allSwiper.slide4_mo", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide4_mo .all-button-next",
                prevEl: ".allSwiper.slide4_mo .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper5 = new Swiper(".allSwiper.slide5_pc", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide5_pc .all-button-next",
                prevEl: ".allSwiper.slide5_pc .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper5_mo = new Swiper(".allSwiper.slide5_mo", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide5_mo .all-button-next",
                prevEl: ".allSwiper.slide5_mo .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper6 = new Swiper(".allSwiper.slide6_pc", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide6_pc .all-button-next",
                prevEl: ".allSwiper.slide6_pc .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper6_mo = new Swiper(".allSwiper.slide6_mo", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide6_mo .all-button-next",
                prevEl: ".allSwiper.slide6_mo .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });   
        var swiper7 = new Swiper(".allSwiper.slide7_pc", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide7_pc .all-button-next",
                prevEl: ".allSwiper.slide7_pc .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });    
        var swiper7_mo = new Swiper(".allSwiper.slide7_mo", {
            slidesPerView: 1,
            spaceBetween: 100,
            loop: true,
            // loopAdditionalSlides: 1,
            allowTouchMove: false,
            centeredSlides: true,
            navigation: {
                nextEl: ".allSwiper.slide7_mo .all-button-next",
                prevEl: ".allSwiper.slide7_mo .all-button-prev",
            },
            breakpoints: {
                1250: {
                    // slidesPerView: 5,
                },
                720: {
                },
                500: {
                },
            },
            observer: true,
            observeParents: true,
        });     
    }

    const partnerSlide = () => {
        var swiper = new Swiper(".partnerSwiper", {
            slidesPerView: 6,
            spaceBetween: 40,
            loopedSlides: 10,
            autoplay: {
                delay: 0, // important !!
                disableOnInteraction: false,
            },
            speed: 5000,
            loop: true,
            loopAdditionalSlides: 1,
            allowTouchMove: false,
            breakpoints: {
                1250: {
                    slidesPerView: 5,
                },
                720: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                500: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
            },
        });    
        var swiper = new Swiper(".partnerSwiperUnder", {
            slidesPerView: 6,
            spaceBetween: 40,
            loopedSlides: 10,
            autoplay: {
                delay: 0, // important !!
                disableOnInteraction: false,
                reverseDirection: true,
            },
            speed: 5000,
            loop: true,
            loopAdditionalSlides: 1,
            allowTouchMove: false,
            breakpoints: {
                1250: {
                    slidesPerView: 5,
                },
                720: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                500: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
            },
        });    
    }

    const rightMenuHandler = () => {
        $('.hamBtn.grayHamBtn').click(function(){
            // alert('?');
            $('.headerSubDiv').addClass('on'); //classList.add('클레스명') ;
            $('.subDim').addClass('on');
        })
        
        $('.subClose').click(function(){
            // $('.menuContainer').removeClass('on');
            // $('.menuCloseDiv').removeClass('on');
            closeEvent();
        })
        $('.subDim').click(function(){
            // $('.menuContainer').removeClass('on');
            // $('.menuCloseDiv').removeClass('on');
            closeEvent();
        })
    
        const closeEvent = () => {
            $('.headerSubDiv').removeClass('on');
            $('.subDim').removeClass('on');
        }
    }
    
    const headerMenu = () => {

        $(".scroll_move").click(function(e){  
            e.preventDefault();       
            $('html,body').animate({scrollTop:$(this.hash).offset().top}, 1000);
        });
    }

    const headerMenu2 = () => {

    $(".scroll_move").click(function(e){  
        var header_height = $('header').outerHeight(true);
        e.preventDefault();       
        $('html,body').animate({scrollTop:$(this.hash).offset().top - header_height}, 1000);
        $('.headerSubDiv').removeClass('on');
        $('.subDim').removeClass('on');
    });

    
    }

// qna 토글
    const qnaToggleSlide = () => {
        $('section.QnA .QnAUl .QnAList .questionDiv').click(function(){
            $(this).siblings('.answerBox').slideToggle()
            // this : .questionDiv
            // siblings: 형제들 선택 
            // find: 자식,손자,뭐든 선택 
            $(this).parent('.QnAList').toggleClass('active')
        })
    }

    // best 탭메뉴
    const bestCarTab = () => {
        $('.best ul.tabMenuUl li.tabList').click(function(){
            const thisDiv = $(this);
            const clickNumber1 = $(this).index(); //현재 클릭한 번호 
            $.ajax({
                url:g5_bbs_url + '/sort_popular_car_data.php',
                type:'POST',
                data:{
                    'sort_by' : clickNumber1,
                    'page' : 1,
                },
                success:function(result){
                    console.log(result);
                    if(result.message==='SUCCESS'){
                        $('.best ul.tabMenuUl li.tabList').removeClass('active');
                        thisDiv.addClass('active');
                        page=1;
                        sortBy=clickNumber1;
                        $('#bestUl').empty();
                        $('#bestUl').html(result.html_content);
                    }else {
                        return false;
                    }
    
                }
            });
        })

        $('#popular_car_prevBtn').click(function(){
            $.ajax({
                url:g5_bbs_url + '/sort_popular_car_data.php',
                type:'POST',
                data:{
                    'sort_by' : sortBy,
                    'page' : page-1,
                },
                success:function(result){
                    console.log(result);
                    if(page === 1){
                        alert('첫번째 페이지입니다'); return false;
                    }else if(result.message==='SUCCESS'){
                        page--;
                        $('#bestUl').empty();
                        $('#bestUl').html(result.html_content);
                        // $('html,body').animate({scrollTop:$('#popular_focus').offset().top}, 1000);
                        $('html, body').scrollTop($('#popular_focus').offset().top);
                    }else {
                        return false;
                    }
    
                }
            });
        })
        $('#popular_car_nextBtn').click(function(){
            console.log(g5_bbs_url,'g5_bbs_url');
            console.log(sortBy,'sortBy');
            console.log(page,'page');
            $.ajax({
                url:g5_bbs_url + '/sort_popular_car_data.php',
                type:'POST',
                data:{
                    'sort_by' : sortBy,
                    'page' : page+1,
                },
                success:function(result){
                    console.log(result);
                    if(result.message==='SUCCESS'){
                        if(result.total_pages==page){
                            // page=1;
                            alert('마지막 페이지입니다.'); return false;
                        }else{
                            page++;
                        }
                        $('#bestUl').empty();
                        $('#bestUl').html(result.html_content);
                        // $('html,body').animate({scrollTop:$('#popular_focus').offset().top}, 1000);
                        $('html, body').scrollTop($('#popular_focus').offset().top);

                    }else {
                        console.error('Unexpected result:', result);
                        return false;
                    }
    
                }
            });
        })
    }



// all 탭 메뉴
    const allCarTab = () => {
        $('section.all ul.tabMenuUl .tabList').click(function(){
    
            const clickNumber = $(this).index(); //현재 클릭한 번호 
    
            $('section.all ul.tabMenuUl .tabList').removeClass('active')
            $(this).addClass('active')
    
            $('section.all ul.contentList > li').removeClass('active')
            $('section.all ul.contentList > li').eq(clickNumber).addClass('active');
        })
    }
    
// 팝업 개인정보
    const popUp = () => {
        $('.privacy').click(function(){
            $('#privacyPopup').addClass('active');
        })
        $('.person').click(function(){
            $('#thirdPopup').addClass('active');
        })
        $('.use').click(function(){
            $('#usePopup').addClass('active');
        })
        $('.privacyPopup .contentWrap .titleBox .closeBtn').click(function(){
            $('.privacyPopup').removeClass('active');
        })
        $('.privacyPopup').click(function(){
            $('.privacyPopup').removeClass('active')
        })
        $('.privacyPopup .contentWrap').click(function(e){
            e.stopPropagation()
        })
    }

    // 견적 신청
    const join = () => {
        $('.headerSubDiv a.promotionBtn').click(function(){
            $('.f_popup_bg').addClass('on');
        })
        $('.f_popup_bg').click(function(){
            $('.f_popup_bg').removeClass('on');
        })
        $('.f_popup_bg .content_wrap').click(function(e){
            e.stopPropagation();
        })
    }

    const show = () => {

        // ✅ 동적으로 생기는 애들까지 모두 처리 (이벤트 위임)
        $(document)
          .off('click', 'section.guide .guideSwiper ul.guideUl li')
          .on('click', 'section.guide .guideSwiper ul.guideUl li', function (e) {
            e.preventDefault();
            const subject = $(this).data('subject');
            $('#wr_content').val(subject || '');
            $('section.form .formDiv').addClass('show');
            $('.formDim').addClass('show');
          });
      
        $(document)
          .off('click', 'section.all .allUl .allList .allDiv')
          .on('click', 'section.all .allUl .allList .allDiv', function (e) {
            e.preventDefault();
            const subject = $(this).data('subject');
            $('#wr_content').val(subject || '');
            $('section.form .formDiv').addClass('show');
            $('.formDim').addClass('show');
          });
      
        $(document)
          .off('click', '.sec1_Btn')
          .on('click', '.sec1_Btn', function (e) {
            e.preventDefault();
            const subject = $(this).data('subject');
            $('#wr_content').val(subject || '');
            $('section.form .formDiv').addClass('show');
            $('.formDim').addClass('show');
          });
      
        $(document)
          .off('click', '.headerSubDiv a.promotionBtn')
          .on('click', '.headerSubDiv a.promotionBtn', function (e) {
            e.preventDefault();
            $('section.form .formDiv').addClass('show');
            $('.formDim').addClass('show');
          });
      
        // ✅ 닫기(얘들도 동적으로 바뀔 수 있으면 위임이 안전)
        $(document)
          .off('click', 'section.form .closeBtn')
          .on('click', 'section.form .closeBtn', function (e) {
            e.preventDefault();
            $('section.form .formDiv').removeClass('show');
            $('.formDim').removeClass('show');
          });
      
        $(document)
          .off('click', '.formDim')
          .on('click', '.formDim', function (e) {
            e.preventDefault();
            $('section.form .formDiv').removeClass('show');
            $('.formDim').removeClass('show');
          });
      };
      
    const back = () => {
    }