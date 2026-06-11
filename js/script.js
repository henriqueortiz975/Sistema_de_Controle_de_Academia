// ======================================
// DADOS
// ======================================

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let treinos = JSON.parse(localStorage.getItem("treinos")) || [];
let pagamentos = JSON.parse(localStorage.getItem("pagamentos")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];

let alunoEditando = null;

// ======================================
// ELEMENTOS
// ======================================

const btnMostrarForm = document.getElementById("btnMostrarForm");
const cardFormulario = document.getElementById("cardFormulario");
const overlay = document.getElementById("overlay");
const modalEditar = document.getElementById("modalEditar");

const tabelaPagamentos =
document.getElementById("tabelaPagamentos");

const tabelaFrequencia =
document.getElementById("tabelaFrequencia");

// ======================================
// NAVEGAÇÃO
// ======================================

function mostrar(id){

    document
        .querySelectorAll(".section")
        .forEach(secao => {
            secao.classList.remove("active");
        });

    document
        .getElementById(id)
        .classList.add("active");

    atualizarRelatorios();

}

// ======================================
// MODAIS
// ======================================

btnMostrarForm.addEventListener("click", () => {

    overlay.style.display = "block";
    cardFormulario.style.display = "block";

    document.body.classList.add(
        "modal-aberto"
    );

});

overlay.addEventListener("click", () => {

    cardFormulario.style.display = "none";
    modalEditar.style.display = "none";
    overlay.style.display = "none";

    document.body.classList.remove(
        "modal-aberto"
    );

});

// ======================================
// CADASTRO DE ALUNOS
// ======================================

document
.getElementById("formAluno")
.addEventListener("submit", (e) => {

    e.preventDefault();

    const nome =
    document.getElementById("nome").value;

    const idade =
    document.getElementById("idade").value;

    const planoSelect =
    document.getElementById("tipoValor");

    const plano =
    planoSelect.options[
        planoSelect.selectedIndex
    ].text;

    const valor =
    Number(planoSelect.value);

    alunos.push({

        nome,
        idade,
        plano,
        presente:false

    });

    pagamentos.push({

        aluno:nome,
        valor,
        pago:false,

        vencimento:
        new Date().toLocaleDateString(),

        formaPagamento:
        "Não definida"

    });

    salvarDados();

    renderAlunos();
    renderPagamentos();
    renderFrequencia();
    atualizarRelatorios();

    e.target.reset();

    cardFormulario.style.display = "none";
    overlay.style.display = "none";

    document.body.classList.remove(
        "modal-aberto"
    );

});

// ======================================
// LISTAR ALUNOS
// ======================================

function renderAlunos(filtro=""){

    const lista =
    document.getElementById(
        "listaAlunosCards"
    );

    lista.innerHTML = "";

    const filtrados =
    alunos.filter(aluno =>

        aluno.nome
        .toLowerCase()
        .includes(
            filtro.toLowerCase()
        )

    );

    filtrados.forEach(aluno => {

        const index =
        alunos.indexOf(aluno);

        lista.innerHTML += `

        <div class="aluno-card">

            <h3>${aluno.nome}</h3>

            <p>
                <strong>Idade:</strong>
                ${aluno.idade}
            </p>

            <p>
                <strong>Plano:</strong>
                ${aluno.plano}
            </p>

            <div class="acoes-card">

                <button
                    class="btn-editar"
                    onclick="editarAluno(${index})">

                    Editar

                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirAluno(${index})">

                    Excluir

                </button>

            </div>

        </div>

        `;

    });

}

// ======================================
// PESQUISA
// ======================================

document
.getElementById("pesquisaAluno")
.addEventListener("keyup", e => {

    renderAlunos(e.target.value);

});

// ======================================
// EXCLUIR ALUNO
// ======================================

function excluirAluno(index){

    const confirmar = confirm(
        `Excluir ${alunos[index].nome}?`
    );

    if(!confirmar) return;

    const nome =
    alunos[index].nome;

    alunos.splice(index,1);

    pagamentos =
    pagamentos.filter(
        p => p.aluno !== nome
    );

    salvarDados();

    renderAlunos();
    renderPagamentos();
    renderFrequencia();
    atualizarRelatorios();

}

// ======================================
// EDITAR ALUNO
// ======================================

function editarAluno(index){

    alunoEditando = index;

    document.getElementById(
        "editarNome"
    ).value = alunos[index].nome;

    document.getElementById(
        "editarIdade"
    ).value = alunos[index].idade;

    overlay.style.display = "block";
    modalEditar.style.display = "block";

    document.body.classList.add(
        "modal-aberto"
    );

}

