import type { Symbol, SymbolMeta } from '@hey-api/codegen-core';

import type { ZodPlugin } from '../types';

// Per-generation aliases stay separate from the symbol registry's conjunctive index.
const references = new WeakMap<ZodPlugin['Instance'], Map<string, Symbol>>();

function operationKey(meta: SymbolMeta): string | undefined {
  if (
    meta.resource !== 'operation' ||
    typeof meta.resourceId !== 'string' ||
    typeof meta.role !== 'string'
  )
    return;
  return JSON.stringify([meta.resourceId, meta.role]);
}

export function rememberOperationReference(
  plugin: ZodPlugin['Instance'],
  meta: SymbolMeta,
  symbol: Symbol,
): boolean {
  const key = operationKey(meta);
  if (key === undefined) return false;
  let values = references.get(plugin);
  if (!values) {
    values = new Map();
    references.set(plugin, values);
  }
  values.set(key, symbol.canonical);
  return true;
}

export function queryOperationSchema(
  plugin: ZodPlugin['Instance'],
  meta: SymbolMeta,
): Symbol | undefined {
  const key = operationKey(meta);
  return (
    (key === undefined ? undefined : references.get(plugin)?.get(key)) ?? plugin.querySymbol(meta)
  );
}
