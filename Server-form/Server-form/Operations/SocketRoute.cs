using Microsoft.AspNetCore.SignalR;
using Server_form.Models;
using System.Threading.Tasks;

namespace Server_form.Operations
{
    public class SocketRoute : Hub
    {
        public async Task UpdateForm(string userName, Formulario formulario)
        {
            await Clients.All.SendAsync("updateForm", userName, formulario);
            ;
        }
        public async Task NewMessage (string userName, string message) 
        {
            await Clients.All.SendAsync("newMessage", userName, message);
        } 



    }
}
