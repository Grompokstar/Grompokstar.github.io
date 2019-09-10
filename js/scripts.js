jQuery(function($){

  $(document).ready(function() {
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

    //youtube video controls
    function resizeYoutubeIframe() {
      var $youtubeContainer = $('#youtube-video-container');
      var $youtubeIframe = $youtubeContainer.find('iframe');
      var iframeWidth = $youtubeContainer.width();
      var iframeHeight = iframeWidth/1.7777;

      $youtubeContainer.css('height', iframeHeight + 'px')
      $youtubeIframe.attr('width', iframeWidth + 'px');
      $youtubeIframe.attr('height', iframeHeight + 'px');
    }

    resizeYoutubeIframe()

    $(window).resize(resizeYoutubeIframe);

    var $playIcon = $('.play-video-button-circle');

    $playIcon.on('click', function() {
      $playIcon.hide()
      var $youtubeIframe = $('#youtube-video-container iframe');
      $youtubeIframe.css('opacity', '1')
      $youtubeIframe.attr('src', 'https://www.youtube.com/embed/zYMdEidHpms?autoplay=1');
    })
    //-----------------------------------------------------

    var $width = $(window).width();

    if ($width >= 992) {
      new fullpage('#fullpage', {
        autoScrolling: true,
        //anchors: ['page1', 'page2', 'page3'],
        css3: true,
        scrollingSpeed: 700,
        navigation: true,
        navigationPosition: 'left',
        responsiveHeight: 330,
        fitToSectionDelay: 500,
        onLeave: function(origin, destination, direction){
          var leavingSection = this;
          if(origin.index == 0){
            setTimeout(() => {
              $('#man-image').addClass('show')
            }, 1000)
            $('#camera-image').removeClass('bottom')
            $('#box-image').removeClass('show')
          } else if (origin.index == 1) {
            $('#man-image').removeClass('show')
            if (direction === 'down') {
              $('#camera-image').removeClass('bottom').addClass('top')
              $('#server-image').removeClass('bottom')
            } else if (direction === 'up') {
              $('#camera-image').addClass('bottom')
            }
            setTimeout(() => {
              $('#box-image').addClass('show')
            }, 1000)
          } else if (origin.index == 2) {
            setTimeout(() => {
              $('#man-image').addClass('show')
            }, 1000)
            $('#camera-image').removeClass('top')
            $('#box-image').removeClass('show')
            $('#server-image').addClass('bottom')
          }

        }
      });

      fullpage_api.setAllowScrolling(true);

      setTimeout(() => {
        $('.page1-content-container').addClass('show')
      }, 500)

      setTimeout(() => {
        $('.mouse-container').removeClass('bottom')
        $('#fp-nav').addClass('show')
      }, 1000)

      $('#fp-nav').on('click', function() {
        setTimeout(checkActiveSection, 50)
      })

      window.addEventListener('mousewheel', function(e) {
        setTimeout(checkActiveSection, 50)
      });
    } else {
      $('.page1-content-container').addClass('show')
    }






    var forms = document.getElementsByClassName('contest-form');

    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
          var requestData = {
            notifications_request: {
              key_name: 'yt_contest_1',
              emails: [$('#inputEmail').val()],
              provided_data: {
                title: $('#inputProject').val(),
                description: $('#inputProjectTheme').val(),
                city: $('#inputCity').val(),
                date: $('#inputDate').val(),
                sender_name: $('#inputProjectLeader').val(),
                experience: $('#inputLeaderExp').val(),
                link: $('#inputYoutube').val(),
                agreement: !!$("#personalAgree").prop("checked"),
                feedback: !!$("#newsAgree").prop("checked"),
              }
            }
          }

          $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: 'http://185.193.143.91/api/notifications/v1/notifications_requests',
            data: JSON.stringify(requestData),
            success: function(data){
              $('#contestModal').modal('hide')
              $('#successModal').modal('show')
            },
            error: function(error) {
              $('#contestModal').modal('hide')

              if (error && error.responseJSON && error.responseJSON.errors
                && error.responseJSON.errors.base[0] === 'Email has already been taken') {
                $('#emailHasModal').modal('show')
              } else {
                $('#errorModal').modal('show')
              }
            }
          });
        }
        form.classList.add('was-validated');
      }, false);
    });

    function checkActiveSection() {
      var links = $('#fp-nav ul li a');

      for (var i = 0; i < links.length; i++) {
        if ($(links[i]).hasClass('active')) {
          $('#fp-nav').removeClass(['active1', 'active2', 'active3']).addClass('active' + (i+1))
        }
      }
    }

  });

});