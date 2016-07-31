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
    })

});