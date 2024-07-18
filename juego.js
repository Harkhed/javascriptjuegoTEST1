const body = document.querySelector("body");
const empezar = document.getElementById("empezar");
const selector = document.getElementById("selector");
const titulo = document.getElementById("titulo");
const fondo = document.getElementById("container");
const score = document.getElementById("score");
const volver = document.getElementById("volver");

var obstaculo;
var dejar = true;
/*objetos*/
const personaje = document.getElementById("personaje");
const suelo = document.getElementById("suelo");

/*empezar*/
empezar.addEventListener("click",function(){

    

    /*deshabilita los botones*/
    empezar.style.display = "none";
    selector.style.display = "none";
    titulo.style.display = "none";

    /*arreglando el boton de volver*/
    volver.style.display = "flex";
    volver.style.position = "absolute";
    volver.style.left = "30px";
    volver.style.top = "-30px";
    volver.style.width = "100px";
    volver.style.fontSize = "10px"; 

    volver.style.backgroundColor = "red";

    /*Añadir color al fondo*/
    fondo.style.background = "linear-gradient(to bottom, #87CEEB, #FFFFFF)";

    score.style.display = "flex";

    /*Habilitar las cosas*/


    personaje.style.display = "flex";
    suelo.style.display = "flex";
    suelo.style.position = "absolute";

    /*Logica del juego*/

    var time = new Date();
    var deltatime = 0;

    if(document.readyState === "complete" || document.readyState === "interactive"){
        setTimeout(Init,1);
    }
    else{
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

    var parado = true;
    var saltando = false;


    var tiempohastaobstaculo = 2;
    var tiempoobstaculomin = 0.5;
    var tiempoobstaculomax = 1.5;
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

        moverSuel();
        moverpersonaje();

        if(dejar === true){
            decidircrearobs();
            moverobstaculo();
        }
        else{
            obstaculo.style.display = "none";
            obstaculos.forEach(function(obstaculo) {
                obstaculo.parentNode.removeChild(obstaculo);
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

            }
            else{
                obstaculos[x].posX -= Calculodelta();
                obstaculos[x].style.left = obstaculos[x].posX + "px";
            }
        }
    }

    function Ganarscore(){
        puntos++
        score.textContent = puntos;
    }








})




/*personaje*/
selector.addEventListener("click",function(){
    /*deshabilita los botones*/
    empezar.style.display = "none";
    selector.style.display = "none";
    titulo.textContent = "Selecciona tu personaje";

    


})



/*Para regresar al menu*/
volver.addEventListener("click",function(){
    
    
    reiniciarJuego(); // Llamar a la función de reinicio al volver al menú
    

    

})


function reiniciarJuego() {
    // Reiniciar variables del juego
    time = new Date();
    deltatime = 0;
    dejar = false;

    sueloX = 0;
    velY = 0;
    impulso = 1000;
    gravedad = 2500;

    personajeY = 80;
    personajex = 0;

    escenariovel = 1200 / 3;
    gamevel = 1;
    puntos = 0;

    tiempohastaobstaculo = 2;
    tiempoobstaculomin = 0.5;
    tiempoobstaculomax = 1.5;
    obstaculos = [];

    // Reiniciar estilos y elementos visuales
    empezar.style.display = "flex";
    selector.style.display = "flex";
    titulo.style.display = "flex";
    volver.style.display = "none";
    fondo.style.backgroundColor = "aliceblue";
    score.style.display = "none";
    personaje.style.display = "none";
    suelo.style.display = "none";

    obstaculos.style.display = "none";

    // Limpiar obstáculos existentes si los hay
    obstaculos.forEach(function(obstaculo) {
        obstaculo.parentNode.removeChild(obstaculo);
    });
    obstaculos = [];
    puntos = 0;
    score.textContent = puntos;

    obstaculo.style.display = "none";
}