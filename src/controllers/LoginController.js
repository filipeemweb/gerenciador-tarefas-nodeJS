const HttpController = require('./HttpController');

class LoginController extends HttpController {
    configurarRotas(baseUrl) {
        this.express(`${baseUrl}/login`, (req, res) => {
            this.login(req, res);
        });
    }

    // devolve a resposta mockada do login em formato json
    login(req, res) {
        res.json({
            token: 'token gerado pela api'
        });
    }
}

module.exports = LoginController;