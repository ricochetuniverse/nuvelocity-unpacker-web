# nuvelocity-unpacker-web

Fork of [NuVelocity.Unpacker](https://github.com/frankwilco/NuVelocity.Unpacker) running on the web using WebAssembly.

[View live website: https://ricochetuniverse.github.io/nuvelocity-unpacker-web/](https://ricochetuniverse.github.io/nuvelocity-unpacker-web/)

## Development

[Install .NET 9.0 SDK](https://dotnet.microsoft.com/en-us/download).

Install the .NET workload:

```sh
dotnet workload install wasm-tools
```

Compile the .NET app:

```sh
rm -rf web/public/dotnet/
dotnet publish -c Debug src/
```

Then run the React web app:

```sh
cd web
npm install
npm run dev
```

To build for production:

```sh
rm -rf web/public/dotnet/
dotnet publish -c Release src/

npm run build
```
