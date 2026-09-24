import adapter from "@sveltejs/adapter-static";
import { preprocessMeltUI, sequence } from "@melt-ui/pp";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sequence([preprocessMeltUI()]),
  kit: {
    adapter: adapter({
      pages: "public",
      assets: "public",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
    paths: {
      base: process.argv.includes('dev') ? '' : (process.env.BASE_PATH || '/your-game'),
    },
  },
};

export default config;
