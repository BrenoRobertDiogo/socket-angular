using Microsoft.AspNetCore.SignalR;
using Server_form.Models; 

namespace Server_form.Operations
{
    public class SocketRoute : Hub
    {
        public void sendData(string userName, Formulario formulario)
        {
            Clients.All.SendAsync("updateForm", userName, formulario);
        }
    }
}
