const container = document.getElementById("container");
let searchInput = document.getElementById('searchInput');
let productList = document.getElementById('productList');
let sortAscBtn = document.getElementById('sortAsc');
let sortDescBtn = document.getElementById('sortDesc');
let buttonFilter = document.getElementById('filtrarBtn');
let buttonClear = document.getElementById('limpiarBtn');
let minBarra = document.getElementById("minPrice");
let maxBarra = document.getElementById("maxPrice");
let relevanteButton = document.getElementById("sortRelevance");

let productsArray = [];

// Muestra los datos en la tabla, usando el array proporcionado
function showData(productsArray) {
    let Content = '';
    for (const product of productsArray) {
        Content += `
            <tr>
                <td><img src="${product.image}" alt="Imagen del Producto"></td>
                <td>
                    <div class="descripcion"><strong>Nombre:</strong> ${product.name}</div>
                    <div class="descripcion"><strong>Descripción:</strong> ${product.description}</div>
                    <div class="descripcion"><strong>Precio:</strong> ${product.cost + " " + product.currency}</div>
                    <div class="descripcion"><strong>Cantidad de Vendidos:</strong> ${product.soldCount}</div>
                </td>
                <td>
                    <button class="btn btn-outline-secondary" onclick="selectProduct(${product.id})">+</button>
                </td>
            </tr>`;
    }
        container.innerHTML = Content;
}

// Guarda el ID del producto seleccionado y redirige a su página de información
function selectProduct(productId) {
    localStorage.setItem('selectProductId', productId);
    location.href = 'product-info.html';
}

// Filtra productos según el término ingresado en la barra de búsqueda
function filterProducts() {
    let searchTerm = searchInput.value.toLowerCase();
    return productsArray.filter(product => 
        (product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm))
    );
}

// Ordena los productos filtrados en base al orden indicado (ascendente, descendente o por relevancia)
function sortProducts(order) {
    let filteredProducts = filterProducts();
    
    if (order === 'asc') {
        filteredProducts.sort((a, b) => a.cost - b.cost);
    } 
    else if (order === 'desc') {
        filteredProducts.sort((a, b) => b.cost - a.cost);
    } 
    else if (order === 'relevante') {
        filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
    }

    showData(filteredProducts);
}

// Filtra productos según el rango de precios especificado en las barras de entrada
function filtroPrice() {
        let minPrice = parseFloat(minBarra.value) || 0;
        let maxPrice = parseFloat(maxBarra.value) || Infinity;
        return productsArray.filter(product => 
            product.cost >= minPrice && product.cost <= maxPrice
        );
};

// Carga los datos de productos al iniciar la página según el ID de categoría almacenado
document.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('catID'); 
    
    if (id) {
        fetch(PRODUCTS_URL + id)
            .then(response => response.json())
            .then(data => {
                productsArray = data.products;
                showData(productsArray);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    } else {
        console.error('No se encontró un ID de categoría en localStorage');
    }
});

// Filtra productos en tiempo real según el término de búsqueda
searchInput.addEventListener('input', () => {
    showData(filterProducts());
});

// Ordena productos en orden ascendente
sortAscBtn.addEventListener('click', () => {
    sortProducts('asc');
});

// Ordena productos en orden descendente
sortDescBtn.addEventListener('click', () => {
    sortProducts('desc');
});

// Aplica el filtro de precios y muestra los productos
buttonFilter.addEventListener('click', () => {
    showData(filtroPrice());
});

// Limpia el filtro de precios y muestra todos los productos
buttonClear.addEventListener('click', () => {
    minBarra.value = '';
    maxBarra.value = '';
    showData(productsArray);
});

// Ordena productos por relevancia
relevanteButton.addEventListener('click', () => {
    sortProducts('relevante');
});
