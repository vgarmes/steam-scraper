# steam-scraper

## Prerequisites:

- Node.js v18 and pnpm installed

## Development environment

Run `yarn start` to start node server in watch mode

Run `yarn watch` to start typescript compiler in watch mode

## Notes on tsconfig file

- `"module": "NodeNext"`: designed to work with a package.json set to `"type": "module"` and thus being able to use `import` instead of `require`

- `"moduleResolution": "NodeNext"`: determines how typescript will find code that you import

- `"target": "ES2020"`: flavor of javascript that the code will compile to (ES2020 should be fine for a modern version of node)

- `"sourceMap": true`: maps compiled javascript code back to typescript to help debugging.
