$(function(){

    $(window).ready(function() {
        var windowHeight = $(window).height(),
            sectionHeight = parseInt($('#slide-1').height()),
            headerHeight = parseInt($('header').height()),
            margin = windowHeight - sectionHeight - headerHeight;

        $('header').css('margin-bottom', margin);

        $(window).resize(function(){
            var windowHeight = $(window).height(),
                sectionHeight = parseInt($('#slide-1').height()),
                headerHeight = parseInt($('header').height()),
                margin = windowHeight - sectionHeight - headerHeight;

            $('header').css('margin-bottom', margin);
        });
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

    var video = $('.slide-video');

    video.on('mouseenter', function(e) {
        this.play();
    });

    video.on('mouseleave', function(e) {
        this.pause();
    });

    var slides = $('.section'),
        slidesImg = $('.section-img'),
        slidesText = $('.section-text');
    slides.addClass('hidden');
    slidesImg.addClass('hidden-left');
    slidesText.addClass('hidden-right');

    var activeSlide = $('#slide-1'),
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
            quietPeriod = 1700;

        if(timeNow - lastAnimation < quietPeriod) {
            event.preventDefault();
            return;
        }

        var targetSlide = $('#slide-' + (parseInt(currentSlideId) + 1)),
            targetSlideImg = targetSlide.find('.section-img'),
            targetSlideText = targetSlide.find('.section-text');

        if (deltaOfInterest < 0) {
            if (currentSlideId >= 1 && currentSlideId < 5) {
                currentSlide.removeClass('current');
                currentSlideImg.addClass('hidden-left');
                currentSlideText.addClass('hidden-right');
                currentSlideImg.one('transitionend', function (e) {
                    currentSlide.addClass('hidden');
                });

                setTimeout(function () {
                    targetSlide.removeClass('hidden');
                }, 950);
                setTimeout(function () {
                    targetSlideImg.removeClass('hidden-left');
                    targetSlideText.removeClass('hidden-right');
                }, 970);

                if (currentSlideId == 4) {
                    setTimeout(function () {
                        $('.section-wrap').addClass('finish');
                        $(document.body).css('overflow', 'auto');
                    }, 1900);
                }

                targetSlide.addClass('current');

            }
        } else {
            if (currentSlideId >= 2 && currentSlideId <= 5) {
                targetSlide = $('#slide-' + (parseInt(currentSlideId) - 1));
                targetSlideImg = targetSlide.find('.section-img');
                targetSlideText = targetSlide.find('.section-text');
                currentSlide.removeClass('current');
                currentSlideImg.addClass('hidden-left');
                currentSlideText.addClass('hidden-right');
                currentSlideImg.one('transitionend', function (e) {
                    currentSlide.addClass('hidden');
                });

                setTimeout(function () {
                    targetSlide.removeClass('hidden');
                }, 950);
                setTimeout(function () {
                    targetSlideImg.removeClass('hidden-left');
                    targetSlideText.removeClass('hidden-right');
                }, 970);
                targetSlide.addClass('current');
            }
        }


        lastAnimation = timeNow;
    }

    $(document).bind('mousewheel DOMMouseScroll', function(event) {
        var currentSlide = $('.section.current');
        var currentSlideId = currentSlide.attr('id').substr(6, 1);

        if (!$('.section-wrap').hasClass('finish')) {
            event.preventDefault();
            var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            init_scroll(event, delta, currentSlide, currentSlideId);
        }
    });

    var $nav = $('#main-navigation li');

    $nav.on('click', function() {
        $nav.removeClass('active');
        $(this).addClass('active');
    })



});