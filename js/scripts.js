jQuery(function($){

  $(document).ready(function() {
    /*if (window.devicePixelRatio > 1) {
      var images = $('.retina-img');

      images.each(function(i) {
        var lowres = $(this).attr('src');
        var highres = lowres.replace(".", "@2x.");
        $(this).attr('src', highres);
      });
    }*/

    var previousScroll = 0;
    $(window).scroll(function(event){
      var scroll = $(this).scrollTop();

      if (scroll > previousScroll || scroll === 0){
        $("header").removeClass('pinned open-mobile-menu');
        $("#content").removeClass('pinned-header');
        $('#mobile-menu').removeClass('open');
      } else {
        $("header").addClass('pinned');
        $("#content").addClass('pinned-header');
      }
      previousScroll = scroll;
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

  });

});