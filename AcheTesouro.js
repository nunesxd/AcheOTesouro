// Identifica a div do mapa do tesouro e o parágrafo que irá conter as mensagens do jogo;
let containerMapa = document.getElementById("container-mapa");
let areaMensagem = document.getElementById("area-mensagem");

// Insere as imagens das palmeiras e duas no mapa do tesouro;
insereImgs(containerMapa);
// Posiciona aleatóriamente as imagens das dunas e palmeiras;
posicionaImgs(containerMapa);
// Gera as coordenadas do tesouro aleatóriamente;
let posicaoX = posicionaX(containerMapa);

// Insere o listener que monitora as coordenadas do mouse na div e que para de monitorar caso saia dela;
// OBS: O "meuListener" apenas chama o listener de monitoramento, o que possibilita passarmos demais argumentos ao listener e permite sua remoção do elemento posteriormente;
containerMapa.addEventListener("mousemove", meuListener);
containerMapa.addEventListener("mouseout", pararDeSeguirMouse);

// -------------------------------------------- FUNÇÕES --------------------------------------------------------

function insereImgs(containerMapa) {
    // Geramos um número aleatório de imagens que deverão aparecer em nosso mapa do tesouro;
    let qtdDunas = Math.floor((Math.random() * 7) + 1);
    let qtdPalmeiras = Math.floor((Math.random() * 7) + 1);
    
    // Criamos uma lista simples contendo as informações dessas imagens, para facilitar na iteração de inserção destas no mapa;
    let listImgs = [
        { tipo: 'palmeiras', qtd: qtdPalmeiras},
        { tipo: 'dunas', qtd: qtdDunas}
    ];

    // Para cada imagem da lista acima, criar o respectivo elemento e o inserimos na div do mapa;
    listImgs.forEach(imgSelecionada => {

        for(let i = 0; i < imgSelecionada.qtd; i++) {
            let tipoImg = imgSelecionada.tipo;
            let tagImg = criaImg(tipoImg);
            containerMapa.appendChild(tagImg);
        } 

    });
}

// Função usada para criação dos elementos de imagem, para depois serem inseridas na div do mapa do tesouro;
function criaImg(tipoImg) {
    // Criamos o elemento de imagem com as respectivas informações geradas acima, junto com as classes devidas;
    let img = document.createElement("img");

    // Dependendo do tipo de imagem, alteramos o source e o seu texto alternativo;
    switch (tipoImg) {
        case "palmeiras":
            img.setAttribute("src", "./imagens/palmeira-pequena.png");
            img.setAttribute("alt", "Uma palmeira bonita !");
            break;

        case "dunas":
            img.setAttribute("src", "./imagens/dunas-pequenas.png");
            img.setAttribute("alt", "Três dunas juntas");            
            break;
    }

    img.classList.add("imagens-mapa");
    img.classList.add(`${tipoImg}`);

    return img;
}

// Função para posicionar aleatóriamente as imagens geradas na div do mapa do tesouro;
function posicionaImgs(containerMapa) {
    // Identificamos a altura e largura da div do mapa do tesouro na tela (foi necessário definirmos um "min-height" para a div, para mais detalhes, vide arquivo "style.css");
    // Considerando a div do mapa como um quadrado, a propriedade 'offset' possibilita determinarmos o início da div acima (offsetTop) e o seu final abaixo (offsetHeight);
    let minAlturaBrowser = containerMapa.offsetTop;
    let maxAlturaBrowser = containerMapa.offsetHeight;
    // É importante identificarmos a largura máxima da div, para calcularmos a posição máxima das imagens á direita, de forma que estas não extrapolem o tamanho da tela (e apareça a barra de rolagem);
    let maxLarguraBrowser = containerMapa.offsetWidth;

    //console.log(`Dimensões da div nas demais imagens - Altura minima: ${minAlturaBrowser}, Altura maxima: ${maxAlturaBrowser}, Largura maxima: ${maxLarguraBrowser}`);

    let novaAlturaImg = 0;
    let novaLarguraImg = 0;

    let imgs = document.querySelectorAll(".imagens-mapa");

    // Para cada imagem das que foram inseridas na div do mapa do tesouro:
    imgs.forEach(img => {
        // Primeiro esperamos a inserção da imagem na tela;
        img.onload = function() {
            // Em seguida, para esta imagem, calculamos uma nova posição verticalmente. Este número deve estar dentro da div;
            novaAlturaImg = Math.floor(Math.random() * (maxAlturaBrowser - minAlturaBrowser)) + minAlturaBrowser;
            // Ademais, calculamos a nova posição horizontal, considerando também o tamanho da imagem, de forma que esta não extrapole o tamanho da tela;
            novaLarguraImg = Math.floor(Math.random() * maxLarguraBrowser - this.naturalWidth);
            // Não queremos que a nova posição horizontal seja negativa, que a imagem seja posicionada a esquerda da tela e não apareça adequadamente;
            if(novaLarguraImg < 0) novaLarguraImg = 0;
            
            //console.log(`Nova altura: ${novaAlturaImg}, Nova largura: ${novaLarguraImg}`); // Debug dos resultados gerados das novas posições;
            // Finalmente, definimos a nova posição da respectiva imagem (horizontal e verticalmente), conforme os calculos realizados acima;
            img.style.top = `${novaAlturaImg}px`;
            img.style.left = `${novaLarguraImg}px`;
        }
    });
}

