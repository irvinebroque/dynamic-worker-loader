import { WorkerEntrypoint } from 'cloudflare:workers';

export class Greeter extends WorkerEntrypoint {
	async greet(name: string) {
	  return `${this.ctx.props.greeting}, ${name}!`;
	}
  }

const untrustedCode = `
						export default {
							async fetch(request, env, ctx) {
								const greeting = await env.CUSTOM_BINDING_API.greet(env.USERNAME);
								console.log(greeting);
								return new Response(greeting + " (sent from a dynamically loaded worker)");
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
				},
				env: {
					// Provide the untrusted code with a custom API
					CUSTOM_BINDING_API: ctx.exports.Greeter({ props : { greeting: 'Hello' }}),
					// Provide the untrusted code with any environment variables
					USERNAME: 'brendan'
				}
			};
		});

		const entrypoint = worker.getEntrypoint();
		return entrypoint.fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
