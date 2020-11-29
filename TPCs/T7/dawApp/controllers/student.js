// Student controller

var Student = require('../models/student')

// Returns student list
module.exports.list = () => {
    return Student
        .find()
        .sort({nome:1})
        .exec()
}

module.exports.lookUp = id => {
    return Student
        .findOne({numero: id})
        .exec()
}

module.exports.insert = student => {
    var newStudent = new Student(student)
    return newStudent.save()
}

module.exports.update = student => {
    var newStudent = new Student(student)
    Student.update({"numero" : newStudent.numero}, {$set: { "nome" : newStudent.nome}, "git": newStudent.git})
        .exec()
    return Student
        .findOne({numero: newStudent.numero})
        .exec()
}

module.exports.delete= id => {
    Student.remove( {"numero" : id})
        .exec()
    return Student
        .find()
        .sort({nome:1})
        .exec()
}