$(function(){

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

    var slides = $('.section');
    slides.addClass('hidden');
    slides.addClass('visuallyhidden');

    var activeSlide = $('#slide-1');

    activeSlide.addClass('current');
    activeSlide.removeClass('hidden');
    setTimeout(function () {
        activeSlide.removeClass('visuallyhidden');
    }, 20);

    var lastAnimation = 0;

    function init_scroll(event, delta,  currentSlide, currentSlideId) {
        var deltaOfInterest = delta,
            timeNow = new Date().getTime(),
            quietPeriod = 500;

        if(timeNow - lastAnimation < quietPeriod + 1200) {
            event.preventDefault();
            return;
        }

        var targetSlide = $('#slide-' + (parseInt(currentSlideId) + 1));

        if (deltaOfInterest < 0) {
            if (currentSlideId >= 1 && currentSlideId < 5) {
                currentSlide.removeClass('current');
                currentSlide.addClass('visuallyhidden');
                currentSlide.one('transitionend', function (e) {
                    currentSlide.addClass('hidden');
                });

                setTimeout(function () {
                    targetSlide.removeClass('hidden');
                }, 950);
                setTimeout(function () {
                    targetSlide.removeClass('visuallyhidden');
                }, 970);

                targetSlide.addClass('current');
            }
        } else {
            if (currentSlideId >= 2 && currentSlideId <= 5) {
                targetSlide = $('#slide-' + (parseInt(currentSlideId) - 1));
                currentSlide.removeClass('current');
                currentSlide.addClass('visuallyhidden');
                currentSlide.one('transitionend', function (e) {
                    currentSlide.addClass('hidden');
                });

                setTimeout(function () {
                    targetSlide.removeClass('hidden');
                }, 950);
                setTimeout(function () {
                    targetSlide.removeClass('visuallyhidden');
                }, 970);
                targetSlide.addClass('current');
            }
        }


        lastAnimation = timeNow;
    }

    $(document).bind('mousewheel DOMMouseScroll', function(event) {
        var currentSlide = $('.section.current');
        var currentSlideId = currentSlide.attr('id').substr(6, 1);

        if (currentSlideId < 5) {
            event.preventDefault();
            var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            init_scroll(event, delta, currentSlide, currentSlideId);
        }
    });

});