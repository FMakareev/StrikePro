$(document).ready(function () {
    var body = $("body");

    var colorTable = $('.colorTable'),
        characteristicsList = $('.characteristics__list'),
        slideContainer = $(".slider__wrap"),
        galleryWrap = $('.colorTable__gallery--wrapper'),
        gallerySliderWrap = $('.colorTable__gallery--slider'),
        galleryPhotoList = $('.variation__list'),
        galleryMainPhoto = $('.colorTable__gallery--img img'),
        galleryMainTitle = $('.colorTable__gallery--title');

    var colorTableItem = [],
        sliderItem = [],
        currentPhoto = [];

    var currentPosition = 0,
        widthStep,
        maxStep;

    // функции генераторы разметки

    function colorTableItemRender(id, image, data) {
        var title = '';
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].title === 'Код цвета') {
                title = data.features[i].pivot.value
            }
        }
        return ('<div class="colorTable__item" id="' + id + '">' +
            '<img src="' + image + '" alt="">' +
            '<span>' + title + '</span>' +
            '</div>')
    }

    function descriptionRender(array) {
        var features = [];
        $(characteristicsList).empty();
        for (var i = 0; i < array.length; i++) {
            var feature = '<li class="characteristics__item">' +
                '<span class="characteristics__title">' + array[i].title + '</span>' +
                '<span class="characteristics__desc">' + array[i].pivot.value + '</span>' +
                '</li>';
            features.push(feature);
        }
        $(characteristicsList).append(features);
    }

    function sliderItemRender(image, id, data) {
        var title = '';
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].title === 'Код цвета') {
                title = data.features[i].pivot.value
            }
        }
        return (
            '<li  class="slider__item" id="' + id + '"> <a href="#!"  class="slider__link" ><img src="' + image + '" /></a><span class="slider__item-title">' + title + '</span> </li>'
        )
    }

    function gelleryPhotoRender(Array) {
        var photos = [];
        var array = Array;

        if (array === undefined) {
            console.log(array);
            // initGalleryMainPhoto(array[i].id);
            return null;
        }
        if (array.length > 1) {
            for (var i = 0; i < array.length; i++) {
                var photo = '<li class="variation__item">' +
                    '<img id="' + array[i].id + '" src="' + array[i].thumb_url + '" alt="">' +
                    '</li>';
                photos.push(photo);
                // if (i === 0) {
                //     initGalleryMainPhoto(array[i].id);
                // }
            }
            $(galleryPhotoList).append(photos);
            $('.colorTable__gallery--variation').addClass('active');

            $('.variation__item img').on('click', function () {
                // initGalleryMainPhoto($(this).attr('id'));

                for (var i = 0; i < array.length; i++) {
                    if (array[i].id === parseInt($(this).attr('id'))) {

                        $(galleryMainPhoto).attr('src', array[i].original_url);
                        if (array[i].title) {
                            $(galleryMainTitle).text(array[i].title);
                        }
                    }
                }


                $(galleryMainPhoto).css({
                    'transform': 'none'
                })
            })
        } else {
            return null;
        }
    }

    // функции движения слайдера

    function leftMove(event) {
        console.log(event.type);
        var step = event.type === 'click' ? 6 : 1;
        if (sliderItem.length <= 6) {
            return
        }

        if (currentPosition <= 0) {
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });

            return;
        }

        currentPosition -= parseFloat(widthStep * step);
        if (currentPosition <= 0) {
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });

            return;
        }
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    }

    function rightMove(event) {
        var step = event.type === 'click' ? 6 : 1;
        if (sliderItem.length <= 6) {
            return
        }
        if (Math.round(parseFloat(currentPosition)) === Math.round(parseFloat(maxStep))) {
            currentPosition = parseFloat(maxStep);
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            return;
        }
        currentPosition += parseFloat(widthStep * step);
        if (Math.round(parseFloat(currentPosition)) >= Math.round(parseFloat(maxStep))) {
            currentPosition = parseFloat(maxStep);
            $(slideContainer).css({
                "transform": "translateX(-" + currentPosition + "px)"
            });
            return;
        }
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });
    }

    function initGallery() {
        var windowSize = window.innerWidth;
        if (windowSize >= 768) {
            $(galleryWrap).show();
            $(body).css({
                "overflow": "hidden"
            });

            var $panzoom = $(galleryMainPhoto).panzoom();
            $panzoom.parent().on('mousewheel.focal', function (e) {
                e.preventDefault();
                var delta = e.delta || e.originalEvent.wheelDelta;
                var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                $panzoom.panzoom('zoom', zoomOut, {
                    increment: 0.1,
                    animate: false,
                    focal: e,
                    minScale: 1
                });
            });


            return initSlider(this);
        }
        return false;
    }

    function initSlider(event) {
        console.log(event);
        sliderItem = [];
        (slideContainer).empty();
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            console.log(articles[i]);
            if (articles[i].logo) {
                sliderItem.push(sliderItemRender(articles[i].logo.thumb_url, articles[i].id, articles[i]))
            } else {
                sliderItem.push(sliderItemRender('http://cdn.strikepro.ru/default_group.png', articles[i].id, articles[i]))
            }
        }
        $(slideContainer).append(sliderItem);

        widthStep = (parseFloat($(gallerySliderWrap).outerWidth() / 6)).toFixed(3);
        maxStep = (parseFloat((sliderItem.length * widthStep) - (widthStep * 6))).toFixed(3);

        currentPosition = 0;
        $(slideContainer).css({
            "transform": "translateX(-" + currentPosition + "px)"
        });


        $(".slider__item").each(function (index, element) {

            if (parseInt($(element).attr('id')) === parseInt($(event).attr('id'))) {
                $(element).addClass('active');
                if (index + 1 > 6) {
                    currentPosition = (parseFloat(((index + 1) * widthStep) - (widthStep * 6))).toFixed(3);
                    $(slideContainer).css({
                        "transform": "translateX(-" + currentPosition + "px)"
                    });
                }
            }
        });

        initDescription($(event).attr('id'));
        initPhotos($(event).attr('id'));

        $(".slider__item").on('click', function (e) {
            e.preventDefault();
            initDescription($(this).attr('id'));
            initPhotos($(this).attr('id'));
            $(".slider__item").removeClass('active');
            $(this).addClass('active');

            $(galleryMainPhoto).css({
                'transform': 'none'
            })
        })
    }

    function initDescription(id) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                descriptionRender(articles[i].features);
            }
        }
    }

    function initPhotos(id) {
        $(galleryPhotoList).empty();
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {
                console.log(articles[i]);
                initGalleryMainPhoto(articles[i].id);
                gelleryPhotoRender(articles[i].head_images);
            }
        }
    }

    function initGalleryMainPhoto(id) {
        console.log(id);
        console.log(currentPhoto);
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id === parseInt(id)) {

                $(galleryMainPhoto).attr('src', articles[i].logo.original_url);
                $(galleryMainTitle).text(articles[i].fullname);
            }
        }
    }

    function init() {
        try {
            var windowSize = window.innerWidth;
            $(colorTable).empty();
            $(colorTable).after("<div class='colorTable _mobile'></div>");
            $(".left").on("click", leftMove);
            $(".right").on("click", rightMove);

            for (var i = 0; i < articles.length; i++) {
                if (articles[i].logo) {
                    colorTableItem.push(colorTableItemRender(articles[i].id, articles[i].logo.thumb_url ? articles[i].logo.thumb_url : 'http://cdn.strikepro.ru/default_group.png', articles[i]));
                } else {
                    colorTableItem.push(colorTableItemRender(articles[i].id, 'http://cdn.strikepro.ru/default_group.png', articles[i]));
                }
            }
            $(colorTable).append(colorTableItem);
            $('.colorTable._mobile').append(colorTableItem);
            $('.colorTable._desctop .colorTable__item').on('click', initGallery);
            if (windowSize >= 768) {

            } else {
                colorTable_item_slider();
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    function colorTable_item_slider() {
        var colorTableItemMobile = $('.colorTable._mobile .colorTable__item');
        var colorTableItemMobileLength = colorTableItemMobile.length;
        for (var i = 0; i < colorTableItemMobileLength; i++) {
            var slides = [];
            var classNav = ".custom-navigation-" + i + " a";
            var photos = articles[i].head_images;
            console.log(photos);
            var photosLength = photos ? photos.length : 1;
            console.log(photosLength);
            if (photosLength === 1) continue;

            var sliderWrap = document.createElement('div'),
                sliderList = document.createElement('ul');
            $(sliderWrap).addClass('slider-' + i);
            $(sliderList).addClass('slides');

            for (var a = 0; a < photosLength; a++) {
                var li = document.createElement('li'),
                    img = document.createElement('img'),
                    span = document.createElement('span');
                $(span).text(photos[a].title);
                $(img).attr('src', photos[a].original_url);
                $(li).append(img);
                $(li).append(span);
                slides.push(li)
            }

            $(sliderList).append(slides);
            $(sliderWrap).append(sliderList);
            $(sliderWrap).append('<div class="flex-direction-nav ' + "custom-navigation-" + i + '">' +
                '<a href="#" class="flex-prev">' +
                '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="caret__arrow"></use></svg>' +
                '</a>' +
                '<a href="#" class="flex-next">' +
                '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg_arrow" class="caret__arrow"></use></svg>' +
                '</a>' +
                '</div>');


            $(colorTableItemMobile[i]).empty();
            $(colorTableItemMobile[i]).append(sliderWrap);

            $(sliderWrap).flexslider({
                animation: "slide",
                slideshow: false,
                touch: true,
                directionNav: true,
                controlNav: false,
                customDirectionNav: $(classNav)
            });

        }
    }


    addEventListener("keydown", function (event) {
        var active = $('.colorTable__gallery--wrapper').css('display');
        if (active === 'block') {

            if (event.which === 37) { //left
                leftMove(event);
            }
            if (event.which === 39) { // right
                rightMove(event);
            }
            if (event.which === 38) { // top
                $('.colorTable__gallery--variation').scrollTop($('.colorTable__gallery--variation').scrollTop() - 10);
            }
            if (event.which === 40) { // bottom
                $('.colorTable__gallery--variation').scrollTop($('.colorTable__gallery--variation').scrollTop() + 10);
            }
        }
    });


    try {
        init();
    } catch (err) {
        console.log(err)
    }

    $(window).resize(function () {
        var windowSize = window.innerWidth;
        if (windowSize >= 992) {
            widthStep = (parseFloat($(gallerySliderWrap).outerWidth() / 6)).toFixed(3);
            maxStep = (parseFloat((sliderItem.length * widthStep) - (widthStep * 6))).toFixed(3);
            currentPosition = 0;
            $(slideContainer).css({
                "transform": "translateX(0px)"
            });
        } else {
            colorTable_item_slider();
        }
    });

});


$(document).ready(function () {
    $(".js-btn3D").on("click", function () {
        console.log('click')
        var img3D = $('#reel-image');
        $(img3D).reel({
            loops: true,
            speed: 0.5,
            frames: 6,
            revolution: 100,
            images: "http://test.vostrel.net/jquery.reel/example/object-movie-non-looping-sequence/green/#.png"
        });

        $(".img_2d").hide();
        $('#reel-image-reel').show();
        $(img3D).show()
    });
    $(".product__sliderImg ul li a").on('click', function (event) {
        console.log('click')

        var img2D = $(".img_2d");
        var img3D = $('#reel-image');
        event.preventDefault();
        $(img2D).show();
        $(img2D).attr("src", $(this).attr("href"));
        $(img3D).hide();
        $('#reel-image-reel').hide();
    });
    $(window).resize(function () {
        var k = 500 / 304,
            productStand = $('.product__stand'),
            w = screen.width;

        if (w < 500) {
            $(productStand).height($(productStand).width() / k);
        }
    });


    //TODO: ШАПКА СТРАНИЦЫ ПРОДУКТА
    var HeaderProductWrapper = $('.header-product'),
        HeaderProductTitle = $('.header-product__title'),
        HeaderProductImage = $('.header-product__image img'),
        HeaderProductNav = $('.header-product__nav'),
        SectionTitleList = $('h4.title__xs'),
        HeaderProductMenuList = [];

    function renderMenuItem(link, content) {
        return ('<li class="header-product__item"><a href="#' + link + '" class="header-product__link">' + content + '</a></li>')
    }

    function init() {
        $(SectionTitleList).each(function (index, element) {
            var id = 'product-section-id-' + index,
                content = $(element).text();
            $(element).attr("id", id);
            HeaderProductMenuList.push(renderMenuItem(id, content));
        });
        $(HeaderProductNav).append(HeaderProductMenuList);
        $(HeaderProductImage).attr('src', $('.product__stand--img .img_2d').attr('src'));
        $(HeaderProductTitle).text($('.product__title h1').text());

        //TODO: Инициализация обработчика скрола
        initScroll(window);
        initAncorHeaderProduct();
    }


    init();

    function initAncorHeaderProduct() {
        $('.header-product__nav .headerNav__item').on("click", "a", function (event) {
            //отменяем стандартную обработку нажатия по ссылке
            event.preventDefault();
            $('.header-product__nav .headerNav__item').each(function (index, element) {
                $(element).removeClass('active');
            });
            //забираем идентификатор бока с атрибута href
            var id = $(this).attr('href'),

                //узнаем высоту от начала страницы до блока на который ссылается якорь
                top = $(id).offset().top;
            $(this).closest('.headerNav__item').addClass('active');
            //анимируем переход на расстояние - top за 1500 мс
            $('body,html').animate({scrollTop: top}, 225);
        });
    }

    function HeaderProductMenuToggle() {
        var list = $('.header-product__nav .headerNav__item');

        $(SectionTitleList).each(function (index, element) {

            if ($(element).offset().top - 200 < window.scrollY) {
                $(list).each(function (index, element) {
                    $(element).removeClass('active');
                });
                $(list[index]).addClass('active')
            }
        });
    }

    function HeaderProductToggle() {
        if (screen.width > 1023) {
            if ($(".img_2d").offset().top < window.scrollY) {

                $('.header__top').css({top: '-150px'});
                $('.header-product').css({top: '0'});
            } else {
                $('.header__top').css({top: '0'});
                $('.header-product').css({top: '-150px'});

            }
        }
    }

    // $(".img_2d").offset()

    function initScroll(elem) {
        if (elem.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                elem.addEventListener("wheel", onWheel);
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                elem.addEventListener("mousewheel", onWheel);
            } else {
                // Firefox < 17
                elem.addEventListener("MozMousePixelScroll", onWheel);
            }
        } else { // IE8-
            elem.attachEvent("onmousewheel", onWheel);
        }

        function onWheel(e) {
            e = e || window.event;

            // wheelDelta не дает возможность узнать количество пикселей
            var delta = e.deltaY || e.detail || e.wheelDelta;

            HeaderProductToggle();
            HeaderProductMenuToggle();
        }
    }

});


