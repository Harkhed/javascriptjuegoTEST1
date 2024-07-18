const body = document.querySelector("body");
const empezar = document.getElementById("empezar");
const selector = document.getElementById("selector");
const titulo = document.getElementById("titulo");
const fondo = document.getElementById("container");
const score = document.getElementById("score");
const volver = document.getElementById("volver");
const perdiste = document.getElementById("gameover");

const flechaiz = document.getElementById("flechaizquierda");
const flechade = document.getElementById("flechaderecha"); 

flechade.style.display = "none";
flechaiz.style.display = "none";

var obstaculo;
var dejar = true;
/*objetos*/
const personaje = document.getElementById("personaje");
const suelo = document.getElementById("suelo");

/*empezar*/

function iniciar(){
    
    /*deshabilita los botones*/
    empezar.style.display = "none";
    selector.style.display = "none";
    titulo.style.display = "none";

    

    /*Añadir color al fondo*/
    fondo.style.background = "linear-gradient(to bottom, #87CEEB, #FFFFFF)";

    score.style.display = "flex";

    /*Habilitar las cosas*/

    personaje.style.display = "flex";
    
    
    suelo.style.display = "flex";
    suelo.style.position = "absolute";

    flechade.style.display = "none";
    flechaiz.style.display = "none";


    personaje.classList.add("correr");

    /*Logica del juego*/

    var time = new Date();
    var deltatime = 0;

    if(document.readyState === "complete" || document.readyState === "interactive"){
        setTimeout(Init,1);
    } else {
        document.addEventListener("DOMContentLoaded",Init);
    }

    function Init(){
        time = new Date();
        Loop();
    }

    function Loop(){
        deltatime = (new Date() - time)/1000;
        time = new Date();

        update();
        requestAnimationFrame(Loop);
    }

    var sueloY = -20;
    var velY = 0;
    var impulso = 1000;
    var gravedad = 2500;

    var personajeY = 80;
    var personajex = 0;

    var sueloX = 0;
    var escenariovel = 1200/3;
    var gamevel = 1;
    var puntos = 0;

    var parado = false;
    var saltando = false;

    var tiempohastaobstaculo = 2;
    var tiempoobstaculomin = 0.8;
    var tiempoobstaculomax = 2;
    var obstaculoY= 16;
    var obstaculos = [];

    dejar = true;

    /*tecla presionada*/
    document.addEventListener("keydown",teclapresionada);

    /*Salto*/
    function teclapresionada(tecla){
        if(tecla.keyCode == 32 ){
            saltar();
        }
    }

    function saltar(){
        if(saltando == false){
            saltando = true;
            velY = impulso;
            personaje.classList.remove("correr");
            personaje.classList.add("saltar");
        }
    }

    /*mueve el suelo de posicion en cada frame*/
    function update(){
        if(parado){
            dejar === false;
            obstaculo.style.display = "none";
            obstaculos.forEach(function(obstaculo) {
                if (obstaculo && obstaculo.parentNode) {
                    obstaculo.parentNode.removeChild(obstaculo);
                }
            });
            return;
        }
        else{
            
        }
        moverSuel();
        moverpersonaje();
        detectarcol();

        if (dejar === true) {
            decidircrearobs();
            moverobstaculo();
        } else {
            obstaculo.style.display = "none";
            obstaculos.forEach(function(obstaculo) {
                if (obstaculo && obstaculo.parentNode) {
                    obstaculo.parentNode.removeChild(obstaculo);
                }
            });
        }
        
        velY  -= gravedad * deltatime;
    }
    
    /*calcula la posicion del suelo para poder actualizarla */
    function moverSuel(){
        sueloX += Calculodelta();
        suelo.style.left = -(sueloX  % container.clientWidth) + "px";
    }

    /*el delta para que funcione en cualquier dispositivo independientemente de los fps que tenga*/
    function Calculodelta(){
        return escenariovel * deltatime * gamevel;
    }

    function moverpersonaje(){
        personajeY += velY * deltatime;
        if(personajeY < 80){
            tocarsuelo();
        }
        personaje.style.bottom = personajeY + "px";
    }

    function tocarsuelo(){
        personajeY = 80;
        velY = 0;
        if(saltando){
            personaje.classList.add("correr");
            personaje.classList.remove("saltar");
        }
        saltando = false;
    }

    function decidircrearobs(){
        tiempohastaobstaculo -= deltatime;
        if(tiempohastaobstaculo <= 0  && dejar === true){
            crearobstaculo();
        }
    }    

    function crearobstaculo(){
        if(dejar){
            obstaculo = document.createElement("div");
            container.appendChild(obstaculo);
            obstaculo.classList.add("sombra");

            obstaculo.posX = container.clientWidth;
            obstaculo.style.left = container.clientWidth;
    
            obstaculos.push(obstaculo);
            tiempohastaobstaculo = tiempoobstaculomin + Math.random() * (tiempoobstaculomax-tiempoobstaculomin) / gamevel;
        }
    }

    function moverobstaculo(){
        for(var x = obstaculos.length -1 ; x >= 0; x--){
            if(obstaculos[x].posX < -obstaculos[x].clientWidth){
                obstaculos[x].parentNode.removeChild(obstaculos[x]);
                obstaculos.splice(x,1);
                Ganarscore();
            } else {
                obstaculos[x].posX -= Calculodelta();
                obstaculos[x].style.left = obstaculos[x].posX + "px";
            }
        }
    }

    function Ganarscore(){
        puntos++
        score.textContent = puntos;
    }

    /*Detecta la colision*/
    function detectarcol(){
        for(var x = 0; x<obstaculos.length; x++){
            if(obstaculos[x].posX > personajex + personaje.clientWidth){
                break;
            } else {
                if(iscollision(personaje,obstaculos[x],10,30,15,20)){
                    muerto();
                }
            }
        }
    }

    function iscollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
        var aRect = a.getBoundingClientRect();
        var bRect = b.getBoundingClientRect();
    
        return !(
            ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
            (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
            ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
            (aRect.left + paddingLeft > (bRect.left + bRect.width))
        );
    }

    function muerto(){
        perdiste.style.display = "flex";
        gameover();
    }

    function gameover(){
        personaje.classList.remove("correr");
        parado = true;
    }

   

  
}

