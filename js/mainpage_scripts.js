jQuery(function($){

  $(document).ready(function() {

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

    /*var $playIcon = $('.play-video-button-circle');

    $playIcon.on('click', function() {
      $playIcon.hide()
      var $youtubeIframe = $('#youtube-video-container iframe');
      $youtubeIframe.css('opacity', '1')
      $youtubeIframe.attr('src', 'https://www.youtube.com/embed/zYMdEidHpms?autoplay=1');
    })*/
    //-----------------------------------------------------


    //карусель на главной
    let carousel = $('.carousel-container');
    let buttons = $('.slider-button');
    let leftButton = $('.slider-button.left');
    let rightButton = $('.slider-button.right');

    $('.cases-slider-container .slider-button.right').on('click', function() {
      let activeCount = carousel.find('.cases-slider-item.active').attr('data-id');
      if (activeCount < 3) {
        let targetCount = parseInt(activeCount) + 1
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
      let activeCount = carousel.find('.cases-slider-item.active').attr('data-id');
      if (activeCount > 0) {
        let targetCount = parseInt(activeCount) - 1
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


    //Анимации

    let whyWeOffsetTop =  $('#why-we').offset().top;
    let optionsOffsetTop =  $('#options').offset().top;
    let securityOffsetTop =  $('#security').offset().top;
    let compatibilityOffsetTop =  $('#compatibility').offset().top;
    let supportOffsetTop =  $('#support').offset().top;
    let videoOffsetTop =  $('#video-section').offset().top;
    let windowHeight = document.documentElement.clientHeight;
    let advantageItemHeight = $('.advantage-item').height();
    let securityItemHeight = $('.security-item').height();
    let compatibilityItemHeight = $('#compatibility .more-case').height();
    let whyWeIcons = $('#why-we .icon');
    let optionsIcons = $('#options .icon');
    let securityIcons = $('#security .security-item img');
    let compatibilityIcons = $('#compatibility img');
    let supportImages = $('#support img');
    let videoContainerCover = $('#video-container-cover');



    $(window).scroll(function(){
      let scroll = $(this).scrollTop();

      if (scroll + windowHeight - advantageItemHeight > whyWeOffsetTop ) {
        whyWeIcons.each((i, elem)=> {
          setTimeout(() => {
            $(elem).addClass('show')
          }, 400 * i)
        })
      }

      if (scroll + windowHeight - advantageItemHeight > optionsOffsetTop ) {
        optionsIcons.each((i, elem)=> {
          setTimeout(() => {
            $(elem).addClass('show')
          }, 400 * i)
        })
      }

      if (scroll + windowHeight - securityItemHeight - 120 > securityOffsetTop ) {
        securityIcons.each((i, elem)=> {
          setTimeout(() => {
            $(elem).addClass('show')
          }, 400 * i)
        })
      }

      if (scroll + windowHeight - compatibilityItemHeight * 2 > compatibilityOffsetTop ) {
        compatibilityIcons.each((i, elem)=> {
          setTimeout(() => {
            $(elem).addClass('show')
          }, 400 * i)
        })
      }

      if (scroll + windowHeight/2 > supportOffsetTop ) {
        supportImages.addClass('show')
      }

      if (scroll + windowHeight/2 > videoOffsetTop ) {
        videoContainerCover.addClass('show')
      }
    });

  });

});