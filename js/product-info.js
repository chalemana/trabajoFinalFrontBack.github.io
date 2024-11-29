document.addEventListener('DOMContentLoaded', () => {
    // Convierte la Fecha a formato D/M/A, hora:min:sec
    function convertirFecha(newFecha) {
        return newFecha.getDate() + "/" + (newFecha.getMonth() + 1) + "/" + newFecha.getFullYear() + ", " +
            newFecha.getHours() + ":" + newFecha.getMinutes() + ":" + newFecha.getSeconds();
    }

    // Cargar y mostrar información del producto seleccionado
    function cargarProducto(productId) {
        fetch(PRODUCT_INFO_URL + productId)
            .then(response => response.json())
            .then(data => {
                document.getElementById('productName').innerHTML = data.name;
                document.getElementById('productDescription').innerHTML = data.description;
                document.getElementById('productCategory').innerHTML = data.category;
                document.getElementById('productPrice').innerHTML = data.cost + " " + data.currency;
                document.getElementById('soldCount').innerHTML = data.soldCount;

                // Función para mostrar el carrusel de imágenes
                displayImages(data.images);

                // Mostrar productos relacionados
                showproduRelacionados(data.relatedProducts);

                // Mostrar comentarios desde la API
                mostrarComentariosDesdeApi(productId);
        

     // Botón de compra
    document.getElementById('buyButton').addEventListener('click', () => {
        Swal.fire({
        title: "¡Producto añadido al carrito!",
        text: "¿Quieres ver tu carrito o seguir comprando?",
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: "Ir al carrito",
        cancelButtonText: "Seguir comprando"
        
        }).then((result) => {
        // Obtener el carrito actual del localStorage o inicializarlo vacío
        let carrito = JSON.parse(localStorage.getItem("productoEnCarrito")) || [];
        let product = {
            id: productId,
            name: data.name,
            image: data.images[0],
            cost: data.cost,
            currency: data.currency,
            cantidad: 1
        };
        // Verificar si el producto ya existe en el carrito
        let productoExistente = carrito.find(item => item.id === productId);
        if (productoExistente) {
            productoExistente.cantidad += 1;  // Si ya existe, aumenta la cantidad
        } else {
            carrito.push(product);  // Si no existe, se agrega
        }

        // Guardar en localStorage
        localStorage.setItem("productoEnCarrito", JSON.stringify(carrito));
        console.log("Producto en carrito:", product);

        // Animar el badge del carrito
        animateCartBadge(); 

        // Redirigir al carrito si el usuario confirma
        if (result.isConfirmed) {
            window.location.href = "cart.html";
        }
        });
    });
})};

    // Producto seleccionado guardado en localStorage
    var productId = localStorage.getItem('selectProductId');
    cargarProducto(productId);

    // Mostrar productos relacionados
    function showproduRelacionados(produRelacionados) {
        const produRelacionadosContainer = document.getElementById('produRelacionados');
        produRelacionadosContainer.innerHTML = '';

        produRelacionados.forEach(product => {
            let card = document.createElement('div');
            card.classList.add('col-md-4');
            card.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <img class="card-img-top" src="${product.image}" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <button class="btn btn-outline-secondary btn-sm" onclick="selectRelatedProduct(${product.id})">Ver Producto</button>
                    </div>
                </div>
            `;
            produRelacionadosContainer.appendChild(card);
        });
    }


    // Selección de producto relacionado
    window.selectRelatedProduct = (id) => {
        localStorage.setItem('selectProductId', id);
        window.location.href = "product-info.html";
    }

    // Mostrar el carrusel de imágenes
    function displayImages(images) {
        let carousel = document.getElementById('carousel');
        carousel.innerHTML = '';

        images.forEach((imgSrc, index) => {
            let activeClass = index === 0 ? 'active' : '';
            carousel.innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <img src="${imgSrc}" class="d-block w-100" alt="Imagen del producto">
                </div>
            `;
        });
    }

    // Mostrar comentarios desde la API
    function mostrarComentariosDesdeApi(productId) {
        fetch(PRODUCT_INFO_COMMENTS_URL + productId)
            .then(response => response.json())
            .then(comentarios => {
                const comentariosGuardados = JSON.parse(localStorage.getItem(`comentarios_${productId}`)) || [];
                const todosLosComentarios = comentarios.map(comentario => ({
                    user: comentario.user,
                    description: comentario.description,
                    score: comentario.score,
                    dateTime: comentario.dateTime
                }));

                // Combina los comentarios de la API y los guardados en localStorage
                const comentariosFinales = [...todosLosComentarios, ...comentariosGuardados];
                mostrarComentarios(comentariosFinales);
            })
            .catch(error => console.error('Error al obtener los comentarios:', error));
    }

    // Mostrar comentarios en el HTML
    function mostrarComentarios(comentarios) {
        let listaComentario = document.getElementById('listaComentario');
        listaComentario.innerHTML = '';

        comentarios.forEach(comentario => {
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += (i < comentario.score) ? '<i class="fa fa-star checked"></i>' : '<i class="fa fa-star"></i>';
            }

            let fecha = new Date(comentario.dateTime);
            let nuevaFecha = convertirFecha(fecha);

            let comentItem = document.createElement('div');
            comentItem.classList.add('comentario');
            comentItem.innerHTML = `
                <strong>${comentario.user}</strong> (${nuevaFecha})<br>
                <em>Calificación:</em> ${stars}<br>
                <p>${comentario.description}</p>
            `;
            listaComentario.appendChild(comentItem);
        });
    }

    // Clasificación por estrellas
    let estrellas = document.querySelectorAll('.star');
    estrellas.forEach(function(estrella, index) {
        estrella.addEventListener('click', function() {
            for (let i = 0; i <= index; i++) {
                estrellas[i].classList.add('checked');
            }
            for (let i = index + 1; i < estrellas.length; i++) {
                estrellas[i].classList.remove('checked');
            }
        });
    });

    // Enviar comentario nuevo
    document.getElementById('submitClas').addEventListener('click', () => {
        let clasificar = document.querySelectorAll('.star.checked').length;
        let comentario = document.getElementById('comentario').value;
        let usuario = localStorage.getItem('user') || 'usuario';

        if (comentario.trim() === "") {
            alert("Por favor, escribe un comentario antes de enviar.");
            return;
        }

        // Obtener los comentarios existentes desde localStorage para el producto específico
        const comentariosGuardados = JSON.parse(localStorage.getItem(`comentarios_${productId}`)) || [];

        // Crear un nuevo comentario
        const nuevoComentario = {
            user: usuario,
            description: comentario,
            score: clasificar,
            dateTime: new Date().toISOString()
        };

        // Agregar el nuevo comentario al array
        comentariosGuardados.push(nuevoComentario);

        // Guardar el array actualizado en localStorage
        localStorage.setItem(`comentarios_${productId}`, JSON.stringify(comentariosGuardados));

        // Mostrar todos los comentarios actualizados, incluyendo el nuevo
        mostrarComentarios([...comentariosGuardados, nuevoComentario]);

        // Limpiar el formulario
        document.querySelectorAll('.star.checked').forEach(star => star.classList.remove('checked'));
        document.getElementById('comentario').value = '';
    });
});
