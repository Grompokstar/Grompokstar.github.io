jQuery(function($){

  $(document).ready(function() {

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
            url: '/api/notifications/v1/notifications_requests',
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