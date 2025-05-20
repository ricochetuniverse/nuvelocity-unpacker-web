using System;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

return;

public partial class Unpacker
{
    [JSExport]
    [SupportedOSPlatform("browser")]
    internal static string readFile(byte[] file)
    {
        return "Hello from readFile";
    }
}
