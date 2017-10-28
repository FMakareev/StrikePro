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
                        if(array[i].title) {
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
                    focal: e
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
            var photos = articles[i].head_images,
                photosLength = photos.length;

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
        var img3D = $('#reel-image');
        $(img3D).reel({
            loops: true,
            speed: 0.5,
            frames: 6,
            revolution: 100,
            images: "http://test.vostrel.net/jquery.reel/example/object-movie-non-looping-sequence/green/#.png"
        });

        $(".product__stand .img_2d").hide();
        $('#reel-image-reel').show();
        $(img3D).show()
    });
    $(".product__sliderImg ul li a").on('click', function (event) {
        var img2D = $(".product__stand .img_2d");
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
        return ('<li class="headerNav__item"><a href="#' + link + '" class="headerNav__link">' + content + '</a></li>')
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
        $('.header-product__nav .headerNav__item').on("click","a", function (event) {
            //отменяем стандартную обработку нажатия по ссылке
            event.preventDefault();
            $('.header-product__nav .headerNav__item').each(function (index, element) {
                $(element).removeClass('active');
            });
            //забираем идентификатор бока с атрибута href
            var id  = $(this).attr('href'),

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

            if ($(element).offset().top - 200 < window.scrollY ) {
                $(list).each(function (index, element) {
                    $(element).removeClass('active');
                });
                $(list[index]).addClass('active')
            }
        });
    }

    function HeaderProductToggle() {
        if ($(".img_2d").offset().top + $(".img_2d").height() / 3 < window.scrollY) {

            $('.header__top').css({top: '-100px'});
            $('.header-product').css({top: '0'});
        } else {
            $('.header__top').css({top: '0'});
            $('.header-product').css({top: '-100px'});

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

        var prevElemHeight = $(productDescription).prev('.col-md-6').innerHeight();

        if(prevElemHeight > productDescriptionHeight) {
            $(this).outerHeight('auto');
            $(this).removeClass('product-desc__disable');
            return
        }

        $(productDescription).addClass('product-desc__disable');
        $(productDescription).innerHeight(prevElemHeight);
        $(productDescription).on('click', function () {
            if($(this).hasClass('product-desc__disable')) {
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



window.articles = [
    {
        "id": 1250042,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C063F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
            "id": 1936,
            "original": "1250042_0_headimage.jpg",
            "thumb": "1250042_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1250042",
            "order": "0",
            "created_at": "2017-10-08 16:48:36",
            "updated_at": "2017-10-11 21:53:18",
            "thumb_url": "http://cdn.strikepro.ru/article/1250042_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1250042_0_headimage.jpg"
        },
        "head_images": [
            {
                "id": 1,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_1',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_1',
            },{
                "id": 2,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_2',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_2',
            },{
                "id": 3,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_3',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_3',
            },{
                "id": 4,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_4',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_4',
            },{
                "id": 5,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_5',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_5',
            },{
                "id": 6,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_6',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_6',
            },{
                "id": 7,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_7',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_7',
            },{
                "id": 8,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_8',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_8',
            },{
                "id": 9,
                "thumb_url":'http://via.placeholder.com/350x150?text=id_9',
                "original_url":'http://via.placeholder.com/1350x1150?text=id_9',
            }
        ],
        "features": [
            {
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
            "pivot": {"group_article_id": "1250042", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1250042", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1250042", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1250042", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250042", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250042", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250042", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250042", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250042", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250042", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250042", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250042", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250042", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250042", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250042", "feature_id": "58", "value": "C063F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250042", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1250045,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A05T",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
            "id": 1937,
            "original": "1250045_0_headimage.jpg",
            "thumb": "1250045_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1250045",
            "order": "0",
            "created_at": "2017-10-08 16:48:36",
            "updated_at": "2017-10-11 21:53:18",
            "thumb_url": "http://cdn.strikepro.ru/article/1250045_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1250045_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1250045", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1250045", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1250045", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1250045", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250045", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250045", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250045", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250045", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250045", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250045", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250045", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250045", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250045", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250045", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250045", "feature_id": "58", "value": "A05T"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250045", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1250048,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A010-EP",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "60",
        "created_at": "2017-10-07 20:24:59",
        "updated_at": "2017-10-07 20:24:59",
        "logo": {
            "id": 1938,
            "original": "1250048_0_headimage.jpg",
            "thumb": "1250048_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1250048",
            "order": "0",
            "created_at": "2017-10-08 16:48:38",
            "updated_at": "2017-10-11 21:53:18",
            "thumb_url": "http://cdn.strikepro.ru/article/1250048_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1250048_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1250048", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1250048", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1250048", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1250048", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250048", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250048", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250048", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250048", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250048", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1250048", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250048", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250048", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250048", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250048", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250048", "feature_id": "58", "value": "A010-EP"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1250048", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1254095,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#CA06ES",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1939,
            "original": "1254095_0_headimage.jpg",
            "thumb": "1254095_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1254095",
            "order": "0",
            "created_at": "2017-10-08 16:48:39",
            "updated_at": "2017-10-11 21:53:18",
            "thumb_url": "http://cdn.strikepro.ru/article/1254095_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1254095_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1254095", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1254095", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1254095", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1254095", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254095", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254095", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254095", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254095", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254095", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254095", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254095", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254095", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254095", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254095", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254095", "feature_id": "58", "value": "CA06ES"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254095", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1254098,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#AC202F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1940,
            "original": "1254098_0_headimage.jpg",
            "thumb": "1254098_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1254098",
            "order": "0",
            "created_at": "2017-10-08 16:48:39",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1254098_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1254098_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1254098", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1254098", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1254098", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1254098", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254098", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254098", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254098", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254098", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254098", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254098", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254098", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254098", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254098", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254098", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254098", "feature_id": "58", "value": "AC202F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254098", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1254517,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#022PPP-713",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "7",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1941,
            "original": "1254517_0_headimage.jpg",
            "thumb": "1254517_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1254517",
            "order": "0",
            "created_at": "2017-10-08 16:48:39",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1254517_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1254517_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1254517", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1254517", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1254517", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1254517", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254517", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254517", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254517", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254517", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254517", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254517", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254517", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254517", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254517", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254517", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254517", "feature_id": "58", "value": "022PPP-713"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254517", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1254518,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#613-713",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "37",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1942,
            "original": "1254518_0_headimage.jpg",
            "thumb": "1254518_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1254518",
            "order": "0",
            "created_at": "2017-10-08 16:48:39",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1254518_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1254518_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1254518", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1254518", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1254518", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1254518", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254518", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254518", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254518", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254518", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254518", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254518", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254518", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254518", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254518", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254518", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254518", "feature_id": "58", "value": "613-713"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254518", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1254520,
        "group_id": "752",
        "new": "0",
        "sale": "1",
        "code": "EG-049#A125E",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1943,
            "original": "1254520_0_headimage.jpg",
            "thumb": "1254520_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1254520",
            "order": "0",
            "created_at": "2017-10-08 16:48:40",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1254520_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1254520_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1254520", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1254520", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1254520", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1254520", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 24,
            "title": "Распродажа",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "bool",
            "is_visible": "1",
            "1C_key": "b5e86a56-2a2e-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254520", "feature_id": "24", "value": "Да"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254520", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254520", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254520", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254520", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254520", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254520", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254520", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254520", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254520", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254520", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254520", "feature_id": "58", "value": "A125E"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254520", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1254521,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A68",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "42",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1944,
            "original": "1254521_0_headimage.jpg",
            "thumb": "1254521_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1254521",
            "order": "0",
            "created_at": "2017-10-08 16:48:40",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1254521_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1254521_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1254521", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1254521", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1254521", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1254521", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254521", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254521", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254521", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254521", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254521", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1254521", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254521", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254521", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254521", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254521", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254521", "feature_id": "58", "value": "A68"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1254521", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1255085,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C382F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1945,
            "original": "1255085_0_headimage.jpg",
            "thumb": "1255085_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1255085",
            "order": "0",
            "created_at": "2017-10-08 16:48:40",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1255085_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1255085_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1255085", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1255085", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1255085", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1255085", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255085", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255085", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255085", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255085", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255085", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255085", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255085", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255085", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255085", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255085", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255085", "feature_id": "58", "value": "C382F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255085", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1255086,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#AC390F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1946,
            "original": "1255086_0_headimage.jpg",
            "thumb": "1255086_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1255086",
            "order": "0",
            "created_at": "2017-10-08 16:48:41",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1255086_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1255086_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1255086", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1255086", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1255086", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1255086", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255086", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255086", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255086", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255086", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255086", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1255086", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255086", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255086", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255086", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255086", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255086", "feature_id": "58", "value": "AC390F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1255086", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258149,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A164F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "39",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1947,
            "original": "1258149_0_headimage.jpg",
            "thumb": "1258149_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258149",
            "order": "0",
            "created_at": "2017-10-08 16:48:41",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258149_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258149_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258149", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258149", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258149", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258149", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258149", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258149", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258149", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258149", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258149", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258149", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258149", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258149", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258149", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258149", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258149", "feature_id": "58", "value": "A164F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258149", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258150,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C192F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1948,
            "original": "1258150_0_headimage.jpg",
            "thumb": "1258150_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258150",
            "order": "0",
            "created_at": "2017-10-08 16:48:41",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258150_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258150_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258150", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258150", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258150", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258150", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258150", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258150", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258150", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258150", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258150", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258150", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258150", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258150", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258150", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258150", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258150", "feature_id": "58", "value": "C192F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258150", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258151,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C384F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "1",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1949,
            "original": "1258151_0_headimage.jpg",
            "thumb": "1258151_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258151",
            "order": "0",
            "created_at": "2017-10-08 16:48:41",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258151_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258151_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258151", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258151", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258151", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258151", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258151", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258151", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258151", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258151", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258151", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258151", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258151", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258151", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258151", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258151", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258151", "feature_id": "58", "value": "C384F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258151", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258152,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C478F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "45",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1950,
            "original": "1258152_0_headimage.jpg",
            "thumb": "1258152_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258152",
            "order": "0",
            "created_at": "2017-10-08 16:48:42",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258152_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258152_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258152", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258152", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258152", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258152", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258152", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258152", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258152", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258152", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258152", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258152", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258152", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258152", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258152", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258152", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258152", "feature_id": "58", "value": "C478F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258152", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258203,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#AC382F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1951,
            "original": "1258203_0_headimage.jpg",
            "thumb": "1258203_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258203",
            "order": "0",
            "created_at": "2017-10-08 16:48:42",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258203_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258203_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258203", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258203", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258203", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258203", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258203", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258203", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258203", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258203", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258203", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258203", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258203", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258203", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258203", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258203", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258203", "feature_id": "58", "value": "AC382F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258203", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258273,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#630V",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "4",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1952,
            "original": "1258273_0_headimage.jpg",
            "thumb": "1258273_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258273",
            "order": "0",
            "created_at": "2017-10-08 16:48:43",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258273_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258273_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258273", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258273", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258273", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258273", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258273", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258273", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258273", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258273", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258273", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258273", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258273", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258273", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258273", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258273", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258273", "feature_id": "58", "value": "630V"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258273", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258775,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A70-713",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1953,
            "original": "1258775_0_headimage.jpg",
            "thumb": "1258775_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258775",
            "order": "0",
            "created_at": "2017-10-08 16:48:44",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258775_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258775_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258775", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258775", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258775", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258775", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258775", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258775", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258775", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258775", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258775", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258775", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258775", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258775", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258775", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258775", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258775", "feature_id": "58", "value": "A70-713"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258775", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258777,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A178S",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1954,
            "original": "1258777_0_headimage.jpg",
            "thumb": "1258777_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258777",
            "order": "0",
            "created_at": "2017-10-08 16:48:44",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258777_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258777_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258777", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258777", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258777", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258777", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258777", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258777", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258777", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258777", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258777", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258777", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258777", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258777", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258777", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258777", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258777", "feature_id": "58", "value": "A178S"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258777", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258778,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#AC450F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1955,
            "original": "1258778_0_headimage.jpg",
            "thumb": "1258778_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258778",
            "order": "0",
            "created_at": "2017-10-08 16:48:44",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258778_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258778_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258778", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258778", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258778", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258778", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258778", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258778", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258778", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258778", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258778", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258778", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258778", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258778", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258778", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258778", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258778", "feature_id": "58", "value": "AC450F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258778", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258779,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C536F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1956,
            "original": "1258779_0_headimage.jpg",
            "thumb": "1258779_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258779",
            "order": "0",
            "created_at": "2017-10-08 16:48:44",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258779_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258779_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258779", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258779", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258779", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258779", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258779", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258779", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258779", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258779", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258779", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258779", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258779", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258779", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258779", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258779", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258779", "feature_id": "58", "value": "C536F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258779", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258780,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C605F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1957,
            "original": "1258780_0_headimage.jpg",
            "thumb": "1258780_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258780",
            "order": "0",
            "created_at": "2017-10-08 16:48:45",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258780_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258780_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258780", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258780", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258780", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258780", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258780", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258780", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258780", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258780", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258780", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258780", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258780", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258780", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258780", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258780", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258780", "feature_id": "58", "value": "C605F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258780", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1258781,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C606E",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1958,
            "original": "1258781_0_headimage.jpg",
            "thumb": "1258781_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1258781",
            "order": "0",
            "created_at": "2017-10-08 16:48:45",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1258781_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1258781_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1258781", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1258781", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1258781", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1258781", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258781", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258781", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258781", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258781", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258781", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1258781", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258781", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258781", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258781", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258781", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258781", "feature_id": "58", "value": "C606E"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1258781", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259135,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C610-064",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "22",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1959,
            "original": "1259135_0_headimage.jpg",
            "thumb": "1259135_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259135",
            "order": "0",
            "created_at": "2017-10-08 16:48:45",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259135_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259135_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259135", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259135", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259135", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259135", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259135", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259135", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259135", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259135", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259135", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259135", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259135", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259135", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259135", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259135", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259135", "feature_id": "58", "value": "C610-064"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259135", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259139,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A102G",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "47",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1960,
            "original": "1259139_0_headimage.jpg",
            "thumb": "1259139_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259139",
            "order": "0",
            "created_at": "2017-10-08 16:48:46",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259139_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259139_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259139", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259139", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259139", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259139", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259139", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259139", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259139", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259139", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259139", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259139", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259139", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259139", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259139", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259139", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259139", "feature_id": "58", "value": "A102G"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259139", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259140,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#A210-SBO-RP",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "19",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1961,
            "original": "1259140_0_headimage.jpg",
            "thumb": "1259140_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259140",
            "order": "0",
            "created_at": "2017-10-08 16:48:47",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259140_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259140_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259140", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259140", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259140", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259140", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259140", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259140", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259140", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259140", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259140", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259140", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259140", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259140", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259140", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259140", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259140", "feature_id": "58", "value": "A210-SBO-RP"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259140", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259141,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C502F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "48",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1962,
            "original": "1259141_0_headimage.jpg",
            "thumb": "1259141_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259141",
            "order": "0",
            "created_at": "2017-10-08 16:48:47",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259141_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259141_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259141", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259141", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259141", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259141", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259141", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259141", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259141", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259141", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259141", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259141", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259141", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259141", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259141", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259141", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259141", "feature_id": "58", "value": "C502F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259141", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259483,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C477F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "14",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1963,
            "original": "1259483_0_headimage.jpg",
            "thumb": "1259483_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259483",
            "order": "0",
            "created_at": "2017-10-08 16:48:48",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259483_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259483_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259483", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259483", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259483", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259483", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259483", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259483", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259483", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259483", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259483", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259483", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259483", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259483", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259483", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259483", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259483", "feature_id": "58", "value": "C477F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259483", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259484,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C101F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1964,
            "original": "1259484_0_headimage.jpg",
            "thumb": "1259484_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259484",
            "order": "0",
            "created_at": "2017-10-08 16:48:48",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259484_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259484_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259484", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259484", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259484", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259484", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259484", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259484", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259484", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259484", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259484", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259484", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259484", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259484", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259484", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259484", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259484", "feature_id": "58", "value": "C101F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259484", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259485,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#GC01S",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1965,
            "original": "1259485_0_headimage.jpg",
            "thumb": "1259485_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259485",
            "order": "0",
            "created_at": "2017-10-08 16:48:48",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259485_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259485_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259485", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259485", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259485", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259485", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259485", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259485", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259485", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259485", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259485", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259485", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259485", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259485", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259485", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259485", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259485", "feature_id": "58", "value": "GC01S"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259485", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259639,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C376F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "28",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1966,
            "original": "1259639_0_headimage.jpg",
            "thumb": "1259639_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259639",
            "order": "0",
            "created_at": "2017-10-08 16:48:49",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259639_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259639_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259639", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259639", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259639", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259639", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259639", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259639", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259639", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259639", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259639", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259639", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259639", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259639", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259639", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259639", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259639", "feature_id": "58", "value": "C376F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259639", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259640,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C380F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "29",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1967,
            "original": "1259640_0_headimage.jpg",
            "thumb": "1259640_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259640",
            "order": "0",
            "created_at": "2017-10-08 16:48:49",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259640_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259640_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259640", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259640", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259640", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259640", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259640", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259640", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259640", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259640", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259640", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259640", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259640", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259640", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259640", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259640", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259640", "feature_id": "58", "value": "C380F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259640", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259641,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C506F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1968,
            "original": "1259641_0_headimage.jpg",
            "thumb": "1259641_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259641",
            "order": "0",
            "created_at": "2017-10-08 16:48:50",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259641_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259641_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259641", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259641", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259641", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259641", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259641", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259641", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259641", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259641", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259641", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259641", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259641", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259641", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259641", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259641", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259641", "feature_id": "58", "value": "C506F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259641", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259642,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C626F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "25",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1969,
            "original": "1259642_0_headimage.jpg",
            "thumb": "1259642_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259642",
            "order": "0",
            "created_at": "2017-10-08 16:48:50",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259642_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259642_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259642", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259642", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259642", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259642", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259642", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259642", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259642", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259642", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259642", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259642", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259642", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259642", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259642", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259642", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259642", "feature_id": "58", "value": "C626F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259642", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 1259643,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C649F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "7",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1970,
            "original": "1259643_0_headimage.jpg",
            "thumb": "1259643_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "1259643",
            "order": "0",
            "created_at": "2017-10-08 16:48:51",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/1259643_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/1259643_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "1259643", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "1259643", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "1259643", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "1259643", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259643", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259643", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259643", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259643", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259643", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "1259643", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259643", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259643", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259643", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259643", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259643", "feature_id": "58", "value": "C649F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "1259643", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 9924460,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C480F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "45",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": null,
        "photos": [],
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
            "pivot": {"group_article_id": "9924460", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "9924460", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "9924460", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "9924460", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924460", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924460", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924460", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924460", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924460", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924460", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924460", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924460", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924460", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924460", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924460", "feature_id": "58", "value": "C480F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924460", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 9924461,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C622F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "cols": "1",
        "og_url": "",
        "og_image": "",
        "og_type": "",
        "og_title": "",
        "meta_description": "",
        "meta_keywords": "",
        "meta_title": "",
        "manufacturer_id": "6",
        "in_stock": "12",
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": null,
        "photos": [],
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
            "pivot": {"group_article_id": "9924461", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "9924461", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "9924461", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "9924461", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924461", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924461", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924461", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924461", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924461", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924461", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924461", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924461", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924461", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924461", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924461", "feature_id": "58", "value": "C622F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924461", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 9924991,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C662F",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": null,
        "photos": [],
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
            "pivot": {"group_article_id": "9924991", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "9924991", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "9924991", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "9924991", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924991", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924991", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924991", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924991", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924991", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924991", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924991", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924991", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924991", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924991", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924991", "feature_id": "58", "value": "C662F"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924991", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 9924992,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C684",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": null,
        "photos": [],
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
            "pivot": {"group_article_id": "9924992", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "9924992", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "9924992", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "9924992", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924992", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924992", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924992", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924992", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924992", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924992", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924992", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924992", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924992", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924992", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924992", "feature_id": "58", "value": "C684"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924992", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 9924993,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C685",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м WOLF COLOR",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": null,
        "photos": [],
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
            "pivot": {"group_article_id": "9924993", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "9924993", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "9924993", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "9924993", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924993", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924993", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924993", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924993", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924993", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924993", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924993", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924993", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924993", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924993", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924993", "feature_id": "58", "value": "C685"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924993", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }, {
        "id": 9924994,
        "group_id": "752",
        "new": "0",
        "sale": "0",
        "code": "EG-049#C687G",
        "name": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м seafart",
        "fullname": "Джеркбейт Strike Pro Buster Jerk II медленно всплывающий 12см  37гр  Загл.0,3-2,0м seafart",
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
        "created_at": "2017-10-07 20:25:00",
        "updated_at": "2017-10-07 20:25:00",
        "logo": {
            "id": 1971,
            "original": "9924994_0_headimage.jpg",
            "thumb": "9924994_0_headimage_thumbnail.jpg",
            "title": "",
            "primary": "1",
            "area": "article",
            "type": "headimage",
            "groups_or_article_id": "9924994",
            "order": "0",
            "created_at": "2017-10-08 16:48:51",
            "updated_at": "2017-10-11 21:53:19",
            "thumb_url": "http://cdn.strikepro.ru/article/9924994_0_headimage_thumbnail.jpg",
            "original_url": "http://cdn.strikepro.ru/article/9924994_0_headimage.jpg"
        },
        "photos": [],
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
            "pivot": {"group_article_id": "9924994", "feature_id": "14", "value": "Да"}
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
            "pivot": {"group_article_id": "9924994", "feature_id": "19", "value": "ТАЙВАНЬ"}
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
            "pivot": {"group_article_id": "9924994", "feature_id": "20", "value": "Лето"}
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
            "pivot": {"group_article_id": "9924994", "feature_id": "21", "value": "Блистер"}
        }, {
            "id": 27,
            "title": "Модель (код)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "dcd92f88-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924994", "feature_id": "27", "value": "EG-049"}
        }, {
            "id": 28,
            "title": "Модель (название)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "fac53bba-2a33-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924994", "feature_id": "28", "value": "Buster Jerk II Shallow Runner"}
        }, {
            "id": 29,
            "title": "Вес (гр.)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "a79e0780-2a34-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924994", "feature_id": "29", "value": "37"}
        }, {
            "id": 34,
            "title": "Загрубление, max (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "07722d47-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924994", "feature_id": "34", "value": "2"}
        }, {
            "id": 35,
            "title": "Загрубление, min (м)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "float",
            "is_visible": "1",
            "1C_key": "165d91ff-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924994", "feature_id": "35", "value": "0,3"}
        }, {
            "id": 37,
            "title": "Количество крючков",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "55807399-2a35-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:58",
            "updated_at": "2017-10-07 19:21:58",
            "pivot": {"group_article_id": "9924994", "feature_id": "37", "value": "2"}
        }, {
            "id": 46,
            "title": "Плавучесть (Экшн)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "17fffeeb-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924994", "feature_id": "46", "value": "Медленно всплывающий"}
        }, {
            "id": 48,
            "title": "Производитель крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "54ddeead-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924994", "feature_id": "48", "value": "OH"}
        }, {
            "id": 49,
            "title": "Длина (мм)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "int",
            "is_visible": "1",
            "1C_key": "7124a74e-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924994", "feature_id": "49", "value": "120"}
        }, {
            "id": 55,
            "title": "Тип крючка",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "db30d563-2a36-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924994", "feature_id": "55", "value": "Тройник"}
        }, {
            "id": 58,
            "title": "Код цвета",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "50b9c2da-2a39-11e6-95fb-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924994", "feature_id": "58", "value": "C687G"}
        }, {
            "id": 64,
            "title": "По форме тела (Воблер)",
            "measurement": "",
            "description": "",
            "is_filter": "0",
            "value_type": "string",
            "is_visible": "1",
            "1C_key": "c5e5cca1-e02f-11e6-a6c0-e06995684273",
            "created_at": "2017-10-07 19:21:59",
            "updated_at": "2017-10-07 19:21:59",
            "pivot": {"group_article_id": "9924994", "feature_id": "64", "value": "Джеркбейт"}
        }]
    }]