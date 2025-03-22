import http from "http";

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/' }); // 修改为 text/html
    res.end('Hello Kailin!');
}).listen(3000);