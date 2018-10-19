(function login($) {
  const token = JSON.parse(localStorage.getItem('dash') || sessionStorage.getItem('dash'));
  if (token) {
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
  const $loader = $('.loader');
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
    } else if (($password.val() && $password.val() < 8)) {
      $('.input-container .error').text('Password length must be up to 8');
      $passwordError.show();
    } else {
      $passwordError.hide();
    }
  });
  addEvent('keydown', $email, (e) => {
    $emailError.hide();
    timer = clearTimeout(timer);
    timer = setTimeout(() => {
      if (!$email.val() || !$password.val()) {
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
      if (!$email.val() || !$password.val()) {
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
    const email = $email.val();
    const password = $password.val();
    const remember = $remember.is(':checked');

    const fd = new FormData();

    fd.append('email', email);
    fd.append('password', password);
    fd.append('remember', remember);

    $.ajax({
      url: 'http://localhost:3000/user/login',
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      processData: false,
      data: fd,
      success: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  });
}(jQuery));

function addEvent($event, $elem, funct) {
  $elem[$event](funct);
}
