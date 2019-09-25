var http = require("http");
http.createServer(function (request, response) {
    //header
    response.writeHead(200, {'Content-Type': 'text/plain'});

    //body
    response.end('This is the body\n');

}).listen(8080);

//console output
console.log('Server is running at http://localhost:8080');