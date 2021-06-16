const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');
const LoginController = require('./controllers/LoginController');
const UsuarioController = require('./controllers/UsuarioController');
const AppConstants = require('./enums/AppConstants');
const MongoDBConnectionHelper = require('./helpers/MongoDBConnectionHelper');

const logger = require('./middlewares/logger')
const jwt = require('./middlewares/jwt');
const TarefaController = require('./controllers/TarefaController');

class App {
    #controllers;

    iniciar() {
        // configurar o express
        this.#configurarExpress();
        // configura conexão com o banco de dados
        this.#configurarBancoDeDados();
        // carregar os controllers
        this.#carregarControllers();
        // iniciar o servidor
        this.#iniciarServidor();
    }

    #configurarExpress = () => {
        // cria a instancia do express para gerenciar servidor
        this.express = express();

        // registra um middleware customisado que faz log das requisições
        this.express.use(logger);

        // registra os middlewares para fazer a conversão das requisições da API
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());

        // registra o middleware do JWT para fazer validação do acesso a rotas através das requisições recebidas
        this.express.use(jwt);

        // configura o swagger da aplicação para servir a documentação
        this.express.use(
            `${AppConstants.BASE_API_URL}/docs`,
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );
    }

    #configurarBancoDeDados = () => {
        MongoDBConnectionHelper.conectar();
    }

    #carregarControllers = () => {
        // atribui para propriedade controllers a lista de controllers disponíveis da aplicação
        this.#controllers = [
            new LoginController(this.express),
            new UsuarioController(this.express),
            new TarefaController(this.express)
        ];
    }

    #iniciarServidor = () => {
        // tenta pegar a porta a partir da variavel ambiente EXPRESS_PORT
        // se não estiver definida, usa a porta padrão
        const port = process.env.EXPRESS_PORT || 3001;
        this.express.listen(port, () => {
            console.log(`Aplicação executando na porta: ${port}`);
        });
    }

}

module.exports = App;