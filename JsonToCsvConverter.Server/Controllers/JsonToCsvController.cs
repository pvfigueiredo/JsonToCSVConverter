using Microsoft.AspNetCore.Mvc;
using JsonToCsvConverter.Server.Services;

namespace JsonToCsvConverter.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JsonToCsvController : ControllerBase
    {
        private readonly JsonToCsvService _jsonToCsvService;

        public JsonToCsvController(JsonToCsvService jsonToCsvService)
        {
            _jsonToCsvService = jsonToCsvService;
        }

        [HttpPost("convert")]
        public async Task<IActionResult> ConvertJsonToCsv()
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var jsonContent = await reader.ReadToEndAsync();
                var csvContent = _jsonToCsvService.ConvertJsonToCsv(jsonContent);
                return Ok(csvContent);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }
    }
}
