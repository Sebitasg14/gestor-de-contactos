const formulario = document.getElementById('formulario-contacto');
const cuerpoTabla = document.getElementById('cuerpo-tabla-contactos');
const mensajeVacio = document.getElementById('mensaje-vacio');

const campoNombre = document.getElementById('nombre');
const campoApellido = document.getElementById('apellido');
const campoTelefono = document.getElementById('telefono');
const campoCorreo = document.getElementById('correo');
const campoCategoria = document.getElementById('categoria');

const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const expresionTelefono = /^[0-9+\-\s]{7,15}$/;

function obtenerContactos() {
    const datos = localStorage.getItem('contactos');
    return datos ? JSON.parse(datos) : [];
}

function guardarContactos(contactos) {
    localStorage.setItem('contactos', JSON.stringify(contactos));
}

function mostrarError(campo, mensajeId, texto) {
    campo.classList.add('campo-invalido');
    document.getElementById(mensajeId).textContent = texto;
}

function limpiarError(campo, mensajeId) {
    campo.classList.remove('campo-invalido');
    document.getElementById(mensajeId).textContent = '';
}

function validarFormulario() {
    let esValido = true;

    if (campoNombre.value.trim() === '') {
        mostrarError(campoNombre, 'error-nombre', 'El nombre es obligatorio.');
        esValido = false;
    } else {
        limpiarError(campoNombre, 'error-nombre');
    }

    if (campoApellido.value.trim() === '') {
        mostrarError(
            campoApellido,
            'error-apellido',
            'El apellido es obligatorio.'
        );
        esValido = false;
    } else {
        limpiarError(campoApellido, 'error-apellido');
    }

    if (campoTelefono.value.trim() === '') {
        mostrarError(
            campoTelefono,
            'error-telefono',
            'El teléfono es obligatorio.'
        );
        esValido = false;
    } else if (!expresionTelefono.test(campoTelefono.value.trim())) {
        mostrarError(
            campoTelefono,
            'error-telefono',
            'Ingresa un teléfono válido.'
        );
        esValido = false;
    } else {
        limpiarError(campoTelefono, 'error-telefono');
    }

    if (campoCorreo.value.trim() === '') {
        mostrarError(campoCorreo, 'error-correo', 'El correo es obligatorio.');
        esValido = false;
    } else if (!expresionCorreo.test(campoCorreo.value.trim())) {
        mostrarError(campoCorreo, 'error-correo', 'Ingresa un correo válido.');
        esValido = false;
    } else {
        limpiarError(campoCorreo, 'error-correo');
    }

    if (campoCategoria.value === '') {
        mostrarError(
            campoCategoria,
            'error-categoria',
            'Selecciona una categoría.'
        );
        esValido = false;
    } else {
        limpiarError(campoCategoria, 'error-categoria');
    }

    return esValido;
}

function crearFilaContacto(contacto, indice) {
    const fila = document.createElement('tr');

    fila.innerHTML = `
    <td>${contacto.nombre}</td>
    <td>${contacto.apellido}</td>
    <td>${contacto.telefono}</td>
    <td>${contacto.correo}</td>
    <td>${contacto.categoria}</td>
    <td><button class="boton-eliminar" data-indice="${indice}">Eliminar</button></td>
  `;

    return fila;
}

function renderizarContactos() {
    const contactos = obtenerContactos();
    cuerpoTabla.innerHTML = '';

    if (contactos.length === 0) {
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
        contactos.forEach((contacto, indice) => {
            cuerpoTabla.appendChild(crearFilaContacto(contacto, indice));
        });
    }
}

function eliminarContacto(indice) {
    const contactos = obtenerContactos();
    contactos.splice(indice, 1);
    guardarContactos(contactos);
    renderizarContactos();
}

campoTelefono.addEventListener('input', function () {
    let soloNumeros = campoTelefono.value.replace(/\D/g, '');

    if (soloNumeros.length > 11) {
        soloNumeros = soloNumeros.slice(0, 11);
    }

    if (soloNumeros.length > 4) {
        campoTelefono.value =
            soloNumeros.slice(0, 4) + '-' + soloNumeros.slice(4);
    } else {
        campoTelefono.value = soloNumeros;
    }
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const nuevoContacto = {
        nombre: campoNombre.value.trim(),
        apellido: campoApellido.value.trim(),
        telefono: campoTelefono.value.trim(),
        correo: campoCorreo.value.trim(),
        categoria: campoCategoria.value
    };

    const contactos = obtenerContactos();
    contactos.push(nuevoContacto);
    guardarContactos(contactos);

    formulario.reset();
    renderizarContactos();
});

cuerpoTabla.addEventListener('click', function (evento) {
    if (evento.target.classList.contains('boton-eliminar')) {
        const indice = evento.target.getAttribute('data-indice');
        eliminarContacto(Number(indice));
    }
});

renderizarContactos();
