using System.Text.Json;

namespace JsonToCsvConverter.Server.Services
{
    public class JsonToCsvService
    {        
        public string ConvertJsonToCsv(string jsonContent)
        {
            using JsonDocument jsonDocument = JsonDocument.Parse(jsonContent);
            JsonElement rootElement = jsonDocument.RootElement;
            var columnNames = GetColumnNames(rootElement);
            var csvContent = CreateCsvContent(rootElement, columnNames);

            return csvContent;

        }

        private string CreateCsvContent(JsonElement rootElement, List<string> columnNames)
        {
            var csvLines = new List<string>
            {
                string.Join(",", columnNames)
            };

            foreach (var item in rootElement.EnumerateArray())
            {
                var row = new List<string>();
                foreach (var columnName in columnNames)
                {
                    if (item.TryGetProperty(columnName, out JsonElement property))
                    {
                        row.Add(property.ToString());
                    }
                    else
                    {
                        row.Add(string.Empty);
                    }
                }
                csvLines.Add(string.Join(",", row));
            }
            return string.Join("\n", csvLines);
        }      

        private List<string> GetColumnNames(JsonElement rootElement)
        {
            var columnNames = new HashSet<string>();
            foreach (var item in rootElement.EnumerateArray())
            {
                foreach (var property in item.EnumerateObject())
                {
                    columnNames.Add(property.Name);
                }
            }
            return new List<string>(columnNames);
        }
    }
}
