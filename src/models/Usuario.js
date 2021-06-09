const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');

const mensagemErroObrigatorio = '*Campo obrigatório!';
const UsuarioSchema = new Schema({
    nome: {
        type : String,
        required: [true, mensagemErroObrigatorio]
    },
    email: {
        type: String,
        required: [true, mensagemErroObrigatorio]
    },
    senha: {
        type: String,
        required: [true, mensagemErroObrigatorio]
    }
});

// define um evento que é executado antes do usuario ser commitado no banco
UsuarioSchema.pre('save', function (next) {
    // criptografa a senha do usuario para não ficar exposta no banco
    this.senha = md5(this.senha);
    next();
});

// faz o link do Schema com a colleciton (leia tabela) 'Usuarios'
const Usuario = mongoose.model('usuarios', UsuarioSchema);
module.exports = Usuario;