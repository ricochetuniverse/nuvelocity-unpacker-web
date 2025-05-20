import {useState} from 'react';

export default function useErrorDetails() {
	return useState<
		| {
				isError: false;
		  }
		| {
				isError: true;
				details?: Error;
		  }
	>({isError: false});
}
