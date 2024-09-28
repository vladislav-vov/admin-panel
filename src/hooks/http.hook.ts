import { useState, useCallback } from 'react';

type HTTPRequestMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type LoadingStatus = 'idle' | 'loading' | 'error';

interface HTTPHeaders {
	[key: string]: string;
}

interface RequestConfig {
	url: string;
	method?: HTTPRequestMethods;
	body?: string | null;
	headers?: HTTPHeaders;
}

const useHttp = () => {
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('idle');

	const request = useCallback(
		async ({
			url,
			method = 'GET',
			body = null,
			headers = { 'Content-Type': 'application/json' },
		}: RequestConfig) => {
			setLoadingStatus('loading');

			try {
				const response = await fetch(url, { method, body, headers });

				if (!response.ok) {
					throw new Error(
						`Could not fetch ${fetch}, status: ${response.status}`
					);
				}

				const data = await response.json();

				setLoadingStatus('idle');

				return data;
			} catch (err) {
				setLoadingStatus('error');

				if (err instanceof Error) {
					console.error(err.message);
				} else if (typeof err === 'string') {
					console.error(err);
				}
			}
		},
		[]
	);

	return { loadingStatus, request };
};

export default useHttp;
