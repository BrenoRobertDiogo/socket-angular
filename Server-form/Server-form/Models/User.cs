using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server_form.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string? imagemPerfil { get; set; }
        public string Cor { get; set; }
    }
}
