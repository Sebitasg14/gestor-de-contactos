const formulario = document.getElementById('formulario-contacto');
const cuerpoTabla = document.getElementById('cuerpo-tabla-contactos');
const mensajeVacio = document.getElementById('mensaje-vacio');
const contadorContactos = document.getElementById('contador-contactos');

const campoNombre = document.getElementById('nombre');
const campoApellido = document.getElementById('apellido');
const campoTelefono = document.getElementById('telefono');
const campoCorreo = document.getElementById('correo');
const campoCategoria = document.getElementById('categoria');
const campoEmojiElegido = document.getElementById('emoji-elegido');
const selectorEmoji = document.getElementById('selector-emoji');

const fondoModal = document.getElementById('fondo-modal');
const formularioEdicion = document.getElementById('formulario-edicion');
const campoEdicionIndice = document.getElementById('edicion-indice');
const campoEdicionNombre = document.getElementById('edicion-nombre');
const campoEdicionApellido = document.getElementById('edicion-apellido');
const campoEdicionTelefono = document.getElementById('edicion-telefono');
const campoEdicionCorreo = document.getElementById('edicion-correo');
const campoEdicionCategoria = document.getElementById('edicion-categoria');
const campoEdicionEmoji = document.getElementById('edicion-emoji');
const selectorEmojiEdicion = document.getElementById('selector-emoji-edicion');
const botonCerrarModal = document.getElementById('boton-cerrar-modal');
const botonCancelarEdicion = document.getElementById('boton-cancelar-edicion');

const fondoModalConfirmacion = document.getElementById(
    'fondo-modal-confirmacion'
);
const textoConfirmacion = document.getElementById('texto-confirmacion');
const botonCancelarEliminacion = document.getElementById(
    'boton-cancelar-eliminacion'
);
const botonConfirmarEliminacion = document.getElementById(
    'boton-confirmar-eliminacion'
);

const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const expresionTelefono = /^[0-9+\-\s]{7,15}$/;

const emojisAvatar = [
    '😀',
    '😎',
    '🙂',
    '😊',
    '🤓',
    '🧑',
    '👩',
    '👨',
    '👩‍💼',
    '👨‍💼',
    '🐱',
    '🐶',
    '🦊',
    '🐼'
];

let indiceParaEliminar = null;

function obtenerEmojiAvatar(nombre) {
    let suma = 0;
    for (let i = 0; i < nombre.length; i++) {
        suma += nombre.charCodeAt(i);
    }
    return emojisAvatar[suma % emojisAvatar.length];
}

function obtenerClaseCategoria(categoria) {
    if (categoria === 'Trabajo') return 'etiqueta-trabajo';
    if (categoria === 'Familia') return 'etiqueta-familia';
    return 'etiqueta-amigos';
}

function construirSelectorEmoji(contenedor, campoOculto) {
    contenedor.innerHTML = '';
    emojisAvatar.forEach(function (emoji) {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'opcion-emoji';
        boton.textContent = emoji;
        boton.setAttribute('role', 'radio');
        boton.setAttribute('aria-checked', 'false');
        boton.addEventListener('click', function () {
            const opciones = contenedor.querySelectorAll('.opcion-emoji');
            opciones.forEach(function (opcion) {
                opcion.classList.remove('emoji-seleccionado');
                opcion.setAttribute('aria-checked', 'false');
            });
            boton.classList.add('emoji-seleccionado');
            boton.setAttribute('aria-checked', 'true');
            campoOculto.value = emoji;
        });
        contenedor.appendChild(boton);
    });
}

function marcarEmojiSeleccionado(contenedor, emoji) {
    const opciones = contenedor.querySelectorAll('.opcion-emoji');
    opciones.forEach(function (opcion) {
        const esElElegido = opcion.textContent === emoji;
        opcion.classList.toggle('emoji-seleccionado', esElElegido);
        opcion.setAttribute('aria-checked', esElElegido ? 'true' : 'false');
    });
}

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

