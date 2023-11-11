using Microsoft.AspNetCore.SignalR;
using Server_form.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server_form.Controllers
{
    public class UserController : Hub
    {
        public async Task UpdateUserData(User user)
        {
            await Clients.All.SendAsync("updateUserData", user);
        }
        public async Task NewUserConnected(User user)
        {
            await Clients.All.SendAsync("newUserConnected", user);
        }
    }
}
