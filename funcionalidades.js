const estoque = [];

let produtoEstoque = {
    id: 1,
    nome: "garrafa",
    qtdDisponivel: 50,
    valor: 3000,
    descricao: "Garrafa térmica em inox com capacidade de 500 ml. Mantém a temperatura do seu liquido por até 12 horas. Disponíveis nas cores rosa, preta e branca.",
    peso: "280 g",
    deletado: false
}

estoque.push(produtoEstoque);

//função de listar produtos
const listarProdutos = () => {
    const produtosValidos = estoque.filter(produto => !produto.deletado);
    return produtosValidos;
}

//conferindo se o produto existe no estoque e se não está deletado
const confereProduto = (id) => {
    let achado = false, deletado = false;
    const index = estoque.indexOf(estoque[id - 1]);

    if(index !== -1){ 
        achado = true;
        deletado = estoque[index].deletado;
    }

    return (achado && !deletado) ? true : false;
}



//função de obter produto a partir do id
const obterItemLista = (id, lista) => {
    let idExiste = false;

    if(lista==="estoque"){
        idExiste = estoque[id - 1];
    }else{
        idExiste = pedidos[id - 1];
        if(idExiste !== undefined) calcularTotal(pedidos[id - 1]);
    }

    return (idExiste !== undefined) ? idExiste : false;
}

//função gerar id
const gerarId = (lista) => {
    return lista.length + 1;;
}

//função adicionar produto a lista
const adicionarProduto = (produto) => {

    let novoProduto = {
        id: gerarId(estoque),
        nome: produto.nome.trim(),
        qtdDisponivel: Number(produto.qtdDisponivel),
        valor: Number(produto.valor),
        descricao: produto.descricao.trim(),
        peso: produto.peso.trim(),
        deletado: false
    }

    estoque.push(novoProduto);
    return novoProduto;
}

//atualizar info do produto no estoque
const atualizarProdutoEstoque = (idProduto, quantidadeAtualizada) => {
    const deletado = confereProduto(idProduto);

    if(deletado){
        estoque[idProduto - 1].qtdDisponivel = quantidadeAtualizada;
        return estoque[idProduto - 1];
    }else{
        return false; //Produto nao encontrado
    }

}


//função marcar como deletado
const marcarDeletado = (id) => {
    const procurandoProduto = confereProduto(id);

    if(procurandoProduto){
        const index = id - 1;
        estoque[index].deletado = true;
        estoque[index].qtdDisponivel = 0;
        return estoque[index];
    }else{
        return false; //Produto não encontrado ou já deletado
    }

}

const pedidos = [
    {
        id: 1,
        produtos: [],
        estado:'incompleto',
        idCliente: '5',
        deletado: false,
        valorTotal: 0
    },
    {
        id: 2,
        produtos: [],
        estado: 'entregue',
        idCliente: '9',
        deletado: false,
        valorTotal: 0
    },
    {
        id: 3,
        produtos: [],
        estado: 'pago',
        idCliente: '7',
        deletado: false,
        valorTotal: 0
    }
];

//função calcular total
const calcularTotal = (pedido) => {
    const produtos = pedido.produtos;
    const valores = produtos.map(produto => produto.qtd * produto.valor);
    const soma = valores.reduce((acc, x) => acc+x , 0);
    pedido.valorTotal = soma;
}

//função listar todos os pedidos
const listarPedidos = () => {
    const pedidosValidos = pedidos.filter(pedido => !pedido.deletado);
    pedidosValidos.forEach(pedido => calcularTotal(pedido));
    return pedidosValidos;
}


//função listar por estado do pedido
const listarEstado = (estado) => {
    const selecionandoPedidos = pedidos.filter(pedido => pedido.estado === estado);
    const pedidosValidos = selecionandoPedidos.filter(pedido => !pedido.deletado);
    pedidosValidos.forEach(pedido => calcularTotal(pedido));
    return pedidosValidos;
}