document
.getElementById("formEditarAluno")
.addEventListener("submit",(e)=>{

    e.preventDefault();

    const nomeAntigo =
    alunos[alunoEditando].nome;

    const novoNome =
    document.getElementById(
        "editarNome"
    ).value;

    const novaIdade =
    document.getElementById(
        "editarIdade"
    ).value;

    alunos[alunoEditando].nome =
    novoNome;

    alunos[alunoEditando].idade =
    novaIdade;

    pagamentos.forEach(p=>{

        if(
            p.aluno === nomeAntigo
        ){

            p.aluno = novoNome;

        }

    });

    salvarDados();

    renderAlunos();
    renderPagamentos();
    renderFrequencia();

    modalEditar.style.display =
    "none";

    overlay.style.display =
    "none";

    document.body.classList.remove(
        "modal-aberto"
    );

});

// ======================================
// CADASTRO DE TREINOS
// ======================================

document
.getElementById("formTreino")
.addEventListener("submit",(e)=>{

    e.preventDefault();

    const exercicio =
    document.getElementById(
        "nomeTreino"
    ).value;

    const dia =
    document.getElementById(
        "DiaSemana"
    ).value;

    treinos.push({

        exercicio,
        dia,
        participantes:[]

    });

    salvarDados();

    renderTreinos();

    atualizarRelatorios();

    e.target.reset();

});

// ======================================
// EDITAR TREINO
// ======================================

function editarTreino(index){

    const novoNome = prompt(

        "Novo nome do treino:",

        treinos[index].exercicio

    );

    if(!novoNome) return;

    treinos[index].exercicio =
    novoNome;

    salvarDados();

    renderTreinos();

}

// ======================================
// EXCLUIR TREINO
// ======================================

function excluirTreino(index){

    const confirmar = confirm(
        "Deseja excluir este treino?"
    );

    if(!confirmar) return;

    treinos.splice(index,1);

    salvarDados();

    renderTreinos();

    atualizarRelatorios();

}

// ======================================
// PARTICIPANTES
// ======================================

function adicionarParticipante(index){

    let listaAlunos = alunos
    .map(aluno => aluno.nome)
    .join("\n");

    const nome = prompt(

        "Digite o nome do aluno:\n\n" +
        listaAlunos

    );

    if(!nome) return;

    const existe = alunos.some(
        aluno => aluno.nome === nome
    );

    if(!existe){

        alert(
            "Aluno não encontrado!"
        );

        return;

    }

    if(
        treinos[index]
        .participantes
        .includes(nome)
    ){

        alert(
            "Aluno já está neste treino!"
        );

        return;

    }

    treinos[index]
    .participantes
    .push(nome);

    salvarDados();

    renderTreinos();

}

// ======================================
// LISTAR TREINOS
// ======================================

function renderTreinos(){

    document.getElementById(
        "segunda"
    ).innerHTML = "";

    document.getElementById(
        "terca"
    ).innerHTML = "";

    document.getElementById(
        "quarta"
    ).innerHTML = "";

    document.getElementById(
        "quinta"
    ).innerHTML = "";

    document.getElementById(
        "sexta"
    ).innerHTML = "";

    treinos.forEach(
    (treino,index)=>{

        let destino;

        switch(treino.dia){

            case "Segunda-feira":
                destino =
                document.getElementById(
                    "segunda"
                );
            break;

            case "Terça-feira":
                destino =
                document.getElementById(
                    "terca"
                );
            break;

            case "Quarta-feira":
                destino =
                document.getElementById(
                    "quarta"
                );
            break;

            case "Quinta-feira":
                destino =
                document.getElementById(
                    "quinta"
                );
            break;

            case "Sexta-feira":
                destino =
                document.getElementById(
                    "sexta"
                );
            break;

        }

        destino.innerHTML += `

        <div class="aluno-card">

            <h3>
                ${treino.exercicio}
            </h3>

            <p>
                <strong>
                Participantes:
                </strong>
            </p>

            <ul>

                ${
                    treino.participantes
                    .map(nome =>

                        `<li>${nome}</li>`

                    )
                    .join("")
                }

            </ul>

            <div class="acoes-card">

                <button
                    class="btn"
                    onclick="
                    adicionarParticipante(
                    ${index}
                    )">

                    Adicionar Aluno

                </button>

                <button
                    class="btn-editar"
                    onclick="
                    editarTreino(
                    ${index}
                    )">

                    Editar

                </button>

                <button
                    class="btn-excluir"
                    onclick="
                    excluirTreino(
                    ${index}
                    )">

                    Excluir

                </button>

            </div>

        </div>

        `;

    });

}

