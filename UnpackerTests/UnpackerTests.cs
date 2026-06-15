namespace UnpackerTests
{
    [TestClass]
    public sealed class UnpackerTests
    {
        [TestMethod]
        public void ReadSequence_WithValidSequence_ReturnsJsonOfBase64()
        {
            byte[] file = File.ReadAllBytes("fixtures/Ball Rail Small.Sequence");

            string unpacked = Unpacker.ReadSequence(file);

            Assert.AreEqual(File.ReadAllText("fixtures/Ball Rail Small unpacked.txt"), unpacked, "Sequence not unpacked correctly");
        }

        [TestMethod]
        public void ReadFrame_WithValidFrame_ReturnsJsonOfBase64()
        {
            byte[] file = File.ReadAllBytes("fixtures/MainMenuShipShield.Frame");

            string unpacked = Unpacker.ReadFrame(file);

            File.WriteAllText("frame.txt", unpacked);

            Assert.AreEqual(File.ReadAllText("fixtures/MainMenuShipShield unpacked.txt"), unpacked, "Frame not unpacked correctly");
        }
    }
}
