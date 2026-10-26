
/* MISSÃO AURA - SISTEMA DE IDENTIFICAÇÃO */

// Array de objetos com os perfis
const perfis = [
    {
        id: 1,
        nome: "Engenheiro de Sistemas",
        categoria: "Construção",
        descricao: "Transforma problemas em soluções. Gosta de construir, consertar equipamentos e manter os sistemas funcionando.",
        imagem: "imagens/perfil-1.jpg",
        recomendacao: "Fique responsável pelos equipamentos, pela manutenção da nave e pela construção de ferramentas necessárias à sobrevivência."
    },
    {
        id: 2,
        nome: "Cientista Explorador",
        categoria: "Investigação",
        descricao: "É curioso, observador e gosta de pesquisar evidências para descobrir como as coisas funcionam.",
        imagem: "imagens/perfil-2.jpg",
        recomendacao: "Analise amostras do planeta, investigue possíveis formas de vida e estude as condições ambientais."
    },
    {
        id: 3,
        nome: "Explorador de Campo",
        categoria: "Exploração",
        descricao: "Adora descobrir lugares, experimentar alternativas e enfrentar situações desconhecidas.",
        imagem: "imagens/perfil-3.jpg",
        recomendacao: "Lidere as expedições pelo terreno, encontre caminhos seguros e identifique recursos importantes para a equipe."
    },
    {
        id: 4,
        nome: "Estrategista da Missão",
        categoria: "Planejamento",
        descricao: "Gosta de organizar informações, coordenar pessoas e tomar decisões pensando no sucesso de todos.",
        imagem: "imagens/perfil-4.jpg",
        recomendacao: "Organize as tarefas da tripulação, avalie os riscos e estabeleça as prioridades da exploração."
    }
];

// Elementos da página
const formulario = document.getElementById("formulario");
const campoNascimento = document.getElementById("nascimento");
const campoNome = document.getElementById("nome");
const mensagem = document.getElementById("mensagem");

const questionario = document.getElementById("questionario");
const resultado = document.getElementById("resultado");

// Impede a seleção de datas futuras
const hoje = new Date();

function dataLocal(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

campoNascimento.max = dataLocal(hoje);

// Calcula a idade considerando se o aniversário já aconteceu
function calcularIdade(data) {
    const nascimento = new Date(data + "T00:00:00");

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const aindaNaoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (
            hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() < nascimento.getDate()
        );

    if (aindaNaoFezAniversario) {
        idade--;
    }

    return idade;
}

// Recebe as respostas e calcula a pontuação
function calcularPerfil() {
    const pontuacao = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };

    for (let i = 1; i <= 4; i++) {
        const resposta = formulario.querySelector(
            `input[name="p${i}"]:checked`
        );

        pontuacao[resposta.value]++;
    }

    const maiorPontuacao = Math.max(...Object.values(pontuacao));

    const vencedores = perfis.filter(
        perfil => pontuacao[perfil.id] === maiorPontuacao
    );

    return {
        perfil: vencedores[0],
        vencedores: vencedores,
        pontos: pontuacao,
        empate: vencedores.length > 1
    };
}

// Envia o formulário
formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    mensagem.textContent = "";

    const nome = campoNome.value.trim();
    const nascimento = campoNascimento.value;

    // Validação do nome
    if (!nome) {
        mensagem.textContent = "Digite seu nome para continuar.";
        campoNome.focus();
        return;
    }

    // Validação da data
    if (!nascimento) {
        mensagem.textContent = "Informe sua data de nascimento.";
        campoNascimento.focus();
        return;
    }

    const dataInformada = new Date(nascimento + "T00:00:00");

    if (
        Number.isNaN(dataInformada.getTime()) ||
        dataLocal(dataInformada) !== nascimento
    ) {
        mensagem.textContent = "Informe uma data válida.";
        campoNascimento.focus();
        return;
    }

    if (nascimento > dataLocal(hoje)) {
        mensagem.textContent = "A data de nascimento não pode ser futura.";
        campoNascimento.focus();
        return;
    }

    // Verifica se as quatro perguntas foram respondidas
    for (let i = 1; i <= 4; i++) {
        const resposta = formulario.querySelector(
            `input[name="p${i}"]:checked`
        );

        if (!resposta) {
            mensagem.textContent =
                `Responda à pergunta ${i} antes de continuar.`;

            formulario.querySelector(
                `input[name="p${i}"]`
            ).focus();

            return;
        }
    }

    // Calcula idade e perfil
    const idade = calcularIdade(nascimento);
    const resultadoPerfil = calcularPerfil();

    const perfil = resultadoPerfil.perfil;

    // Preenche a tela de resultado
    document.getElementById("saudacao").textContent =
        `Participante: ${nome} • Idade: ${idade} anos`;

    document.getElementById("categoriaPerfil").textContent =
        `CATEGORIA: ${perfil.categoria}`;

    document.getElementById("nomePerfil").textContent =
        perfil.nome;

    document.getElementById("descricaoPerfil").textContent =
        perfil.descricao;

    document.getElementById("recomendacaoPerfil").textContent =
        perfil.recomendacao;

    const imagem = document.getElementById("imagemPerfil");

    imagem.src = perfil.imagem;
    imagem.alt = `Ilustração: ${perfil.nome}`;

    // Trata empates
    const pontuacaoTexto = document.getElementById("pontuacao");

    if (resultadoPerfil.empate) {
        const nomesEmpatados = resultadoPerfil.vencedores
            .map(item => item.nome)
            .join(", ");

        pontuacaoTexto.textContent =
            `Empate! Seus resultados combinam com: ${nomesEmpatados}. ` +
            `Exibindo o primeiro perfil como sugestão.`;
    } else {
        pontuacaoTexto.textContent =
            `Perfil definido com ${resultadoPerfil.pontos[perfil.id]} de 4 pontos.`;
    }

    // Mostra o resultado e oculta o questionário
    questionario.hidden = true;
    resultado.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Permite refazer o teste
document.getElementById("refazer").addEventListener("click", function() {
    formulario.reset();

    mensagem.textContent = "";

    resultado.hidden = true;
    questionario.hidden = false;

    campoNascimento.max = dataLocal(new Date());

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Mensagem para caso uma imagem não seja encontrada
document.getElementById("imagemPerfil").addEventListener(
    "error",
    function() {
        this.alt = "Imagem indisponível. Verifique o arquivo do perfil.";
    }
);
