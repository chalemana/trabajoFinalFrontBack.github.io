// Comprueba si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', ()=> {
let usuario=localStorage.getItem("user")

// Si no hay un usuario en localStorage, redirige a la página de login
if (usuario===null) {
location.href="login.html";
}
// Si hay un usuario, muestra su nombre en el elemento 'usuariologin'
else{
    document.getElementById('usuariologin').innerText=usuario;
}  
});
