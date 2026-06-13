const conexion = new signalR.HubConnectionBuilder()
    .withUrl("/turnosHub")
    .build();

// Actualizar lista de turnos
conexion.on("ActualizarFila", function (fila) {

    const lista = document.getElementById("listaTurnos");

    lista.innerHTML = "";

    fila.forEach(function (turno) {

        const li = document.createElement("li");

        li.textContent = turno.numero;

        lista.appendChild(li);

    });

});

// Actualizar clientes conectados
conexion.on("ActualizarConectados", function (cantidad) {

    document.getElementById("conectados").textContent = cantidad;

});

// Estado de la recepción
conexion.on("EstadoRecepcion", function (abierta) {

    const estado = document.getElementById("estadoRecepcion");

    if (abierta) {
        estado.textContent = "🟢 ABIERTA";
    }
    else {
        estado.textContent = "🔴 CERRADA";
    }

});

// Si no hay turnos
conexion.on("FilaVacia", function () {

    alert("No hay turnos en espera.");

});

// Iniciar conexión
conexion.start()
    .then(function () {

        console.log("Operador conectado");

    })
    .catch(function (err) {

        console.error(err);

    });

// Botón llamar siguiente
document.getElementById("btnSiguiente")
    .addEventListener("click", function () {

        conexion.invoke("SiguienteTurno");

    });

// Variable para saber si está abierta
let abierta = true;

// Botón abrir/cerrar
document.getElementById("btnRecepcion")
    .addEventListener("click", function () {

        if (abierta) {

            conexion.invoke("Cerrar");

        } else {

            conexion.invoke("Abrir");

        }

        abierta = !abierta;

    });

// Botón reiniciar
document.getElementById("btnReset")
    .addEventListener("click", function () {

        if (confirm("¿Deseas reiniciar el sistema?")) {

            conexion.invoke("Reiniciar");

        }

    });