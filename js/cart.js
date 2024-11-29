// Al cargar el documento, se obtiene el carrito de localStorage y se muestran los productos
document.addEventListener('DOMContentLoaded', () => {
    let productoEnCarrito = JSON.parse(localStorage.getItem("productoEnCarrito")) || [];
    showCartProducts(productoEnCarrito);

    // Asignar funciones a los botones de vaciar, finalizar compra y aplicar descuento
    document.getElementById('boton-vaciar-carrito').addEventListener('click', vaciarCarrito);
    document.getElementById('boton-finalizar-compra').addEventListener('click', finalizarCompra);
    document.getElementById('applyDiscount').addEventListener('click', aplicarDescuento);

    // Validar campos de dirección en tiempo real
    ['departamento', 'localidad', 'calle', 'numero', 'esquina'].forEach(id => {
        let field = document.getElementById(id);
        field.addEventListener('input', () => {
            validateField(field, value => value !== '', 'Este campo es obligatorio.');
        });
    });
});

// Variable para rastrear si se aplicó un descuento
let descuentoAplicado = false;

//calcular costo de envio y segun el tipo
function calcularCostoEnvio(tipoEnvio, subtotalCarrito) {
    let tasas = {
        'premium': 0.15,
        'express': 0.07,
        'standard': 0.05
    };
    // Obtener la tasa según el tipo de envío
    let tasaEnvio = tasas[tipoEnvio] || 0; 

    // Calcular y devolver el costo de envío
    return subtotalCarrito * tasaEnvio;
}

// Función para animar el badge del carrito
function animateCartBadge() {
    let badge = document.getElementById("cart-badge");
    if (!badge) return;

    badge.classList.add("animate__animated", "animate__heartBeat");
    badge.addEventListener("animationend", () => {
        badge.classList.remove("animate__animated", "animate__heartBeat");
    });
}

// Función para resaltar el subtotal al actualizarlo
function highlightSubtotal() {
    let subtotalElement = document.getElementById('subtotalCarrito');
    if (!subtotalElement) return;

    subtotalElement.classList.add("animate__animated", "animate__heartBeat");
    subtotalElement.addEventListener("animationend", () => {
        subtotalElement.classList.remove("animate__animated", "animate__heartBeat");
    });
}

