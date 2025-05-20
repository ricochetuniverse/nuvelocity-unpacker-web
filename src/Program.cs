using System;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using NuVelocity.Graphics;

return;

public partial class Unpacker
{
    [JSExport]
    [SupportedOSPlatform("browser")]
    internal static string readFile(byte[] file)
    {
        // ImageExporter exporter = new ImageExporter(
        //     format: EncoderFormat.Mode3,
        //     dumpRawData: false,
        //     stripCacheFromPath: true,
        //     overrideBlackBlending: false,
        //     inputDataFileOrDirectory: "Data",
        //     outputFolder: "Data/Export"
        // );

        // exporter.ExportData();

        return "Hello from readFile";
    }
}
