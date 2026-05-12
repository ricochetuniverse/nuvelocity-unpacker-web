import {useState} from 'react';
import type {NuVelocityUnpacker} from './NuVelocityUnpackerType';
import useDotNet from './useDotNet';
import useErrorDetails from './useErrorDetails';

import ImageResults from './ImageResults';

export default function App() {
	const {getDotNet, loading: isDotNetLoading} = useDotNet<NuVelocityUnpacker>(
		new URL('/dotnet/wwwroot/_framework/dotnet.js', import.meta.url).href,
	);

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

		try {
			const bytes = new Uint8Array(await file.arrayBuffer());

			// todo should be done in a web worker because it lags the main thread
			const dotNet = await getDotNet();
			if (dotNet == null) {
				return;
			}

			const decodedImages = JSON.parse(
				dotNet.Unpacker.ReadFile(bytes),
			) as string[];

			setDecodedImages(decodedImages);
		} catch (error) {
			console.error(error);

			setErrorDetails({
				isError: true,
				details: error instanceof Error ? error : undefined,
			});
		} finally {
			setIsUnpacking(false);
		}
	}

	return (
		<div>
			<h1>
				nuvelocity-unpacker-web{' '}
				<a href="https://github.com/ricochetuniverse/nuvelocity-unpacker-web">
					(view source code on GitHub)
				</a>
			</h1>

			<div>
				<input type="file" onChange={onFileChange} />
			</div>

			{isUnpacking ? (
				isDotNetLoading ? (
					<p>
						<strong>Loading...</strong>
					</p>
				) : (
					<p>
						<strong>Decoding images...</strong>
					</p>
				)
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
