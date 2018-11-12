(function ($) {
  const $form = $('.register-form form');
  const $btn = $form.find('.btn');
  const $email = $form.find('#email');
  const $password = $form.find('#password');
  const $name = $form.find('#name');
  const $nameError = $form.find('.name-error');
  const $emailError = $('.email-error');
  const $passwordError = $('.password-error');
  const $loader = $('.register-form .loader');
  const $serverErrorContainer = $('.register-server-error');
  const $serverError = $('.register-server-error .error');

  let email;
  let password;
  let remember;
  let data;
  let scrollPos;
  let timer;
  let timer1;
  let name;

  if (!$email.val() || !$password.val() || $name.val()) {
    $btn.prop({
      disabled: true,
    });
  } else {
    $btn.prop({
      disabled: true,
    });
  }


  addEvent('blur', $email, (e) => {
    if (!$email.val()) {
      $emailError.show();
    } else {
      $emailError.hide();
    }
  });

  addEvent('blur', $name, (e) => {
    if (!$name.val()) {
      $nameError.show();
    } else {
      $nameError.hide();
    }
  });

  addEvent('blur', $password, (e) => {
    if (!$password.val()) {
      $passwordError.show();
    } else if (($password.val() && $password.val().length < 8)) {
      $('.input-container .error').text('Password length must be up to 8').css({
        textAlign: 'center',
      });
      $passwordError.show();
    } else {
      $passwordError.hide();
    }
  });
  addEvent('keydown', $email, (e) => {
    $emailError.hide();
    timer = clearTimeout(timer);
    timer = setTimeout(() => {
      if (!$email.val()) {
        $email.addClass('invalid');
        $email.removeClass('valid');
      } else {
        $email.removeClass('invalid');
        $email.addClass('valid');
      }
      if (!$email.val() || !$password.val() || !$name.val() || ($password.val() && $password.val().length < 8)) {
        $btn.prop({
          disabled: true,
        });
      } else {
        $btn.prop({
          disabled: false,
        });
      }
    }, 10);
  });
  addEvent('keydown', $name, (e) => {
    $emailError.hide();
    timer = clearTimeout(timer);
    timer = setTimeout(() => {
      if (!$name.val()) {
        $name.addClass('invalid');
        $name.removeClass('valid');
      } else {
        $name.removeClass('invalid');
        $name.addClass('valid');
      }
      if (!$email.val() || !$password.val() || !$name.val() || ($password.val() && $password.val().length < 8)) {
        $btn.prop({
          disabled: true,
        });
      } else {
        $btn.prop({
          disabled: false,
        });
      }
    }, 10);
  });

  addEvent('keydown', $password, (e) => {
    $passwordError.hide();
    timer1 = clearTimeout(timer1);
    timer1 = setTimeout(() => {
      if (!$password.val()) {
        $password.addClass('invalid');
        $password.removeClass('valid');
      } else if (($password.val() && $password.val().length < 8)) {
        $password.addClass('invalid');
        $password.removeClass('valid');
      } else {
        $password.removeClass('invalid');
        $password.addClass('valid');
      }
      if (!$email.val() || !$password.val() || !$name.val() || ($password.val() && $password.val().length < 8)) {
        $btn.prop({
          disabled: true,
        });
      } else {
        $btn.prop({
          disabled: false,
        });
      }
    }, 10);
  });

  $btn.click((e) => {
    e.preventDefault();
    $serverErrorContainer.fadeOut();
    $loader.css({
      display: 'flex',
    });

    email = $email.val();
    password = $password.val();
    name = $name.val();

    data = {
      email,
      password,
      name,
    };


    $.ajax({
      url: 'http://localhost:3000/user/signup',
      data: JSON.stringify(data),
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      success: (res) => {
        $loader.hide();
        const dash = {
          token: res.token,
        };
        localStorage.setItem('dash', JSON.stringify(dash));
        window.location.href = '/';
      },
      error: (err) => {
        $loader.hide();
        if (err.status < 1) {
          $serverError.text('Something is wrong with your network');
        } else if (err.status === 500) {
          $serverError.text('Server Error');
        } else {
          $serverError.text(err.responseJSON.message);
        }
        $serverErrorContainer.fadeIn();
        scrollPos = $serverErrorContainer.offset().top;
        $(window).scrollTop(scrollPos);
      },
    });
  });
}(jQuery));

function addEvent($event, $elem, funct) {
  $elem[$event](funct);
}
