// DADOS
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

let treinos = JSON.parse(localStorage.getItem("treinos")) || [];

let pagamentos = JSON.parse(localStorage.getItem("pagamentos")) || [];

let historico = JSON.parse(localStorage.getItem("historico")) || [];

let alunoEditando = null;
let treinoSelecionado = null;
let pagamentoSelecionado = null;


// ELEMENTOS
const btnMostrarForm = document.getElementById("btnMostrarForm");

const cardFormulario = document.getElementById("cardFormulario");

const overlay = document.getElementById("overlay");

const modalEditar = document.getElementById("modalEditar");

const modalTreino = document.getElementById("modalTreino");

const modalParticipantes = document.getElementById("modalParticipantes");

const tabelaPagamentos = document.getElementById("tabelaPagamentos");

const tabelaFrequencia = document.getElementById("tabelaFrequencia");

const modalPagamento = document.getElementById("modalPagamento");


// NAVEGAÇÃO
function mostrar(id){

    document.querySelectorAll(".section").forEach(secao=>{
        secao.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    atualizarRelatorios();

}


// MODAIS
function fecharModais(){

    cardFormulario.style.display = "none";

    modalEditar.style.display = "none";

    modalTreino.style.display = "none";

    modalParticipantes.style.display  = "none";

    modalPagamento.style.display = "none";

    overlay.style.display = "none";

    document.body.classList.remove("modal-aberto");

}

overlay.addEventListener("click", fecharModais);


// ABRIR MODAL ALUNO
btnMostrarForm.addEventListener("click",()=>{

    overlay.style.display = "block";

    cardFormulario.style.display = "block";

    document.body.classList.add("modal-aberto");

});


// ABRIR MODAL TREINO
document.getElementById("btnNovoTreino").addEventListener("click", ()=>{

    overlay.style.display = "block";

    modalTreino.style.display = "block";

    document.body.classList.add("modal-aberto");

});


// CADASTRO DE ALUNOS
document.getElementById("formAluno").addEventListener("submit", (e)=>{

    e.preventDefault();

    const nome = document.getElementById("nome").value;

    const idade = document.getElementById("idade").value;

    const gmail = document.getElementById("gmail").value;

    const whatsapp = document.getElementById("whatsapp").value;

    const planoSelect = document.getElementById("tipoValor");

    const valor = Number(planoSelect.value);

    const plano = planoSelect.options[planoSelect.selectedIndex].text;

    const meses = {150:1, 400:3, 750:6, 1500:12}[valor];

    alunos.push({id: Date.now(), nome, idade, gmail, whatsapp, plano, meses, 
        dataCadastro: new Date().toISOString(), presente:false});

    const vencimento = new Date();

    vencimento.setMonth(vencimento.getMonth() + meses);

    pagamentos.push({alunoId: alunos[alunos.length - 1].id, aluno: nome, valor, 
        pago:false, vencimento: vencimento.toISOString(), formaPagamento: "Não definida"});

    salvarDados();
    renderAlunos();
    renderPagamentos();
    renderFrequencia();
    atualizarRelatorios();
    e.target.reset();
    fecharModais();

});


// PESQUISA
document.getElementById("pesquisaAluno").addEventListener("keyup", (e)=>{

    renderAlunos(e.target.value);

});


// LISTAR ALUNOS
function renderAlunos(filtro = ""){

    const lista = document.getElementById("listaAlunosCards");

    lista.innerHTML = "";

    const filtrados = alunos.filter(aluno =>

        aluno.nome.toLowerCase().includes(filtro.toLowerCase())

    );

    filtrados.forEach(aluno=>{

        const index = alunos.indexOf(aluno);

        lista.innerHTML += `

        <div class="aluno-card">

            <h3>${aluno.nome}</h3>

            <p><strong>Idade:</strong>${aluno.idade}</p>

            <p><strong>Gmail:</strong>${aluno.gmail}</p>

            <p><strong>WhatsApp:</strong>${aluno.whatsapp}</p>

            <p><strong>Plano:</strong>${aluno.plano}</p>

            <div class="acoes-card">

                <button class="btn-editar" onclick=" editarAluno(${index})">Editar</button>

                <button class="btn-excluir" onclick="excluirAluno(${index})">Excluir</button>

            </div>

        </div>

        `;

    });

}


// EXCLUIR ALUNO
function excluirAluno(index){

    const idAluno = alunos[index].id;

    alunos.splice(index, 1);

    pagamentos = pagamentos.filter(pagamento => pagamento.alunoId !== idAluno);

    treinos.forEach( treino=>{

        treino.participantes = treino.participantes.filter(participante => participante !== idAluno);

    });

    salvarDados();
    renderAlunos();
    renderPagamentos();
    renderTreinos();
    renderFrequencia();
    atualizarRelatorios();

}


// EDITAR ALUNO
function editarAluno(index){

    alunoEditando = index;

    document.getElementById("editarNome").value =

    alunos[index].nome;

    document.getElementById("editarIdade").value = alunos[index].idade;

    document.getElementById("editarGmail").value = alunos[index].gmail;

    document.getElementById("editarWhatsapp").value = alunos[index].whatsapp;

    overlay.style.display = "block";

    modalEditar.style.display = "block";

    document.body.classList.add("modal-aberto");

}

document.getElementById("formEditarAluno").addEventListener("submit", (e)=>{

    e.preventDefault();

    const nomeAntigo = alunos[alunoEditando].nome;

    const novoNome = document.getElementById("editarNome").value;

    const novaIdade = document.getElementById("editarIdade").value;

    const novoGmail = document.getElementById("editarGmail").value;

    const novoWhatsapp = document.getElementById("editarWhatsapp").value;

    alunos[alunoEditando].nome = novoNome;

    alunos[alunoEditando].idade = novaIdade;

    alunos[alunoEditando].gmail = novoGmail;

    alunos[alunoEditando].whatsapp = novoWhatsapp;

    pagamentos.forEach(pagamento=>{

    if(pagamento.alunoId === alunos[alunoEditando].id){

        pagamento.aluno = novoNome;

    }

});

    treinos.forEach( treino=>{

        treino.participantes = treino.participantes.map(nome=>{

            return nome === nomeAntigo ? novoNome : nome;

        });

    });

    salvarDados();
    renderAlunos();
    renderPagamentos();
    renderFrequencia();
    fecharModais();

});


// VERIFICAR PLANOS EXPIRADOS
function verificarExpirados(){

    const hoje = new Date();

    const alunosAtivos = [];

    alunos.forEach(aluno=>{

        const limite = new Date(aluno.dataCadastro);

        limite.setMonth(limite.getMonth() + aluno.meses);

        if(hoje <= limite){

            alunosAtivos.push(aluno);

        }

    });

    alunos = alunosAtivos;

    pagamentos = pagamentos.filter(pagamento=>{

        return alunos.some(aluno=>

            aluno.nome === pagamento.aluno

        );

    });

    salvarDados();

}


// CADASTRO DE TREINOS
document.getElementById("formNovoTreino").addEventListener("submit", (e)=>{

    e.preventDefault();

    const exercicio = document.getElementById("novoExercicio").value;

    const dia = document.getElementById("novoDia").value;

    treinos.push({exercicio, dia, participantes:[]});

    salvarDados();
    renderTreinos();
    atualizarRelatorios();
    e.target.reset();
    fecharModais();

});


// LISTAR TREINOS
function renderTreinos(){

    document.getElementById("segunda").innerHTML = "";

    document.getElementById("terca").innerHTML = "";

    document.getElementById("quarta").innerHTML = "";

    document.getElementById("quinta").innerHTML = "";

    document.getElementById("sexta").innerHTML = "";

    treinos.forEach((treino,index)=>{

        let destino;

        switch(treino.dia){

            case "Segunda-feira" : destino = document.getElementById("segunda");
            break;

            case "Terça-feira" : destino = document.getElementById("terca");
            break;

            case "Quarta-feira" : destino = document.getElementById("quarta");
            break;

            case "Quinta-feira" : destino = document.getElementById("quinta");
            break;

            case "Sexta-feira" : destino = document.getElementById("sexta");
            break;

        }

        destino.innerHTML += `

        <div class="Treino-card">

            <h3>${treino.exercicio}</h3>

            <p>Participantes:${treino.participantes.length}</p>

            <div class="acoes-card">

                <button class="btn" onclick="abrirParticipantes(${index})">Participantes</button>

                <button class="btn-editar" onclick="editarTreino(${index})">Editar</button>

                <button class="btn-excluir" onclick="excluirTreino(${index})">Excluir</button>

            </div>

        </div>

        `;

    });

}


// EDITAR TREINO
function editarTreino(index){

    const novoNome = prompt("Novo nome:", treinos[index].exercicio);

    if(!novoNome) return;

    treinos[index].exercicio = novoNome;

    salvarDados();
    renderTreinos();

}


// EXCLUIR TREINO
function excluirTreino(index){

    const confirmar = confirm("Excluir treino?");

    if(!confirmar) return;

    treinos.splice(index, 1);

    salvarDados();
    renderTreinos();
    atualizarRelatorios();

}


// PARTICIPANTES
function abrirParticipantes(index){

    treinoSelecionado = index;

    renderParticipantes();

    overlay.style.display = "block";

    modalParticipantes.style.display = "block";

    document.body.classList.add("modal-aberto");

}

function renderParticipantes(){

    const lista = document.getElementById("listaParticipantes");

    const select = document.getElementById("alunoParticipante");

    lista.innerHTML = "";
    select.innerHTML = "";

    const treino = treinos[treinoSelecionado];

    treino.participantes.forEach((idAluno,posicao)=>{

        const aluno = alunos.find(a => a.id === idAluno);

        if(!aluno) return;

        lista.innerHTML += `

        <div class="participante-item">

            <span>${aluno.nome}</span>

            <button class="btn-excluir" onclick="removerParticipante(${posicao})">Remover</button>

        </div>

        `;

    });

    alunos.forEach(aluno=>{

        if(!treino.participantes.includes(aluno.id)){

            select.innerHTML += `

            <option value="${aluno.id}">${aluno.nome}</option>

            `;

        }

    });

}

document.getElementById("btnAdicionarParticipante").addEventListener("click",()=>{

    const idAluno = Number(document.getElementById("alunoParticipante").value);

    treinos[treinoSelecionado].participantes.push(idAluno);

    salvarDados();
    renderParticipantes();
    renderTreinos();

});

function removerParticipante(posicao){

    treinos[treinoSelecionado].participantes.splice(posicao, 1);

    salvarDados();
    renderParticipantes();
    renderTreinos();

}


// PAGAMENTOS
function marcarPago(index){

    pagamentoSelecionado = index;

    overlay.style.display = "block";

    modalPagamento.style.display = "block";

    document.body.classList.add("modal-aberto");

}

document.getElementById("formPagamento").addEventListener("submit",(e)=>{

    e.preventDefault();

    const forma = document.getElementById("formaPagamentoSelect").value;

    pagamentos[pagamentoSelecionado].pago = true;

    pagamentos[pagamentoSelecionado].formaPagamento = forma;

    historico.push({aluno : pagamentos[pagamentoSelecionado].aluno, 
        valor : pagamentos[pagamentoSelecionado].valor, forma, data : new Date().toLocaleDateString()});

    salvarDados();
    renderPagamentos();
    document.getElementById("formPagamento").reset();
    fecharModais();

});

function renderPagamentos(){

    tabelaPagamentos.innerHTML = "";

    pagamentos.forEach((pagamento,index)=>{

        const hoje = new Date();

        const vencimento = new Date(pagamento.vencimento);

        const atrasado = hoje > vencimento && !pagamento.pago;

        tabelaPagamentos.innerHTML += `

        <tr>

            <td>${pagamento.aluno}</td>

            <td>R$ ${pagamento.valor}</td>

            <td>${vencimento.toLocaleDateString()}</td>

            <td>${pagamento.formaPagamento}</td>

            <td class="${atrasado ? "atrasado" : pagamento.pago ? "pago" : "pendente"}">
            ${atrasado ? "Atrasado" : pagamento.pago ? "Pago" : "Pendente"}</td>

            <td>${pagamento.pago ? "✔" : `<button class="btn-pago" onclick=" marcarPago(${index})">
            Confirmar</button>`}</td>

        </tr>

        `;

    });

    atualizarFinanceiro();

}


// FINANCEIRO
function atualizarFinanceiro(){

    let recebido = 0;

    let pendentes = 0;

    pagamentos.forEach(pagamento=>{

        if(pagamento.pago){
            recebido += Number(pagamento.valor);
        }else{
            pendentes++;
        }

    });

    document.getElementById("valorRecebido").textContent = `R$ ${recebido.toFixed(2)}`;

    document.getElementById("faltamPagar").textContent = pendentes;

}


// FREQUÊNCIA
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

            <td>${aluno.nome}</td>

            <td><input type="checkbox" ${aluno.presente ? "checked" : ""} onchange="alterarPresenca(${index})"></td>

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

    localStorage.setItem("historico", JSON.stringify(historico));

}

// INICIALIZAÇÃO
verificarExpirados();
renderAlunos();
renderTreinos();
renderPagamentos();
renderFrequencia();
atualizarRelatorios();