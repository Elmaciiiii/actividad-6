function calcularSeguridad(clave) {
    const largo = clave.length;
    const tieneMinus = /[a-z]/.test(clave);
    const tieneMayus = /[A-Z]/.test(clave);
    const tieneNum = /\d/.test(clave);
    const tieneSimbolos = /[^a-zA-Z0-9]/.test(clave);
    const tiposPresentes = [tieneMinus, tieneMayus, tieneNum, tieneSimbolos].filter(Boolean).length;

    if (largo < 8) {
        return { nivel: "Muy Poco Segura", color: "seguridad-muy-poco-segura" };
    }

    if (largo >= 8 && largo <= 10 && tiposPresentes === 1) {
        return { nivel: "Muy Poco Segura", color: "seguridad-muy-poco-segura" };
    }

    if (largo >= 8 && largo <= 10 && tiposPresentes === 2) {
        return { nivel: "Poco Segura", color: "seguridad-poco-segura" };
    }

    if (largo >= 11 && largo <= 12 && tiposPresentes === 1) {
        return { nivel: "Poco Segura", color: "seguridad-poco-segura" };
    }

    if (largo >= 8 && largo <= 10 && tiposPresentes >= 3) {
        return { nivel: "Buena", color: "seguridad-buena" };
    }

    if (largo >= 11 && largo <= 15 && tiposPresentes >= 2) {
        return { nivel: "Buena", color: "seguridad-buena" };
    }

    if (largo >= 16 && tiposPresentes >= 3) {
        return { nivel: "Muy Buena", color: "seguridad-muy-buena" };
    }

    if (largo >= 12 && tiposPresentes === 4) {
        return { nivel: "Muy Buena", color: "seguridad-muy-buena" };
    }

    return { nivel: "Buena", color: "seguridad-buena" };
}

function actualizarIndicadorSeguridad(clave) {
    const seguridadClaveElement = document.getElementById("seguridadClave");
    if (seguridadClaveElement) {
        if (clave) {
            const resultado = calcularSeguridad(clave);
            seguridadClaveElement.textContent = resultado.nivel;
            seguridadClaveElement.className = resultado.color;
        } else {
            seguridadClaveElement.textContent = "";
            seguridadClaveElement.className = "";
        }
    }
}

function verificarOpcionesSeleccionadas() {
    const incluirMinus = document.getElementById("minus");
    const incluirMayus = document.getElementById("mayus");
    const incluirNum = document.getElementById("num");
    const incluirSimbolos = document.getElementById("simbolos");
    return [incluirMinus, incluirMayus, incluirNum, incluirSimbolos].some(checkbox => checkbox && checkbox.checked);
}

function guardarClaveEnHistorial(clave) {
    const listaHistorial = document.getElementById("listaHistorial");
    if (listaHistorial) {
        const nuevoItem = document.createElement("li");
        nuevoItem.textContent = clave;
        listaHistorial.prepend(nuevoItem); // Agrega la clave al principio de la lista
    }
}

function mostrarNotificacion(mensaje) {
    const notificacionDiv = document.getElementById("notificacion");
    if (notificacionDiv) {
        notificacionDiv.textContent = mensaje;
        notificacionDiv.classList.add("mostrar");
        setTimeout(() => {
            notificacionDiv.classList.remove("mostrar");
        }, 1500);
    } else {
        console.error("Error: El elemento con ID 'notificacion' no se encontró en el DOM.");
    }
}

function crearClave() {
    if (!verificarOpcionesSeleccionadas()) {
        const mensajeErrorElement = document.getElementById("mensajeError");
        if (mensajeErrorElement) {
            mensajeErrorElement.classList.remove("oculto");
        }
        actualizarIndicadorSeguridad("");
        return;
    } else {
        const mensajeErrorElement = document.getElementById("mensajeError");
        if (mensajeErrorElement) {
            mensajeErrorElement.classList.add("oculto");
        }
    }

    const tamElement = document.getElementById("tam");
    const incluirMinusElement = document.getElementById("minus");
    const incluirMayusElement = document.getElementById("mayus");
    const incluirNumElement = document.getElementById("num");
    const incluirSimbolosElement = document.getElementById("simbolos");
    const claveGeneradaInput = document.getElementById("claveGenerada");

    if (tamElement && incluirMinusElement && incluirMayusElement && incluirNumElement && incluirSimbolosElement && claveGeneradaInput) {
        const largo = parseInt(tamElement.value);
        const incluirMinus = incluirMinusElement.checked;
        const incluirMayus = incluirMayusElement.checked;
        const incluirNum = incluirNumElement.checked;
        const incluirSimbolos = incluirSimbolosElement.checked;
        let base = "";
        if (incluirMinus) base += "abcdefghijklmnopqrstuvwxyz";
        if (incluirMayus) base += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (incluirNum) base += "0123456789";
        if (incluirSimbolos) base += "!@#$%^&*()_+";

        let resultado = "";
        if (base.length === 0) {
            resultado = "";
        } else {
            for (let i = 0; i < largo; i++) {
                resultado += base.charAt(Math.floor(Math.random() * base.length));
            }
        }
        claveGeneradaInput.value = resultado;
        actualizarIndicadorSeguridad(resultado);

        if (resultado) {
            guardarClaveEnHistorial(resultado);
        }
    }
}

function borrarHistorialClaves() {
    const listaHistorial = document.getElementById("listaHistorial");
    if (listaHistorial) {
        listaHistorial.innerHTML = ""; // Elimina todos los elementos de la lista
    }
}

const botonGenerar = document.getElementById("generar");
if (botonGenerar) {
    botonGenerar.addEventListener("click", crearClave);
}

const botonCopiar = document.getElementById("copiar");
const campoClave = document.getElementById("claveGenerada");

if (botonCopiar && campoClave) {
    botonCopiar.addEventListener("click", () => {
        const claveGenerada = campoClave.value;
        if (claveGenerada) {
            campoClave.select();
            document.execCommand("copy");
            mostrarNotificacion("¡Clave copiada!");
        } else {
            mostrarNotificacion("¡Primero genera una contraseña!");
        }
    });
}

const tamInput = document.getElementById("tam");
const tamValorSpan = document.getElementById("tamValor");
if (tamInput && tamValorSpan) {
    tamInput.addEventListener("input", (e) => {
        tamValorSpan.textContent = e.target.value;
    });
}

const claveGeneradaInput = document.getElementById("claveGenerada");
if (claveGeneradaInput) {
    claveGeneradaInput.addEventListener("input", (e) => {
        actualizarIndicadorSeguridad(e.target.value);
    });
}

const botonBorrarHistorial = document.getElementById("borrarHistorial");
if (botonBorrarHistorial) {
    botonBorrarHistorial.addEventListener("click", borrarHistorialClaves);
}