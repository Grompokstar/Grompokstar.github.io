$(function(){

    $("body").on('click', '[href*="#"]', function(e){
        $('html,body').stop().animate({ scrollTop: $(this.hash).offset().top + 5}, 1000);
        e.preventDefault();
    });

    function onScroll(){
        var scroll_top = $(document).scrollTop();
        $('.main-menu a').each(function(){
            var hash = $(this).attr("href");
            var target = $(hash);
            if (target.position().top <= scroll_top && target.position().top + target.outerHeight() > scroll_top) {
                $('.main-menu li.active').removeClass("active");
                $(this).parent('li').addClass("active");
            } else {
                $(this).parent('li').removeClass("active");
            }
        });
    }

    $(window).ready(function() {
        var windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            header = $('header'),
            headerHeight = parseInt(header.height()),
            sections = $('.section'),
            imgHeaders = $('.img-header');

        if (windowWidth >= 1200) {
            var sectionImages = $('.section-img img'),
                sectionImgWidth = parseInt($('#slide-1 img').width()),
                containerWidth = parseInt($('.container').width());

            var marginRight = (windowWidth - containerWidth)/2;

            sectionImages.css('width', sectionImgWidth + marginRight + 20);
            imgHeaders.css('width', sectionImgWidth + marginRight + 20);

            /*var sectionHeight = parseInt($('#slide-1').height()),
                margin = windowHeight - sectionHeight - headerHeight;

            sections.css('margin-bottom', margin);*/
        }

        $(document).on("scroll", onScroll);

        $('.try-free-btn').on('click', function() {
            $('.registerWindow').modal();

        })


    });

    var h_hght = 40; // высота шапки
    var h_mrg = 0;    // отступ когда шапка уже не видна

    $(function(){

        var elem = $('#main-navigation');
        var top = $(this).scrollTop();

        if(top > h_hght){
            elem.css('top', h_mrg);
        }

        $(window).scroll(function(){
            top = $(this).scrollTop();

            if (top + h_mrg < h_hght) {
                elem.css('top', (h_hght - top));
            } else {
                elem.css('top', h_mrg);
            }
        });

    });

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
    });




    var authWindow = $('.authWindow');

    $('#register-phone').inputmask({mask: '+7(999)-999-99-99', clearIncomplete: true});

    authWindow.find('input[type="password"]').on('keypress', function(e){
        if (e.keyCode == 13){
            authWindow.find('.authMe').click();
        }
    });

    authWindow.find('.authMe').click(function(){
        authWindow.find('.alert').hide();
        var LoginForm = {
            username: authWindow.find('input[type="email"]').val(),
            password: authWindow.find('input[type="password"]').val()
        };

        authWindow.find('.authMe').attr('disabled', 'disabled').text('Подождите...');
        $.ajax({
            type: 'POST',
            url: '/user/login',
            data: LoginForm,
            dataType: 'text',
            success: function(response){
                document.location = '/#objects';
                authWindow.find('.authMe').removeAttr('disabled').text('Войти');
            },
            error: function(response){
                authWindow.find('.authMe').removeAttr('disabled').text('Войти');
                switch(response.status) {
                    case 403:
                        authWindow.find('.alert').text('Проверьте корректность логина и пароля.').show();
                        break;
                    case 410:
                        authWindow.find('.alert').text('Аккаунт компании заблокирован. Если вы хотите разблокировать данный аккаунт, обратитесь в техподдержку.').show();
                        break;
                    default:
                        authWindow.find('.alert').text(response.statusText).show();
                        break;
                }
            }
        });
    });

    $('select[name="orgForm"]').on('change', function(e){
        var companyInput = $('input[name="company"]');
        switch (this.value){
            case 'org':
                companyInput.attr('placeholder', 'ООО Название компании');
                break;
            case 'ip':
                companyInput.attr('placeholder', 'ИП Фамилия И.О.');
                break;
        }
    });

    $('.register input[name="email"]').change(function(e){
        var form = $('form.registerForm'),
            email = form.find('input[name="email"]');

        $.ajax({
            type: 'POST',
            url: '../user/check-email',
            data: {email: email.val()},
            success: function(data){
                if(data) {
                    email.parents('.form-group').find('.error-msg').empty().append('<div class="error">Данный email уже зарегистрирован</div>');
                } else {
                    email.parents('.form-group').find('.error-msg').empty();
                }
            },
            error: function(){

            }
        });
    });

    var refreshCaptchaImage = function () {
        // отправляется рандомный параметр, чтобы запрос не кешировался
        $('#captcha-image-container').empty().append($('<img>', {src: '/site/captcha?v=' + Math.random()}));
    };

    $('#registerMe').on('click', function(e){
        var form = $('form.registerForm'),
            inputs = form.find('input'),
            validate = function(){
                var result = true,
                    pass1 = form.find('input[name="password[0]"]'),
                    pass2 = form.find('input[name="password[1]"]'),
                    license = form.find('input[type="checkbox"]')[0],
                    company = form.find('input[name="company"]'),
                    email = form.find('input[name="email"]'),
                    phone = form.find('input[name="phone"]')

                if (company.val().replace(/ /g, '') == ''){
                    company.parents('.form-group').find('.error-msg').empty().append('<div class="error">Поле обязательно для заполнения</div>');
                    result = false;
                } else {
                    company.parents('.form-group').find('.error-msg').empty();
                }

                if (!/^([a-zA-Z0-9_.'+-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/.test(email.val())){
                    email.parents('.form-group').find('.error-msg').empty().append('<div class="error">Введите корректный e-mail</div>');
                    result = false;
                } else {
                    email.parents('.form-group').find('.error-msg').empty();
                }

                if (pass1.val().replace(/ /g, '') == ''){
                    pass1.parents('.form-group').find('.error-msg').empty().append('<div class="error">Поле обязательно для заполнения</div>');
                    result = false;
                } else {
                    pass1.parents('.form-group').find('.error-msg').empty();
                }

                if (pass2.val().replace(/ /g, '') == ''){
                    pass2.parents('.form-group').find('.error-msg').empty().append('<div class="error">Поле обязательно для заполнения</div>');
                    result = false;
                } else {
                    pass2.parents('.form-group').find('.error-msg').empty();
                }

                if (phone.val().replace(/ /g, '') == ''){
                    phone.parents('.form-group').find('.error-msg').empty().append('<div class="error">Поле обязательно для заполнения</div>');
                    result = false;
                } else {
                    phone.parents('.form-group').find('.error-msg').empty();
                }

                if (pass1.val() !== pass2.val()){
                    result = false;
                    alert('Введенные пароли не совпадают');
                }

                if (result && !license.checked){
                    var accept = confirm('Вы принимаете условия использования сервиса?');
                    if (accept){
                        license.checked = true;
                    } else {
                        result = false;
                    }
                }

                $.ajax({
                    async: false,
                    type: 'POST',
                    url: '../user/check-email',
                    data: {email: email.val()},
                    success: function(data){
                        if(data) {
                            email.parents('.form-group').find('.error-msg').empty().append('<div class="error">Данный email уже зарегистрирован</div>');
                            result = false;
                        }
                    },
                    error: function(){

                    }
                });

                return result;
            };

        inputs.on('change', function(e){
            $(this).removeClass('error');
        });

        if (validate()){
            $.ajax({
                type: 'POST',
                url:'/site/register/',
                contentType: 'application/json',
                data: JSON.stringify({
                    orgForm: form.find('select[name="orgForm"]').val(),
                    company: form.find('input[name="company"]').val(),
                    email: form.find('input[name="email"]').val(),
                    phone: form.find('input[name="phone"]').val(),
                    password: [form.find('input[name="password[0]"]').val()],
                    verifyCode: form.find('input[name="verifyCode"]').val()
                }),
                success: function () {
                    window.location.href = '/';
                },
                error: function () {
                    var verifyCodeField = form.find('input[name="verifyCode"]').val('');
                    verifyCodeField.parents('.form-group').find('.error-msg').empty().append('<div class="error">Неверный код</div>');
                    refreshCaptchaImage();
                }
            });
        }
    });

    $('#sendPassword').on('click', function(e){
        var email = $(this).parents('form').find('input[name="email"]'),
            regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            form = $('form.passwordForm'),
            errorCnt = $('#error-cnt');


        email.unbind('change');
        email.on('change', function(e){
            $(this).removeClass('error');
        });

        if (email.val().replace(/ /g, '') !== '' && regexp.test(email.val())){
            $.ajax({
                url: '/site/password',
                data: {
                    email: email.val()
                },
                type: 'POST',
                success: function(resp){
                    form.empty().append('<div class="alert alert-success">На e-mail <b>'+ email.val() +'</b> было выслано письмо с информацией о Вашей учетной записи. <br><br>Пожалуйста, проверьте свою почту</div>');
                },
                error: function(resp){
                    if (resp.status == 404) {
                        errorCnt.append('<div class="alert alert-danger">Пользователь не найден. Проверьте введенный логин.</div>')
                    } else {
                        form.empty().append('<div class="alert alert-danger">Мы не смогли отправить Вам письмо с информацией о Вашей учетной записи. <br><br>Пожалуйста, попробуйте позднее.</div>');
                    }
                }
            });
        } else {
            email.addClass('error');
        }
    });

    $('#captcha-image-container, .captcha-refresher').on('click', function (event) {
        $.ajax({
            url: '/site/refresh-captcha',
            type: 'POST',
            success: function () {
                refreshCaptchaImage();
            },
            error: function () {
                refreshCaptchaImage();
            }
        });
    });


    var callBtn = $('#call'),
        callbackModal = $('#callback-modal'),
        callbackForm = $('#callback-form'),
        alert = callbackForm.find('#callback-alert'),
        errorCnt = callbackForm.find('.error-msg');

    callbackForm.find('#phone-field').inputmask({mask: '+7(999)-999-99-99', clearIncomplete: true});

    callbackForm.find('#submit-phone').on('click', function(e){
        var number = callbackForm.find('#phone-field'),
            clb = function(){
                callbackForm.find('#phone-field').val('');
                callbackForm.find('#сall-comment').val('');
                callbackForm.find('#сall-name').val('');
                callbackModal.modal('hide');
                alert.empty().hide();
            };

        if (number.val() !== ''){
            errorCnt.empty();

            $.ajax({
                url: '/callback',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    phone: number.val(),
                    comment: $('#сall-comment').val(),
                    name: $('#сall-name').val()
                }),
                success: function(resp){
                    alert.removeClass('alert-danger').addClass('alert-success')
                        .text('Заявка на обратный звонок успешно принята. Окно автоматически закроется через 5 секунд.')
                        .show();

                    setTimeout(clb, 5000);
                },
                error: function(resp){
                    alert.removeClass('alert-success').addClass('alert-danger');

                    if (resp.status == 403){
                        alert.text('С вашего IP адреса уже поступала заявка на обратный звонок. Новый запрос будет доступен через 5 минут.')
                            .show();
                    } else {
                        alert.text('При отправке заявки на обратный звонок произошла ошибка. Попробуйте позднее').show();
                    }

                    setTimeout(clb, 5000);
                }
            });
        } else {
            errorCnt.html('<div class="error">Номер телефона должен состоять из 10 цифр</div>');
        }
    });

    $('.write-to-manager').click(function() {
        window.Zenbox.show();
    });

    setTimeout(function(){
        if (!localStorage.getItem('myobject_callback')) {
            callBtn.click();
            localStorage.setItem('myobject_callback', '1')
        }
    }, 60000)


});