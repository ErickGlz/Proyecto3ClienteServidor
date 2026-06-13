using HospitalServer.Hubs;
using HospitalServer.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddSingleton<TurnosService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapHub<TurnosHub>("/turnosHub");

app.Run();
