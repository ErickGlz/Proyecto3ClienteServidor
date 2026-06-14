let clienteId = localStorage.getItem("clienteId");

if (!clienteId) {
    clienteId = crypto.randomUUID();
    localStorage.setItem("clienteId", clienteId);
}

const conexion = new signalR.HubConnectionBuilder()
    .withUrl("/turnosHub")
    .build();

conexion.on("TurnoAsignado", function (numero) {

    document.getElementById("miTurno").textContent = numero;

});

conexion.on("EsTuTurno", function (numero) {

    document.getElementById("miTurno").textContent = numero;

    document.getElementById("estadoTurno").textContent =
        "✅ ES TU TURNO - Pase a consulta";

    document.getElementById("estadoTurno").style.color = "green";
    document.getElementById("estadoTurno").style.fontSize = "28px";
    document.getElementById("estadoTurno").style.fontWeight = "bold";

    document.getElementById("personasAntes").textContent = "0";

    alert("🏥 Es tu turno: " + numero);

});

conexion.on("RecepcionCerrada", function () {

    alert("La recepción está cerrada.");

});

conexion.on("EstadoRecepcion", function (abierta) {

    const texto = abierta ? "🟢 Abierta" : "🔴 Cerrada";

    document.getElementById("recepcion").textContent = texto;

});

conexion.on("ActualizarFila", function (fila) {

    const indice = fila.findIndex(x => x.clienteId === clienteId);

    if (indice >= 0) {
        document.getElementById("personasAntes").textContent = indice;
    }
    else {
        document.getElementById("personasAntes").textContent = "-";
    }

});

conexion.start()
    .then(async function () {

        console.log("Conectado");

        const turno = await conexion.invoke("ObtenerTurnoActivo", clienteId);

        if (turno) {

            document.getElementById("miTurno").textContent = turno.numero;

            document.getElementById("estadoTurno").textContent =
                "⏳ Turno activo (recuperado)";

        }

    })
    .catch(function (err) {

        console.error(err);
    });

document.getElementById("btnSolicitar")
    .addEventListener("click", function () {

        conexion.invoke("PedirTurno", clienteId);

    });
document.getElementById("btnCancelar")
    .addEventListener("click", function () {

        conexion.invoke("CancelarTurno", clienteId);

        document.getElementById("miTurno").textContent = "---";

        document.getElementById("personasAntes").textContent = "0";

        document.getElementById("estadoTurno").textContent =
            "Sin turno";

    });