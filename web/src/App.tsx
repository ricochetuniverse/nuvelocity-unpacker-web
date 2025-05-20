import {useState} from 'react';
import useDotNet from './useDotNet';
import useErrorDetails from './useErrorDetails';

import ImageResults from './ImageResults';

export default function App() {
	const {
		dotnet,
		loading: isDotNetLoading,
		error: isDotNetLoadingError,
	} = useDotNet();

	const [decodedImages, setDecodedImages] = useState<string[]>([]);
	const [isUnpacking, setIsUnpacking] = useState(false);

	const [errorDetails, setErrorDetails] = useErrorDetails();

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

		setIsUnpacking(true);
		setErrorDetails({isError: false});
		setDecodedImages([]);

		const bytes = new Uint8Array(await file.arrayBuffer());

		try {
			// todo should be done in a web worker because it lags the main thread
			const decodedImages = JSON.parse(
				dotnet.Unpacker.ReadFile(bytes),
			) as string[];

			setDecodedImages(decodedImages);
		} catch (error) {
			console.error(error);

			setErrorDetails({
				isError: true,
				details: error instanceof Error ? error : undefined,
			});
		}

		setIsUnpacking(false);
	}

	return (
		<div>
			<h1>
				nuvelocity-unpacker-web{' '}
				<a href="https://github.com/ricochetuniverse/nuvelocity-unpacker-web">
					(view source code on GitHub)
				</a>
			</h1>

			{isDotNetLoading ? (
				<p>
					<strong>Loading...</strong>
				</p>
			) : isDotNetLoadingError.isError ? (
				<p>
					⚠️ Oops, there was a problem loading .NET:{' '}
					<code>{isDotNetLoadingError.details?.toString()}</code>
				</p>
			) : (
				<div>
					<input type="file" onChange={onFileChange} />
				</div>
			)}

			{isUnpacking ? (
				<p>
					<strong>Decoding images...</strong>
				</p>
			) : null}

			{errorDetails.isError ? (
				<p>
					⚠️ Oops, there was a problem while decoding the file:{' '}
					<code>{errorDetails.details?.toString()}</code>
				</p>
			) : null}

			{decodedImages.length ? (
				<ImageResults decodedImages={decodedImages} />
			) : null}
		</div>
	);
}
