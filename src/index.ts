import { transform, Options } from '@swc/core';
import { type Plugin } from 'vite';

// Types
export interface SwcOptions extends Options {
  include?: RegExp;
}

// Plugin
export function swc(opts: SwcOptions = {}): Plugin {
  const include = opts.include ?? /\.[jt]sx?$/;

  return {
    name: 'jujulego:swc',
    enforce: 'pre',
    async transform(code, id) {
      if (!include.exec(id)) {
        return;
      }

      return await transform(code, {
        swcrc: true,
        ...opts,
        filename: id,
        sourceMaps: true,
      });
    }
  };
}
