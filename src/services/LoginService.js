const jwt = require('jsonwebtoken');
const md5 = require('md5');
const UsuarioRepository = require('../repositories/impl/MongoDBUsuarioRepository');

class LoginService {
    async logar(login, senha) {
        const filtro = {
            email: login,
            senha: md5(senha)
        }
        
        let usuario = null;
        const usuarios = await UsuarioRepository.filtrar(filtro);
        if (usuarios && usuarios.length) {
            usuario = usuarios[0];
        } else {
            return null;
        }

        // -> TODO: gerar o token de acesso usando o JWT - OK
        const token = jwt.sign({ _id: usuario.id }, process.env.CHAVE_SECRETA_JWT);

        // Devolve as informações do usuário autenticado com o seu token de acesso
        return {
            ...usuario,
            token
        }
    }
}

module.exports = LoginService;