$(document).ready(function () {

    var productDescription = $('.js-product-description');
    var productDescriptionHeight = '';

    function init() {
        productDescriptionHeight = $(productDescription).innerHeight();
        var prevElemHeight;

        if ($(productDescription).find('.tile__wrapper').length === 0) {
            if (screen.width >= 992) {
                prevElemHeight = $(productDescription).innerWidth() / 6;
            } else if (screen.width >= 768) {
                prevElemHeight = $(productDescription).innerWidth() / 4;
            } else if (screen.width >= 500 && screen.width < 768) {
                prevElemHeight = $(productDescription).innerWidth() / 2
            } else if (screen.width >= 320 && screen.width < 500) {
                prevElemHeight = $(productDescription).innerWidth();
            } else {
                $(this).outerHeight('auto');
                $(this).removeClass('product-desc__disable');
                return
            }
        } else if (screen.width >= 992) {
            prevElemHeight = $(productDescription).innerWidth() / 2;
        } else if (screen.width >= 768) {
            prevElemHeight = $(productDescription).innerWidth() / 1.5;
        } else if (screen.width >= 320 && screen.width < 500) {
            prevElemHeight = $(productDescription).innerWidth() * 2;
        } else {
            $(this).outerHeight('auto');
            $(this).removeClass('product-desc__disable');
            return
        }

        if (prevElemHeight > productDescriptionHeight) {
            $(this).outerHeight('auto');
            $(this).removeClass('product-desc__disable');
            return
        }

        $(productDescription).addClass('product-desc__disable');
        $(productDescription).innerHeight(prevElemHeight);
        $(productDescription).on('click', function () {
            if ($(this).hasClass('product-desc__disable')) {
                $(this).outerHeight('auto');
                $(this).removeClass('product-desc__disable')
            } else {
                // $(this).outerHeight(prevElemHeight);
                // $(this).addClass('product-desc__disable')
            }

        })
    }

    init();
    $(window).resize(function () {
        init();
    })
});


