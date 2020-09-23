const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const chalk = require('chalk');

const server = new Koa();

const funcionalidades = require("./funcionalidades");

server.use(bodyparser());

//função formata erro
const erro = (ctx, mensagem, status = 404) => {
    ctx.status = status;
    ctx.body = {
        status: "Erro",
        dados: {
            mensagem: mensagem
        },
    };
};

//função formata sucesso
const sucesso = (ctx, dados, status = 200, mensagem) => {
    ctx.status = status;
    ctx.body = {
        status: "Sucesso",
        dados: dados,
        mensagem: mensagem
    };
};

server.use(async ctx => {

    const caminho = ctx.url;
    const metodo = ctx.method;

    if(caminho.includes('/products')){ 
        //Rotas produtos
        
        const id = caminho.split('/')[2];

        if(id){

            if(metodo === 'GET'){

                //obter um produto no estoque
                const itemEstoque = funcionalidades.obterItemLista(id, "estoque");
                if(!itemEstoque){
                    erro(ctx, "Conteúdo não encontrado", 404)
                }else{
                    sucesso(ctx, itemEstoque, 200);
                }

            }else if(metodo === 'PUT'){

                //Atualizar um produto no estoque
                const body = ctx.request.body;

                if(!body.qtdDisponivel){
                    erro(ctx, "Você precisa passar todas as informações de um produto que você quer atualizar", 400);
                }else{
                    produtoAtualizado = funcionalidades.atualizarProdutoEstoque(id, body.qtdDisponivel);

                    if(produtoAtualizado){
                        sucesso(ctx, produtoAtualizado, 200, "Produto atualizado")
                    }else{
                        erro(ctx, "Produto não encontrado ou deletado", 404);
                    }

                }

            }else if(metodo === 'DELETE'){

                //Deletar um produto no estoque
                const itemEstoqueDeletado = funcionalidades.marcarDeletado(id);

                if(itemEstoqueDeletado){
                    sucesso(ctx, itemEstoqueDeletado, 200, "Produto deletado")
                }else{
                    erro(ctx, "Produto não encontrado ou já deletado", 404);
                }

            }
        }
        else{

            if(metodo === 'POST'){

                //criar novo produto no estoque
                const body = ctx.request.body;

                if(!body.qtdDisponivel){
                    erro(ctx, "Você precisa a quantidade a ser atualizada", 400);
                }else{
                    const novoProduto = funcionalidades.adicionarProduto(body);
                    sucesso(ctx, novoProduto, 201, "Produto criado");
                }

            }else if(metodo === 'GET'){

                //obtendo todo o estoque
                const estoque = funcionalidades.listarProdutos();
                sucesso(ctx, estoque, 200); 

            }else{
                (metodo!== 'GET' && metodo!== 'POST' && metodo!== 'PUT' && metodo!== 'DELETE') ? erro(ctx, "Método não permitido", 405)  : erro(ctx, "Você precisa passar o id do produto", 400);
            }

        }
            
    }else if(caminho.includes('/orders')){ 
        //Rotas pedidos

        const id = caminho.split('/')[2];

        if(id){

            if(metodo === 'GET'){

                //Obter informações de um pedido em particular
                 const pedido = funcionalidades.obterItemLista(id, "pedidos");
                 if(!pedido){
                     erro(ctx, "Conteúdo não encontrado", 404);
                 }else{
                    sucesso(ctx, pedido, 200);
                 }

            }else if(metodo === 'PUT'){

                //Atualizar estado do pedido ou Adicionar/remover/atualizar produtos na lista de produtos de um pedido
                const funcionalidade = caminho.split('/')[3];

                if(funcionalidade){

                    if(funcionalidade === 'adicionar'){

                        //adicionando novo produto ao pedido
                        const body = ctx.request.body;
                        if(!body.idProduto || !body.quantidadeProduto){
                            erro(ctx, "Você precisa passar todas as de adição do produto (idPedido, idProduto, quantidadeProduto)",400);
                        }else{
                            const produtoAdicionado = funcionalidades.adicionarProdutoPedidos(id, body.idProduto, body.quantidadeProduto);
                            if(produtoAdicionado){
                                sucesso(ctx, produtoAdicionado, 201, "Produto adicionado");
                            }else{
                                erro(ctx, 'Impossível adicionar, possíveis erros: Produto ou pedido inexistentes ou indisponíveis. Estoque não compatível com solicitação ou solicitação inválida.', 404);
                            }
                            
                        }

                    }else if(funcionalidade === 'remover'){

                        //remover produto da lista de pedidos
                        const body = ctx.request.body;
                        if(!body.idProduto){
                            erro(ctx, "Você precisa passar todas as informações de remoção do produto (idPedido, idProduto)", 400);
                        }else{
                            const produtoRemovido = funcionalidades.removerProdutoPedidos(id, body.idProduto);
                            if(produtoRemovido){
                                sucesso(ctx, produtoRemovido, 200, "Produto removido");
                            }else{
                                erro(ctx, "Impossível remover, possíveis erros: Produto ou pedido inexistentes ou indisponíveis. Estoque não compatível com solicitação ou solicitação inválida.", 404);
                            }   
                        }
        
                    }else if(funcionalidade === 'atualizar'){ 

                        //atualizar quantidade do produto na lista do pedido
                        const body = ctx.request.body;
                        if(!body.idProduto || !body.quantidadeProduto){
                            erro(ctx, "Você precisa passar todas as de atualização do produto (idPedido, idProduto, quantidadeProduto)",400);
                        }else{
                            const produtoAtualizado = funcionalidades.atualizarProdutoPedido(id, body.idProduto, body.quantidadeProduto);

                            if(produtoAtualizado){
                                sucesso(ctx, produtoAtualizado, 200, "Produto atualizado");
                            }else{
                                erro(ctx, "Impossível atualizar, possíveis erros: Produto ou pedido inexistentes ou indisponíveis. Estoque não compatível com solicitação ou solicitação inválida.", 404);
                            }   

                        }
        
                    }else if (funcionalidade === 'atualizarEstado'){

                        //atualizar estado do pedido
                        const body = ctx.request.body;
                        if(!body.idPedido || !body.status){
                            erro(ctx, "Você precisa passar todas as de atualização do estado do pedido (idPedido, status)",400);
                        }else{
                            const estadoAtualizado = funcionalidades.marcarEstadoPedido(body.idPedido, body.status);

                            if(estadoAtualizado){
                                sucesso(ctx, estadoAtualizado, 200, "Pedido atualizado");
                            }else{
                                erro(ctx, "Impossível atualizar pedido não marcado como incompleto", 404);
                            }   

                        }

                    }else{
                        erro(ctx, "Conteúdo não encontrado", 404);
                    }

                }else{
                    erro(ctx, "Você precisa passar a função desejada", 400);
                }
                
            }else if(metodo === 'DELETE'){

                //Deletando pedido
                const pedidoDeletado = funcionalidades.deletarPedido(id);
                if(pedidoDeletado){
                    sucesso(ctx, pedidoDeletado, 200, "Pedido deletado");
                }else{
                    erro(ctx, "Conteúdo não encontrado", 404);
                }

            }else{
                erro(ctx, "Método não permitido", 405);
            }

        }else{
            if(metodo === 'POST'){

                //Criar um novo pedido
                const body = ctx.request.body;
                if(!body.idCliente){
                    erro(ctx, "Você precisa passar todas as informações de um pedido", 400);
                }else{
                    const novoPedido = funcionalidades.criarPedido(body);
                    sucesso(ctx, novoPedido, 201, "Pedido criado");
                }

            }else if(metodo === 'GET'){
                const estado = caminho.split('=')[1];

                if(estado){
                    //listar pedidos por estado
                    const pedidos = funcionalidades.listarEstado(estado);
                    sucesso(ctx, pedidos, 200);

                }else{
                    //Obter todos os pedidos
                    const pedidos = funcionalidades.listarPedidos();
                    sucesso(ctx, pedidos, 200); 
                }

            }else{
                (metodo!== 'GET' && metodo!== 'POST' && metodo!== 'PUT' && metodo!== 'DELETE') ? erro(ctx, "Método não permitido", 405)  : erro(ctx, "Você precisa passar o id do produto", 400);
            }
        }

    }else{
        erro(ctx, "Conteúdo não encontrado", 404);
    } 

});

server.listen(8081, () => console.log("Requisição recebida!"));