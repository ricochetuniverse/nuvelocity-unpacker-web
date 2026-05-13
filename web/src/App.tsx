import {useState} from 'react';
import {unpack} from './worker-handler';

import ImageResults from './ImageResults';
import type {WorkerStatuses} from './WorkerMessageType';

export default function App() {
	const [status, setStatus] = useState<WorkerStatuses | null>(null);
	const [decodedImages, setDecodedImages] = useState<string[]>([]);
	const [errorDetails, setErrorDetails] = useState<Error | null>(null);

	function onFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
		const fileInput = ev.currentTarget;
		if (!(fileInput instanceof HTMLInputElement)) {
			throw new Error('Expected HTMLInputElement');
		}

		if (fileInput.files && fileInput.files[0]) {
			void processFile(fileInput.files[0]);
		}
	}

	async function processFile(file: File) {
		console.log('Starting...');

		setStatus('LOADING');
		setDecodedImages([]);
		setErrorDetails(null);

		const bytes = new Uint8Array(await file.arrayBuffer());

		unpack(bytes, (response) => {
			setStatus(response.status);

			switch (response.status) {
				case 'LOADING':
				case 'PROCESSING':
					break;

				case 'FINISHED': {
					const decodedImages = JSON.parse(
						response.decodedImagesJson,
					) as string[];
					setDecodedImages(decodedImages);
					break;
				}

				case 'ERROR':
					console.error(response.errorDetails);
					setErrorDetails(new Error(response.errorDetails));
					break;

				default:
					break;
			}
		});
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

			{status === 'LOADING' ? (
				<p>
					<strong>Loading...</strong>
				</p>
			) : status === 'PROCESSING' ? (
				<p>
					<strong>Decoding images...</strong>
				</p>
			) : status === 'ERROR' ? (
				<p>
					⚠️ Oops, there was a problem while decoding the file
					{errorDetails ? (
						<>
							: <code>{errorDetails.message}</code>
						</>
					) : null}
				</p>
			) : null}

			{decodedImages.length ? (
				<ImageResults decodedImages={decodedImages} />
			) : null}
		</div>
	);
}
