export type WorkerRequest = {
	messageId: number;
	command: 'unpack';
	loaderUrl: string;
	bytes: Uint8Array<ArrayBuffer>;
};

export type WorkerResponses =
	| {
			decodedImagesJson: string;
	  }
	| {
			isError: true;
			errorDetails: string;
	  };
