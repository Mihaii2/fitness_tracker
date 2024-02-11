const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const hostname = '0.0.0.0'
const port = 3000;

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
  
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, '../mainpage/index.html'), function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
} else if (req.url.pathname.startsWith('/assets/logo/svg/logo-color.svg')) {
    fs.readFile(path.join(__dirname, '..', requestUrl.pathname), function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + requestUrl.pathname);
        }
        res.writeHead(200, {'Content-Type': 'image/svg+xml'});
        res.end(data);
    });
} else {
    res.writeHead(404);
    res.end('Not found');
}

}