function validarCampos(datos, prefijoError) {
    let esValido = true;

    if (datos.nombre.value.trim() === '') {
        mostrarError(
            datos.nombre,
            prefijoError + 'nombre',
            'El nombre es obligatorio.'
        );
        esValido = false;
    } else {
        limpiarError(datos.nombre, prefijoError + 'nombre');
    }

    if (datos.apellido.value.trim() === '') {
        mostrarError(
            datos.apellido,
            prefijoError + 'apellido',
            'El apellido es obligatorio.'
        );
        esValido = false;
    } else {
        limpiarError(datos.apellido, prefijoError + 'apellido');
    }

    if (datos.telefono.value.trim() === '') {
        mostrarError(
            datos.telefono,
            prefijoError + 'telefono',
            'El teléfono es obligatorio.'
        );
        esValido = false;
    } else if (!expresionTelefono.test(datos.telefono.value.trim())) {
        mostrarError(
            datos.telefono,
            prefijoError + 'telefono',
            'Ingresa un teléfono válido.'
        );
        esValido = false;
    } else {
        limpiarError(datos.telefono, prefijoError + 'telefono');
    }

    if (datos.correo.value.trim() === '') {
        mostrarError(
            datos.correo,
            prefijoError + 'correo',
            'El correo es obligatorio.'
        );
        esValido = false;
    } else if (!expresionCorreo.test(datos.correo.value.trim())) {
        mostrarError(
            datos.correo,
            prefijoError + 'correo',
            'Ingresa un correo válido.'
        );
        esValido = false;
    } else {
        limpiarError(datos.correo, prefijoError + 'correo');
    }

    if (datos.categoria.value === '') {
        mostrarError(
            datos.categoria,
            prefijoError + 'categoria',
            'Selecciona una categoría.'
        );
        esValido = false;
    } else {
        limpiarError(datos.categoria, prefijoError + 'categoria');
    }

    return esValido;
}

function formatearTelefono(campo) {
    let soloNumeros = campo.value.replace(/\D/g, '');

    if (soloNumeros.length > 11) {
        soloNumeros = soloNumeros.slice(0, 11);
    }

    if (soloNumeros.length > 4) {
        campo.value = soloNumeros.slice(0, 4) + '-' + soloNumeros.slice(4);
    } else {
        campo.value = soloNumeros;
    }
}

function crearFilaContacto(contacto, indice) {
    const fila = document.createElement('tr');
    fila.className = 'fila-contacto';
    fila.setAttribute('data-indice', indice);
    fila.setAttribute('tabindex', '0');

    const emoji =
        contacto.emoji ||
        obtenerEmojiAvatar(contacto.nombre + contacto.apellido);
    const claseCategoria = obtenerClaseCategoria(contacto.categoria);

    fila.innerHTML = `
    <td>
      <div class="celda-contacto">
        <span class="avatar-contacto" aria-hidden="true">${emoji}</span>
        <span class="nombre-contacto">${contacto.nombre} ${contacto.apellido}</span>
      </div>
    </td>
    <td>${contacto.telefono}</td>
    <td>${contacto.correo}</td>
    <td><span class="etiqueta-categoria ${claseCategoria}">${contacto.categoria}</span></td>
    <td><button type="button" class="boton-eliminar" data-indice="${indice}">Eliminar</button></td>
  `;

    return fila;
}

function actualizarContador(cantidad) {
    if (cantidad === 0) {
        contadorContactos.textContent = 'Aún no tienes contactos registrados.';
    } else if (cantidad === 1) {
        contadorContactos.textContent = 'Tienes 1 contacto registrado.';
    } else {
        contadorContactos.textContent = `Tienes ${cantidad} contactos registrados.`;
    }
}

function renderizarContactos() {
    const contactos = obtenerContactos();
    cuerpoTabla.innerHTML = '';

    if (contactos.length === 0) {
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
        contactos.forEach(function (contacto, indice) {
            cuerpoTabla.appendChild(crearFilaContacto(contacto, indice));
        });
    }

    actualizarContador(contactos.length);
}

function abrirModalDetalles(indice) {
    const contactos = obtenerContactos();
    const contacto = contactos[indice];
    if (!contacto) return;

    const emoji =
        contacto.emoji ||
        obtenerEmojiAvatar(contacto.nombre + contacto.apellido);

    campoEdicionIndice.value = indice;
    campoEdicionNombre.value = contacto.nombre;
    campoEdicionApellido.value = contacto.apellido;
    campoEdicionTelefono.value = contacto.telefono;
    campoEdicionCorreo.value = contacto.correo;
    campoEdicionCategoria.value = contacto.categoria;
    campoEdicionEmoji.value = emoji;

    marcarEmojiSeleccionado(selectorEmojiEdicion, emoji);

    [
        'error-edicion-nombre',
        'error-edicion-apellido',
        'error-edicion-telefono',
        'error-edicion-correo',
        'error-edicion-categoria'
    ].forEach(function (id) {
        document.getElementById(id).textContent = '';
    });
    [
        campoEdicionNombre,
        campoEdicionApellido,
        campoEdicionTelefono,
        campoEdicionCorreo,
        campoEdicionCategoria
    ].forEach(function (campo) {
        campo.classList.remove('campo-invalido');
    });

    fondoModal.classList.add('modal-visible');
}

function cerrarModalDetalles() {
    fondoModal.classList.remove('modal-visible');
}

