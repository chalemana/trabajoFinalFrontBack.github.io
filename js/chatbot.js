
let enviarBtn = document.getElementById("send-btn");
let inputUser = document.getElementById("user-input");
let chatBox = document.getElementById("chat-box");

// boton envío de mensajes
enviarBtn.addEventListener("click", () => handleUserInput());

inputUser.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserInput();
});

function handleUserInput() {
    let textoUser = inputUser.value.trim();
    if (!textoUser) return;

  // Mostrar mensaje del usuario
    appendMessage(textoUser, "user");

  // Obtener respuesta del chatbot
    let btnResponder = getBotResponse(textoUser);

  // Mostrar respuesta del bot
    appendMessage(btnResponder, "bot");

  // Limpiar el campo de entrada
    inputUser.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(message, sender) {
    let campoMensaje = document.createElement("div");
    campoMensaje.classList.add(`${sender}-message`);
    campoMensaje.textContent = message;
    chatBox.appendChild(campoMensaje);
}

let minimizarBtn = document.getElementById('minimize-btn');
let contenderoChat = document.querySelector('.chat-container');
let iconoChat = document.getElementById('chat-icon');

// minimizar el chat
minimizarBtn.addEventListener('click', () => {
    contenderoChat.classList.toggle('minimized');
    iconoChat.style.display = contenderoChat.classList.contains('minimized') ? 'flex' : 'none';
});

//abrir el chat al hacer clic en el icono
iconoChat.addEventListener('click', () => {
    contenderoChat.classList.remove('minimized');
    iconoChat.style.display = 'none';
});

function getBotResponse(input) {
  let preguntas = input.toLowerCase();

    // Respuestas predefinidas del chatbot
    if (preguntas.includes("hola")) {
        return "¡Hola! ¿En qué puedo ayudarte?";
    } else if (preguntas.includes("productos") || preguntas.includes("categorías")) {
      return "Puedes ver los productos navegando por las categorías o usando la barra de búsqueda. ¿Te gustaría ver algo específico?";
    } else if (preguntas.includes("agregar al carrito") || preguntas.includes("carrito")) {
      return "Para agregar un producto al carrito, haz clic en el botón 'Agregar al Carrito' en la página del producto.";
    } else if (preguntas.includes("pago") || preguntas.includes("métodos de pago")) {
      return "En este momento solo aceptamos pagos por transferencia bancaria o efectivo al recibir el producto.";
    } else if (preguntas.includes("devolución") || preguntas.includes("producto defectuoso")) {
      return "Si el producto está defectuoso, puedes solicitar una devolución contactando con el soporte.";
    } else if (preguntas.includes("registrar") || preguntas.includes("crear cuenta")) {
      return "Para registrarte, haz clic en 'Mi Perfil' en la parte superior del sitio y completa tus datos.";
    } else if (preguntas.includes("vender")) {
      return "Si deseas vender productos, regístrate como vendedor y agrega los detalles en la sección 'Vender'.";
    } else if (preguntas.includes("soporte")) {
      return "Puedes contactar con soporte desde la sección 'Mi Perfil' en el sitio.";
    } else if (preguntas.includes("envío")) {
      return "El envío está disponible dentro del país, y tarda entre 5 y 7 días hábiles dependiendo de tu ubicación.";
    } else if (preguntas.includes("política de privacidad")) {
      return "Puedes consultar nuestra política de privacidad en la parte inferior del sitio.";
    } else if (preguntas.includes("garantía")) {
      return "Algunos productos incluyen garantía. Revisa la página del producto para más detalles.";
    } else {
      return "Lo siento, no entendí tu pregunta. Por favor, escribe solo una palabra a la vez, no frases!";
    }
  }
