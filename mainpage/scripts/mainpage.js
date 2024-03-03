document.getElementById('logout__button__form').addEventListener('submit', async (event) => {
  event.preventDefault();
  let response;
  try {
    response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (err) {
    console.error(err);
    alert('An error occurred');
    return;
  }
  window.location.href = '/';
});