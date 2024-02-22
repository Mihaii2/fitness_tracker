document.getElementById('register__form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  // Perform basic validation
 
  if (!validatePassword(password)) {
    return;
  }
  
  let response;
  try {
    response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });
  }
  catch (err) {
    console.error(err);
    alert('An error occurred');
    return;
  }
  let data;
  try {
    console.log(response);
    data = await response.json();
  }
  catch (err) {
    console.error(err);
    alert('An error occurred');
    return;
  }

  if (data.usernameExists) {
    alert('Username is already taken');
  } else if (data.emailExists) {
    alert('Email is already taken');
  } else {
    alert('Registration successful');
  }
});

function validateEmail(email) {
  // Regular expression for basic email validation
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  console.log(password);
  password__confirm = document.getElementById('password__confirm').value;

  if( password != password__confirm){
    alert('Passwords do not match');
    return false;
  }

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