
const untrustedCode = `
						export default {
							async fetch(request, env, ctx) {
								return new Response('Hello from a dynamically loaded worker!')
							}
						};
					`

export default {
	async fetch(request, env, ctx): Promise<Response> {		
		const worker = env.LOADER.get('some-id-you-define', () => {
			return {
				compatibilityDate: "2025-06-01", 
				mainModule: "index.js",
				modules: {
					"index.js": untrustedCode
				}
			};
		});

		const entrypoint = worker.getEntrypoint();
		return entrypoint.fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
