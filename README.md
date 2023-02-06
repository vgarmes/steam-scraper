# My Steam

A scraper for your Steam profile integrated with an API deployed to a Cloudflare worker for a 🚀 blazing fast response.

Based on [a similar project by midudev](https://github.com/midudev/kings-league-project/)

## Prerequisites:

- Node.js v18 and pnpm installed
- A Cloudflare account
- A public Steam account

## Configuration

- Fork this repository
- Add your Cloudflare API token as a repository secret with key `CF_API_TOKEN`
- Add your Steam username as a repository variable (not secret!) with key `USERNAME`
- By default, the Cloudflare worker will be called `mysteam` but you can change that in the `wrangler.toml` file in the root folder.
- Done! Every day at 0:00, a scheduled job in Github workflows will scrape your profile and publish it to your Cloudflare worker.

## Development environment

Run `yarn start` to start node server in watch mode

Run `yarn watch` to start typescript compiler in watch mode

## Notes on tsconfig file

- `"module": "NodeNext"`: designed to work with a package.json set to `"type": "module"` and thus being able to use `import` instead of `require`

- `"moduleResolution": "NodeNext"`: determines how typescript will find code that you import

- `"target": "ES2020"`: flavor of javascript that the code will compile to (ES2020 should be fine for a modern version of node)

- `"sourceMap": true`: maps compiled javascript code back to typescript to help debugging.
