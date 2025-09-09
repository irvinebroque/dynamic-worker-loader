# Dynamic Worker Loader — Example

Demonstrates https://github.com/cloudflare/workerd/pull/4383 — a way to on-demand load code (from anywhere) and execute it in its *own* isolate, that is securely sandboxed and does not have access to the host Worker that created it.

Useful for:

- **Executing AI generated code quickly, on-demand** — without the need for a container
- **Building a live code editor for server-side code** — moment that the code changes, you can provide the updated code to the `env.LOADER` binding and execute it
- **Running small user-generated functions before they need to be deployed as their own distinct Workers** — for example, before deploying your customer's code to [Workers for Platforms](https://developers.cloudflare.com/cloudflare-for-platforms/) — let them run and edit it quickly

## Try it

- `npm install`
- `npm run dev`
- press `b` to open a tab
- edit the code of the Worker that is loaded dynamically

## Requirements

- The `experimental` compatibility flag must be enabled in `wrangler.jsonc`
- The dynamic worker loader is automatically available as `env.LOADER` when using experimental features

## Limits

- Currently local dev only
- API subject to change