using HospitalServer.Models;

namespace HospitalServer.Services
{
    public class TurnosService
    {
        private readonly List<Turno> _turnos = new();

        private int _contador = 1;

        public bool RecepcionAbierta { get; private set; } = true;

        public int ClientesConectados { get; private set; } = 0;

        private readonly object _lock = new();

        public List<Turno> ObtenerFila()
        {
            return _turnos.ToList();
        }

        public Turno? SolicitarTurno(string clienteId, string connectionId)
        {
            lock (_lock)
            {
                if (!RecepcionAbierta)
                    return null;

                var existente = _turnos.FirstOrDefault(t =>
                    t.ClienteId == clienteId &&
                    t.Estado == "EnEspera");

                if (existente != null)
                    return existente;

                var turno = new Turno
                {
                    Id = _contador,
                    Numero = $"H{_contador:D3}",
                    ClienteId = clienteId,
                    ConnectionId = connectionId,
                    Estado = "EnEspera",
                    FechaSolicitud = DateTime.Now
                };

                _turnos.Add(turno);
                _contador++;

                return turno;
            }
        }

        public bool CancelarTurno(string clienteId)
        {
            lock (_lock)
            {
                var turno = _turnos.FirstOrDefault(t =>
                    t.ClienteId == clienteId &&
                    t.Estado == "EnEspera");

                if (turno == null)
                    return false;

                _turnos.Remove(turno);

                return true;
            }
        }

        public Turno? LlamarSiguiente()
        {
            lock (_lock)
            {
                if (_turnos.Count == 0)
                    return null;

                var siguiente = _turnos.First();

                siguiente.Estado = "Atendido";

                _turnos.RemoveAt(0);

                return siguiente;
            }
        }

        public void Resetear()
        {
            lock (_lock)
            {
                _turnos.Clear();
                _contador = 1;
            }
        }

        public void AbrirRecepcion()
        {
            RecepcionAbierta = true;
        }

        public void CerrarRecepcion()
        {
            RecepcionAbierta = false;
        }

        public void ClienteConectado()
        {
            ClientesConectados++;
        }

        public void ClienteDesconectado()
        {
            if (ClientesConectados > 0)
                ClientesConectados--;
        }
    }
}