//função de criar novo pedido
const criarPedido = (idCliente) => {

    let novoPedido = {
        id: gerarId(pedidos),
        produtos: [],
        estado: 'incompleto',
        idCliente: idCliente,
        deletado: false,
        valorTotal: 0
    }
    
    calcularTotal(novoPedido);
    pedidos.push(novoPedido);
    return novoPedido;
}



//função confere se lista de produtos do pedido está vazia e passa se os estado do pedido é incompleto
const confereListaProdutos = (id) => {
    const pedidoselecionado = obterItemLista(id, "pedidos");
    const verificaEstado = pedidoselecionado.estado === 'incompleto' ? true : false;
    let vaziaOuIndisponivel = false;

    if(pedidoselecionado && verificaEstado){
        if(pedidoselecionado.produtos.length === 0){
            vaziaOuIndisponivel = true;
        }
    }else{
        vaziaOuIndisponivel = true;
    }

    return vaziaOuIndisponivel;
}


//atualizar quantidade disponível no estoque
const atualizarQtdDisponivel = (idProduto, qtdProdutoPedido, funcionalidade) => {
    const indexProdutoEstoque = idProduto - 1;
    const reserva = estoque[indexProdutoEstoque];

    if(funcionalidade==='adicionar'){ //se você adiciona ao pedido, remove do estoque
        if(reserva.qtdDisponivel >= qtdProdutoPedido){
            reserva.qtdDisponivel -= qtdProdutoPedido; 
            return true 
        }else{
            return false //'Ação não permitida, estoque indisponível';
        }
    }else{  //se você retira do pedido, repõe no estoque
            reserva.qtdDisponivel += qtdProdutoPedido; 
            return true
    }

}

//função adicionar um produto a lista de pedidos

const adicionarProdutoPedidos = (idPedido, idProduto, quantidadeProduto) => {
        let validandoProduto = confereProduto(idProduto);
        const pedidoSelecionado = obterItemLista(idPedido, "pedidos");
        const verificaEstado = pedidoSelecionado.estado === 'incompleto' ? true : false;
        const verificaPedidoDeletado = pedidoSelecionado.deletado ? true : false;

        if(validandoProduto && verificaEstado && !verificaPedidoDeletado){
                const produtoSelecionado = obterItemLista(idProduto, "estoque");
                const produtosPedido = pedidoSelecionado.produtos;
                const existeNaLista = produtosPedido.indexOf(produtosPedido[idProduto - 1]) ;
                const qtdProduto = Number(quantidadeProduto);
                const estoqueCompativel = atualizarQtdDisponivel(idProduto, quantidadeProduto, 'adicionar');

                if(existeNaLista === -1){
                    
                    if(estoqueCompativel && qtdProduto>0){
                    produtosPedido.push({
                        id: produtoSelecionado.id,
                        nome: produtoSelecionado.nome,
                        qtd: qtdProduto,
                        valor: produtoSelecionado.valor
                    });
                    calcularTotal(pedidoSelecionado);
                    return pedidoSelecionado //'produto adicionado'

                    }else{
                        return false //estoque não compatível com solicitação ou solicitação inválida
                    }

                }else{
                    return false //produto já existe na lista
                }
                
        }else{
            return false //'impossível adicionar, produto ou pedido inexistentes ou indisponíveis';
        }
}


//função remover produto da lista de pedidos

