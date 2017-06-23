$(function(){

    $(window).ready(function(){

        $('body').on('click', '[href*="#"]', function(e){
            $('html,body').stop().animate({ scrollTop: $(this.hash).offset().top - 90}, 1000);
            e.preventDefault();
        });

        //header
        var $body = $('body'),
            $mainMenu = $('.main-menu'),
            $mainMenuBtn = $('.main-menu-btn'),
            $mainMenuLinks = $('.main-menu a, .mobile-main-menu a'),
            $mobileMainMenu = $('.mobile-menu-wrapper'),
            $phoneHeaderMenu = $('.phone-mobile-menu'),
            $phoneHeaderBtn = $('.header-phone-btn'),
            $cityBtn = $('#city-btn'),
            $cityBtnAngle = $('#city-btn .fa'),
            $cityMenu = $('#city-menu'),
            $dropdownItems = $('.dropdown li'),
            $languageBtn = $('.language-btn'),
            $languageList = $('.language-list'),
            $languageListItems = $('.language-list li'),
            $languageListLiks = $('.language-list li a'),
            $headerOverlay = $('.header-overlay'),
            $clickToToggleSubmenu = $('.click-to-toggle'),
            $chooseAgeLinks = $('a[href="#choose-age"]'),
            $onlineEntryBtnWrapper = $('.online-entry-btn-wrapper'),
            $articleCloseBtn = $('.article .close-btn');

        function toggleMainMenu() {
            $mainMenu.toggleClass('visible');
            $mobileMainMenu.toggleClass('visible');
            $('.main-menu-btn').toggleClass('close');
            $('.main-menu-btn svg').toggleClass('visible');
            $('.overlay').toggleClass('visible');
            if ($mainMenu.hasClass('visible')) {
                $body.addClass('overflow-hidden');
                $onlineEntryBtnWrapper.addClass('visible');
            } else {
                $body.removeClass('overflow-hidden');
                $onlineEntryBtnWrapper.removeClass('visible');
            }
        }

        function toggleCityMenu() {
            $cityBtnAngle.toggleClass('fa-angle-down').toggleClass('fa-angle-up');
            $cityMenu.toggleClass('show');
        }

        $mainMenuBtn.on('click', function () {
            toggleMainMenu();

            if ($cityMenu.hasClass('show')) {
                toggleCityMenu();
            }

            if ($phoneHeaderMenu.hasClass('visible')) {
                $phoneHeaderMenu.toggleClass('visible');
            }
        });

        $phoneHeaderBtn.on('click', function () {
            if (!$phoneHeaderMenu.hasClass('visible')) {
                $body.addClass('overflow-hidden');
                $onlineEntryBtnWrapper.addClass('visible');
            } else {
                $body.removeClass('overflow-hidden');
                $onlineEntryBtnWrapper.removeClass('visible');
            }
            $phoneHeaderMenu.toggleClass('visible');

            if ($mainMenu.hasClass('visible')) {
                $mainMenu.removeClass('visible');
                $mobileMainMenu.removeClass('visible');
                $('.main-menu-btn').toggleClass('close');
                $('.main-menu-btn svg').toggleClass('visible');
                $('.overlay').toggleClass('visible');
            }
        });

        $mainMenuLinks.on('click', function() {
            toggleMainMenu();
        });

        $cityBtn.on('click', function() {
            toggleCityMenu();

            if ($mainMenu.hasClass('visible')) {
                toggleMainMenu();
            }
        });

        $(document).mouseup(function (e) {
            var header = $("header");

            if (!header.is(e.target) && header.has(e.target).length === 0) {
                if ($mainMenu.hasClass('visible')) {
                    toggleMainMenu();
                }

                if ($phoneHeaderMenu.hasClass('visible')) {
                    $phoneHeaderMenu.toggleClass('visible');
                }
            }

        });

        $chooseAgeLinks.on('click', function() {
            var packageId = $(this).attr('data-package');
            $('.choose-age-item[data-package="' + packageId + '"]').click();
        });

        $dropdownItems.on('click', function() {
            $cityMenu.toggleClass('show');
            var city = $(this).find('a').html();
            $cityBtn.html(city + '<span class="fa fa-angle-down">');
        });

        $languageBtn.on('click', function() {
            $headerOverlay.toggleClass('show');
            $languageList.toggleClass('open');
        });

        $languageListLiks.on('click', function() {
            $headerOverlay.toggleClass('show');
            $languageList.toggleClass('open');

            var languageFirsTwoSimbols = $(this).html().substr(0, 2);
            $languageBtn.html(languageFirsTwoSimbols);

            $languageListItems.removeClass('current');

            $(this).closest('li').addClass('current');
        });

        $clickToToggleSubmenu.on('click', function() {
            $(this).closest('.submenu-toggle').toggleClass('open');
        });

        $articleCloseBtn.on('click', function() {
            window.history.back();
        })


    });

}());

