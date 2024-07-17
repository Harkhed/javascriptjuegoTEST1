const body = document.querySelector("body");
const empezar = document.getElementById("empezar");
const selector = document.getElementById("selector");
const titulo = document.getElementById("titulo");
const fondo = document.getElementById("container");



/*empezar*/
empezar.addEventListener("click",function(){
    /*deshabilita los botones*/
    empezar.style.display = "none";
    selector.style.display = "none";
    titulo.style.display = "none";

    /*Añadir color al fondo*/
    fondo.style.background = "linear-gradient(to bottom, #87CEEB, #FFFFFF)";

})




/*personaje*/
selector.addEventListener("click",function(){
    empezar.style.display = "none";
    selector.style.display = "none";

    


})


