import type {NuVelocityUnpacker as AppExports} from './NuVelocityUnpackerType';
import type {WorkerRequest, WorkerResponses} from './WorkerMessageType';

let dotNet: AppExports | null = null;

async function getDotNet(loaderUrl: string) {
	if (dotNet) {
		return dotNet;
	}

	dotNet = await loadAssembly(loaderUrl);
	return dotNet;
}

async function loadAssembly<AppExports>(loaderUrl: string) {
	const module = (await import(
		/* @vite-ignore */ loaderUrl
	)) as typeof import('../public/dotnet/wwwroot/_framework/dotnet.js');

	const {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		getAssemblyExports,
		getConfig,
	} = await module.dotnet.withDiagnosticTracing(import.meta.env.DEV).create();

	const {mainAssemblyName} = getConfig();
	if (!mainAssemblyName) {
		throw new Error('Missing main assembly name');
	}

	const exports = (await getAssemblyExports(mainAssemblyName)) as AppExports;
	if (!exports) {
		throw new Error('Missing assembly exports');
	}

	return exports;
}

async function onMessage(request: WorkerRequest) {
	const response = (result: WorkerResponses) => {
		self.postMessage({
			messageId: request.messageId,
			command: 'response',
			result,
		});
	};

	try {
		const dotNet = await getDotNet(request.loaderUrl);

		response({
			decodedImagesJson: dotNet.Unpacker.ReadFile(request.bytes),
		});
	} catch (error) {
		response({
			isError: true,
			errorDetails: error instanceof Error ? error.message : '',
		});
	}
}

self.addEventListener(
	'message',
	(ev: MessageEvent<WorkerRequest>) => {
		void onMessage(ev.data);
	},
	false,
);
