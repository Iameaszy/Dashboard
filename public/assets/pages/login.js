(function login($) {
  const dash = JSON.parse(localStorage.getItem('dash') || sessionStorage.getItem('dash'));
  if (dash && dash.token) {
    window.location.href = '/admin/register.html';
    return 0;
  }

  const $form = $('.login-form form');
  const $btn = $form.find('.btn');
  const $email = $form.find('#email');
  const $password = $form.find('#password');
  const $remember = $form.find('#remember');
  const $emailError = $('.email-error');
  const $passwordError = $('.password-error');
  const $loader = $('.login-form .loader');
  const $serverErrorContainer = $('.login-server-error');
  const $serverError = $('.login-server-error .error');
  let scrollPos;
  let timer;
  let timer1;

  if (!$email.val() || !$password.val()) {
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
      if (!$email.val() || !$password.val() || ($password.val() && $password.val().length < 8)) {
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
      if (!$email.val() || !$password.val() || ($password.val() && $password.val().length < 8)) {
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
    $serverErrorContainer.css({
      marginTop: '-5rem',
    });
    $loader.css({
      display: 'flex',
    });

    const email = $email.val();
    const password = $password.val();
    const remember = $remember.is(':checked');

    const data = {
      email,
      password,
    };


    $.ajax({
      url: 'http://localhost:3000/user/login',
      data: JSON.stringify(data),
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      success: (res) => {
        $loader.hide();
        const token = {
          res,
        };
        const dash = JSON.parse(localStorage.getItem('dash'));
        if (!dash) {
          if (remember) {
            localStorage.setItem('dash', JSON.stringify({
              token,
            }));
          } else {
            sessionStorage.setItem('dash', JSON.stringify({
              token,
            }));
          }
        } else {
          dash.token = token;

          if (remember) {
            localStorage.setItem('dash', JSON.stringify({
              token,
            }));
          } else {
            sessionStorage.setItem('dash', JSON.stringify({
              token,
            }));
          }
        }
        window.location.href = '/';
      },
      error: (err) => {
        $loader.hide();
        if (err.status === 1) {
          $serverError.text('Something is wrong with your network');
        } else if (err.status === 500) {
          $serverError.text('Server Error');
        } else {
          $serverError.text(err.responseJSON.message);
        }
        $serverErrorContainer.css({
          marginTop: 0,
        });
        scrollPos = $serverErrorContainer.offset().top;
        $(window).scrollTop(scrollPos);
      },
    });
  });
}(jQuery));

function addEvent($event, $elem, funct) {
  $elem[$event](funct);
}
