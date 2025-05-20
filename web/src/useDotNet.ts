// Based from https://github.com/nbelyh/article-demo-dotnet-react-app/blob/main/src/useDotNet.ts

import {useEffect, useRef, useState} from 'react';
import type {RuntimeAPI} from '../public/dotnet/wwwroot/_framework/dotnet.js';

import useErrorDetails from './useErrorDetails';

export default function useDotNet() {
	// this is actually `any` :p
	const [dotnet, setDotNet] = useState<Awaited<
		ReturnType<RuntimeAPI['getAssemblyExports']>
	> | null>(null);

	const [loading, setLoading] = useState(true);
	const startedRef = useRef(false);

	const [errorDetails, setErrorDetails] = useErrorDetails();

	async function load() {
		const module: typeof import('../public/dotnet/wwwroot/_framework/dotnet.js') =
			await import(
				/* @vite-ignore */
				new URL('/dotnet/wwwroot/_framework/dotnet.js', import.meta.url).href
			);

		const {getAssemblyExports, getConfig} = await module.dotnet
			.withDiagnosticTracing(false)
			.create();

		const {mainAssemblyName} = getConfig();
		if (!mainAssemblyName) {
			throw new Error('Missing main assembly name');
		}

		return await getAssemblyExports(mainAssemblyName);
	}

	useEffect(() => {
		// Bad practice :(
		if (startedRef.current) {
			return;
		}

		startedRef.current = true;
		setLoading(true);

		load()
			.then((exports) => setDotNet(exports))
			.catch((error) => {
				console.error(error);

				setErrorDetails({
					isError: true,
					details: error instanceof Error ? error : undefined,
				});
			})
			.finally(() => setLoading(false));
	}, [setErrorDetails]);

	return {
		dotnet,
		loading,
		error: errorDetails,
	};
}
