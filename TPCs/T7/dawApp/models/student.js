var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

var studentSchema = new mongoose.Schema({
    numero: { type: String, unique: true},
    nome: String,
    git: String,
    tpc: [Number]
});

module.exports = mongoose.model('student', studentSchema)