window.articles = [{
    "id": 1257989,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#A70-713",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "5",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2488,
        "original": "1257989_0_headimage.jpg",
        "thumb": "1257989_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257989",
        "order": "0",
        "created_at": "2017-10-08 16:51:50",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257989_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257989_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2488,
        "original": "1257989_0_headimage.jpg",
        "thumb": "1257989_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257989",
        "order": "0",
        "created_at": "2017-10-08 16:51:50",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257989_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257989_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1257989", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257989", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257989", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257989", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257989", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257989", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257989", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257989", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257989", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257989", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257989", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257989", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257989", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257989", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257989", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257989", "feature_id": "58", "value": "A70-713"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1257989", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1257991,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#AC202F",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2489,
        "original": "1257991_0_headimage.jpg",
        "thumb": "1257991_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257991",
        "order": "0",
        "created_at": "2017-10-08 16:51:50",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257991_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257991_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2489,
        "original": "1257991_0_headimage.jpg",
        "thumb": "1257991_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257991",
        "order": "0",
        "created_at": "2017-10-08 16:51:50",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257991_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257991_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1257991", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257991", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257991", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257991", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257991", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257991", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257991", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257991", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257991", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257991", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257991", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257991", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257991", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257991", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257991", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257991", "feature_id": "58", "value": "AC202F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1257991", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1257992,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#C242F",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2490,
        "original": "1257992_0_headimage.jpg",
        "thumb": "1257992_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257992",
        "order": "0",
        "created_at": "2017-10-08 16:51:51",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257992_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257992_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2490,
        "original": "1257992_0_headimage.jpg",
        "thumb": "1257992_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257992",
        "order": "0",
        "created_at": "2017-10-08 16:51:51",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257992_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257992_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1257992", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257992", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257992", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257992", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257992", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257992", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257992", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257992", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257992", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257992", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257992", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257992", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257992", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257992", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257992", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257992", "feature_id": "58", "value": "C242F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1257992", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1257993,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#C382F",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "5",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2491,
        "original": "1257993_0_headimage.jpg",
        "thumb": "1257993_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257993",
        "order": "0",
        "created_at": "2017-10-08 16:51:51",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257993_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257993_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2491,
        "original": "1257993_0_headimage.jpg",
        "thumb": "1257993_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257993",
        "order": "0",
        "created_at": "2017-10-08 16:51:51",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257993_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257993_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1257993", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257993", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257993", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257993", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257993", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257993", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257993", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257993", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257993", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257993", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257993", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257993", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257993", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257993", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257993", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257993", "feature_id": "58", "value": "C382F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1257993", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1257994,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#C384F",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2492,
        "original": "1257994_0_headimage.jpg",
        "thumb": "1257994_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257994",
        "order": "0",
        "created_at": "2017-10-08 16:51:51",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257994_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257994_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2492,
        "original": "1257994_0_headimage.jpg",
        "thumb": "1257994_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1257994",
        "order": "0",
        "created_at": "2017-10-08 16:51:51",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1257994_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1257994_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1257994", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257994", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257994", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1257994", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257994", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257994", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1257994", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257994", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257994", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257994", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1257994", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257994", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257994", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257994", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257994", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1257994", "feature_id": "58", "value": "C384F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1257994", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1258175,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#AC390F",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2493,
        "original": "1258175_0_headimage.jpg",
        "thumb": "1258175_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258175",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1258175_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258175_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2493,
        "original": "1258175_0_headimage.jpg",
        "thumb": "1258175_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258175",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1258175_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258175_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1258175", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258175", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258175", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258175", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258175", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258175", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258175", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258175", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258175", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258175", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258175", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258175", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258175", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258175", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258175", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258175", "feature_id": "58", "value": "AC390F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1258175", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1258176,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#AC450F",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2494,
        "original": "1258176_0_headimage.jpg",
        "thumb": "1258176_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258176",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1258176_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258176_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2494,
        "original": "1258176_0_headimage.jpg",
        "thumb": "1258176_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258176",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1258176_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258176_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1258176", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258176", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258176", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258176", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258176", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258176", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258176", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258176", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258176", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258176", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258176", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258176", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258176", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258176", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258176", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258176", "feature_id": "58", "value": "AC450F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1258176", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1258177,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#C478F",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м WOLF COLOR",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2495,
        "original": "1258177_0_headimage.jpg",
        "thumb": "1258177_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258177",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1258177_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258177_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2495,
        "original": "1258177_0_headimage.jpg",
        "thumb": "1258177_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1258177",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1258177_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1258177_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1258177", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258177", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258177", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1258177", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258177", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258177", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1258177", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258177", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258177", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258177", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1258177", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258177", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258177", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258177", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258177", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1258177", "feature_id": "58", "value": "C478F"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1258177", "feature_id": "64", "value": "Джеркбейт"}
    }]
}, {
    "id": 1259153,
    "group_id": "1154",
    "new": "0",
    "sale": "0",
    "code": "EG-078#C606E",
    "name": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "fullname": "Джеркбейт Strike Pro Big Bandit тонущий 19,5см  98гр  Загл.1,0-3,0м",
    "cols": "1",
    "og_url": "",
    "og_image": "",
    "og_type": "",
    "og_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "meta_title": "",
    "manufacturer_id": "6",
    "in_stock": "0",
    "created_at": "2017-10-07 20:24:59",
    "updated_at": "2017-10-07 20:24:59",
    "logo": {
        "id": 2496,
        "original": "1259153_0_headimage.jpg",
        "thumb": "1259153_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1259153",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1259153_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1259153_0_headimage.jpg"
    },
    "head_images": [{
        "id": 2496,
        "original": "1259153_0_headimage.jpg",
        "thumb": "1259153_0_headimage_thumbnail.jpg",
        "title": "",
        "primary": "1",
        "area": "article",
        "type": "headimage",
        "groups_or_article_id": "1259153",
        "order": "0",
        "created_at": "2017-10-08 16:51:52",
        "updated_at": "2017-10-11 21:53:23",
        "thumb_url": "http://cdn.strikepro.ru/article/1259153_0_headimage_thumbnail.jpg",
        "original_url": "http://cdn.strikepro.ru/article/1259153_0_headimage.jpg"
    }],
    "features": [{
        "id": 14,
        "title": "Продажи Онлайн",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "bool",
        "is_visible": "0",
        "1C_key": "34fe49b1-de34-11e6-83a8-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-12 15:39:27",
        "pivot": {"group_article_id": "1259153", "feature_id": "14", "value": "Да"}
    }, {
        "id": 19,
        "title": "Страна производителя",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "a3030031-2a2d-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1259153", "feature_id": "19", "value": "ТАЙВАНЬ"}
    }, {
        "id": 20,
        "title": "Сезонность",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "55348334-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1259153", "feature_id": "20", "value": "Лето"}
    }, {
        "id": 21,
        "title": "Вид упаковки",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "703c4371-2a2e-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-07 19:21:58",
        "pivot": {"group_article_id": "1259153", "feature_id": "21", "value": "Блистер"}
    }, {
        "id": 27,
        "title": "Код модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1259153", "feature_id": "27", "value": "EG-078"}
    }, {
        "id": 28,
        "title": "Название модели",
        "measurement": "",
        "description": "",
        "is_filter": "0",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1259153", "feature_id": "28", "value": "Big Bandit Sinking"}
    }, {
        "id": 29,
        "title": "Вес",
        "measurement": "гр",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:50",
        "pivot": {"group_article_id": "1259153", "feature_id": "29", "value": "98"}
    }, {
        "id": 34,
        "title": "Максимальное заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1259153", "feature_id": "34", "value": "3"}
    }, {
        "id": 35,
        "title": "Минимальное  заглубление",
        "measurement": "м",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1259153", "feature_id": "35", "value": "1"}
    }, {
        "id": 37,
        "title": "Количество крючков",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:58",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1259153", "feature_id": "37", "value": "2"}
    }, {
        "id": 43,
        "title": "Нагрузка",
        "measurement": "кг",
        "description": "",
        "is_filter": "1",
        "value_type": "float",
        "is_visible": "1",
        "1C_key": "cf1c3be7-2a35-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:51",
        "pivot": {"group_article_id": "1259153", "feature_id": "43", "value": "44"}
    }, {
        "id": 46,
        "title": "Плавучесть (Экшн)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1259153", "feature_id": "46", "value": "Тонущий"}
    }, {
        "id": 48,
        "title": "Производитель крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1259153", "feature_id": "48", "value": "OH"}
    }, {
        "id": 49,
        "title": "Длина (мм)",
        "measurement": "мм",
        "description": "",
        "is_filter": "1",
        "value_type": "int",
        "is_visible": "1",
        "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1259153", "feature_id": "49", "value": "195"}
    }, {
        "id": 55,
        "title": "Тип крючка",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1259153", "feature_id": "55", "value": "Тройник"}
    }, {
        "id": 58,
        "title": "Код цвета",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:52",
        "pivot": {"group_article_id": "1259153", "feature_id": "58", "value": "C606E"}
    }, {
        "id": 64,
        "title": "По форме тела (Воблер)",
        "measurement": "",
        "description": "",
        "is_filter": "1",
        "value_type": "string",
        "is_visible": "1",
        "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
        "created_at": "2017-10-07 19:21:59",
        "updated_at": "2017-10-29 18:20:53",
        "pivot": {"group_article_id": "1259153", "feature_id": "64", "value": "Джеркбейт"}
    }]
}]
