const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const connection = require('./database_code/database');
const uuid = require('uuid');
const ejs = require('ejs');

const hostname = '0.0.0.0'
const port = 4000;

const server = http.createServer(async (req, res) => {
  req.on('error', (err) => {
    console.error(err);
    res.statusCode = 400;
    res.end();
  }
  );
  handle_request(req, res);
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function handle_request(req, res) {
  try {
    const cookies = req.headers.cookie;
    let LoggedIn = false, UserID;
    if (cookies) {
      const sessionId = cookies.split('=')[1];
      const [rows] = await connection.query('SELECT * FROM Sessions WHERE SessionID = ?', [sessionId]);
      if (rows.length > 0) {
        LoggedIn = true;
        UserID = rows[0].UserID;
      }
    }
    const UserData = { LoggedIn };
    let filePath, contentType;
    if(req.method === 'GET') {
      switch (req.url) { // Determine file to serve
        case '/':
          filePath = path.join(__dirname, './mainpage/mainpage.ejs');
          contentType = 'text/html';
          break;
        case '/assets/logo/svg/logo-no-background.svg':
          filePath = path.join(__dirname, './mainpage/', req.url);
          contentType = 'image/svg+xml';
          break;
        case '/assets/logo/svg/fitness-tracker-favicon-color.svg':
          filePath = path.join(__dirname, './mainpage/', req.url);
          contentType = 'image/svg+xml';
          break;
        case '/styles/mainpage.css':
          filePath = path.join(__dirname, './mainpage/', req.url);
          contentType = 'text/css';
          break;
        case '/assets/images/man_squatting.jpg':
          filePath = path.join(__dirname, './mainpage/', req.url);
          contentType = 'image/jpeg';
          break;
        case '/scripts/mainpage_logout.js':
          filePath = path.join(__dirname, './mainpage/', req.url);
          contentType = 'text/javascript';
          break;
        case '/register':
          filePath = path.join(__dirname, './register/register.html');
          contentType = 'text/html';
          break;
        case '/register/styles/register.css':
          filePath = path.join(__dirname, './register/styles/register.css');
          contentType = 'text/css';
          break;
        case '/register/assets/images/girl__training.jpg':
          filePath = path.join(__dirname, req.url);
          contentType = 'image/jpeg';
          break;
        case '/register/scripts/register_logic.js':
          filePath = path.join(__dirname, './register/scripts/register_logic.js');
          contentType = 'text/javascript';
          break;
        case '/login':
          filePath = path.join(__dirname, './login/login.html');
          contentType = 'text/html';
          break;
        case '/login/styles/login.css':
          filePath = path.join(__dirname, './login/styles/login.css');
          contentType = 'text/css';
          break;
        case '/login/assets/images/girl__training.jpg':
          filePath = path.join(__dirname, req.url);
          contentType = 'image/jpeg';
          break;
        case '/login/scripts/login_logic.js':
          filePath = path.join(__dirname, './login/scripts/login_logic.js');
          contentType = 'text/javascript';
          break;
        default:
          res.writeHead(404);
          res.end('Not found');
          return; // Prevent further execution
      }
      // read file to send from file system
      if(filePath.endsWith('.ejs')) {
        const template = await fs.readFile(filePath, 'utf8');
        const rendered = ejs.render(template, { UserData });
        res.writeHead(200, { 'Content-Type': contentType});
        res.end(rendered);
      }
      else {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    }
    else if (req.method === 'POST') { // Handle POST requests
      if (req.url === '/register') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            console.log('username:', data.username);
            console.log('password:', data.password);
            console.log('email:', data.email);
            // Perform basic validation
            if (!validateEmail(data.email)) {
              res.writeHead(400);
              res.end('Invalid email');
              return;
            }
            if (!validatePassword(data.password)) {
              res.writeHead(400);
              res.end('Invalid password');
              return;
            }
          
            // Check if username exists
            const [userRows] = await connection.query('SELECT * FROM Users WHERE Username = ?', [data.username]);
            if (userRows.length > 0) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ usernameExists: true, emailExists: false }));
  
              return;
            }
        
            // Check if email exists
            const [emailRows] = await connection.query('SELECT * FROM Users WHERE Email = ?', [data.email]);
            if (emailRows.length > 0) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ emailExists: true, usernameExists: false}));
              console.log('Email already exists');
              return;
            }
            
            // Hash password and create user
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await connection.query('INSERT INTO Users (Username, PasswordHash, Email) VALUES (?, ?, ?)', [data.username, hashedPassword, data.email]);
        
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ usernameExists: false, emailExists: false }));
            console.log('User created');
          } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end();
          }
        });
      }
      else if (req.url === '/login') {
        console.log("login");
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        })
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            console.log('email:', data.email);
            console.log('password:', data.password);
            // Perform basic validation
            if(!validateEmail(data.email)) {
              res.writeHead(400);
              res.end('Invalid email or password');
              return;
            }
            if(!validatePassword(data.password)) {
              res.writeHead(400);
              res.end('Invalid email or password');
              return;
            }
            // Check if email exists
            const [rows] = await connection.query('SELECT * FROM Users WHERE Email = ?', [data.email]);
            if(rows.length === 0) {
              res.writeHead(400);
              res.end('Invalid email or password');
              return;
            }
            const user = rows[0];
            // Check if password is correct
            const passwordMatch = await bcrypt.compare(data.password, user.PasswordHash);
            if(!passwordMatch) {
              res.writeHead(400);
              res.end('Invalid email or password');
              return;
            }
            // Create session cookie
            const sessionId = uuid.v4();

            // Store session in database
            await connection.query('INSERT INTO Sessions (SessionID, UserID, Time_To_Live) VALUES (?, ?, ?)', [sessionId, user.UserID, 2592000]); // Set cookie to expire in 1 month

            // Set session cookie
            res.writeHead(200, {
              'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Max-Age=2592000; SameSite=Strict; Secure; Path='/'`, // Set cookie to expire in 1 month
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ success: true }));
            
          } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end();
          }
          });
      }
      else if (req.url === '/logout') {
        if (!LoggedIn) {
          res.writeHead(400);
          res.end('Not logged in');
          return;
        }
        await connection.query('DELETE FROM Sessions WHERE UserID = ?', [UserID]);
        res.setHeader('Set-Cookie', `sessionId=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/;`);
        res.writeHead(302, { 'Location': '/' });
        res.end();
      }
    }
    else {
      res.writeHead(405);
      res.end();
    }
  }
  catch (err) {
    console.error(err);
    if (err.code === 'ENOENT') { // File not found
      res.writeHead(404);
      res.end('Not found');
    } else { // General error
      res.writeHead(500);
      res.end();
    }
  }
}

// Query the database
connection.query('SELECT * FROM example_table')
  .then(([rows, fields]) => {
    console.log(rows);
  })
  .catch((err) => {
    console.error(err);
  });

function validateEmail(email) {
  // Regular expression for basic email validation
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {

  if(password.length < 8){ 
    console.log('Password must be at least 8 characters long');
    return false;
  }

  if(password.length > 20){
    console.log('Password must be at most 20 characters long');
    return false;
  }

  if(!/\d/.test(password)){
    console.log('Password must contain a number');
    return false;
  }

  return true;
}

// a recurring timeout to delete expired sessions every 24 hours
setInterval(async () => {
  try {
    const [rows] = await connection.query('DELETE FROM Sessions WHERE ADDDATE(CreatedAt, INTERVAL Time_To_Live SECOND) < NOW()');
    console.log('Deleted', rows.affectedRows, 'expired sessions');
  } catch (err) {
    console.error(err);
  }
}
, 86400000); // 24 hours