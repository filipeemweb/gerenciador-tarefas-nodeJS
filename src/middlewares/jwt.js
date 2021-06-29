const jwt = require('jsonwebtoken');
const UsuarioRepository = require('../repositories/impl/MongoDBUsuarioRepository');

// define a lista de rotas publicas da aplicação
const rotasPublicas = [
    {
        url: '/api/login',
        metodo: 'POST'
    },
    {
        url: '/api/docs*',
        metodo: 'GET'
    },
    {
        url: '/api/usuario',
        metodo: 'POST'
    }
];

module.exports = (req, res, next) => {
    req.logger.info(`verificando permissão de acesso a rota: ${req.url}`);

    // verifica se a requisição rececida é de alguma rota pública
    const rotaPublica = rotasPublicas.find(rota => {
        const rotaPublicaContemWidCard = rota.url.indexOf('*') !== -1;
        const urlRequisicaoContemParteDaRotaPublica = req.url.indexOf(rota.url.replace('*', '')) !== -1;
        return ( // os parênteses definem a prioridade de verificação das condições
            // verifica se a rota da requisição é identica
            rota.url === req.url
            || ( // ou a rota pública contem um '*' e a rota da requisição possui como parte da url a rota publica
                rotaPublicaContemWidCard
                && urlRequisicaoContemParteDaRotaPublica
            )
        )
            && (
                rota.metodo === req.method.toUpperCase()
                || req.method.toUpperCase() === 'OPTIONS'
            )
    });

    if (rotaPublica) {
        req.logger.info('rota pública, requisição liberada');
        return next();
    }

    const auth = req.headers.authorization;
    // verifica se a autorização foi informada no header
    if (!auth) {
        req.logger.info('acesso negado, sem header de autorização');
        // http status 401 = acesso negado (access denied)
        return res.status(401).json({
            status: 401,
            erro: 'acesso negado, necessário o envio header authorization'
        });
    }

    // pega o token extraindo a parte do 'Bearer ' pegando do 7 caracter em diante
    const token = auth.substr(7);
    if (!token) {
        req.logger.info('acesso negado, requisição sem tokem de acesso')
        res.status(401).json({
            status: 401,
            erro: 'acesso negado, o token de acesso não foi informado'
        });
    }

    // verificar se o token é valido e foi gerado usando nossa chave secreta
    jwt.verify(token, process.env.CHAVE_SECRETA_JWT, async (err, decoded) => {
        if (err) {
            req.logger.error('erro ao decodificar o token JWT,', `token: ${token}`);
            return res.status(401).json({
                status: 401,
                erro: 'acesso negado, problema ao decodificar o seu token de autorização'
            });
        }

        req.logger.debug('token JWT decodificado,', `id_usuario: ${decoded._id}`);

        // TODO: carregar o usuário a partir do banco de dados
        const usuario = await UsuarioRepository.buscarPorId(decoded._id);
        if (!usuario) {
            req.logger.error('usuário não encontrado na base,', `id: ${decoded._id}`);
            return res.status(401).json({
                status: 401,
                erro: 'acesso negado, usuário não encontrado'
            });
        }

        // atribui a propriedade usuario da requisisção, quem é o usuário autenticado
        req.usuario = usuario;
        next();
    });

}