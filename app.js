#! /usr/bin/node
const http = require('http');
const request = require('request-promise');
const url = require('url');


const urlProxy = async (url, res) => {
    const body = await request(url);
    console.log(body);
    res.writeHead(200, res.headers);
    res.write(body);
    res.end();
} 

http.createServer((req, res) => {
    let data = '';
    let urlstring = '';
    //header
    
    //console.log(request.method);
    req.on('data', chunk => {
        console.log(`data chunk: ${chunk}`)
        data += chunk;
    });

    // Entire request received
    req.on('end', () => { 
        switch(req.method){
            case('GET'): 
                var query = req.url.substring(2);
                //urlstring = url.parse(req.url, true).query;
                if (query.includes('url=')){ 
                    urlstring = JSON.parse('{"' + decodeURI(query).replace('=', '":"') + '"}');
                    urlProxy(urlstring.url, res);
                }
                else{
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write('nothing entered');
                    res.end();
                }
                //res.write('this is a get req');
                console.log(urlstring);
                //res.end();

                break;
            case('POST'):
                data = JSON.parse(data);
                console.log(data.url);
                
                if (data.url) {
                    urlProxy(data.url, res);
                }

                else{
                    console.log(data);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify(data));
                    res.end();
                }

                break;
            default:
                res.writeHead(407, {'Content-Type': 'text-plain'});
                res.end();
        }
            
    });
    req.on('err', error => {
        console.log(error);
        res.writeHead(500);
        res.write(error);
    })

}).listen(8080);

//console output
console.log('Server is running at http://localhost:8080');