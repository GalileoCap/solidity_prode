import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
//import eslint from 'vite-plugin-eslint';
import polyfillNode from 'rollup-plugin-polyfill-node'

import fs from "fs";

const estamosEnGlitch= process.env.PROJECT_REMIX_CHAIN!=null //A: la encontre con set en consola de glitch
const HMR_PORT= estamosEnGlitch ? 443 : null; 
//A: En glitch hay que indicarle al navegador que se conecte al de https pubico donde se ve la pagina
console.log('HMR_PORT',HMR_PORT);

// https://vitejs.dev/config/
export default defineConfig({
	esbuild: { loader: "jsx", include: /src\/.*\.jsx?$/, exclude: [] }, 
	optimizeDeps: { esbuildOptions: { plugins: [ { name: "load-js-files-as-jsx", setup(build) { build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => { return ({ loader: "jsx", contents: await fs.promises.readFile(args.path, "utf8"), }) }); }, }, ], },
	},
	plugins: [
		reactRefresh(),
		polyfillNode(),
	],
	build: {
		outDir: "build"
	},
	server: {
		strictPort: true,
			hmr: {
				port: HMR_PORT,
			}
	},
	define: { //A: Compatibilidad node-react ej: web3
    'process.env': {},
  }
});
