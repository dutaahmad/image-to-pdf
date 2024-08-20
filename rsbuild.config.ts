import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack'

export default defineConfig({
  plugins: [pluginReact(), pluginBabel({
    include: /\.(?:jsx|tsx)$/,
    babelLoaderOptions(opts) {
      opts.plugins?.unshift('babel-plugin-react-compiler');
    },
  }), pluginSvgr()],
  tools: {
    rspack: {
      plugins: [TanStackRouterRspack()]
    }
  }
});
