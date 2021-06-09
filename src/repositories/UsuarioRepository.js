
// faz a definição da interface do repositório de usuários
// então qualquer implementação de repositorio de usuario  vai precisar ter os métodos definidos aqui
module.exports = (Implementacao) => {
    if (!Implementacao.cadastrar) {
        throw new Error(`A classe ${Implementacao} não implementou o método cadastrar!`);
    }

    if (!Implementacao.filtrar) {
        throw new Error(`A classe ${Implementacao} não implementou o método filtrar!`);
    }
    
    return Implementacao;
}