// Gera as coordenadas aleatórias do tesouro, conforme as dimensões da div do mapa;
function posicionaX(containerMapa) {
    let minAlturaBrowser = containerMapa.offsetTop;
    let maxAlturaBrowser = containerMapa.offsetHeight;
    let maxLarguraBrowser = containerMapa.offsetWidth;

    let novaAlturaX = Math.floor(Math.random() * (maxAlturaBrowser - minAlturaBrowser)) + minAlturaBrowser;
    let novaLarguraX = Math.floor(Math.random() * maxLarguraBrowser - 55);
    if(novaLarguraX < 0) novaLarguraX = 0;

    //console.log(`Dimensões da div nas demais imagens - Altura minima: ${minAlturaBrowser}, Altura maxima: ${maxAlturaBrowser}, Largura maxima: ${maxLarguraBrowser}`); // Debug das dimensões identificadas da div;
    //console.log(`Para X - Altura gerada: ${novaAlturaX}, Largura gerada: ${novaLarguraX}`); // Debug para identificar a posição do tesouro no console;

    return [novaAlturaX,novaLarguraX];
}

// Declaração de uma função para chamar o que realmente seria a função do listener, utilizando esta estratégia, foi possível utilizar o "remove event listener" e encerrar o jogo caso o tesouro seja encontrado;
function meuListener(event) {
    monitoraPosicaoMouse(event, areaMensagem, posicaoX, containerMapa);
}

// Função que obtém a posição do mouse quando este está em cima da div referente ao mapa do tesouro;
function monitoraPosicaoMouse(e, areaMensagem, posicaoX, containerMapa) {
    
    // Obtemos a posição do mouse a partir do evento de mouseover na div;
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    // Realiza o calulo da diferença entre as coordenadas do mouse x a posição do tesouro, permitindo identificarmos sua proximidadade;
    let difY = mouseY - posicaoX[0];
    let difX = mouseX - posicaoX[1];
    // Abaixo determinamos as regras que serão utilizadas para identificar a proximidade do mouse, para o caso do tesouro ser encontrado e no caso do mouse estar próximo, dando esta dica ao usuário;
    let regraTesouro = (difX <= 70 && difX >= 0) && (difY <= 70 && difY >= 0);
    let regraQuente = (difX <= 250 && difX >= -250) && (difY <= 250 && difY >= -250);

    let dicaCoordenada = "";
    
    if(regraQuente && !regraTesouro) dicaCoordenada = `Está quente !`;
    // Caso o tesouro seja encontrado, insere a imagem do "X" na div e a posiciona conforme as coordenadas geradas aleatoriamente, após isso, remove os listeners da div do mapa do tesouro, pois o jogo foi concluído;
    else if(regraTesouro) {

        dicaCoordenada = `Tesouro encontrado !!! Parabéns !!!!`;
        let imgX = document.createElement("img");
        imgX.setAttribute("src", "./imagens/X-pequeno.png");
        imgX.setAttribute("alt", "Tesouro encontrado !!! Parabéns !!!!");
        imgX.style.position = "absolute";
        imgX.style.top = `${posicaoX[0]}px`;
        imgX.style.left = `${posicaoX[1]}px`;
        imgX.classList.add("X");

        containerMapa.appendChild(imgX);

        containerMapa.removeEventListener("mouseout", pararDeSeguirMouse);
        containerMapa.removeEventListener("mousemove", meuListener); 
        
    }
    else dicaCoordenada = `Está frio !`;

    //dicaCoordenada += ` || Posicao do Tesouro: ${posicaoX[0]}, ${posicaoX[1]}, DifX: ${difX}, DifY: ${difY}`; // Para debug das coordenadas e da dica;
 
    let mensagemCoordenadas = `Seu mouse está em: ${mouseX} e ${mouseY}, Dica ! ${dicaCoordenada}`;
    areaMensagem.innerHTML = mensagemCoordenadas;
    // console.log(`Evento ${e}, Mensagem da Coordenada: ${mensagemCoordenadas}, Div Area de Mensagem: ${areaMensagem}`); // Debug

}

// Função executada quando o mouse sai da div do mapa do tesouro. O código para de calcular a posição do mouse na tela, mas pode voltar se o mouse voltar a região da div;
function pararDeSeguirMouse() {
    areaMensagem.innerHTML = "O mouse está fora do mapa !!! Arrrrrghhh !!!!!!";
}