// Usado para limpar os dados armazenados no localStorage
//localStorage.clear();

function mostrar(id){

    document.querySelectorAll(".section").forEach(secao=>{secao.classList.remove("active");});

    document.getElementById(id).classList.add("active");

    atualizarRelatorios();
}

const formAluno = document.getElementById("formAluno");

const tabelaAlunos = document.getElementById("tabelaAlunos");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

function renderAlunos(){

    tabelaAlunos.innerHTML = "";

    alunos.forEach(aluno=>{

        tabelaAlunos.innerHTML += `
        <tr>
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.plano}</td>
        </tr>
        `;

    });

}

formAluno.addEventListener("submit",(e)=>{

    e.preventDefault();

    const nome = document.getElementById("nome").value;

    const idade = document.getElementById("idade").value;

    const plano = document.getElementById("tipoValor").value;

    alunos.push({nome, idade, plano});

    localStorage.setItem("alunos", JSON.stringify(alunos));

    renderAlunos();

    formAluno.reset();

});

const formTreino = document.getElementById("formTreino");

const tabelaTreinos = document.getElementById("tabelaTreinos");

let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

function renderTreinos(){

    tabelaTreinos.innerHTML = "";

    treinos.forEach(treino=>{

        tabelaTreinos.innerHTML += `
        <tr>
            <td>${treino.nome}</td>
            <td>${treino.tipo}</td>
        </tr>
        `;

    });

}

formTreino.addEventListener("submit",(e)=>{

    e.preventDefault();

    const nome = document.getElementById("nomeTreino").value;

    const tipo = document.getElementById("tipoTreino").value;

    treinos.push({nome, tipo});

    localStorage.setItem("treinos", JSON.stringify(treinos));

    renderTreinos();

    formTreino.reset();

});

const formPagamento = document.getElementById("formPagamento");

const tabelaPagamentos = document.getElementById("tabelaPagamentos");

let pagamentos = JSON.parse(localStorage.getItem("pagamentos")) || [];

function renderPagamentos(){

    tabelaPagamentos.innerHTML = "";

    pagamentos.forEach(pagamento => {

        tabelaPagamentos.innerHTML += `
        <tr>
            <td>${pagamento.aluno}</td>
            <td>R$ ${pagamento.valor}</td>
        </tr>
        `;

    });

}

formPagamento.addEventListener("submit",(e)=>{

    e.preventDefault();

    const aluno = document.getElementById("alunoPagamento").value;

    const valor = document.getElementById("valorPagamento").value;

    pagamentos.push({aluno, valor});

    localStorage.setItem(
        "pagamentos",
        JSON.stringify(pagamentos)
    );

    renderPagamentos();

    formPagamento.reset();

});

const formFrequencia = document.getElementById("formFrequencia");

const tabelaFrequencia = document.getElementById("tabelaFrequencia");

let frequencias = JSON.parse(localStorage.getItem("frequencias")) || [];

function renderFrequencia(){

    tabelaFrequencia.innerHTML = "";

    frequencias.forEach(item => {

        tabelaFrequencia.innerHTML += `
        <tr>
            <td>${item.aluno}</td>
            <td>${item.data}</td>
        </tr>
        `;

    });

}

formFrequencia.addEventListener("submit",(e)=>{

    e.preventDefault();

    const aluno = document.getElementById("alunoFrequencia").value;

    const data = new Date().toLocaleDateString("pt-BR");

    frequencias.push({aluno, data});

    localStorage.setItem("frequencias", JSON.stringify(frequencias));

    renderFrequencia();

    formFrequencia.reset();

});

function atualizarRelatorios(){

    document.getElementById("totalAlunos").textContent = alunos.length;

    document.getElementById("totalTreinos").textContent = treinos.length;

    document.getElementById("totalPagamentos").textContent = pagamentos.length;

    document.getElementById("totalFrequencia").textContent = frequencias.length;

}

renderAlunos();
renderTreinos();
renderPagamentos();
renderFrequencia();
atualizarRelatorios();