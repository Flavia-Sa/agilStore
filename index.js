const readline = require('readline-sync');
const fs = require('fs');

const CAMINHO_ARQUIVO = './estoque.json';

// --- FUNÇÕES DE APOIO (PERSISTÊNCIA) ---

function lerEstoque() {
    try {
        if (!fs.existsSync(CAMINHO_ARQUIVO)) return [];
        const dados = fs.readFileSync(CAMINHO_ARQUIVO, 'utf-8');
        return JSON.parse(dados);
    } catch (erro) {
        return [];
    }
}

function salvarEstoque(estoque) {
    fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(estoque, null, 2));
}

// --- FUNÇÕES PRINCIPAIS ---

function adicionarProduto() {
    console.log('\n--- Adicionar Novo Produto ---');
    const estoque = lerEstoque();

    const nome = readline.question('Nome do Produto: ');
    const categoria = readline.question('Categoria: ');
    const quantidade = parseInt(readline.question('Quantidade em Estoque: '));

    const ultimoId = estoque.length > 0 ? estoque[estoque.length - 1].id : 0;
    const novoId = ultimoId + 1;
    
    // Aceita vírgula e converte para número decimal
    let precoInput = readline.question('Preco ');
    const preco = parseFloat(precoInput.replace(',', '.'));

    if (isNaN(preco) || isNaN(quantidade)) {
        console.log('Erro: Quantidade e Preco devem ser numeros validos!');
        return;
    }

    const novoProduto = {
        id: novoId,
        nome,
        categoria,
        quantidade,
        preco
    };

    estoque.push(novoProduto);
    salvarEstoque(estoque);
    console.log('Produto adicionado com sucesso!');
}

function listarProdutos() {
    const estoque = lerEstoque();
    console.log('\n--- Inventario AgilStore ---');

    if (estoque.length === 0) {
        console.log('O estoque esta vazio.');
        return;
    }

    // Exibição visual na tabela
    const listaFormatada = estoque.map(p => ({
        ID: p.id,
        Nome: p.nome,
        Categoria: p.categoria,
        Qtd: p.quantidade,
        Preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`
    }));

    console.table(listaFormatada);
}

function atualizarProduto() {
    const estoque = lerEstoque();
    const idBusca = readline.question('\nDigite o ID do produto para atualizar: ');
    const produto = estoque.find(p => p.id.toString() === idBusca);

    if (!produto) {
        console.log('Produto nao encontrado!');
        return;
    }

    console.log(`Editando: ${produto.nome}. (Deixe vazio para manter o atual)`);
    
    const novoNome = readline.question(`Nome [${produto.nome}]: `) || produto.nome;
    const novaCat = readline.question(`Categoria [${produto.categoria}]: `) || produto.categoria;
    
    const novaQtdInput = readline.question(`Quantidade [${produto.quantidade}]: `);
    const novaQtd = novaQtdInput !== "" ? parseInt(novaQtdInput) : produto.quantidade;

    const novoPrecoInput = readline.question(`Preco [${produto.preco}]: `);
    const novoPreco = novoPrecoInput !== "" ? parseFloat(novoPrecoInput.replace(',', '.')) : produto.preco;

    // Atualiza o objeto na lista
    produto.nome = novoNome;
    produto.categoria = novaCat;
    produto.quantidade = novaQtd;
    produto.preco = novoPreco;

    salvarEstoque(estoque);
    console.log('Produto atualizado com sucesso!');
}

function excluirProduto() {
    let estoque = lerEstoque();
    const idExcluir = readline.question('\nDigite o ID para excluir: ');
    
    const produto = estoque.find(p => p.id.toString() === idExcluir);

    if (produto) {
        const confirmar = readline.question(`Excluir "${produto.nome}"? (s/n): `);
        if (confirmar.toLowerCase() === 's') {
            estoque = estoque.filter(p => p.id.toString() !== idExcluir);
            salvarEstoque(estoque);
            console.log('Produto removido!');
        }
    } else {
        console.log('ID nao encontrado.');
    }
}

function buscarProduto() {
    const estoque = lerEstoque();
    const busca = readline.question('\nBuscar (ID ou Nome): ').toLowerCase();

    const resultados = estoque.filter(p => 
        p.id.toString().includes(busca) || 
        p.nome.toLowerCase().includes(busca)
    );

    if (resultados.length > 0) {
        console.table(resultados.map(p => ({
            ...p,
            preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`
        })));
    } else {
        console.log('Nenhum produto encontrado.');
    }
}

// --- MENU ---

function menu() {
    while (true) {
        console.log('\n1. Adicionar | 2. Listar | 3. Atualizar | 4. Excluir | 5. Buscar | 0. Sair');
        const opcao = readline.question('Escolha: ');

        if (opcao === '1') adicionarProduto();
        else if (opcao === '2') listarProdutos();
        else if (opcao === '3') atualizarProduto();
        else if (opcao === '4') excluirProduto();
        else if (opcao === '5') buscarProduto();
        else if (opcao === '0') break;
        else console.log('Opcao invalida.');
    }
}

menu();