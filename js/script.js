// Usado para limpar os dados armazenados no localStorage
// localStorage.clear();

// NAVEGAÇÃO ENTRE SEÇÕES
function mostrar(id){

    document.querySelectorAll(".section").forEach(secao=>{
        secao.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    atualizarRelatorios();

}

// ALUNOS
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

const btnMostrarForm = document.getElementById("btnMostrarForm");

const cardFormulario = document.getElementById("cardFormulario");

const overlay = document.getElementById("overlay");

const modalEditar = document.getElementById("modalEditar");

let alunoEditando = null;

btnMostrarForm.addEventListener("click",()=>{

    overlay.style.display = "block";
    cardFormulario.style.display = "block";

    document.body.classList.add("modal-aberto");

});

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
    atualizarRelatorios();

    e.target.reset();

    cardFormulario.style.display = "none";
    overlay.style.display = "none";

    document.body.classList.remove("modal-aberto");

});

function excluirAluno(index){

    const confirmar = confirm(`Deseja excluir ${alunos[index].nome}?`);

    if(!confirmar) return;

    const nomeAluno = alunos[index].nome;

    alunos.splice(index,1);

    pagamentos = pagamentos.filter(p => p.aluno !== nomeAluno);

    salvarDados();
    renderAlunos();
    renderPagamentos();
    renderFrequencia();
    atualizarRelatorios();

}

function renderAlunos(filtro = ""){

    const lista = document.getElementById("listaAlunosCards");

    lista.innerHTML = "";

    const alunosFiltrados = alunos.filter(aluno =>

        aluno.nome.toLowerCase().includes(filtro.toLowerCase())

    );

    alunosFiltrados.forEach(aluno=>{

        const indexOriginal = alunos.indexOf(aluno);

        lista.innerHTML += `

        <div class="aluno-card">

            <h3>${aluno.nome}</h3>

            <p>
                <strong>Idade:</strong>
                ${aluno.idade} ano(s)
            </p>

            <p>
                <strong>Plano:</strong>
                ${aluno.plano}
            </p>

            <div class="acoes-card">

                <button
                    class="btn-editar"
                    onclick="editarAluno(${indexOriginal})">

                    Editar

                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirAluno(${indexOriginal})">

                    Excluir

                </button>

            </div>

        </div>

        `;

    });

}

const campoPesquisa = document.getElementById("pesquisaAluno");

campoPesquisa.addEventListener("keyup",()=>{

    renderAlunos(campoPesquisa.value);

});

function editarAluno(index){

    alunoEditando = index;

    document.getElementById("editarNome").value = alunos[index].nome;

    document.getElementById("editarIdade").value = alunos[index].idade;

    overlay.style.display = "block";

    modalEditar.style.display = "block";

    document.body.classList.add("modal-aberto");

}

document.getElementById("formEditarAluno").addEventListener("submit",(e)=>{

    e.preventDefault();

    const nomeAntigo = alunos[alunoEditando].nome;

    const novoNome = document.getElementById("editarNome").value;

    const novaIdade = document.getElementById("editarIdade").value;

    alunos[alunoEditando].nome = novoNome;

    alunos[alunoEditando].idade = novaIdade;

    pagamentos.forEach(p=>{

        if(p.aluno === nomeAntigo){

            p.aluno = novoNome;

        }

    });

    salvarDados();
    renderAlunos();
    renderPagamentos();
    renderFrequencia();
    atualizarRelatorios();

    modalEditar.style.display = "none";
    overlay.style.display = "none";

    document.body.classList.remove("modal-aberto");

});

overlay.addEventListener("click",()=>{

    cardFormulario.style.display = "none";

    modalEditar.style.display = "none";

    overlay.style.display = "none";

    document.body.classList.remove("modal-aberto");

});

// TREINOS
let treinos =JSON.parse(localStorage.getItem("treinos")) || [];

document.getElementById("formTreino").addEventListener("submit",(e)=>{

    e.preventDefault();

    const exercicio = document.getElementById("nomeTreino").value;

    const dia = document.getElementById("DiaSemana").value;

    treinos.push({exercicio, dia});

    salvarDados();

    renderTreinos();

    atualizarRelatorios();

    e.target.reset();

});

function renderTreinos(){

    document.getElementById("segunda").innerHTML = "";
    document.getElementById("terca").innerHTML = "";
    document.getElementById("quarta").innerHTML = "";
    document.getElementById("quinta").innerHTML = "";
    document.getElementById("sexta").innerHTML = "";

    treinos.forEach((treino,index)=>{

        let destino;

        switch(treino.dia){

            case "Segunda-feira": destino = document.getElementById("segunda");
                break;

            case "Terça-feira": destino = document.getElementById("terca");
                break;

            case "Quarta-feira": destino = document.getElementById("quarta");
                break;

            case "Quinta-feira": destino = document.getElementById("quinta");
                break;

            case "Sexta-feira": destino = document.getElementById("sexta");
                break;

        }

        console.log(treino.dia);
        console.log(destino);

        if(!destino){console.error("Dia inválido:", treino.dia);
            return;
        }

        destino.innerHTML += `

        <div class="aluno-card">

            <h3>${treino.exercicio}</h3>

            <div class="acoes-card">

                <button
                    class="btn-excluir"
                    onclick="excluirTreino(${index})">

                    Excluir

                </button>

            </div>

        </div>

        `;

    });

}

function excluirTreino(index){

    const confirmar = confirm("Deseja excluir este treino?");

    if(!confirmar) return;

    treinos.splice(index,1);

    salvarDados();

    renderTreinos();

    atualizarRelatorios();

}

// PAGAMENTOS
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
                        onclick="marcarPago(${index})">

                        Confirmar

                    </button>`
                }

            </td>

        </tr>

        `;

    });

    atualizarFinanceiro();

}

// FINANCEIRO
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

// FREQUÊNCIA
const tabelaFrequencia = document.getElementById("tabelaFrequencia");

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

                <input
                    type="checkbox"

                    ${
                        aluno.presente
                        ? "checked"
                        : ""
                    }

                    onchange="
                        alterarPresenca(${index})
                    "
                >

            </td>

        </tr>

        `;

    });

}

// RELATÓRIOS
function atualizarRelatorios(){

    document.getElementById("totalAlunos").textContent = alunos.length;

    document.getElementById("totalTreinos").textContent = treinos.length;

    document.getElementById("totalPagamentos").textContent = pagamentos.filter(p => p.pago).length;

    document.getElementById("totalFrequencia").textContent = alunos.filter(aluno => aluno.presente).length;

}

// LOCAL STORAGE
function salvarDados(){

    localStorage.setItem("alunos", JSON.stringify(alunos));

    localStorage.setItem("treinos", JSON.stringify(treinos));

    localStorage.setItem("pagamentos", JSON.stringify(pagamentos));

}

renderAlunos();
renderTreinos();
renderPagamentos();
renderFrequencia();
atualizarRelatorios();