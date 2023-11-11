using Microsoft.AspNetCore.SignalR;
using Server_form.Models;
using System.Threading.Tasks;

namespace Server_form.Controllers
{
    public class FormController : Hub
    {
        public async Task UpdateForm(User user, Formulario formulario)
        {
            await Clients.All.SendAsync("updateForm", user, formulario);
        }

    }
}
