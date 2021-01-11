// const http = require('http');
// const m = require("./module1");
// var url = require('url');


// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     var q = url.parse(req.url, true).query;
//     var txt = q.year + " " + q.month;
//     res.end(txt);
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('home.html', function(err, data) {
        res.write(data);
    });
    res.end();
}).listen(8080);

