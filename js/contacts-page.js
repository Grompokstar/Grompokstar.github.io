jQuery(function($){

  $(document).ready(function() {

    var forms = document.getElementsByClassName('contact-form');

    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
          var requestData = {
            notifications_request: {
              key_name: 'feedback',
              emails: [$('#inputEmail').val()],
              provided_data: {
                name: $('#inputName').val(),
                message: $('#inputMessage').val(),
                bot_email: $('#inputEmail2').val()
              }
            }
          }

          $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/api/notifications/v1/notifications_requests',
            data: JSON.stringify(requestData),
            success: function(data){
              $('.form-container').html('<div class="text-center">Спасибо за обращение! Мы обязательно ответим Вам в ближайшее время.</div>')
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

  });

});