
const echoWorker = `
						export default {
							async fetch(request, env, ctx) {
								return new Response('Hello from a dynamically loaded worker!')
							}
						};
					`

export default {
	async fetch(request, env, ctx): Promise<Response> {		
		const worker = env.LOADER.get('echo-worker', () => {
			return {
				compatibilityDate: "2025-06-01", 
				mainModule: "echo.js",
				modules: {
					"echo.js": echoWorker
				}
			};
		});

		const entrypoint = worker.getEntrypoint();
		return entrypoint.fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
