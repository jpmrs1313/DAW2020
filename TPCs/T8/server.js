var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(function(req,res,next) {
    console.log(JSON.stringify(req.body))
    next()
})

app.get('*', function(req,res){
    res.send('Recebi um Get...')
})

app.post('*', function(req,res){
    res.send('Recebi um Post...')
})

app.listen(7700, () => console.log('Servidor à escuta na porta 7700...'))