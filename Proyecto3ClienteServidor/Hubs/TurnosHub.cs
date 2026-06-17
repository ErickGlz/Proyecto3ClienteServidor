using HospitalServer.Models;
using HospitalServer.Services;
using Microsoft.AspNetCore.SignalR;

namespace HospitalServer.Hubs
{
    public class TurnosHub: Hub
    {
        private readonly TurnosService turnos;

        public TurnosHub(TurnosService turnos)
        {
            this.turnos = turnos;
        }

        public override async Task OnConnectedAsync()
        {
         

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            turnos.ClienteDesconectado();

            await Clients.All.SendAsync(
                "ActualizarConectados",
                turnos.ClientesConectados);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task PedirTurno(string clienteId)
        {
            var turno = turnos.SolicitarTurno(clienteId, Context.ConnectionId);

            if (turno == null)
            {
                await Clients.Caller.SendAsync("RecepcionCerrada");
                return;
            }

            await Clients.Caller.SendAsync("TurnoAsignado", turno.Numero);

            await Clients.All.SendAsync(
                "ActualizarFila",
                turnos.ObtenerFila());
        }

        public async Task CancelarTurno(string clienteId)
        {
            turnos.CancelarTurno(clienteId);

            await Clients.All.SendAsync(
                "ActualizarFila",
                turnos.ObtenerFila());
        }

        public async Task SiguienteTurno()
        {
            var turno = turnos.LlamarSiguiente();

            if (turno == null)
            {
                await Clients.Caller.SendAsync("FilaVacia");
                return;
            }

            await Clients.Client(turno.ConnectionId)
                .SendAsync("EsTuTurno", turno.Numero);

            await Clients.All.SendAsync(
                "ActualizarFila",
                turnos.ObtenerFila());
        }

        public async Task Abrir()
        {
            turnos.AbrirRecepcion();

            await Clients.All.SendAsync(
                "EstadoRecepcion",
                true);
        }

        public async Task Cerrar()
        {
            turnos.CerrarRecepcion();

            await Clients.All.SendAsync(
                "EstadoRecepcion",
                false);
        }

        public async Task Reiniciar()
        {
            turnos.Resetear();

            await Clients.All.SendAsync(
                "ActualizarFila",
                turnos.ObtenerFila());
        }
        public async Task<Turno?> ObtenerTurnoActivo(string clienteId)
        {
            return turnos.ObtenerFila()
                .FirstOrDefault(t => t.ClienteId == clienteId && t.Estado == "EnEspera");
        }
        public async Task RegistrarPaciente()
        {
            turnos.ClienteConectado();

            await Clients.All.SendAsync(
                "ActualizarConectados",
                turnos.ClientesConectados);
        }
    }
}
