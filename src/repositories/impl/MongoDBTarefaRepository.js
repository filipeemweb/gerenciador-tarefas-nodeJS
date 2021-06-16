const Tarefa = require('../../models/Tarefa');
const TarefaRepository = require('../TarefaRepository');
const StatusTarefa = require('../../enums/StatusTarefa');

const transformarTarefa = (tarefaBD) => {
    return {
        id: tarefaBD._doc._id,
        nome: tarefaBD._doc.nome,
        dataPrevistaConclusao: tarefaBD._doc.dataPrevistaConclusao,
        dataConclusao: tarefaBD._doc.dataConclusao,
        idUsuario: tarefaBD._doc.idUsuario
    }
}
 
class MongoDBTarefaRepository {
    static cadastrar(dados) {
        return Tarefa.create(dados);
    }

    static editar(idTarefa, dados) {
        return Tarefa.findByIdAndUpdate(idTarefa, dados);
    }

    static deletar(idTarefa) {
        return Tarefa.findByIdAndDelete(idTarefa);
    }

    static async filtrarPorUsuarioPeriodoEStatus({
        periodoDe,
        periodoAte,
        status,
        idUsuario
    }) {
        const query = {
            idUsuario
        }

        if (periodoDe && periodoDe.trim()) {
            // converte a string passada como parâmetro no periodoDe para uma data em JS
            const dataPeriodoDe = new Date(periodoDe);
            query.dataPrevistaConclusao = {
                // >=
                $gte: dataPeriodoDe
            }
        }

        if (periodoAte && periodoAte.trim()) {
            // converte a string passada como parâmetro no periodoAte para uma data em JS
            const dataPeridoAte = new Date(periodoAte);
            if (!query.dataPrevistaConclusao) {
                query.dataPrevistaConclusao = {};
            }

            // aplica filtro <= dataPeriodoAte
            query.dataPrevistaConclusao.$lte = dataPeridoAte;
        }

        if (status && status.trim()) {
            const statusInt = parseInt(status);
            if (statusInt === StatusTarefa.EM_ABERTO) {
                query.dataConclusao = null;
            } else if (statusInt == StatusTarefa.CONCLUIDO) {
                // diz para o filtro pegar todas as tarefas com a data != de null
                query.dataConclusao = {
                    $ne: null
                }
            }
        }

        const tarefas = await Tarefa.find(query);
        if (tarefas) {
            // faz a transformação da lista de tarefas para o modelo esperado na aplicação
            return tarefas.map(t => transformarTarefa(t));
        }

        return [];
    }

    static async buscarPorId(idTarefa) {
        const tarefaBD = await Tarefa.findById(idTarefa);
        if (tarefaBD) {
            return transformarTarefa(tarefaBD);
        }
        
        return null;
    }
}

module.exports = TarefaRepository(MongoDBTarefaRepository);