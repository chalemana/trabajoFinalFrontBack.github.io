const CATEGORIES_URL = "http://localhost:3000/categories/";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell/";
const PRODUCTS_URL = "http://localhost:3000/cat_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/comments/";
const CART_INFO_URL = "http://localhost:3000/user_cart/";
const CART_BUY_URL = "http://localhost:3000/cart/";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}


//DARK MODE
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

//Activa el dark mode
function enableDarkMode() {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');

}
//Desactiva el dark mode
function disableDarkMode() {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', null);
}
//Crea la condicion que si el darkmode esta activo active la funcion enableDarkmode()
if(darkmode === "active") enableDarkMode()

  //Crea condicion de cuando debe de activarse y desactivarse los modos
themeSwitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode');
  
  if (darkmode !== "active") {
    enableDarkMode()
  }
  else {
    disableDarkMode()
  }
});

// Cerrar sesión
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logout') {
      e.preventDefault();
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  });
});

      // Obtener el botón ira para arriba
      var mybutton = document.getElementById("irArriba");

      // Cuando el usuario scrollea 20px desde el top de la página, mostrar el botón
      window.onscroll = function () {
        scrollFunction();
      };

      function scrollFunction() {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }

      // Cuando el usuario hace clic en el botón, scrollear al top de la página
      mybutton.onclick = function () {
        document.body.scrollTop = 0; // Para Safari
        document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
      };