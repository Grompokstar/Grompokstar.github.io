$(function(){

  var arrLang = {
    'en': {
      title: 'Service Temporary Unavailable',
      contentText: 'Dear Customer, ' +
        'our service is temporary unavailable due to technical issues. ' +
        'To get any additional information please contact our support team.',
      supportMail: 'support team',
      blogLink: 'our blog'

    },
    'ru': {
      title: 'Ведутся технические работы',
      contentText: 'Уважаемый пользователь, сервис boodet.online временно недоступен. ' +
        ' За дополнительной информацией вы можете обратиться в техническую поддержку.',
      supportMail: 'адрес технической поддержки',
      blogLink: 'наш блог'
    }
  };

  $(window).ready(function(){

    $('.change-language').click(function() {
      var lang = $(this).attr('data-lang');
      $(this).hide();
      if (lang === 'en') {
        $('.change-language[data-lang="ru"]').show()
      } else {
        $('.change-language[data-lang="en"]').show()
      }

      $('.lang').each(function(index, element) {
        $(this).html(arrLang[lang][$(this).attr('data-key')]);
      });

    });

  });

}());
