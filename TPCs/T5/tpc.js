var http = require('http')
var axios = require('axios')

http.createServer(function (req, res) {

    console.log(req.method + ' ' + req.url)
    if(req.method == 'GET'){
        if(req.url == '/'){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write('<h2>Escola de Musica</h2>')
            res.write('<ul>')
            res.write('<li><a href="/alunos">Lista de alunos</a></li>')
            res.write('<li><a href="/cursos">Lista de cursos</a></li>')
            res.write('<li><a href="/instrumentos">Lista de instrumentos</li>')
            res.write('</ul>')
            res.end()
        }
        else if(req.url == '/alunos'){
            axios.get('http://localhost:3001/alunos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Musica: Lista de Alunos</h2>')
                res.write('<ul>')
            
                alunos.forEach(a => {
                    res.write('<li><a href="/alunos/' + a.id+ '" >' + a.id + ' - ' + a.nome + '</li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtençao da lista de alunos: ' + error);
            }); 
        }
        else if(req.url == '/cursos'){
            axios.get('http://localhost:3001/cursos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Musica: Lista de Cursos</h2>')
                res.write('<ul>')
            
                alunos.forEach(a => {
                    res.write('<li> <a href="/cursos/' + a.id+ '">' + a.id + ' - ' + a.designacao + '</li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtençao da lista de alunos: ' + error);
            }); 
        }
        else if(req.url == '/instrumentos'){
            axios.get('http://localhost:3001/instrumentos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Musica: Lista de Instrumentos</h2>')
                res.write('<ul>')
            
                alunos.forEach(a => {
                    res.write('<li> <a href="/instrumentos/' + a.id+'">' + a.id + ' - ' + a["#text"] +'</li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtençao da lista de instrumentos: ' + error);
            }); 
        }
        else if(req.url.match('(\/alunos\/A[0-9]+)$')){
            axios.get('http://localhost:3001'+req.url)
            .then(function (resp){
                aluno=resp.data;
            
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write('<h2>Dados do aluno: </h2>')
            res.write('<p>Identificador: ' + aluno.id + ' </p>')
            res.write('<p>Nome: ' + aluno.nome + ' </p>')
            res.write('<p>Data de nascimento: ' + aluno.dataNasc + ' </p>')
            res.write('<p>Ano do curso: ' + aluno.anoCurso + ' </p>')
            res.write('<p>Instrumento: ' + aluno.instrumento + ' </p>')
            res.write('<address>[<a href="/alunos">Voltar</a>]</address>')
            res.end()
            })
            .catch(function (error){
                console.log('Erro na obtençao da lista de instrumentos: ' + error);
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write("<p>Pedido nao suportado: " + req.method + " " + req.url + "</p>")
                res.end() 
            });
        }
        else if(req.url.match('(\/cursos\/(CB|CS)[0-9]+)')){
            axios.get('http://localhost:3001'+req.url)
            .then(function (resp){
                curso=resp.data;
            
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write('<h2>Dados do curso: </h2>')
            res.write('<p>Identificador do curso: ' + curso.id + ' </p>')
            res.write('<p>Designação: ' + curso.designacao + ' </p>')
            res.write('<p>Identificador do instrumento: ' + curso.instrumento.id + ' </p>')
            res.write('<p>Nome do instrumento: ' + curso.instrumento["#text"] + ' </p>')
            res.write('<address>[<a href="/cursos">Voltar</a>]</address>')
            res.end()
            })
            .catch(function (error){
                console.log('Erro na obtençao da lista de instrumentos: ' + error);
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write("<p>Pedido nao suportado: " + req.method + " " + req.url + "</p>")
                res.end() 
            });
        }
        else if(req.url.match('(\/instrumentos\/I[0-9]+)')){
            axios.get('http://localhost:3001'+req.url)
            .then(function (resp){
                instrumento=resp.data;
            
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write('<h2>Dados do instrumento: </h2>')
            res.write('<p>Identificador do instrumento: ' + instrumento.id + ' </p>')
            res.write('<p>Nome do instrumento: ' + instrumento["#text"] + ' </p>')
            res.write('<address>[<a href="/instrumentos">Voltar</a>]</address>')
            res.end()
            })
            .catch(function (error){
                console.log('Erro na obtençao da lista de instrumentos: ' + error);
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write("<p>Pedido nao suportado: " + req.method + " " + req.url + "</p>")
                res.end() 
            });
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write("<p>Pedido nao suportado: " + req.method + " " + req.url + "</p>")
            res.end() 
        }
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write("<p>Pedido nao suportado: " + req.method + " " + req.url + "</p>")
        res.end()
    }
    
}).listen(4000)

console.log('Servidor a escuta na porta 4000...')