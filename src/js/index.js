// Slider page product
$(document).ready(function () {
    var elemList = $(".colorTable__item");
    var slideContainer = $(".slider__wrap");
    var currentPosition = 0;
    var widthStep;
    var maxStep;

    function init() {

        for (var i = 0; i < elemList.length; i++) {
            var imgLink = $(elemList[i]).find("img").attr("src");
            var imgAlt = $(elemList[i]).find("span").text();
            var elem = '<li class="slider__item">' + '<a href=' + imgLink + ' class="slider__link">' + '<img src=' + imgLink + '  alt=' + imgAlt + '>' + '</a>' + '</li>';
            $(slideContainer).append(elem);
        }

        widthStep = $('.colorTable__gallery--slider').outerWidth() / 6;
        maxStep = (elemList.length * widthStep) - (widthStep * 6);

        $(".colorTable__gallery--title__name").text($(".product__title h1").text());
    }
    init();

    $(".left").on("click", function () {

        if (currentPosition <= 0) {
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            console.log(currentPosition);
            return;
        }

        currentPosition -= widthStep;
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    })
    $(".right").on("click", function () {
        if (currentPosition == maxStep) {
            currentPosition = maxStep;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            return;
        }
        currentPosition += widthStep;
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    })

    $(".slider__item").on("click", function (event) {
            event.preventDefault();


            $(".colorTable__gallery--img img").attr("src", $(this).find("img").attr("src"));
            $(".colorTable__gallery--title__model").text($(this).find("img").attr("alt"));

        })
        // open popup
    $(elemList).on("click", function (event) {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            $(".colorTable__gallery--img img").attr("src", $(this).find("img").attr("src"));
            $(".colorTable__gallery--title__model").text($(this).find("span").text());

            $(".colorTable__gallery--wrapper").show();

            $(".colorTable__gallery--popup").css({
                "top": $(".colorTable__wrapper").offset().top + "px"
            });
            $("body").css({
                "overflow": "hidden"
            });
            var scroll_el = $(".colorTable__wrapper");
            if ($(scroll_el).length != 0) {
                $('html, body').animate({
                    scrollTop: $(scroll_el).offset().top - 80
                }, 500);
            }
            return false;
            if ($(this).index() >= (elemList.length - 5)) {
                currentPosition = widthStep * ($(this).index() - 5);
            } else {
                currentPosition = widthStep * $(this).index();
            }
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
        }
    })

    $(document).on("click", function (event) {
        if ($(event.target).closest(".js__closePopup").length == 1) {
            $(event.target).closest(".js__popup").hide();
            $("body").css({
                "overflow": "inherit"
            });
            return
        } else if ($(event.target).closest(".colorTable__gallery--popup").length == 1) {
            event.stopPropagation();
            return
        } else if ($(event.target).closest(".js__popup").length == 1) {
            event.stopPropagation();
            $(event.target).closest(".js__popup").hide();
            $("body").css({
                "overflow": "inherit"
            });
            $(".popUP__wrapper").detach();
            return
        }
    })

});


$(".js__videoPopup").on("click", function (event) {
    event.preventDefault();
    var link = $(this).attr('href');
    var popUp_content = '<iframe width="640" height="360" src="' + link + '" frameborder="0" allowfullscreen></iframe>';
    var popUp = '<div class="popUP__wrapper js__popup active"><div class="popUP__video">' + popUp_content + '</div></div>';
    $("body").css({
        "overflow": "hidden"
    });
    $("body").append(popUp);
})


$(window).load(function () {
    $('.header__slider').flexslider({
        animation: "slide",
        slideshow: false,
        touch: true,
        directionNav: false,
        controlNav: true
    });
});


// Jquery UI range

jQuery("#input_range-1").slider({
    min: 0,
    max: 15,
    values: [0, 15],
    range: true
});
jQuery("#input_range-2").slider({
    min: 0,
    max: 11,
    values: [0, 11],
    range: true
});
jQuery("#input_range-3").slider({
    min: 0,
    max: 6,
    values: [0, 6],
    range: true
});

// close product filtr
$(".productList__filtrBlock--close").on("click", function () {
    var filtr = $(".productList__filtrBlock");
    filtr.slideToggle();
    $(".productList__filtrBlock--close").toggleClass("active");
})


// tabs in category header
$("#catalog__tabs").on("click", function (event) {
    event.stopPropagation();
})
$(document).ready(function () {
    $('.accordion-tabs').children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    $('.accordion-tabs').on('click', 'li > a', function (event) {
        if (!$(this).hasClass('is-active')) {
            event.preventDefault();
            $('.accordion-tabs .is-open').removeClass('is-open').hide();
            $(this).next().toggleClass('is-open').toggle();
            $('.accordion-tabs').find('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        } else if ($(this).hasClass('is-active')) {
            event.preventDefault();
            $(this).removeClass('is-active');
            $(this).next().toggleClass('is-open').toggle();
        } else {
            event.preventDefault();
        }
    });
});

$(".headerNav__toggle").on("click", function () {
    $(this).toggleClass("active")
    if ($(this).hasClass("active")) {
        $(".header__top").addClass("nav__active");
        $("body").addClass("nav__active")
    } else {
        $(".header__top").removeClass("nav__active");
        $("body").removeClass("nav__active");
    }

})


$(".tab-head-cont section a").on("click", function (event) {
    event.stopPropagation();
})



// mobile search popup
$(".header__search--btn").on("click", function (event) {
    var w = screen.width;
    if (w < 1180) {
        event.preventDefault();
        if (!$("body").hasClass("nav__active")) {
            $(".header__search--mobile").show();
        }
    }
})
$(document).on("click", function (event) {
    if ($(event.target).closest(".form-group").length == 1) {
        event.stopPropagation();
        return
    } else if ($(event.target).closest(".header__search--mobile").length == 1) {
        $(".header__search--mobile").hide();
        return
    }
})
