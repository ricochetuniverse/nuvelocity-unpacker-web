import {useState} from 'react';

const {dotnet} = await import(
	/* @vite-ignore */
	new URL('/dotnet/wwwroot/_framework/dotnet.js', import.meta.url).href
);

const {getAssemblyExports, getConfig} = await dotnet
	.withDiagnosticTracing(false)
	.withApplicationArgumentsFromQuery()
	.create();

const {mainAssemblyName} = getConfig();
if (!mainAssemblyName) {
	throw new Error('Missing main assembly name');
}
const exports = await getAssemblyExports(mainAssemblyName);

function App() {
	const [decodedImages, setDecodedImages] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const [errorDetails, setErrorDetails] = useState<{
		isError: boolean;
		details?: Error;
	}>({isError: false});

	function onFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
		const fileInput = ev.currentTarget;
		if (!(fileInput instanceof HTMLInputElement)) {
			throw new Error('Expected HTMLInputElement');
		}

		if (fileInput.files && fileInput.files[0]) {
			processFile(fileInput.files[0]);
		}
	}

	async function processFile(file: File) {
		console.log('Starting...');

		setIsLoading(true);
		setErrorDetails({isError: false});
		setDecodedImages([]);

		const bytes = new Uint8Array(await file.arrayBuffer());

		try {
			// todo should be done in a web worker because it lags the main thread
			const decodedImages = JSON.parse(
				exports.Unpacker.ReadFile(bytes),
			) as string[];

			setIsLoading(false);
			setDecodedImages(decodedImages);
		} catch (ex) {
			console.error(ex);

			setIsLoading(false);
			setErrorDetails({
				isError: true,
				details: ex instanceof Error ? ex : undefined,
			});
		}
	}

	return (
		<div>
			<h1>nuvelocity-unpacker-web</h1>

			<div>
				<input type="file" onChange={onFileChange} />
			</div>

			{isLoading ? (
				<p>
					<strong>Loading...</strong>
				</p>
			) : null}

			{errorDetails.isError ? (
				<p>Opps, there was an error: {errorDetails.details?.toString()}</p>
			) : null}

			{decodedImages.length ? (
				<div>
					<hr />
					<h2>Decoded images:</h2>
					{decodedImages.map((img, index) => {
						return (
							<img
								src={'data:image/png;base64,' + img}
								key={index}
								style={{display: 'block'}}
							/>
						);
					})}
				</div>
			) : null}
		</div>
	);
}

export default App;
