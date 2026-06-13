namespace HospitalServer.Models
{
    public class Turno
    {
            public int Id { get; set; }

            public string Numero { get; set; } = string.Empty;

            public string ClienteId { get; set; } = string.Empty;

            public string ConnectionId { get; set; } = string.Empty;

            public string Estado { get; set; } = "EnEspera";

            public DateTime FechaSolicitud { get; set; } = DateTime.Now;
    }
}
