# nuvelocity-unpacker-web

Fork of [NuVelocity.Unpacker](https://github.com/frankwilco/NuVelocity.Unpacker) running on the web using WebAssembly.

[View live website: https://ricochetuniverse.github.io/nuvelocity-unpacker-web/](https://ricochetuniverse.github.io/nuvelocity-unpacker-web/)

## Development

Compile the .NET app first:

```sh
dotnet workload install wasm-tools

rm -rf web/public/dotnet/
dotnet publish -c Debug src/
dotnet publish -c Release src/
```

Then run the React web app:

```sh
cd web
npm install
npm run dev
npm run build
```
