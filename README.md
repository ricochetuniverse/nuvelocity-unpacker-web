# nuvelocity-unpacker-web

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
