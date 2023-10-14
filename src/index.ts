import { transform, Options } from '@swc/core';
import { type Plugin } from 'vite';

// Plugin
export function swc(opts: Options = {}): Plugin {
  return {
    name: 'jujulego:swc',
    enforce: 'pre',
    async transform(code, id) {
      return await transform(code, {
        swcrc: true,
        ...opts,
        filename: id,
        sourceMaps: true,
      });
    }
  };
}
