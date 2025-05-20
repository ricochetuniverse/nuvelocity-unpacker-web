using System.Diagnostics.CodeAnalysis;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text.Json;
using NuVelocity.Graphics;

return;

public partial class Unpacker
{
    [JSExport]
    [SupportedOSPlatform("browser")]
    [DynamicDependency(DynamicallyAccessedMemberTypes.All, typeof(FrameInfo))]
    // [DynamicDependency(DynamicallyAccessedMemberTypes.All, typeof(Font))]
    // [DynamicDependency(DynamicallyAccessedMemberTypes.All, typeof(FontBitmap))]
    // [DynamicDependency(DynamicallyAccessedMemberTypes.All, typeof(Frame))]
    // [DynamicDependency(DynamicallyAccessedMemberTypes.All, typeof(PaletteHolder))]
    // [DynamicDependency(DynamicallyAccessedMemberTypes.All, typeof(Sequence))]
    [DynamicDependency(DynamicallyAccessedMemberTypes.All, typeof(SequenceFrameInfoList))]
    internal static string ReadFile(byte[] file)
    {
        ImageExporter exporter = new ImageExporter(
            format: EncoderFormat.Mode3,
            overrideBlackBlending: false,
            inputDataFile: file
        );

        return JsonSerializer.Serialize(exporter.ExportData());
    }
}