// Muestra los productos en el carrito y actualiza subtotales y totales
function showCartProducts(productoEnCarrito) {
    let CartProductsContainer = document.getElementById('selectProductId');
    let cartSubtotal = document.getElementById('subtotalCarrito');
    let cartEnvio = document.getElementById('envioCarrito');
    let cartTotal = document.getElementById('totalCarrito');
    let cartDiscount = document.getElementById('cartDiscount');
    
    let subtotalGeneral = 0;
    let prevTotalItems = parseInt(document.getElementById("cart-badge").textContent.split(" - ")[0]) || 0;
    CartProductsContainer.innerHTML = ''; // Limpia el contenedor

    // Si el carrito está vacío, muestra un mensaje
    if (productoEnCarrito.length === 0) {
        CartProductsContainer.innerHTML = '<tr><td colspan="7">El carrito está vacío.</td></tr>';
        cartSubtotal.innerText = '0';
        cartEnvio.innerText = '0';
        cartTotal.innerText = '0';
        actualizarBadgeCarrito(0);
        return;
    }

    // Convierte de USD a UYU si es necesario y lo suma al total general
    productoEnCarrito.forEach((product, index) => {
        let productCost = product.currency === 'USD' ? product.cost * 40 : product.cost; 
        let subtotal = productCost * product.cantidad; 
        subtotalGeneral += subtotal; 

        // Crea una fila para el producto
        let row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: auto;"></td>
            <td>${product.name}</td>
            <td>${product.currency === 'USD' ? 'UYU' : product.currency}</td>
            <td>${productCost}</td>
            <td>
                <input type="number" value="${product.cantidad}" style="width: 50px; text-align: center;" 
                    onchange="updateQuantityDirect(${index}, this.value)" />
            </td>
            <td id="subtotal-${index}">${subtotal}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button></td>
        `;
        CartProductsContainer.appendChild(row); // Agrega la fila al contenedor

    });

    // Actualiza subtotal general
    cartSubtotal.innerText = subtotalGeneral;
    highlightSubtotal(); // Resalta el subtotal

    // Actualiza el costo de envío en base a la selección
    let tipoEnvio = document.getElementById('tipoEnvioSelect').value;
    let costoEnvio = calcularCostoEnvio(tipoEnvio, subtotalGeneral);
    cartEnvio.innerText = costoEnvio.toFixed(1);

    // Calcula el total con el costo de envío
    let total = subtotalGeneral + costoEnvio;

    // Aplica descuento si corresponde
    if (descuentoAplicado) {
        let descuentoSumado = total * 0.25; // 25% de descuento
        cartDiscount.innerText = `- ${descuentoSumado.toFixed(1)}`;
        total -= descuentoSumado; 
    } else {
        cartDiscount.innerText = '0';
    }

    cartTotal.innerText = total.toFixed(1); // Muestra el total
    actualizarBadgeCarrito(productoEnCarrito.length); // Actualiza el badge del carrito
    if (productoEnCarrito.length !== prevTotalItems) {
    animateCartBadge(); // Agrega la animación
}
}

// Actualiza localStorage y refresca la vista del carrito
function updateCartLocalStorage(productoEnCarrito) {
    localStorage.setItem("productoEnCarrito", JSON.stringify(productoEnCarrito));
    showCartProducts(productoEnCarrito);
}

// Aplica el descuento basado en el código ingresado
function aplicarDescuento() {
    let descuentoCode = document.getElementById('discountCode').value;
    
    if (descuentoCode === "FERNANDITOS" && !descuentoAplicado) {
        descuentoAplicado = true; // descuento como aplicado
        Swal.fire('¡Descuento aplicado!', 'Se ha aplicado un 25% de descuento.', 'success');
        showCartProducts(JSON.parse(localStorage.getItem("productoEnCarrito"))); 
    } else if (descuentoAplicado) {
        Swal.fire('Descuento ya aplicado', 'No puedes aplicar el mismo descuento dos veces.', 'info'); 
    } else {
        Swal.fire('Código inválido', 'Por favor, ingresa un código válido.', 'error');
    }
}

// Vaciar carrito
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás deshacer esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5a9589',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem("productoEnCarrito"); 
            showCartProducts([]);
            Swal.fire('Carrito vacío', 'El carrito ha sido vaciado con éxito.', 'success');
        }
    });
}

// Finaliza la compra 
function finalizarCompra() {
    let cartTotal = document.getElementById('totalCarrito').textContent; 
    //let paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=tuemail@tuempresa.com&currency_code=USD&amount=${cartTotal}&item_name=Compra%20en%20tu%20sitio`;
    //window.location.href = paypalUrl; // Redirige a PayPal
}

// Actualiza la cantidad de un producto en el carrito
function updateQuantity(index, change) {
    let productoEnCarrito = JSON.parse(localStorage.getItem("productoEnCarrito")) || [];

    // la cantidad no baje de 1 y muestra el carrito actualizado
    if (productoEnCarrito[index].cantidad + change >= 1) {
        productoEnCarrito[index].cantidad += change; 
        localStorage.setItem("productoEnCarrito", JSON.stringify(productoEnCarrito)); 
        showCartProducts(productoEnCarrito); 
    }
}
// Actualiza la cantidad directamente desde el input
function updateQuantityDirect(index, value) {
    let productoEnCarrito = JSON.parse(localStorage.getItem("productoEnCarrito")) || [];
    productoEnCarrito[index].cantidad = parseInt(value) || 1; 
    localStorage.setItem("productoEnCarrito", JSON.stringify(productoEnCarrito)); 
    showCartProducts(productoEnCarrito); 
}

// Elimina un producto del carrito
// Elimina un producto del carrito con confirmación
function removeFromCart(index) {
    Swal.fire({
        title: '¿Eliminar producto?',
        text: "No podrás deshacer esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5a9589',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let productoEnCarrito = JSON.parse(localStorage.getItem("productoEnCarrito")) || [];
            productoEnCarrito.splice(index, 1); // Eliminar producto del array
            localStorage.setItem("productoEnCarrito", JSON.stringify(productoEnCarrito)); // Actualizar localStorage
            showCartProducts(productoEnCarrito); // Actualizar vista
            animateCartBadge(); // Animar el badge
            Swal.fire('Eliminado', 'El producto fue eliminado del carrito.', 'success');
        }
    });
}

// Actualiza el badge del carrito con el total de productos y el total general $
function actualizarBadgeCarrito(totalItems) {
    document.getElementById("cart-badge").textContent = `${totalItems} - $${document.getElementById('totalCarrito').innerText}`;
}


// Función para actualizar el costo de envío basado en la selección del tipo de envío
document.getElementById('tipoEnvioSelect').addEventListener('change', function () {
    let tipoEnvio = this.value;
    let subtotalCarrito = parseFloat(document.getElementById('subtotalCarrito').innerText);
    let costoEnvio = calcularCostoEnvio(tipoEnvio, subtotalCarrito);
    document.getElementById('envioCarrito').innerText = costoEnvio.toFixed(1);

    // Actualizar el total
    let total = subtotalCarrito + costoEnvio;
    document.getElementById('totalCarrito').innerText = total.toFixed(1);
});


//Forma de pago con los campos para PayPal, tarjeta de credito y transferencia bancaria
document.getElementById('formaPago').addEventListener('change', function () {
let camposAdicionales = document.getElementById('camposAdicionales');
camposAdicionales.innerHTML = '';
    
    switch (this.value) {
    case 'tarjeta':
    camposAdicionales.innerHTML = `
            <label for="numeroTarjeta">Número de tarjeta:</label>
            <input type="text" id="numeroTarjeta" class="form-control" placeholder="Ingrese el número de tarjeta">
            <label for="fechaVencimiento">Fecha de vencimiento:</label>
            <input type="month" id="fechaVencimiento" class="form-control">
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" class="form-control" placeholder="Ingrese el CVV">
        `;
    camposAdicionales.style.display = 'block';
        break;
        case 'transferencia':
    camposAdicionales.innerHTML = `
            <label for="cuentaBancaria">Número de cuenta bancaria:</label>
            <input type="text" id="cuentaBancaria" class="form-control" placeholder="Ingrese el número de cuenta">
        `;
    camposAdicionales.style.display = 'block';
        break;
        case 'paypal':
            camposAdicionales.innerHTML = `
                <label for="correoPaypal">Correo de PayPal:</label>
                <input type="email" id="correoPaypal" class="form-control" placeholder="Ingrese su correo de PayPal">
                <div style="margin-top: 10px;">
                <a href="https://www.paypal.com/signin" target="_blank" class="btn btn-primary">Ir a PayPal</a>
                </div>
            `;
        break;
        default:
    camposAdicionales.style.display = 'none';
    }
    });

// Boton finalizar compra 
let botonFinalizarCompra = document.getElementById("boton-finalizar-compra");
botonFinalizarCompra.addEventListener('click', () => {  

// direccion 
let departamento = document.getElementById('departamento').value.trim();
let localidad = document.getElementById('localidad').value.trim();
let calle = document.getElementById('calle').value.trim();
let numero = document.getElementById('numero').value.trim();
let esquina = document.getElementById('esquina').value.trim();

//forma de envio 
let formaDeEnvio = document.getElementById("tipoEnvioSelect").value;

//forma de pago 
let formaDePago = document.getElementById("formaPago").value;

let existenProductos = JSON.parse(localStorage.getItem("productoEnCarrito")) || [];

if (existenProductos.length === 0) {
    Swal.fire('Carrito vacío', 'No puedes finalizar la compra sin productos en el carrito.', 'warning');
    return;
}

if (!departamento || !localidad || !calle || !numero || !esquina) {
    Swal.fire('Dirección incompleta', 'Por favor, rellene los campos vacíos.', 'warning');
        return;
}

if (!formaDeEnvio) {
    Swal.fire('Tipo de Envío no seleccionado', 'Por favor, selecciona un tipo de envío.', 'warning');
        return;
}

if (!formaDePago) {
    Swal.fire('Forma de pago no seleccionada', 'Por favor, selecciona una forma de pago.', 'warning');
        return;
}


if (formaDePago === 'tarjeta') {
    let numeroTarjeta = document.getElementById('numeroTarjeta')?.value;
    let fechaVencimiento = document.getElementById('fechaVencimiento')?.value;
    let cvv = document.getElementById('cvv')?.value;

    if (!numeroTarjeta || !fechaVencimiento || !cvv) {
        Swal.fire('Datos de tarjeta incompletos', 'Por favor, rellena todos los campos de tu tarjeta.', 'warning');
        return;
    }
} else if (formaDePago === 'transferencia') {
    let cuentaBancaria = document.getElementById('cuentaBancaria')?.value;

    if (!cuentaBancaria) {
        Swal.fire('Datos de transferencia incompletos', 'Por favor, ingresa el número de cuenta bancaria.', 'warning');
            return;
    }
} else if (formaDePago === 'paypal') {
    let correoPaypal = document.getElementById('correoPaypal')?.value;

    if (!correoPaypal) {
        Swal.fire('Correo PayPal no ingresado', 'Por favor, ingresa tu correo de PayPal.', 'warning');
            return;
    }
}

Swal.fire('Compra realizada', 'Gracias por tu compra, te esperamos de vuelta!', 'success').then(() => {
    // Cuando la compra se realiza, se eliminan los productos del carrito
    localStorage.removeItem("productoEnCarrito");
    // Esperar 1 segundo y redirigir al index
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
    });
});

// Validar campos en tiempo real
function validateField(field, validator) {
    let value = field.value.trim();
    if (!validator(value)) {
        field.classList.add('is-invalid');
    } else {
        field.classList.remove('is-invalid');
    }
}

// Ejemplo: Validación en tiempo real para campos de dirección
document.querySelectorAll('.form-control').forEach(field => {
    field.addEventListener('input', () => {
        validateField(field, value => value !== ''); // Validar que el campo no esté vacío
    });
});
