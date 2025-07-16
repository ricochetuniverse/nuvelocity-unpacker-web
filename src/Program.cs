using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text.Json;
using System.Text.Json.Serialization;
using NuVelocity.Graphics;

return;

public partial class Unpacker
{
    [JSExport]
    [SupportedOSPlatform("browser")]
    internal static string ReadFile(byte[] file)
    {
        ImageExporter exporter = new ImageExporter(
            format: EncoderFormat.Mode3,
            overrideBlackBlending: false,
            inputDataFile: file
        );

        return JsonSerializer.Serialize(exporter.ExportData(), SequenceDataInfoContext.Default.ByteArrayArray);
    }
}

[JsonSerializable(typeof(byte[][]))]
internal partial class SequenceDataInfoContext : JsonSerializerContext
{
}
