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
    name: '@jujulego/vite-plugin-swc',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (source.startsWith('@swc/helpers/_')) {
        const resolution = await this.resolve('@swc/helpers', importer, options);

        if (resolution?.external) {
          return { id: source, external: true };
        }
      }

      return null;
    },
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