const removerProdutoPedidos = (idPedido, idProduto) => {
    let validandoProduto = confereProduto(idProduto);
    const pedidoSelecionado = obterItemLista(idPedido, "pedidos");
    const verificaEstado = pedidoSelecionado.estado === 'incompleto' ? true : false;
    const produtosPedido = pedidoSelecionado.produtos;
    const verificaPedidoDeletado = pedidoSelecionado.deletado ? true : false;

    
    if(validandoProduto && verificaEstado && !verificaPedidoDeletado){

                const existeNaLista = produtosPedido.indexOf(produtosPedido[idProduto - 1]);
                if(existeNaLista !== -1){
                    const estoqueCompativel = atualizarQtdDisponivel(idProduto, produtosPedido[existeNaLista].qtd, 'remover');

                    if(estoqueCompativel){
                        produtosPedido.splice(existeNaLista, 1);
                        calcularTotal(pedidoSelecionado);
                        return pedidoSelecionado//'produto removido;
                    }else{
                        return false //solicitação inválida
                    }

                }else{
                    return false //produto inexistente na lista de pedidos ou solicitação de retirada aior do que a quantidade no pedido
                }

    }else{
        return false //'impossível adicionar, produto ou pedido inexistentes ou indisponíveis';
    }
}

//função atuaizar lista de produtos
const atualizarProdutoPedido = (idPedido, idProduto, quantidadeProduto) => {
    let validandoProduto = confereProduto(idProduto);
    const pedidoSelecionado = obterItemLista(idPedido, "pedidos");
    const verificaEstado = pedidoSelecionado.estado === 'incompleto' ? true : false;
    const verificaPedidoDeletado = pedidoSelecionado.deletado ? true : false;


    if(validandoProduto && verificaEstado && !verificaPedidoDeletado){

            const produtosPedido = pedidoSelecionado.produtos;
            const existeNaLista = produtosPedido.indexOf(produtosPedido[idProduto - 1]) ;

            if(existeNaLista !== -1){
                const qtdProduto = Number(quantidadeProduto);
                let estoqueCompativel = null;

                if(produtosPedido[existeNaLista].qtd >= qtdProduto){
                    estoqueCompativel = atualizarQtdDisponivel(idProduto, produtosPedido[existeNaLista].qtd, 'remover');
                    estoqueCompativel = atualizarQtdDisponivel(idProduto, qtdProduto, 'adicionar');
                }else{
                    estoqueCompativel = atualizarQtdDisponivel(idProduto, (produtosPedido[existeNaLista].qtd - qtdProduto) ,'remover') ;
                }
                        
                if(estoqueCompativel && qtdProduto>0){
                    produtosPedido[existeNaLista].qtd = qtdProduto; 
                    calcularTotal(pedidoSelecionado);
                    return pedidoSelecionado //'produto atualizado'
                }else{
                    return false //estoque não compatível com solicitação ou solicitação inválida
                }

            }else{
                return false //produto já existe na lista
            }
            
    }else{
        return false //'impossível adicionar, produto ou pedido inexistentes ou indisponíveis';
    }
}


//função marcar estado do pedido
const marcarEstadoPedido = (id, status) => {
    let pedidoselecionado = obterItemLista(id, "pedidos");
    const confereValidacoes = confereListaProdutos(id);

    if(confereValidacoes){
        return false;
    }else{
        pedidoselecionado.estado = status;
        return pedidoselecionado;
    } 

}

//deletar pedido
const deletarPedido = (id) => {
    const pedidoSelecionado = obterItemLista(id, "pedidos");

    if(pedidoSelecionado && !pedidoSelecionado.deletado){
        pedidoSelecionado.deletado = true;
        return pedidoSelecionado;
    }else{
        return false //pedido não encontrado ao já deletado
    }
    
}


module.exports = {
    listarProdutos: listarProdutos,
    obterItemLista: obterItemLista,
    listarPedidos: listarPedidos,
    adicionarProduto: adicionarProduto,
    criarPedido: criarPedido,
    atualizarProdutoEstoque: atualizarProdutoEstoque,
    marcarDeletado: marcarDeletado,
    marcarEstadoPedido: marcarEstadoPedido,
    deletarPedido: deletarPedido,
    adicionarProdutoPedidos: adicionarProdutoPedidos,
    removerProdutoPedidos: removerProdutoPedidos,
    atualizarProdutoPedido: atualizarProdutoPedido,
    marcarEstadoPedido: marcarEstadoPedido,
    listarEstado: listarEstado
}