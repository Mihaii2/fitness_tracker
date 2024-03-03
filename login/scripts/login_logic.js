document.getElementById('login__form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if(!validateEmail(email)){
    alert('Invalid email');
    return;
  }

  if(!validatePassword(password)) {
    alert('Invalid password');
    return;
  }

  const data = { email, password };
  let response;
  let responseData;
  try {
    response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    responseData = await response.json();
  } catch (err) {
    console.error(err);
    alert('Error logging in please try again');
  }
  
  if (responseData.success) {
    window.location.href = '/';
  } else {
    alert('Invalid email or password');
  }
}
);

function validateEmail(email) {
  // Regular expression for basic email validation
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {

  if(password.length < 8){ 
    alert('Password must be at least 8 characters long');
    return false;
  }

  if(password.length > 20){
    alert('Password must be at most 20 characters long');
    return false;
  }

  if(!/\d/.test(password)){
    alert('Password must contain a number');
    return false;
  }

  return true;
}