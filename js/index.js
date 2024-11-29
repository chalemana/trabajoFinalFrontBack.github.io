// Configura los botones de categorías al cargar la página
document.addEventListener("DOMContentLoaded", function() {

    let popup = document.getElementById("popup-aviso");
    let closePopupBtn = document.getElementById("popup-close-btn"); // Usamos la cruz como botón de cierre
    let form = document.getElementById("popup-form");
    let emailInput = document.getElementById("email-input");

    // Muestra el popup automáticamente después de 1 segundo
    setTimeout(() => {
        popup.classList.add("show");
    }, 1000);

    // Cierra el popup cuando el usuario haga clic en la cruz
    closePopupBtn.addEventListener("click", function (event) {
        event.preventDefault(); 
        popup.classList.remove("show");  // Cierra el popup
    });

    // Validar el email
    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        
        let email = emailInput.value;
        if (email) {
            Swal.fire({
                title: '¡Felicidades!',
                text: 'Copia tu código de descuento: FERNANDITOS',
                icon: 'success',
                confirmButtonText: '¡Genial!'
            });
            popup.classList.remove("show"); 
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingresa un correo válido.',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    });

    // Guarda el ID de categoría de autos y redirige a la página de productos
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });

    // Guarda el ID de categoría de juguetes y redirige a la página de productos
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });

    // Guarda el ID de categoría de muebles y redirige a la página de productos
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});
