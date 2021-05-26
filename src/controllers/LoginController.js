const HttpController = require('./HttpController');

class LoginController extends HttpController {
    // sobrescreve o método da classe HttpController
    configurarRotas(baseUrl) {
        // define a rota e o manipulador da classe login
        // passando o metdodo login como referencia e informando
        // que o contexto que dever ser usado é o do próprio objeto da classe LoginController
        this.express.post(`${baseUrl}/login`, this.login.bind(this));
    }

    login(req, res) {
        // atribui o corpo da solicitação para a variavel body
        const body = req.body; 

        // valida se foi passado no body os campos de login e senha
        if (!body || !body.login || !body.senha) {
            
            // retorna um erro para quem chamou a API sobre os parâmetros inválidos
            return res.status(400).json({
                status: 400,
                erro: "Parâmetros de entrada inválidos"
            });
        }
        
        // devolve a resposta mockada do login em formato json
        res.json({
            token: 'token gerado pela api'
        });
    }
}

module.exports = LoginController;