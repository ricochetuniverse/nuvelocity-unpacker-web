namespace UnpackerTests
{
    [TestClass]
    public sealed class UnpackerTests
    {
        [TestMethod]
        public void ReadFile_WithValidSequence_ReturnsJsonOfBase64()
        {
            byte[] file = File.ReadAllBytes("fixtures/Ball Rail Small.Sequence");

            string unpacked = Unpacker.ReadFile(file);

            Assert.AreEqual(File.ReadAllText("fixtures/Ball Rail Small unpacked.txt"), unpacked, "Image not unpacked correctly");
        }
    }
}
