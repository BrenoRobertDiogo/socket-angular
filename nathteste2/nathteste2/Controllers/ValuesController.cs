using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace nathteste2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet("GetPleno")]
        public ActionResult<string> teste()
        {
            return "pleno";
        }
        
        [HttpGet("GetTeste2")]
        public ActionResult<object> teste2()
        {
            return new { Nome = "teste", error = "sem erros", json = new { message = "mensagem" } };
        }
        [HttpGet("GetTeste3")]
        public ActionResult<string> teste3()
        {
            return "pleno";
        }
        [HttpGet("GetTeste4")]
        public ActionResult<string> teste4()
        {
            return "pleno";
        }
        [HttpGet("GetTeste5")]
        public ActionResult<string> teste5()
        {
            return "pleno";
        }
    }
}
