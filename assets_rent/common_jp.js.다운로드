document.addEventListener("DOMContentLoaded", function(e){
    animationOnHandler();
    headerScrollHandler();
})
document.addEventListener("scroll", function(){
    animationOnHandler();
})

const headerScrollHandler = () => {
    /* header */
    const header_main = document.querySelector('header');

    if(header_main){
        document.addEventListener("scroll", function(){
            let scroll_top = window.scrollY;
            if(scroll_top > 0){
                header_main.classList.add("on");
            }else{
                header_main.classList.remove("on");
            }
        })
    }
}

const animationOnHandler = () => {

    const scroll_y = window.scrollY + (window.innerHeight / 1.5) ;
    const animationContainer = document.querySelectorAll('.ani')
    animationContainer.forEach(element => {
        const itemTop = element.getBoundingClientRect().top + window.scrollY;
        if((scroll_y) > itemTop){
            element.classList.add('on');

            if ($('main.main').length > 0) {
                $('header ul.headerUl li.headerList').removeClass('active');
                if(element.classList[0] === 'mainVisual'){
                    $('header ul.headerUl li.headerList').eq(0).addClass('active');
                }else if(element.classList[0] === 'guide'){
                    $('header ul.headerUl li.headerList').eq(1).addClass('active');
                }else if(element.classList[0] === 'review'){
                    $('header ul.headerUl li.headerList').eq(3).addClass('active');
                }else if(element.classList[0] === 'QnA'){
                    $('header ul.headerUl li.headerList').eq(4).addClass('active');
                }
            }

        }else{
            element.classList.remove('on');
        }
    });


    // const countList = document.querySelectorAll('.ani');
    // if (countList.length) {
    //     // Intersection Observer to detect visibility

        
    //     const observer = new IntersectionObserver(entries => {
            
    //         countList.forEach(item => observer.observe(item));


    //         entries.forEach(entry => {
    //             if (entry.isIntersecting) {
    //                 entry.target.classList.add('on');
    //                 console.log(entry.target.classList[0]);
    //                 if ($('main.main').length > 0) {
    //                     $('header ul.headerUl li.headerList').removeClass('active');
    //                     if(entry.target.classList[0] === 'mainVisual'){
    //                         $('header ul.headerUl li.headerList').eq(0).addClass('active');
    //                     }else if(entry.target.classList[0] === 'guide'){
    //                         $('header ul.headerUl li.headerList').eq(1).addClass('active');
    //                     }else if(entry.target.classList[0] === 'review'){
    //                         $('header ul.headerUl li.headerList').eq(3).addClass('active');
    //                     }else if(entry.target.classList[0] === 'QnA'){
    //                         $('header ul.headerUl li.headerList').eq(4).addClass('active');
    //                     }
    //                 }
    //             } else {
    //                 entry.target.classList.remove('on');
    //             }
    //         });
    //     }, {
    //         threshold: 0.1 // Adjust threshold as needed
    //     });
        
    //     // Observe each .ani element
    //     countList.forEach(element => observer.observe(element));
    // }
}