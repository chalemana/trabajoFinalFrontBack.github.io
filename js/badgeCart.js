document.addEventListener('DOMContentLoaded', () => {
    actualizarBadgeCarrito();
});

// Función para animar el badge del carrito
function animateCartBadge() {
    var cartBadge = document.getElementById("cart-badge");
    if (!cartBadge) return;

    cartBadge.classList.add("animate__animated", "animate__heartBeat");
    cartBadge.addEventListener("animationend", () => {
        cartBadge.classList.remove("animate__animated", "animate__heartBeat");
    });
}

// Función para actualizar el badge del carrito en todas las páginas
function actualizarBadgeCarrito() {
    let productoEnCarrito = JSON.parse(localStorage.getItem("productoEnCarrito")) || [];
    
    // Calcula el total de productos y el monto total en UYU
    let totalItems = productoEnCarrito.reduce((sum, product) => sum + product.cantidad, 0);
    let totalMonto = productoEnCarrito.reduce((sum, product) => {
        let productCost = product.currency === 'USD' ? product.cost * 40 : product.cost; 
        return sum + (productCost * product.cantidad);
    }, 0);

    // Actualiza el contenido del badge
    let cartBadge = document.getElementById("cart-badge");
    if (cartBadge) {
        cartBadge.textContent = `${totalItems} - $${totalMonto}`;
        animateCartBadge(); // Animar el badge del carrito
    }
}
