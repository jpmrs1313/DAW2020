var http = require('http')
var fs = require('fs')
var url = require('url')


var servidor = http.createServer(function (req, res) {

    if(req.url.match(/\/arqs$/))
    {
        fs.readFile('site/index.html', function(err, data) {
            if(err){
                console.log('ERRO na leitura do ficheiro: ' + err)
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write("<p>Ficheiro inexistente.</p>")
                res.end()
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                res.end()
            } 
        })
    }
    else
    {   
        path=req.url.split("/")
        fs.readFile('site/'+path[2]+'.html', function(err, data) {
            if(err){
                console.log('ERRO na leitura do ficheiro: ' + err)
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write("<p>Ficheiro inexistente.</p>")
                res.end()
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                res.end()
            } 
        })

    }
})


servidor.listen(7777)
console.log("Servidor Ã  escuta na porta 7777...")