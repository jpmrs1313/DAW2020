var http = require('http')
var axios = require('axios')
var fs = require('fs')


var {parse} = require('querystring')
const { ENGINE_METHOD_DIGESTS } = require('constants')

// Aux. Functions
// Retrieves task info from request body --------------------------------
function recuperaInfo(request,date,callback){
    console.log(request.data)
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = "date_created=" + date + "&" 
        request.on('data', function(bloco) {
            body += bloco.toString()
        })
        request.on('end', function() {
            console.log(body)
            callback(parse(body))
        })
    }
}

function geraPostConfirm( task, d){
    return `
    <html>
    <head>
        <title>POST receipt: ${task.id}</title>
        <meta charset="utf-8"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${task.id} inserida</h1>
            </header>

            <div class="w3-container">
                <p>Data inicio: ${task.date_created}</p>
                <p>Data fim: ${task.date_deadline}</p>
                <p>Descriçao: ${task.what}</p>
                <p>Responsavel: ${task.who}</p>
                <p>Tipo: ${task.type}</p>
                
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por servidor ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

function geraDeleteConfirm( ){
    return `
    <html>
    <head>
        <title>DELETE receipt</title>
        <meta charset="utf-8"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa eliminada</h1>
            </header>

            <div class="w3-container">
                <p>Elemento removido</p>
                
            </div>

            <footer class="w3-container w3-teal">
                <address>Servidor- [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Funções auxilidares

function geraPagTasks(tasks_terminadas,tasks_nao_terminadas,tarefa,d){
    let pagHTML = ` 
    <html>
        <head>
            <title>Lista de Tarefas</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        <div class="w3-container w3-teal">
        <h2>Registo de Tarefas</h2>
    </div>

    <form class="w3-container" action="/tasks/${tarefa.id}" method="POST">
        <br>

        <input type="hidden" id="custId" name="id" value="${tarefa.id}">
        <label class="w3-text-teal"><b>Data término</b></label>
        <input class="w3-input w3-border w3-light-grey" type="date"  name="date_deadline" value="${tarefa.date_deadline}">

        <label class="w3-text-teal"><b>Responsável</b></label>
        <input class="w3-input w3-border w3-light-grey" type="text" name="who" value="${tarefa.who}">

        <label class="w3-text-teal"><b>Descrição</b></label>
        <input class="w3-input w3-border w3-light-grey" type="text" name="what" value="${tarefa.what}">

        <label class="w3-text-teal"><b>Tipo</b></label>
        <select class="w3-input w3-border w3-light-grey" name="type">
            <option value="pouco importante">Pouco Importante</option>
            <option value="importante">Importante</option>
            <option value="muito importante">Muito importante</option>
        </select>
        <br>

        <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
    </form>
    <form class="w3-container" action="/tasks" method="GET">
        <input class="w3-btn w3-blue-grey" type="submit" value="Limpar valores"/> 
    </form>
    <div class=w3-container w3-teal">
        <h2>Lista de Tarefas Terminadas</h2>
    </div>
    <table class="w3-table w3 bordered">
        <tr>   
            <th>Id</th>
            <th>Data criação</th>
            <th>Data término</th>
            <th>Responsável</th>
            <th>Descrição</th>
            <th>Tipo</th>
        </tr>    
    `

    tasks_terminadas.forEach(t=> {
        pagHTML += `
        <tr>
            <td>${t.id}</td>
            <td>${t.date_created}</td>
            <td>${t.date_deadline}</td>
            <td>${t.who}</td>
            <td>${t.what}</td>
            <td>${t.type}</td>
            <td>
            <form class="w3-container" action="/tasks/edit/${t.id}" method="GET">
                 <input class="w3-btn w3-blue-grey" type="submit" value="Editar"/> 
             </form>
             </td>
            <td>
            <form class="w3-container" action="/tasks/delete/${t.id}" method="POST">
                 <input class="w3-btn w3-blue-grey" type="submit" value="Eliminar"/> 
             </form>
             </td>
        </tr>  
        `
    })

    pagHTML += `
        </table> 
        <br>
        <br>
        <div class=w3-container w3-teal">
            <h2>Lista de Tarefas Não Terminadas</h2>
        </div>
        <table class="w3-table w3 bordered">
            <tr>
                <th>Id</th>
                <th>Data criação</th>
                <th>Data término</th>
                <th>Responsável</th>
                <th>Descrição</th>
                <th>Tipo</th>
            </tr>    
        
    `

    tasks_nao_terminadas.forEach(t=> {
        pagHTML += `
        <tr>
            <td>${t.id}</td>
            <td>${t.date_created}</td>
            <td>${t.date_deadline}</td>
            <td>${t.who}</td>
            <td>${t.what}</td>
            <td>${t.type}</td>
            <td>
            <form class="w3-container" action="/tasks/edit/${t.id}" method="GET">
                 <input class="w3-btn w3-blue-grey" type="submit" value="Editar"/> 
             </form>
             </td>
            <td>
            <form class="w3-container" action="/tasks/delete/${t.id}" method="POST">
                 <input class="w3-btn w3-blue-grey" type="submit" value="Eliminar"/> 
             </form>
             </td>
        </tr>
        `
    })


    pagHTML += `
        </table>
        <div class="w3-container w3-teal">
            <address>Gerado pelo servidor em ${d} --------------</address>
        </div>
    </body>
    </html>
`
return pagHTML
}



var server = http.createServer (function(req, res){
    //logger: que pedido chegou e quando
    //importante para detetar pedidos e erros

    //get date
    var d=new Date().toISOString().substr(0,16)
    console.log(req.method + " " + req.url + " " + d)

    switch(req.method){
        case "GET":
            //GET TASKS
            if((req.url=="/") || (req.url.match('\/tasks$')) ){
                axios.get("http://localhost:3000/tasks")
                    .then(response => {
                        var tasks = response.data
                        var tasks_terminadas = []
                        var tasks_nao_terminadas= []
                        tasks.forEach(t=>{
            
                            var date_deadline = new Date(t.date_deadline).toISOString().substr(0,16)
  
                            if(d>=date_deadline){
                                //data ja expirou
                                tasks_terminadas.push(t)
                            }
                            else{
                                //ainda nao terminou a data da tarefa
                                tasks_nao_terminadas.push(t)
                            }
                        })

                        task={
                            "id": "0",
                            "date_created": "",
                            "date_deadline": "",
                            "who": "",
                            "what": "",
                            "type": "pouco importante",
                          },

                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write(geraPagTasks(tasks_terminadas,tasks_nao_terminadas,task,d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas...")
                        res.end()
                    })
            }
            else if((req.url.match('(tasks\/edit\/[0-9]+?)'))){
                var id = req.url.substring(req.url.lastIndexOf('/') + 1);
                id=id.slice(0, -1) 
                axios.get("http://localhost:3000/tasks")
                    .then(response => {
                        var tasks = response.data

                        var tasks_terminadas = []
                        var tasks_nao_terminadas= []
                        var task={}
                        tasks.forEach(t=>{
            
                            var date_deadline = new Date(t.date_deadline).toISOString().substr(0,16)
  
                            if(d>=date_deadline){
                                //data ja expirou
                                tasks_terminadas.push(t)
                            }
                            else{
                                //ainda nao terminou a data da tarefa
                                tasks_nao_terminadas.push(t)
                            }
                            if(id=t.id){
                                task=t
                            }

                        })


                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write(geraPagTasks(tasks_terminadas,tasks_nao_terminadas,task,d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas...")
                        res.end()
                    })
                    
            }
            else if(/\/w3\.css$/.test(req.url)){
                fs.readFile("w3.css", function(erro, dados){
                    if(!erro){
                        res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                        res.write(dados)
                        res.end()
                    }
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        case "POST":
            if(req.url.match('(tasks\/[0-9]+)')){
                var id = req.url.substring(req.url.lastIndexOf('/') + 1);
                id=id.slice(0, -1) 
                if(id==0)
                {
                    var d=new Date().toISOString().substr(0,16)
                    date_now=formatDate(d)
                    data=req.data
                    console.log('${data.id}')

                        console.log('PUTde tarefa:' + JSON.stringify(task))
                        axios.post('http://localhost:3000/tasks', task)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPostConfirm( resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                }
                else
                {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("ola")
                    res.end()
                }
            }
            else if((req.url.match('(tasks\/delete\/[0-9]+$)+'))){
                var id = req.url.substring(req.url.lastIndexOf('/') + 1);
                axios.delete('http://localhost:3000/tasks/'+id)
                    .then(resp => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraDeleteConfirm())
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write('<p>Erro no Delete: ' + erro + '</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
            }
            break
        default:
        res.writeHead(200, {'Content-Type':  'text/html;charset=utf-8'})  
        res.write("<p>" + req.method + " não suportado neste servidor.</p>")
        res.end()  
    }
})



server.listen(7777)
console.log('Servidor à escuta na porta 7777...')