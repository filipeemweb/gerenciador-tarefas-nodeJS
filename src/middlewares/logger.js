module.exports = (req, res, next) => {
    // gera um número aleatório e retorna um número inteiro
    const traceId = Math.ceil(Math.random() * 99999999999);
    const logger = {
        // exibe mensagens de erro
        error: (mensagem, ...parametrosExtras) => {
            console.error(`[ERROR] traceId: ${traceId}, msg: ${mensagem}`, ...parametrosExtras);
        },
        // exibe mensagens de depuração
        debug: (mensagem, ... parametrosExtras) => {
            console.log(`[DEBUG] traceId: ${traceId}, msg: ${mensagem}`, ...parametrosExtras);
        },
        // exibe mensagens informativas 
        info: (mensagem, ...parametrosExtras) => {
            console.info(`[INFO] traceId: ${traceId}, msg: ${mensagem}`, ...parametrosExtras);
        }
    }

    logger.info('requisição recebida,', `url: ${req.url},`, `metodo_http: ${req.method}`);
    
    // cria uma propriedade logger no objeto da requisição e atribui o obejeto logger criado acima
    req.logger = logger;
    next();
}