jQuery(function($){

  $(document).ready(function() {

    var previousScroll = 0;
    var $header = $("header")
    var $mobileMenu = $('#mobile-menu')
    $(window).scroll(function(event){
      $mobileMenu.removeClass('open');
      $header.removeClass('open-mobile-menu');

      var scrollTop = $(this).scrollTop();

      if (scrollTop > 0 && previousScroll > scrollTop) {
        $header.addClass('pinned');
      } else if (scrollTop < 0 && previousScroll < scrollTop) {
        $header.addClass('pinned').removeClass('pinned');
      } else {
        $header.removeClass('pinned');
      }

      previousScroll = scrollTop;
    });

    $('#mobile-menu-btn').on('click', function() {
      var $header = $('header');

      $('#mobile-menu').toggleClass('open');
      $header.toggleClass('open-mobile-menu').addClass('pinned');
    });

    var preloader    = $('#preloader'),
      imagesCount  = $('img').length,
      dBody        = $('body'),
      percent      = 100 / imagesCount,
      progress     = 0,
      imgSum       = 3,
      loadedImg    = 0;

    if (imagesCount >= imgSum && imagesCount > 0) {
      dBody.css('overflow', 'hidden');

      for (var i = 0; i < imagesCount; i++) { // создаем клоны изображений
        var img_copy        = new Image();
        img_copy.src        = document.images[i].src;
        img_copy.onload     = img_load;
        img_copy.onerror    = img_load;
      }

      function img_load () {
        progress += percent;
        loadedImg++;
        if (progress >= 100 || loadedImg == imagesCount) {
          preloader.delay(200).fadeOut('slow');
          dBody.css('overflow', '');
        }
        $("#progress-bar").width(progress + "%");
      }
    } else {
      preloader.remove();
    }

    //custom tab navigation

    var $tabNavItems = $('.tab-nav-item')
    var $tabContentItems = $('.tab-content-item')

    $tabNavItems.on('click', function() {
      var doc_w = $(document).width()
      var id = $(this).attr('data-id')
      var $targetContent = $(".tab-content-item[data-id='" + id + "']")

      if (doc_w < 768 && $(this).hasClass('active')) {
        $('.mobile-tab-content').detach()
        $(this).removeClass('active')
      } else if (doc_w < 768 && !$(this).hasClass('active')) {
        $('.mobile-tab-content').detach()
        $(this).addClass('active')
        var targetHtml = '<div class="mobile-tab-content">' + $targetContent.html() + '</div>'
        $(this).after(targetHtml)
      } else {
        $tabNavItems.removeClass('active')
        $tabContentItems.removeClass('show')
        $(this).addClass('active')
        $targetContent.addClass('show')
      }
    });




    //карусель
    var carousel = $('.carousel-container');
    var buttons = $('.slider-button');
    var leftButton = $('.slider-button.left');
    var rightButton = $('.slider-button.right');

    $('.cases-slider-container .slider-button.right').on('click', function() {
      var activeCount = carousel.find('.cases-slider-item.active').attr('data-id');
      if (activeCount < 3) {
        var targetCount = parseInt(activeCount) + 1
        carousel.find('.cases-slider-item').removeClass('active')
        carousel.find('.cases-slider-item[data-id="' + targetCount + '"]').addClass('active')
        carousel.css('margin-left', targetCount * -100 + '%')
      }

      buttons.removeClass('disabled')
      if (activeCount == 2 || activeCount == 3) {
        rightButton.addClass('disabled')
      }
    })

    $('.cases-slider-container .slider-button.left').on('click', function() {
      var activeCount = carousel.find('.cases-slider-item.active').attr('data-id');
      if (activeCount > 0) {
        var targetCount = parseInt(activeCount) - 1
        carousel.find('.cases-slider-item').removeClass('active')
        carousel.find('.cases-slider-item[data-id="' + targetCount + '"]').addClass('active')
        carousel.css('margin-left', targetCount * -100 + '%')

        buttons.removeClass('disabled')
        if (activeCount == 1 || activeCount == 0) {
          leftButton.addClass('disabled')
        }
      }
    })
    //----------------------------------

  });

});