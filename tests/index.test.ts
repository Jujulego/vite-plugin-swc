import { PluginContext, ResolvedId } from 'rollup';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { swc } from '@/src/index.js';

// Tests
describe('resolveId hook', () => {
  let context: PluginContext;
  const options = { attributes: {}, isEntry: false };
  let plugin: ReturnType<typeof swc>;

  beforeEach(() => {
    plugin = swc();

    context = {
      async resolve(id: string, importer) {
        return {
          id,
          external: false,
          resolvedBy: importer,
        } as ResolvedId;
      },
    } as PluginContext;
  });

  it('should resolve swc helper import as external like @swc/helpers', async () => {
    vi.spyOn(context, 'resolve').mockResolvedValue({
      id: '@swc/helpers',
      external: true,
      resolvedBy: 'test',
    } as ResolvedId);

    await expect(plugin.resolveId.apply(context, ['@swc/helpers/_/test', 'test', options]))
      .resolves.toEqual({
        id: '@swc/helpers/_/test',
        external: true,
      });

    expect(context.resolve).toHaveBeenCalledWith('@swc/helpers', 'test', options);
  });

  it('should not resolve swc helper import as @swc/helpers is internal', async () => {
    vi.spyOn(context, 'resolve').mockResolvedValue({
      id: '@swc/helpers',
      external: false,
      resolvedBy: 'test',
    } as ResolvedId);

    await expect(plugin.resolveId.apply(context, ['@swc/helpers/_/test', 'test', options]))
      .resolves.toBeNull();

    expect(context.resolve).toHaveBeenCalledWith('@swc/helpers', 'test', options);
  });

  it('should resolve .js file as .ts, as .js file is missing', async () => {
    vi.spyOn(context, 'resolve').mockResolvedValueOnce(null);

    await expect(plugin.resolveId.apply(context, ['test.js', 'test', options]))
      .resolves.toEqual({
        id: 'test.ts',
        external: false,
        resolvedBy: 'test',
      });

    expect(context.resolve).toHaveBeenCalledWith('test.js', 'test', options);
    expect(context.resolve).toHaveBeenCalledWith('test.ts', 'test', options);
  });

  it('should resolve .jsx file as .tsx, as .jsx file is missing', async () => {
    vi.spyOn(context, 'resolve').mockResolvedValueOnce(null);

    await expect(plugin.resolveId.apply(context, ['test.jsx', 'test', options]))
      .resolves.toEqual({
        id: 'test.tsx',
        external: false,
        resolvedBy: 'test',
      });

    expect(context.resolve).toHaveBeenCalledWith('test.jsx', 'test', options);
    expect(context.resolve).toHaveBeenCalledWith('test.tsx', 'test', options);
  });
});