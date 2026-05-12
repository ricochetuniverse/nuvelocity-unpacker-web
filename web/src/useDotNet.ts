// Based from https://github.com/nbelyh/article-demo-dotnet-react-app/blob/main/src/useDotNet.ts

import {useCallback, useRef, useState} from 'react';

async function loadAssembly<AppType>(loaderUrl: string): Promise<AppType> {
	const module: typeof import('../public/dotnet/wwwroot/_framework/dotnet.js') =
		await import(/* @vite-ignore */ loaderUrl);

	const {getAssemblyExports, getConfig} = await module.dotnet
		.withDiagnosticTracing(import.meta.env.DEV)
		.create();

	const {mainAssemblyName} = getConfig();
	if (!mainAssemblyName) {
		throw new Error('Missing main assembly name');
	}

	return getAssemblyExports(mainAssemblyName);
}

export default function useDotNet<AppType>(loaderUrl: string) {
	const [dotNet, setDotNet] = useState<AppType | null>(null);

	const [loading, setLoading] = useState(true);
	const startedLoadingRef = useRef(false);

	const getDotNet = useCallback(async () => {
		if (dotNet) {
			return dotNet;
		}

		if (startedLoadingRef.current) {
			// If dotnet did finish loading, then we wouldn't be here
			return;
		}
		startedLoadingRef.current = true;

		try {
			const exports = await loadAssembly<AppType>(loaderUrl);
			setDotNet(exports);

			return exports;
		} finally {
			setLoading(false);
		}
	}, [dotNet, loaderUrl]);

	return {
		getDotNet,
		loading,
	};
}
