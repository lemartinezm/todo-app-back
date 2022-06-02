const esbuild = require('esbuild');

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['./index.ts'],
  outfile: './dist/index.js',
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: true,
  loader: { '.ts': 'ts' },
  target: 'node16',
  plugins: [nodeExternalsPlugin()]
}).catch(() => process.exit(1));
