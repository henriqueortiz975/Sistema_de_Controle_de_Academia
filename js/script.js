// Usado para limpar os dados armazenados no localStorage
//localStorage.clear();

// NAVEGAÇÃO ENTRE SEÇÕES
function mostrar(id){

    document.querySelectorAll(".section").forEach(secao=>{
        secao.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    atualizarRelatorios();
}


// Seção de Alunos
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

const tabelaAlunos = document.getElementById("tabelaAlunos");

document.getElementById("formAluno").addEventListener("submit",(e)=>{

    e.preventDefault();

    const nome = document.getElementById("nome").value;

    const idade = document.getElementById("idade").value;

    const planoSelect = document.getElementById("tipoValor");

    const plano = planoSelect.options[planoSelect.selectedIndex].text;

    const valor = Number(planoSelect.value);

    const aluno = {nome, idade, plano, presente:false};

    alunos.push(aluno);

    pagamentos.push({aluno:nome, valor:valor, pago:false});

    salvarDados();
    renderAlunos();
    renderPagamentos();
    renderFrequencia();
    atualizarSelectAlunos();
    atualizarRelatorios();

    e.target.reset();

});

function excluirAluno(index){

    const nomeAluno = alunos[index].nome;

    alunos.splice(index, 1);

    pagamentos = pagamentos.filter(p => p.aluno !== nomeAluno);

    treinos = treinos.filter(t => t.aluno !== nomeAluno);

    salvarDados();
    renderAlunos();
    renderPagamentos();
    renderTreinos();
    renderFrequencia();
    atualizarSelectAlunos();
    atualizarRelatorios();

}

function renderAlunos(){

    tabelaAlunos.innerHTML = "";

    alunos.forEach((aluno,index)=>{

        tabelaAlunos.innerHTML += `
        <tr>
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.plano}</td>
            <td>
                <button
                class="btn-excluir"
                onclick="excluirAluno(${index})">
                    Excluir
                </button>
            </td>
        </tr>
        `;

    });

}

function atualizarSelectAlunos(){

    if(!selectAlunoTreino) return;

    selectAlunoTreino.innerHTML = "";

    alunos.forEach(aluno=>{

        selectAlunoTreino.innerHTML += `
        <option>
            ${aluno.nome}
        </option>
        `;

    });

}

// Seção de Treinos
let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

const tabelaTreinos = document.getElementById("tabelaTreinos");

const selectAlunoTreino = document.getElementById("alunoTreino");

document.getElementById("formTreino").addEventListener("submit",(e)=>{

    e.preventDefault();

    const aluno = document.getElementById("alunoTreino").value;

    const exercicio = document.getElementById("nomeTreino").value;

    treinos.push({aluno, exercicio});

    salvarDados();
    renderTreinos();
    atualizarRelatorios();

    e.target.reset();

});

function renderTreinos(){

    tabelaTreinos.innerHTML = "";

    treinos.forEach(treino=>{

        tabelaTreinos.innerHTML += `
        <tr>
            <td>${treino.aluno}</td>
            <td>${treino.exercicio}</td>
        </tr>
        `;

    });

}

// Seção de Pagamentos
let pagamentos = JSON.parse(localStorage.getItem("pagamentos")) || [];

const tabelaPagamentos = document.getElementById("tabelaPagamentos");

function marcarPago(index){

    pagamentos[index].pago = true;

    salvarDados();
    renderPagamentos();
    atualizarRelatorios();

}

function renderPagamentos(){

    tabelaPagamentos.innerHTML = "";

    pagamentos.forEach((pagamento,index)=>{

        tabelaPagamentos.innerHTML += `
        <tr>

            <td>
                ${pagamento.aluno}
            </td>

            <td>
                R$ ${pagamento.valor}
            </td>

            <td class="${pagamento.pago ? "pago" : "pendente"}">

                ${
                    pagamento.pago ? "Pago" : "Pendente"
                }

            </td>

            <td>

                ${
                    pagamento.pago

                    ?

                    `<span>✔</span>`

                    :

                    `<button class="btn-pago" onclick="marcarPago(${index})">Confirmar</button>`

                }

            </td>

        </tr>
        `;

    });

    atualizarFinanceiro();

}

// seção de Financeiro
const tabelaFrequencia = document.getElementById("tabelaFrequencia");

function atualizarFinanceiro(){

    let recebido = 0;

    let pendentes = 0;

    pagamentos.forEach(p=>{

        if(p.pago){
            recebido += Number(p.valor);
        }else{
            pendentes++;
        }

    });

    document.getElementById("valorRecebido").textContent = `R$ ${recebido.toFixed(2)}`;

    document.getElementById("faltamPagar").textContent = pendentes;

}

// seção de Frequência
function alterarPresenca(index){

    alunos[index].presente = !alunos[index].presente;

    salvarDados();
    atualizarRelatorios();

}

function renderFrequencia(){

    tabelaFrequencia.innerHTML = "";

    alunos.forEach((aluno,index)=>{

        tabelaFrequencia.innerHTML += `
        <tr>

            <td>
                ${aluno.nome}
            </td>

            <td>

                <input type="checkbox"

                ${
                    aluno.presente ? "checked" : ""
                }

                onchange="alterarPresenca(${index})">

            </td>

        </tr>
        `;

    });

}

// seção de Relatórios
function atualizarRelatorios(){

    document.getElementById("totalAlunos").textContent = alunos.length;

    document.getElementById("totalTreinos").textContent = treinos.length;

    document.getElementById("totalPagamentos").textContent = pagamentos.filter(p => p.pago).length;

    document.getElementById("totalFrequencia").textContent = alunos.filter(aluno => aluno.presente).length;

}

// seção de Local Storage
function salvarDados(){

    localStorage.setItem("alunos", JSON.stringify(alunos));

    localStorage.setItem("treinos", JSON.stringify(treinos));

    localStorage.setItem("pagamentos", JSON.stringify(pagamentos));

}

renderAlunos();
renderTreinos();
renderPagamentos();
renderFrequencia();
atualizarSelectAlunos();
atualizarRelatorios();