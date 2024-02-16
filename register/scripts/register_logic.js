document.getElementById('register__form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const password__confirm = document.getElementById('password__confirm').value;
  const email = document.getElementById('email').value;
  console.log('username:', username);
  console.log('password:', password);
  console.log('password__confirm:', password__confirm);
  console.log('email:', email);

  // Perform basic validation
  if (!validateEmail(email)) {
    alert('Invalid email');
    return;
  }

  if (!validatePassword(password)) {
    alert('Invalid password');
    return;
  }
  let response;
  console.log(JSON.stringify({ username, password, email }));
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
    data = await response.json();
  }
  catch (err) {
    console.error(err);
    alert('An error occurred');
    return;
  }

  if (data.usernameExists) {
    alert('Username is already taken');
  } else {
    alert('Registration successful');
  }
});

function validateEmail(email) {
  // Implement your email validation logic here
  return true;
}

function validatePassword(password) {
  // Implement your password validation logic here
  return true;
}