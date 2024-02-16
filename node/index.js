const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

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
  let filePath;
  let contentType;
  if(req.method === 'GET') {
    switch (req.url) {
      case '/':
        filePath = path.join(__dirname, '../mainpage/mainpage.html');
        contentType = 'text/html';
        break;
      case '/assets/logo/svg/logo-no-background.svg':
        filePath = path.join(__dirname, '../mainpage/', req.url);
        contentType = 'image/svg+xml';
        break;
      case '/styles/mainpage.css':
        filePath = path.join(__dirname, '../mainpage/', req.url);
        contentType = 'text/css';
        break;
      case '/assets/images/man_squatting.jpg':
        filePath = path.join(__dirname, '../mainpage/', req.url);
        contentType = 'image/jpeg';
        break;
      case '/register':
        filePath = path.join(__dirname, '../register/register.html');
        contentType = 'text/html';
        break;
      case '/register/styles/register.css':
        filePath = path.join(__dirname, '../register/styles/register.css');
        contentType = 'text/css';
        break;
      case '/register/assets/images/girl__training.jpg':
        filePath = path.join(__dirname, '..', req.url);
        contentType = 'image/jpeg';
        break;
      case '/register/scripts/register_logic.js':      
        filePath = path.join(__dirname, '../register/scripts/register_logic.js');
        contentType = 'text/javascript';
        break;
      default:
        res.writeHead(404);
        res.end('Not found');
        return; // Prevent further execution
    }
  
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (err) {
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
  else if (req.method === 'POST') {
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
          // if (!validateEmail(data.email)) {
          //   res.writeHead(400);
          //   res.end('Invalid email');
          //   return;
          // }
          // if (!validatePassword(data.password)) {
          //   res.writeHead(400);
          //   res.end('Invalid password');
          //   return;
          // }
          // Check if username exists
          const usernameExists = false; // Replace with actual check
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ usernameExists }));
        } catch (err) {
          console.error(err);
          res.writeHead(500);
          res.end();
        }
      });
    }
  }
  else {
    res.writeHead(405);
    res.end();
  }
}