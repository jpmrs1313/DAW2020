var express = require('express');
var router = express.Router();

var Student = require('../controllers/student')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/students', function(req, res) {
  // Data retrieve
  Student.list()
    .then(data => res.render('students', { list: data }))
    .catch(err => res.render('error', {error: err}))
  ;
});

router.get('/students/editar/:id', function(req, res) {
  // Data retrieve
  console.log(req.params.id)
  Student.lookUp(req.params.id)
    .then(data => res.render('editar', { info: data }))
    .catch(err => res.render('error', {error: err}))
  ;
});

router.get('/students/registar', function(req, res) {
  res.render('registar')
});


router.get('/students/:id', function(req, res) {
  // Data retrieve
  Student.lookUp(req.params.id)
    .then(data => res.render('student', { info: data }))
    .catch(err => res.render('error', {error: err}))
});

router.post('/students', function(req, res) {
  var student=req.body
  Student.insert(student)
    .then(data => res.render('student',{ info: data }))
    .catch(err => res.render('error', {error: err}))
});

router.post('/students/:id', function(req, res) {
  var student=req.body
  student.numero=req.params.id
  Student.update(student)
    .then(data => res.render('student',{ info: data }))
    .catch(err => res.render('error', {error: err}))
});

router.post('/students/eliminar/:id', function(req, res) {
  Student.delete(req.params.id)
    .then(data => res.render('students',{list: data }))
    .catch(err => res.render('error', {error: err}))
});


module.exports = router;
