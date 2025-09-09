import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Dynamic Worker Loader - Echo Worker', () => {
	it('echoes request information when LOADER not available', async () => {
		const request = new IncomingRequest('http://example.com', {
			method: 'POST',
			headers: { 'X-Test': 'value' }
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		expect(response.status).toBe(500);
		expect(await response.text()).toContain('Dynamic Worker Loader not available');
	});

	it('handles requests when LOADER not available (integration style)', async () => {
		const response = await SELF.fetch('https://example.com', {
			method: 'GET',
			headers: { 'User-Agent': 'test' }
		});
		
		expect(response.status).toBe(500);
		expect(await response.text()).toContain('Dynamic Worker Loader not available');
	});
});