function abrirModalConfirmacion(indice) {
    const contactos = obtenerContactos();
    const contacto = contactos[indice];
    if (!contacto) return;

    indiceParaEliminar = indice;
    textoConfirmacion.textContent = `¿Seguro que deseas eliminar a ${contacto.nombre} ${contacto.apellido}? Esta acción no se puede deshacer.`;
    fondoModalConfirmacion.classList.add('modal-visible');
}

function cerrarModalConfirmacion() {
    indiceParaEliminar = null;
    fondoModalConfirmacion.classList.remove('modal-visible');
}

function eliminarContacto(indice) {
    const contactos = obtenerContactos();
    contactos.splice(indice, 1);
    guardarContactos(contactos);
    renderizarContactos();
}

construirSelectorEmoji(selectorEmoji, campoEmojiElegido);
construirSelectorEmoji(selectorEmojiEdicion, campoEdicionEmoji);

campoTelefono.addEventListener('input', function () {
    formatearTelefono(campoTelefono);
});

campoEdicionTelefono.addEventListener('input', function () {
    formatearTelefono(campoEdicionTelefono);
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const esValido = validarCampos(
        {
            nombre: campoNombre,
            apellido: campoApellido,
            telefono: campoTelefono,
            correo: campoCorreo,
            categoria: campoCategoria
        },
        'error-'
    );

    if (!esValido) {
        return;
    }

    const nuevoContacto = {
        nombre: campoNombre.value.trim(),
        apellido: campoApellido.value.trim(),
        telefono: campoTelefono.value.trim(),
        correo: campoCorreo.value.trim(),
        categoria: campoCategoria.value,
        emoji:
            campoEmojiElegido.value ||
            obtenerEmojiAvatar(
                campoNombre.value.trim() + campoApellido.value.trim()
            )
    };

    const contactos = obtenerContactos();
    contactos.push(nuevoContacto);
    guardarContactos(contactos);

    formulario.reset();
    campoEmojiElegido.value = '';
    marcarEmojiSeleccionado(selectorEmoji, '');
    renderizarContactos();
});

cuerpoTabla.addEventListener('click', function (evento) {
    const botonEliminar = evento.target.closest('.boton-eliminar');
    if (botonEliminar) {
        const indice = Number(botonEliminar.getAttribute('data-indice'));
        abrirModalConfirmacion(indice);
        return;
    }

    const fila = evento.target.closest('.fila-contacto');
    if (fila) {
        const indice = Number(fila.getAttribute('data-indice'));
        abrirModalDetalles(indice);
    }
});

cuerpoTabla.addEventListener('keydown', function (evento) {
    if (evento.key !== 'Enter' && evento.key !== ' ') return;
    const fila = evento.target.closest('.fila-contacto');
    if (fila) {
        evento.preventDefault();
        const indice = Number(fila.getAttribute('data-indice'));
        abrirModalDetalles(indice);
    }
});

formularioEdicion.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const esValido = validarCampos(
        {
            nombre: campoEdicionNombre,
            apellido: campoEdicionApellido,
            telefono: campoEdicionTelefono,
            correo: campoEdicionCorreo,
            categoria: campoEdicionCategoria
        },
        'error-edicion-'
    );

    if (!esValido) {
        return;
    }

    const indice = Number(campoEdicionIndice.value);
    const contactos = obtenerContactos();

    contactos[indice] = {
        nombre: campoEdicionNombre.value.trim(),
        apellido: campoEdicionApellido.value.trim(),
        telefono: campoEdicionTelefono.value.trim(),
        correo: campoEdicionCorreo.value.trim(),
        categoria: campoEdicionCategoria.value,
        emoji: campoEdicionEmoji.value
    };

    guardarContactos(contactos);
    renderizarContactos();
    cerrarModalDetalles();
});

botonCerrarModal.addEventListener('click', cerrarModalDetalles);
botonCancelarEdicion.addEventListener('click', cerrarModalDetalles);
fondoModal.addEventListener('click', function (evento) {
    if (evento.target === fondoModal) {
        cerrarModalDetalles();
    }
});

botonCancelarEliminacion.addEventListener('click', cerrarModalConfirmacion);
fondoModalConfirmacion.addEventListener('click', function (evento) {
    if (evento.target === fondoModalConfirmacion) {
        cerrarModalConfirmacion();
    }
});

botonConfirmarEliminacion.addEventListener('click', function () {
    if (indiceParaEliminar !== null) {
        eliminarContacto(indiceParaEliminar);
    }
    cerrarModalConfirmacion();
});

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
        cerrarModalDetalles();
        cerrarModalConfirmacion();
    }
});

renderizarContactos();
