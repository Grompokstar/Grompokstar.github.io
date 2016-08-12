$(function(){

    $("body").on('click', '[href*="#"]', function(e){
        $('html,body').stop().animate({ scrollTop: $(this.hash).offset().top}, 1000);
        e.preventDefault();
    });

    function onScroll(){
        var scroll_top = $(document).scrollTop();
        $('.main-menu a').each(function(){
            var hash = $(this).attr("href");
            var target = $(hash);
            if (target.position().top <= scroll_top && target.position().top + target.outerHeight() > scroll_top) {
                $('.main-menu li.active').removeClass("active");
                $(this).parent('li').addClass("active");
            } else {
                $(this).parent('li').removeClass("active");
            }
        });
    }

    $(window).ready(function() {
        var windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            header = $('header'),
            sectionWrap = $('.section-wrap'),
            headerHeight = parseInt(header.height()),
            sections = $('.section'),
            imgHeaders = $('.img-header');

        var sectionImages = $('.section-img img'),
            sectionImgWidth = parseInt($('#slide-1 img').width()),
            containerWidth = parseInt($('.container').width());

        var marginRight = (windowWidth - containerWidth)/2;

        sectionImages.css('width', sectionImgWidth + marginRight - 10);
        imgHeaders.css('width', sectionImgWidth + marginRight - 10);

        var sectionHeight = parseInt($('#slide-1').height()),
        margin = windowHeight - sectionHeight - headerHeight;

        sections.css('margin-bottom', margin + 80);

        $(document).on("scroll", onScroll);


    });

    var h_hght = 40; // высота шапки
    var h_mrg = 0;    // отступ когда шапка уже не видна

    $(function(){

        var elem = $('#main-navigation');
        var top = $(this).scrollTop();

        if(top > h_hght){
            elem.css('top', h_mrg);
        }

        $(window).scroll(function(){
            top = $(this).scrollTop();

            if (top + h_mrg < h_hght) {
                elem.css('top', (h_hght - top));
            } else {
                elem.css('top', h_mrg);
            }
        });

    });

    var $nav = $('#main-navigation li');

    $nav.on('click', function() {
        $nav.removeClass('active');
        $(this).addClass('active');
    });

    var tariffs =  $('.tariff-block');
    var functionality =  $('.tariff-functionality');
    tariffs.addClass('hidden');
    tariffs.addClass('hidden-left');

    functionality.addClass('hidden');
    functionality.addClass('visuallyhidden');

    var activeTariffId = $('.tariffs li.active').attr('data-tariff-id');
    var activeTariff = $('#tariff-' + activeTariffId);

    activeTariff.removeClass('hidden');
    setTimeout(function () {
        activeTariff.removeClass('hidden-left');
    }, 20);

    var activeFunctionality = $('#functionality-' + activeTariffId);
    activeFunctionality.removeClass('hidden');
    setTimeout(function () {
        activeFunctionality.removeClass('visuallyhidden');
    }, 20);

    var tariffsNav = $('.tariffs li');

    tariffsNav.on('click', function() {
        tariffsNav.removeClass('active');
        $(this).addClass('active');

        var tariffId = $(this).attr('data-tariff-id'),
            targetTariff = $('#tariff-' + tariffId),
            targetFunctionality = $('#functionality-' + tariffId);

        tariffs.addClass('hidden');
        tariffs.addClass('hidden-left');

        functionality.addClass('hidden');
        functionality.addClass('visuallyhidden');

        if (targetTariff.hasClass('hidden')) {
            targetTariff.removeClass('hidden');
            setTimeout(function () {
                targetTariff.removeClass('hidden-left');
            }, 20);
        }

        if (targetFunctionality.hasClass('hidden')) {
            targetFunctionality.removeClass('hidden');
            setTimeout(function () {
                targetFunctionality.removeClass('visuallyhidden');
            }, 20);
        }
    });

    /*var video = $('.slide-video');

    video.on('mouseenter', function(e) {
        this.play();
    });

    video.on('mouseleave', function(e) {
        this.pause();
    });*/

    var windowWidth = $(window).width();

    /*if (parseInt(windowWidth) >= 768) {
        var slides = $('.section'),
            slidesImg = $('.section-img'),
            slidesText = $('.section-text');
        slides.addClass('hidden');
        slidesImg.addClass('hidden-left');
        slidesText.addClass('hidden-right');
    }*/



    /*var activeSlide = $('#slide-1'),
        activeSlideImg = activeSlide.find('.section-img'),
        activeSlideText = activeSlide.find('.section-text');

    activeSlide.addClass('current');
    activeSlide.removeClass('hidden');
    setTimeout(function () {
        activeSlideImg.removeClass('hidden-left');
        activeSlideText.removeClass('hidden-right');
    }, 20);

    var lastAnimation = 0;

    function init_scroll(event, delta,  currentSlide, currentSlideId) {
        var currentSlideImg = currentSlide.find('.section-img'),
            currentSlideText = currentSlide.find('.section-text');
        var deltaOfInterest = delta,
            timeNow = new Date().getTime(),
            quietPeriod = 1350;


        if(timeNow - lastAnimation < quietPeriod) {
            event.preventDefault();
            return;
        }

        var targetSlide = $('#slide-' + (parseInt(currentSlideId) + 1)),
            targetSlideImg = targetSlide.find('.section-img'),
            targetSlideText = targetSlide.find('.section-text'),
            targetNavLi = $('li[data-slide-id = "' + (parseInt(currentSlideId) + 1) + '"]');

        if (deltaOfInterest < 0) {
            $nav.removeClass('active');
            if (currentSlideId >= 1 && currentSlideId < 5) {
                currentSlide.removeClass('current');
                currentSlideImg.addClass('visuallyhidden');
                currentSlideText.addClass('visuallyhidden');
                currentSlideImg.one('transitionend', function (e) {
                    currentSlide.addClass('hidden');
                    currentSlideImg.addClass('hidden-left');
                    currentSlideText.addClass('hidden-right');
                    currentSlideImg.removeClass('visuallyhidden');
                    currentSlideText.removeClass('visuallyhidden');
                });

                setTimeout(function () {
                    targetSlide.removeClass('hidden');
                }, 650);
                setTimeout(function () {
                    targetSlideImg.removeClass('hidden-left');
                    targetSlideText.removeClass('hidden-right');
                }, 670);

                targetNavLi.addClass('active');

                if (currentSlideId == 4) {
                    setTimeout(function () {
                        $('.section-wrap').addClass('finish');
                        $(document.body).css('overflow', 'auto');
                    }, 1400);
                }

                targetSlide.addClass('current');

            }
        } else {
            if (currentSlideId >= 2 && currentSlideId <= 5) {
                $nav.removeClass('active');
                targetSlide = $('#slide-' + (parseInt(currentSlideId) - 1));
                targetSlideImg = targetSlide.find('.section-img');
                targetSlideText = targetSlide.find('.section-text');
                targetNavLi = $('li[data-slide-id = "' + (parseInt(currentSlideId) - 1) + '"]');
                currentSlide.removeClass('current');
                currentSlideImg.addClass('visuallyhidden');
                currentSlideText.addClass('visuallyhidden');
                currentSlideImg.one('transitionend', function (e) {
                    currentSlide.addClass('hidden');
                    currentSlideImg.addClass('hidden-left');
                    currentSlideText.addClass('hidden-right');
                    currentSlideImg.removeClass('visuallyhidden');
                    currentSlideText.removeClass('visuallyhidden');
                });

                setTimeout(function () {
                    targetSlide.removeClass('hidden');
                }, 650);
                setTimeout(function () {
                    targetSlideImg.removeClass('hidden-left');
                    targetSlideText.removeClass('hidden-right');
                }, 670);

                targetNavLi.addClass('active');
                targetSlide.addClass('current');
            }
        }

        lastAnimation = timeNow;
    }

    var initMouseWheel = function(event) {
        var currentSlide = $('.section.current');
        var currentSlideId = currentSlide.attr('id').substr(6, 1);
        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
        var sectionWrap = $('.section-wrap');

        if (!sectionWrap.hasClass('finish')) {
            event.preventDefault();
            init_scroll(event, delta, currentSlide, currentSlideId);
        } else if (sectionWrap.hasClass('finish') && delta > 0 && $(window).scrollTop() == 0) {
            sectionWrap.removeClass('finish');
            $(document.body).css('overflow', 'hidden');
            init_scroll(event, delta, currentSlide, currentSlideId);
        }
    };

    if (parseInt(windowWidth) >= 768) {
        $(document).bind('mousewheel DOMMouseScroll', initMouseWheel);
    }*/



    $nav.on('click', function() {
        var targetSlideId = $(this).attr('data-slide-id');
        var currentSlide = $('.section.current');
        var currentSlideId = currentSlide.attr('id').substr(6, 1);

        if (targetSlideId) {
            $('.section-wrap').removeClass('finish');
            $(document.body).css('overflow', 'hidden');
            $(document).bind('mousewheel DOMMouseScroll', initMouseWheel);
        } else {
            $(document.body).css('overflow', 'auto');
            $(document).unbind('mousewheel DOMMouseScroll');
        }

        if (targetSlideId && targetSlideId != currentSlideId) {
            var currentSlideImg = currentSlide.find('.section-img'),
                currentSlideText = currentSlide.find('.section-text');

            $nav.removeClass('active');

            var targetSlide = $('#slide-' + parseInt(targetSlideId)),
                targetSlideImg = targetSlide.find('.section-img'),
                targetSlideText = targetSlide.find('.section-text'),
                targetNavLi = $('li[data-slide-id = "' + parseInt(targetSlideId) + '"]');

            currentSlide.removeClass('current');
            currentSlideImg.addClass('visuallyhidden');
            currentSlideText.addClass('visuallyhidden');
            currentSlideImg.one('transitionend', function (e) {
                currentSlide.addClass('hidden');
                currentSlideImg.addClass('hidden-left');
                currentSlideText.addClass('hidden-right');
                currentSlideImg.removeClass('visuallyhidden');
                currentSlideText.removeClass('visuallyhidden');
            });

            setTimeout(function () {
                targetSlide.removeClass('hidden');
            }, 650);
            setTimeout(function () {
                targetSlideImg.removeClass('hidden-left');
                targetSlideText.removeClass('hidden-right');
            }, 670);

            targetNavLi.addClass('active');
            targetSlide.addClass('current');
        }

        if (targetSlideId == 5) {
            $('.section-wrap').addClass('finish');
            $(document.body).css('overflow', 'auto');
        }
    })

});