// OVERRIDES
// hard-coded here because build process doesn't pick up overrides from separate files
import '@hey-api/codegen-core';
import '@hey-api/shared';

declare module '@hey-api/codegen-core' {
  interface ProjectMeta {
    /**
     * If specified, this will be the file extension used when importing
     * other modules. By default, we don't add a file extension and let the
     * runtime resolve it.
     *
     * @default null
     */
    importFileExtension?: AnyString | null;
  }

  interface SymbolMeta {
    artifact?:
      | 'angular'
      | 'arktype'
      | 'fastify'
      | 'json-schema'
      | 'msw'
      | 'sdk'
      | 'typescript'
      | 'valibot'
      | 'zod'
      | AnyString;
    category?:
      | 'client'
      | 'external'
      | 'hook'
      | 'schema'
      | 'sdk'
      | 'transform'
      | 'type'
      | 'utility'
      | AnyString;
    /** Path to the resource this symbol represents. */
    path?: ReadonlyArray<string | number>;
    /** Name of the plugin that registered this symbol. */
    plugin?: string;
    resource?: 'client' | 'definition' | 'operation' | 'webhook' | AnyString;
    resourceId?: string;
    role?: 'data' | 'error' | 'errors' | 'options' | 'response' | 'responses' | AnyString;
    /** Tags associated with this symbol. */
    tags?: ReadonlyArray<string>;
    variant?: 'container' | AnyString;
  }
}

declare module '@hey-api/shared' {
  interface PluginConfigMap {
    '@angular/common': AngularCommonPlugin['Types'];
    '@faker-js/faker': FakerJsFakerPlugin['Types'];
    '@hey-api/client-angular': HeyApiClientAngularPlugin['Types'];
    '@hey-api/client-axios': HeyApiClientAxiosPlugin['Types'];
    '@hey-api/client-fetch': HeyApiClientFetchPlugin['Types'];
    '@hey-api/client-ky': HeyApiClientKyPlugin['Types'];
    '@hey-api/client-next': HeyApiClientNextPlugin['Types'];
    '@hey-api/client-nuxt': HeyApiClientNuxtPlugin['Types'];
    '@hey-api/client-ofetch': HeyApiClientOfetchPlugin['Types'];
    '@hey-api/examples': HeyApiExamplesPlugin['Types'];
    '@hey-api/schemas': HeyApiSchemasPlugin['Types'];
    '@hey-api/sdk': HeyApiSdkPlugin['Types'];
    '@hey-api/transformers': HeyApiTransformersPlugin['Types'];
    '@hey-api/typescript': HeyApiTypeScriptPlugin['Types'];
    '@pinia/colada': PiniaColadaPlugin['Types'];
    '@tanstack/angular-query-experimental': TanStackAngularQueryPlugin['Types'];
    '@tanstack/preact-query': TanStackPreactQueryPlugin['Types'];
    '@tanstack/react-query': TanStackReactQueryPlugin['Types'];
    '@tanstack/solid-query': TanStackSolidQueryPlugin['Types'];
    '@tanstack/svelte-query': TanStackSvelteQueryPlugin['Types'];
    '@tanstack/vue-query': TanStackVueQueryPlugin['Types'];
    arktype: ArktypePlugin['Types'];
    fastify: FastifyPlugin['Types'];
    msw: MswPlugin['Types'];
    nestjs: NestJsPlugin['Types'];
    orpc: OrpcPlugin['Types'];
    swr: SwrPlugin['Types'];
    valibot: ValibotPlugin['Types'];
    zod: ZodPlugin['Types'];
  }

  interface PluginInstanceTypes {
    Node: TsDsl;
  }
}
// END OVERRIDES

import type { AnyString, LazyOrAsync, MaybeArray } from '@hey-api/types';

import type { UserConfig } from './config/types';
import type { AngularCommonPlugin } from './plugins/@angular/common/types';
import type { FakerJsFakerPlugin } from './plugins/@faker-js/faker/types';
import type { HeyApiClientAngularPlugin } from './plugins/@hey-api/client-angular/types';
import type { HeyApiClientAxiosPlugin } from './plugins/@hey-api/client-axios/types';
import type { HeyApiClientFetchPlugin } from './plugins/@hey-api/client-fetch/types';
import type { HeyApiClientKyPlugin } from './plugins/@hey-api/client-ky/types';
import type { HeyApiClientNextPlugin } from './plugins/@hey-api/client-next/types';
import type { HeyApiClientNuxtPlugin } from './plugins/@hey-api/client-nuxt/types';
import type { HeyApiClientOfetchPlugin } from './plugins/@hey-api/client-ofetch/types';
import type { HeyApiExamplesPlugin } from './plugins/@hey-api/examples/types';
import type { HeyApiSchemasPlugin } from './plugins/@hey-api/schemas/types';
import type { HeyApiSdkPlugin } from './plugins/@hey-api/sdk/types';
import type { HeyApiTransformersPlugin } from './plugins/@hey-api/transformers/types';
import type { HeyApiTypeScriptPlugin } from './plugins/@hey-api/typescript/types';
import type { PiniaColadaPlugin } from './plugins/@pinia/colada/types';
import type { TanStackAngularQueryPlugin } from './plugins/@tanstack/angular-query-experimental/types';
import type { TanStackPreactQueryPlugin } from './plugins/@tanstack/preact-query/types';
import type { TanStackReactQueryPlugin } from './plugins/@tanstack/react-query/types';
import type { TanStackSolidQueryPlugin } from './plugins/@tanstack/solid-query/types';
import type { TanStackSvelteQueryPlugin } from './plugins/@tanstack/svelte-query/types';
import type { TanStackVueQueryPlugin } from './plugins/@tanstack/vue-query/types';
import type { ArktypePlugin } from './plugins/arktype/types';
import type { FastifyPlugin } from './plugins/fastify/types';
import type { MswPlugin } from './plugins/msw/types';
import type { NestJsPlugin } from './plugins/nestjs/types';
import type { OrpcPlugin } from './plugins/orpc/types';
import type { SwrPlugin } from './plugins/swr/types';
import type { ValibotPlugin } from './plugins/valibot/types';
import type { ZodPlugin } from './plugins/zod/types';
import type { TsDsl } from './ts-dsl';

/**
 * Type helper for configuration object, returns {@link MaybeArray<UserConfig>} object(s)
 */
export function defineConfig(
  config: LazyOrAsync<ReadonlyArray<UserConfig>>,
): Promise<ReadonlyArray<UserConfig>>;
export function defineConfig(config: LazyOrAsync<UserConfig>): Promise<UserConfig>;
export async function defineConfig<T extends MaybeArray<UserConfig>>(
  config: LazyOrAsync<T>,
): Promise<T> {
  return typeof config === 'function' ? await config() : config;
}

export type { UserConfig } from './config/types';