empezar.addEventListener("click",iniciar);

perdiste.addEventListener("click",reiniciarJuego);


/*personaje*/
selector.addEventListener("click",function(){
    /*deshabilita los botones*/
    empezar.style.display = "none";
    selector.style.display = "none";
    titulo.textContent = "Selecciona tu personaje";

    personaje.style.display = "flex";
    personaje.style.top = "250px";
    personaje.style.left = "430px";

    flechade.style.display = "flex";
    flechaiz.style.display = "flex";

    flechade.style.position = "absolute";
    flechade.style.top = "250px";
    flechade.style.left = "580px";

    flechaiz.style.position = "absolute";
    flechaiz.style.top = "250px";
    flechaiz.style.left = "270px";

    volver.style.display = "flex";
    volver.style.top = "300px";
    volver.style.left = "300px";

})



function reiniciarJuego() {
  
    empezar.style.display = "flex";
    selector.style.display = "flex";
    titulo.style.display = "flex";
    volver.style.display = "none";

    /* restaurar fondo */
    fondo.style.background = "linear-gradient(to bottom, #87CEEB, #FFFFFF)";

    /* ocultar elementos del juego */
    personaje.style.display = "none";
    suelo.style.display = "none";
    score.style.display = "none";
    perdiste.style.display = "none";

    /* reiniciar variables del juego */
    obstaculo = null;
    dejar = false;  // Detener la generación de obstáculos

    personaje.classList.remove("correr");
    personaje.classList.remove("saltar");

    /* reiniciar puntos */
    puntos = 0;
    score.textContent = puntos;

    /* reset del personaje */
    personaje.style.bottom = "80px";
    velY = 0;
    personajeY = 80;
    personajex = 0;

    /* reset del suelo */
    sueloX = 0;

    /* reiniciar obstáculos */
    obstaculos.forEach(function(obstaculo) {
        if (obstaculo && obstaculo.parentNode) {
            obstaculo.parentNode.removeChild(obstaculo);
        }
    });
    obstaculos = [];

    parado = false;
    saltando = false;
}


volver.addEventListener("click",function(e){
    empezar.style.display = "flex";
    selector.style.display = "flex";
    titulo.style.display = "flex";
    volver.style.display = "none";

    flechade.style.display = "none";
    flechaiz.style.display = "none";
    personaje.style.display = "none";
    personaje.style.position = "absolute";

    personaje.style.display = "none";
    personaje.style.top = "";
    personaje.style.left = "";
    personaje.style.bottom = "80px";
    
})

var skins = ["per1.png","per2.png","per3.png"];

// Definir índice inicial y obtener elementos del DOM
var indiceSkin = 0; // Índice inicial del skin


/*Evita que no aparezca una skin vacia*/
personaje.style.backgroundImage = `url(${skins[indiceSkin]})`;

// Agregar evento al botón de flecha izquierda
flechaiz.addEventListener("click", function() {
    // Cambiar el estilo de fondo del personaje con el siguiente skin
    personaje.style.backgroundImage = `url(${skins[indiceSkin]})`;
    
    // Incrementar el índice para el siguiente skin
    indiceSkin++;
    
    // Reiniciar el índice si supera la cantidad de skins disponibles
    if (indiceSkin >= skins.length) {
        indiceSkin = 0;
    }
});

flechade.addEventListener("click", function() {
    
    personaje.style.backgroundImage = `url(${skins[indiceSkin]})`;
    
    
    indiceSkin++;
    
    
    if (indiceSkin >= skins.length) {
        indiceSkin = 0;
    }
});