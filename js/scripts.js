$(function(){

  var windowWidth = window.innerWidth;

  $(window).ready(function(){

    // редиректы между страницами. Надо будет выпилить.
    $('.filial-card').on('click', function() {
      window.location.href = 'choose_date.html';
    });

    $('.btn-back').on('click', function() {
      window.location.href = 'index.html';
    });

    $('.time-slot-item').on('click', function() {
      window.location.href = 'step-3.html';
    });

    $('.back-to-date-btn').on('click', function() {
      window.location.href = 'choose_date.html';
    });

    $('#booking').on('click', function() {
      window.location.href = 'success_page.html';
    });

    $('#new-booking').on('click', function() {
      window.location.href = 'index.html';
    });

    $('.booking-btn').on('click', function(e) {
      e.stopPropagation();
      window.location.href = 'step-3.html';
    });



    //---------------------------------------------


    if (windowWidth < 500) {
      $('.main-container').css('width', windowWidth + 'px');
    }

    $(window).resize(function() {
      windowWidth = window.innerWidth;

      if (windowWidth < 500) {
        $('.main-container').css('width', windowWidth + 'px');
      }
    });




    $('.ui.dropdown').dropdown();

    var headerWidth = $('header').height();

    if (windowWidth < 500) {
      $('.main-content').css('padding-top', headerWidth + 10 + 'px');
      $('.filials-map').css('top', headerWidth + 60 + 'px');
    } else {
      $('.main-content').css('padding-top', headerWidth + 15 + 'px');
      $('.filials-map').css('top', headerWidth + 55 + 'px');
    }

    $('.close-btn').on('click', function(e) {
      $('.content').addClass('close');
    });

    $('#exit').on('click', function() {
      $('.content').addClass('close');
    });


    $('.phone a').on('click', function(e) {
      e.stopPropagation();
    });



    //переключение карта/список

    var activeView = $('.nav-view .nav-item.active').attr('data-area');
    $('.nav-view-area[data-target="' + activeView + '"]').show();

    $('.nav-view .nav-item').on('click', function() {

      $('.nav-view .nav-item').removeClass('active');
      $(this).addClass('active');

      activeView = $('.nav-view .nav-item.active').attr('data-area');
      $('.nav-view-area').hide();
      $('.nav-view-area[data-target="' + activeView + '"]').show();

    });

    var activeIconView = $('.nav-icon .nav-item.active').attr('data-area');
    $('.nav-view-area[data-target="' + activeIconView + '"]').show();

    $('.nav-view .nav-icon').on('click', function() {

      $('.nav-view .nav-icon').removeClass('active');
      $(this).addClass('active');

      activeIconView = $('.nav-view .nav-icon.active').attr('data-area');
      $('.nav-view-area').hide();
      $('.nav-view-area[data-target="' + activeIconView + '"]').show();

    });

    //-----------------------------------------



    // карточка на карте

    $('.geopin').on('click', function() {
      var cardId = $(this).attr('data-card-id');

      $('.filials-map .filial-card[data-card-id="' + cardId + '"]').toggle();
    });

    $('.filial-card .close-icn').on('click', function(e) {
      e.stopPropagation();
      $(this).closest('.filial-card').hide();
    });

    //-------------------------------------------


    // total-price
    var $minus = $('.session-count-control .minus');
    var $plus = $('.session-count-control .plus');
    var $countOutput = $('.session-count-control .count-output');

    $plus.on('click', function() {
      var currentValue = parseInt($countOutput.text());
      if (currentValue < 99) {
        $countOutput.text(currentValue + 1);
        calcTotalPrice(currentValue + 1);
      }

    });

    $minus.on('click', function() {
      var currentValue = parseInt($countOutput.text());
      if (currentValue > 1) {
        $countOutput.text(currentValue - 1);
        calcTotalPrice(currentValue - 1)
      }
    });

    function calcTotalPrice(sessionCount) {
      var totalPrice;

      var full = Math.floor(sessionCount/2);
      var rest = sessionCount%2;

      totalPrice = full*6860 + rest*4900;

      $('#total-price-output .price').text(totalPrice);

    }

    //-----------------

  });

}());