import adapter from "@sveltejs/adapter-static";
import { preprocessMeltUI, sequence } from "@melt-ui/pp";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sequence([preprocessMeltUI()]),
  kit: {
    adapter: adapter({
      pages: "public",
      assets: "public",
      fallback: "index.html", // single page application режим чтобы переход по ссылке .../dashboard не выдавал ошибку
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
