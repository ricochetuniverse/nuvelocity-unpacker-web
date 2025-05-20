import { dotnet } from './_framework/dotnet.js';

const { getAssemblyExports, getConfig } = await dotnet
  .withDiagnosticTracing(false)
  .withApplicationArgumentsFromQuery()
  .create();

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);

document.getElementById('file').addEventListener('change', async (ev) => {
  console.log('Starting...');

  const file = ev.currentTarget.files[0];
  const bytes = new Uint8Array(await file.arrayBuffer());

  // todo should be done in a web worker because it lags the main thread

  try {
    /** @type string[] */
    const decodedImages = JSON.parse(exports.Unpacker.ReadFile(bytes));

    for (let i = 0; i < decodedImages.length; i += 1) {
      const img = document.createElement('img');
      img.src = 'data:image/png;base64,' + decodedImages[i];
      document.body.appendChild(img);
    }
  } catch (ex) {
    console.error(ex);
    return;
  }
});
