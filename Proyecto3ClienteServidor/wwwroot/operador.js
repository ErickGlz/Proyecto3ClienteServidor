const conexion = new signalR.HubConnectionBuilder()
    .withUrl("/turnosHub")
    .build();

conexion.on("ActualizarFila", function (fila) {

    const lista = document.getElementById("listaTurnos");

    lista.innerHTML = "";

    fila.forEach(function (turno) {

        const li = document.createElement("li");

        li.textContent = turno.numero;

        lista.appendChild(li);

    });

});

conexion.on("ActualizarConectados", function (cantidad) {

    document.getElementById("conectados").textContent = cantidad;

});

conexion.on("EstadoRecepcion", function (abierta) {

    const estado = document.getElementById("estadoRecepcion");

    if (abierta) {
        estado.textContent = "🟢 ABIERTA";
    }
    else {
        estado.textContent = "🔴 CERRADA";
    }

});

conexion.on("FilaVacia", function () {

    alert("No hay turnos en espera.");

});

conexion.start()
    .then(function () {

        console.log("Operador conectado");

    })
    .catch(function (err) {

        console.error(err);

    });

document.getElementById("btnSiguiente")
    .addEventListener("click", function () {

        conexion.invoke("SiguienteTurno");

    });

let abierta = true;

document.getElementById("btnRecepcion")
    .addEventListener("click", function () {

        if (abierta) {

            conexion.invoke("Cerrar");

        } else {

            conexion.invoke("Abrir");

        }

        abierta = !abierta;

    });

document.getElementById("btnReset")
    .addEventListener("click", function () {

        if (confirm("¿Deseas reiniciar el sistema?")) {

            conexion.invoke("Reiniciar");

        }

    });