// ======================================
// PAGAMENTOS
// ======================================

function marcarPago(index){

    const forma = prompt(
        "Forma de pagamento:\nPix, Dinheiro ou Cartão"
    );

    if(!forma) return;

    pagamentos[index].pago = true;

    pagamentos[index].formaPagamento =
    forma;

    historico.push({

        aluno:
        pagamentos[index].aluno,

        valor:
        pagamentos[index].valor,

        forma:
        forma,

        data:
        new Date()
        .toLocaleDateString()

    });

    salvarDados();

    renderPagamentos();

    atualizarRelatorios();

}

function renderPagamentos(){

    tabelaPagamentos.innerHTML = "";

    pagamentos.forEach(
    (pagamento,index)=>{

        tabelaPagamentos.innerHTML += `

        <tr>

            <td>
                ${pagamento.aluno}
            </td>

            <td>
                R$ ${pagamento.valor}
            </td>

            <td>
                ${
                    pagamento.vencimento
                    || "-"
                }
            </td>

            <td>
                ${
                    pagamento.formaPagamento
                    || "-"
                }
            </td>

            <td
                class="${
                    pagamento.pago
                    ? "pago"
                    : "pendente"
                }">

                ${
                    pagamento.pago
                    ? "Pago"
                    : "Pendente"
                }

            </td>

            <td>

                ${
                    pagamento.pago

                    ?

                    `<span>✔</span>`

                    :

                    `<button
                        class="btn-pago"
                        onclick="
                        marcarPago(
                        ${index}
                        )">

                        Confirmar

                    </button>`
                }

            </td>

        </tr>

        `;

    });

    atualizarFinanceiro();

}

// ======================================
// FINANCEIRO
// ======================================

function atualizarFinanceiro(){

    let recebido = 0;

    let pendentes = 0;

    pagamentos.forEach(p=>{

        if(p.pago){

            recebido +=
            Number(p.valor);

        }else{

            pendentes++;

        }

    });

    document.getElementById(
        "valorRecebido"
    ).textContent =
    `R$ ${recebido.toFixed(2)}`;

    document.getElementById(
        "faltamPagar"
    ).textContent =
    pendentes;

}

// ======================================
// FREQUÊNCIA
// ======================================

function alterarPresenca(index){

    alunos[index].presente =
    !alunos[index].presente;

    salvarDados();

    atualizarRelatorios();

}

function renderFrequencia(){

    tabelaFrequencia.innerHTML = "";

    alunos.forEach(
    (aluno,index)=>{

        tabelaFrequencia.innerHTML += `

        <tr>

            <td>

                ${aluno.nome}

            </td>

            <td>

                <input
                    type="checkbox"

                    ${
                        aluno.presente
                        ? "checked"
                        : ""
                    }

                    onchange="
                    alterarPresenca(
                    ${index}
                    )
                    "

                >

            </td>

        </tr>

        `;

    });

}

// ======================================
// RELATÓRIOS
// ======================================

function atualizarRelatorios(){

    document.getElementById(
        "totalAlunos"
    ).textContent =
    alunos.length;

    document.getElementById(
        "totalTreinos"
    ).textContent =
    treinos.length;

    document.getElementById(
        "totalPagamentos"
    ).textContent =
    pagamentos.filter(
        p => p.pago
    ).length;

    document.getElementById(
        "totalFrequencia"
    ).textContent =
    alunos.filter(
        aluno => aluno.presente
    ).length;

}

// ======================================
// HISTÓRICO FINANCEIRO
// ======================================

function mostrarHistorico(){

    console.table(historico);

}

// ======================================
// LOCAL STORAGE
// ======================================

function salvarDados(){

    localStorage.setItem(
        "alunos",
        JSON.stringify(alunos)
    );

    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );

    localStorage.setItem(
        "pagamentos",
        JSON.stringify(pagamentos)
    );

    localStorage.setItem(
        "historico",
        JSON.stringify(historico)
    );

}

// ======================================
// INICIALIZAÇÃO
// ======================================

renderAlunos();

renderTreinos();

renderPagamentos();

renderFrequencia();

atualizarRelatorios();