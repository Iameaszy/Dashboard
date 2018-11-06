(function () {
  const dash = JSON.parse(localStorage.getItem('dash') || sessionStorage.getItem('dash'));
  if (!dash || !(dash && dash.token)) {
    window.location.href = '/admin/register.html';
  }
}());
