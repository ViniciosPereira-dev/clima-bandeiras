// Variaveis e seleções
const apiKey = "c2bdf948963313d958eac1422b601df9";
const apiUrl = "https://countryflagsapi.com/png/";

const cidadeInput = document.querySelector("#cidade_input");
const pesquisa = document.querySelector("#pesquisa");
const limparDados = document.getElementById("limparDados");
const iconeCarregamento = document.getElementById("carregamento");
const mensagemErro = document.getElementById('mensagemErro');

const cidadeElemento = document.querySelector("#cidade");
const temperaturaElemento = document.querySelector("#temperatura span");
const descricaoElemento = document.querySelector("#descricao");
const paisElemento = document.querySelector("#pais");
const tempoIconElemento = document.querySelector("#tempo-icon");
const umidadeElemento = document.querySelector("#umidade span");
const ventoElemento = document.querySelector("#vento span");
const tempoElemento = document.querySelector("#tempo");

//Funções

const pegarInformacoesApi = async(cidade) =>{

    const apiTempoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${apiKey}&lang=pt_br`;
    const respota = await fetch(apiTempoUrl);
    const dados = await respota.json();
    return dados;
}

const buscarClima = async(cidade) => {

    exibirIcone();

    try{
        const dados = await pegarInformacoesApi(cidade);

        if(dados.cod === "404"){
            exibirMensagemErro();
            esconderIcone();
            return;
        }    
        cidadeElemento.innerText = dados.name;
        temperaturaElemento.innerText = parseInt(dados.main.temp);
        descricaoElemento.innerText = dados.weather[0].description;
        mudarImgFundo(dados.weather[0].description);
        tempoIconElemento.setAttribute("src", `http://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`);
        paisElemento.setAttribute("src", `https://flagcdn.com/${dados.sys.country.toLowerCase()}.svg`);
        umidadeElemento.innerText = `${dados.main.humidity}%`;
        ventoElemento.innerText = `${dados.wind.speed} km/h`;
        tempoElemento.classList.remove("hide");   

    } catch(erro){
        exibirMensagemErro("Erro ao buscar dados do clima");
    } finally{
        esconderIcone();

    }  
}

//Mostrar/Esconder icone e Msg de erro;
const exibirIcone = () => {
    iconeCarregamento.classList.remove("hide");
};

const esconderIcone = () => {
    iconeCarregamento.classList.add("hide");
};


const exibirMensagemErro = (mensagem = "Erro desconhecido") => {
    mensagemErro.innerText = mensagem;
    mensagemErro.classList.remove("hide");

     setTimeout(() => {
        esconderMensagemErro();
    }, 4000);
}

const esconderMensagemErro = () => {
    mensagemErro.classList.add("hide");
};

const mudarImgFundo = (descricao) => {

    const descricaoMin = descricao.toLowerCase();

    document.body.classList.remove('bg_ceu_chuvoso','bg_ceu_limpo', 'bg-default', 'bg_ceu_nublado', 'bg_ceu_nuvens', 'bg_ceu_neve');

    // Céu limpo
    if(descricaoMin.includes("céu limpo") || descricaoMin.includes("ensolarado")){       
        document.body.classList.add('bg_ceu_limpo') 

    // Chuva e tempestades
    } else if(
        descricaoMin.includes("chuva") || 
        descricaoMin.includes("tempestade") || 
        descricaoMin.includes("chuvisco") || 
        descricaoMin.includes("granizo") || 
        descricaoMin.includes("chuva congelante")
    ){
        document.body.classList.add('bg_ceu_chuvoso')

    // Nuvens mais densas e nebulosidade
    } else if(
        descricaoMin.includes("nublado") || 
        descricaoMin.includes("nuvens quebradas")
    ){
        document.body.classList.add('bg_ceu_nublado')

    // Nuvens mais claras, dispersas
    } else if(
        descricaoMin.includes("poucas nuvens") || 
        descricaoMin.includes("nuvens dispersas")
    ){
        document.body.classList.add('bg_ceu_nuvens')

    // Neve e gelo
    } else if(
        descricaoMin.includes("neve") || 
        descricaoMin.includes("neblina") || 
        descricaoMin.includes("névoa") ||
        descricaoMin.includes("névoa forte")
    ){
        document.body.classList.add('bg_ceu_neve')

    // Caso padrão
    } else {
        document.body.classList.add("bg-default")
    }
        
}

//Eventos
pesquisa.addEventListener("click", (e) => {

    e.preventDefault();
    
    const cidade = cidadeInput.value;
    
    buscarClima(cidade)
});

cidadeInput.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){

        const cidade = cidadeInput.value;
        
        buscarClima(cidade)
    }
});

limparDados.addEventListener("click", (e) => {

    exibirIcone(); 

    setTimeout(() =>{   
    cidadeInput.value = '';
    tempoElemento.classList.add('hide');
    mensagemErro.classList.add('hide');
    document.body.className = '';
    esconderIcone();

    },1000)
});