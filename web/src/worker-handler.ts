// Based on https://github.com/dotnet/blazor-samples/blob/main/10.0/DotNetOnWebWorkersReact/react/src/

import type {WorkerResponses} from './WorkerMessageType';

const pendingRequests = new Map<
	number,
	{
		resolve: (decodedImagesJson: string) => void;
		reject: (error: Error) => void;
	}
>();
let messageNewId = 0;

const worker = new Worker(new URL('./worker-background.ts', import.meta.url), {
	type: 'module',
});

worker.addEventListener(
	'message',
	(
		ev: MessageEvent<{
			messageId: number;
			command: 'response';
			result: WorkerResponses;
		}>,
	) => {
		const request = pendingRequests.get(ev.data.messageId);
		if (!request) {
			return;
		}
		pendingRequests.delete(ev.data.messageId);

		const response = ev.data.result;
		if ('decodedImagesJson' in response) {
			request.resolve(response.decodedImagesJson);
			return;
		}

		if ('isError' in response) {
			request.reject(new Error(response.errorDetails));
			return;
		}

		request.reject(new Error('Unknown response from web worker'));
	},
	false,
);

export function unpack(bytes: Uint8Array<ArrayBuffer>) {
	messageNewId += 1;

	return new Promise<string>((resolve, reject) => {
		pendingRequests.set(messageNewId, {resolve, reject});

		worker.postMessage({
			messageId: messageNewId,
			command: 'unpack',
			loaderUrl: new URL(
				'/dotnet/wwwroot/_framework/dotnet.js',
				import.meta.url,
			).href,
			bytes,
		});
	});
}
