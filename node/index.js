const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const hostname = '0.0.0.0'
const port = 4000;

const server = http.createServer((req, res) => {
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

function handle_request(req, res) {
  switch (req.url) {
    case '/':
      fs.readFile(path.join(__dirname, '../mainpage/index.html'), function(err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      });
      break;
    case '/assets/logo/svg/logo-no-background.svg':
      fs.readFile(path.join(__dirname, '..', req.url), function(err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading ' + req.url);
        }
        res.writeHead(200, {'Content-Type': 'image/svg+xml'});
        res.end(data);
      });
      break;
    case '/styles/css/mainpage.css':
      fs.readFile(path.join(__dirname, '..', req.url), function(err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading ' + req.url);
        }
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(data);
      });
      break;
    default:
      res.writeHead(404);
      res.end('Not found');
  }

}