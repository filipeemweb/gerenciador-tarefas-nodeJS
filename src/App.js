const express = require('express');
const LoginController = require('./controllers/LoginController');

class App {
    #controllers;

    iniciar() {
        // configurar o express
        this.#configurarExpress();
        // carregar os controllers
        this.#carregarControllers();
        // iniciar o servidor
        this.#iniciarServidor();
    }

    #configurarExpress = () => {
        // cria a instancia do express para gerenciar servidor
        this.express = express();

        // registra os middlewares para fazer a conversão das requisições da API
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());

        // registra um middleware customisado que faz log das requisições
        this.express.use((req, res, next) => {
            console.log(`Requisição recebida, url: ${req.url}, método http: ${req.method}`);
            next();
        });
    }

    #carregarControllers = () => {
        // atribui para propriedade controllers a lista de controllers disponíveis da aplicação
        this.#controllers = [
            new LoginController(this.express)
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