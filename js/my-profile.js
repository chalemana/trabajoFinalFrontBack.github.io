document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePic = document.getElementById('profilePic');
    let usuariologueado = localStorage.getItem('user');

    // Verifica si el usuario está logueado
    if (!usuariologueado) {
        window.location.href = 'login.html';
    }

    document.getElementById('inputEmail').value = usuariologueado;

    // Cargar datos del perfil
    loadProfileData();

    // Envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (form.checkValidity()) {
            saveProfileData();
            alert('Perfil actualizado con éxito');
        } else {
            form.reportValidity();
        }
    });

    // Cambio de foto de perfil
    profilePicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result; // Actualiza la imagen de perfil
                localStorage.setItem('profilePic', e.target.result); // Guarda la imagen en localStorage
            };
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        }
    });

    function loadProfileData() {
        const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
        for (const key in profileData) {
            const element = document.getElementById(key);
            if (element) {
                element.value = profileData[key]; // Cargar datos en los campos
            }
        }
        // Cargar la imagen de perfil desde localStorage o usar una predeterminada
        profilePic.src = localStorage.getItem('profilePic') || 'img/chili.jpg';
    }

    function saveProfileData() {
        const profileData = {
            nombre: document.getElementById('nombre').value,
            segundoNombre: document.getElementById('segundoNombre').value,
            apellido: document.getElementById('apellido').value,
            segundoApellido: document.getElementById('segundoApellido').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('inputEmail').value // Guardar también el email
        };
        localStorage.setItem('profileData', JSON.stringify(profileData)); // Guardar datos en localStorage
        localStorage.setItem('user', document.getElementById('inputEmail').value); // Guardar email
    }
});
