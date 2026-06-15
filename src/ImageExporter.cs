// Forked from https://github.com/frankwilco/NuVelocity.Unpacker/blob/master/src/ImageExporter.cs to work on WebAssembly environment

using NuVelocity.Graphics;
using NuVelocity.Graphics.ImageSharp;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using System.Diagnostics;
using static SixLabors.ImageSharp.Image;

internal class ImageExporter
{
    private readonly EncoderFormat _encoderFormat;
    private readonly bool _overrideBlackBlending;
    private readonly byte[] _inputDataFile;
    private readonly PngEncoder _pngEncoder = new();
    //private readonly TgaEncoder _tgaEncoder;

    public ImageExporter(
        EncoderFormat format,
        bool overrideBlackBlending,
        byte[] inputDataFile)
    {
        _encoderFormat = format switch
        {
            EncoderFormat.Mode1 => EncoderFormat.Mode1,
            EncoderFormat.Mode2 => EncoderFormat.Mode2,
            EncoderFormat.Mode3 => EncoderFormat.Mode3,
            _ => throw new NotSupportedException(),
        };

        // _tgaEncoder = new()
        // {
        //     BitsPerPixel = TgaBitsPerPixel.Pixel32,
        //     Compression = TgaCompression.RunLength
        // };

        _overrideBlackBlending = overrideBlackBlending;
        _inputDataFile = inputDataFile;
    }

    private byte[][] ExportFromSequenceStream(Stream sequenceStream)
    {
        SequenceEncoder encoder = _encoderFormat switch
        {
            //EncoderFormat.Mode1 => throw new NotImplementedException(),
            //EncoderFormat.Mode2 => new Mode2SequenceEncoder(),
            EncoderFormat.Mode3 => new Mode3SequenceEncoder(),
            _ => throw new InvalidOperationException(),
        };
        encoder.Decode(sequenceStream, null);

        Sequence sequence = encoder.Sequence;

        // XXX: override blended with black property and blit type if
        // it uses black biased blitting (which we don't support yet).
        if (_overrideBlackBlending)
        {
            sequence.BlendedWithBlack = false;
            if (sequence.BlitType == BlitType.BlendBlackBias)
            {
                sequence.BlitType = BlitType.TransparentMask;
            }
        }

        Image[]? images = _encoderFormat switch
        {
            //EncoderFormat.Mode1 => throw new NotImplementedException(),
            //EncoderFormat.Mode2 => ((Mode2SequenceEncoder)encoder).ToImages(),
            EncoderFormat.Mode3 => ((Mode3SequenceEncoder)encoder).ToImages(),
            _ => throw new InvalidOperationException(),
        };
        if (images == null)
        {
            throw new DecodeException();
        }

        byte[][] decodedImages = new byte[images.Length][];
        for (int i = 0; i < images.Length; i++)
        {
            Console.WriteLine("Doing image {0}", i);

            MemoryStream stream = new MemoryStream();
            images[i].Save(stream, _pngEncoder);
            decodedImages[i] = stream.ToArray();
            stream.Dispose();
        }

        return decodedImages;
    }

    private byte[] ExportFromFrameStream(Stream frameStream)
    {
        Stream? propertyListStream = null; // todo is this needed?

        FrameEncoder encoder = _encoderFormat switch
        {
            //EncoderFormat.Mode1 => throw new NotImplementedException(),
            //EncoderFormat.Mode2 => new Mode2FrameEncoder(),
            EncoderFormat.Mode3 => new Mode3FrameEncoder(),
            _ => throw new InvalidOperationException(),
        };
        encoder.Decode(frameStream, propertyListStream);

        Image? image = _encoderFormat switch
        {
            //EncoderFormat.Mode1 => throw new NotImplementedException(),
            //EncoderFormat.Mode2 => ((Mode2FrameEncoder)encoder).ToImage(),
            EncoderFormat.Mode3 => ((Mode3FrameEncoder)encoder).ToImage(),
            _ => throw new InvalidOperationException(),
        };
        if (image == null)
        {
            throw new DecodeException();
        }

        MemoryStream stream = new MemoryStream();
        image.Save(stream, _pngEncoder);
        byte[] decodedImage = stream.ToArray();
        stream.Dispose();

        return decodedImage;
    }

    public byte[][] ExportData(ImageType imageType)
    {
        Console.WriteLine("Starting the export");

        Stopwatch stopwatch = Stopwatch.StartNew();

        MemoryStream containerStream = new MemoryStream(_inputDataFile);

        byte[][] decodedImages = imageType switch
        {
            ImageType.SEQUENCE => ExportFromSequenceStream(containerStream),
            ImageType.FRAME => [ExportFromFrameStream(containerStream)],
            _ => throw new NotSupportedException("Unknown image type"),
        };

        stopwatch.Stop();
        TimeSpan elapsedTime = stopwatch.Elapsed;
        Console.WriteLine("Elapsed time: {0}", elapsedTime);
        Console.WriteLine("Done.");

        return decodedImages;
    }
}

public class DecodeException : Exception { }
