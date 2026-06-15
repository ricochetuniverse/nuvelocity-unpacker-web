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
    [Obsolete("Use ReadSequence instead")]
    public static string ReadFile(byte[] file)
    {
        return ReadSequence(file);
    }

    [JSExport]
    [SupportedOSPlatform("browser")]
    public static string ReadSequence(byte[] file)
    {
        return HandleImageType(file, ImageType.SEQUENCE);
    }

    [JSExport]
    [SupportedOSPlatform("browser")]
    public static string ReadFrame(byte[] file)
    {
        return HandleImageType(file, ImageType.FRAME);
    }

    private static string HandleImageType(byte[] file, ImageType imageType)
    {
        ImageExporter exporter = new ImageExporter(
           format: EncoderFormat.Mode3,
           overrideBlackBlending: false,
           inputDataFile: file
       );

        return JsonSerializer.Serialize(exporter.ExportData(imageType), SequenceDataInfoContext.Default.ByteArrayArray);
    }
}

[JsonSerializable(typeof(byte[][]))]
internal partial class SequenceDataInfoContext : JsonSerializerContext
{
}
