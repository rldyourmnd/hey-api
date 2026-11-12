import type { AngularCommonPlugin } from './plugins/@angular/common';
import type { FakerJsFakerPlugin, FakerJsFakerResolvers } from './plugins/@faker-js/faker';
import type {
  AngularClient as AngularClientImp,
  HeyApiClientAngularPlugin,
} from './plugins/@hey-api/client-angular';
import type {
  AxiosClient as AxiosClientImp,
  HeyApiClientAxiosPlugin,
} from './plugins/@hey-api/client-axios';
import type {
  FetchClient as FetchClientImp,
  HeyApiClientFetchPlugin,
} from './plugins/@hey-api/client-fetch';
import type { HeyApiClientKyPlugin, KyClient as KyClientImp } from './plugins/@hey-api/client-ky';
import type {
  HeyApiClientNextPlugin,
  NextClient as NextClientImp,
} from './plugins/@hey-api/client-next';
import type {
  HeyApiClientNuxtPlugin,
  NuxtClient as NuxtClientImp,
} from './plugins/@hey-api/client-nuxt';
import type {
  HeyApiClientOfetchPlugin,
  OfetchClient as OfetchClientImp,
} from './plugins/@hey-api/client-ofetch';
import type { HeyApiExamplesPlugin } from './plugins/@hey-api/examples';
import type { HeyApiSchemasPlugin } from './plugins/@hey-api/schemas';
import type { HeyApiSdkPlugin } from './plugins/@hey-api/sdk';
import type { HeyApiTransformersPlugin } from './plugins/@hey-api/transformers';
import type {
  HeyApiTypeScriptPlugin,
  HeyApiTypeScriptResolvers,
} from './plugins/@hey-api/typescript';
import type { PiniaColadaPlugin } from './plugins/@pinia/colada';
import type { TanStackAngularQueryPlugin } from './plugins/@tanstack/angular-query-experimental';
import type { TanStackPreactQueryPlugin } from './plugins/@tanstack/preact-query';
import type { TanStackReactQueryPlugin } from './plugins/@tanstack/react-query';
import type { TanStackSolidQueryPlugin } from './plugins/@tanstack/solid-query';
import type { TanStackSvelteQueryPlugin } from './plugins/@tanstack/svelte-query';
import type { TanStackVueQueryPlugin } from './plugins/@tanstack/vue-query';
import type { ArktypePlugin } from './plugins/arktype';
import type { FastifyPlugin } from './plugins/fastify';
import type { MswPlugin } from './plugins/msw';
import type { NestJsPlugin } from './plugins/nestjs';
import type { OrpcPlugin } from './plugins/orpc';
import type { SwrPlugin } from './plugins/swr';
import type { ValibotPlugin, ValibotResolvers } from './plugins/valibot';
import type { ZodPlugin, ZodResolvers } from './plugins/zod';

export { defineConfig } from './config';
export type { UserConfig } from './config/types';
export { createClient } from './generate';
export * as plugins from './plugins';
export { clientDefaultConfig, clientDefaultMeta } from './plugins/@hey-api/client-core/config';
export { clientPluginHandler } from './plugins/@hey-api/client-core/plugin';
export type { Client } from './plugins/@hey-api/client-core/types';
export type { ExpressionTransformer, TypeTransformer } from './plugins/@hey-api/transformers/types';
export { defaultPlugins } from './plugins/config';
export * from './ts-dsl';
export { Logger } from '@hey-api/codegen-core';
export type {
  AnyPluginName,
  Coercer,
  CoercerMap,
  ConfigTable,
  DefinePlugin,
  IR,
  OpenApi,
  OpenApiMetaObject,
  OpenApiOperationObject,
  OpenApiParameterObject,
  OpenApiRequestBodyObject,
  OpenApiResponseObject,
  OpenApiSchemaObject,
  Plugin,
  PluginContext,
  PluginInstance,
  TableDirectives,
} from '@hey-api/shared';
export {
  applyNaming,
  coerce,
  defaultPaginationKeywords,
  defineConfig as defineConfigTable,
  definePluginConfig,
  OperationPath,
  OperationStrategy,
  toCase,
  utils,
} from '@hey-api/shared';

export namespace Plugins {
  export namespace AngularCommon {
    export type Types = AngularCommonPlugin;
  }

  export namespace Arktype {
    export type Types = ArktypePlugin;
  }

  export namespace FakerJsFaker {
    export type Resolvers = Required<FakerJsFakerResolvers>['$resolvers'];
    export type Types = FakerJsFakerPlugin;
  }

  export namespace Fastify {
    export type Types = FastifyPlugin;
  }

  export namespace HeyApiClientAngular {
    export type Client = AngularClientImp;
    export type Types = HeyApiClientAngularPlugin;
  }

  export namespace HeyApiClientAxios {
    export type Client = AxiosClientImp;
    export type Types = HeyApiClientAxiosPlugin;
  }

  export namespace HeyApiClientFetch {
    export type Client = FetchClientImp;
    export type Types = HeyApiClientFetchPlugin;
  }

  export namespace HeyApiClientKy {
    export type Client = KyClientImp;
    export type Types = HeyApiClientKyPlugin;
  }

  export namespace HeyApiClientNext {
    export type Client = NextClientImp;
    export type Types = HeyApiClientNextPlugin;
  }

  export namespace HeyApiClientNuxt {
    export type Client = NuxtClientImp;
    export type Types = HeyApiClientNuxtPlugin;
  }

  export namespace HeyApiClientOfetch {
    export type Client = OfetchClientImp;
    export type Types = HeyApiClientOfetchPlugin;
  }

  export namespace HeyApiExamples {
    export type Types = HeyApiExamplesPlugin;
  }

  export namespace HeyApiSchemas {
    export type Types = HeyApiSchemasPlugin;
  }

  export namespace HeyApiSdk {
    export type Types = HeyApiSdkPlugin;
  }

  export namespace HeyApiTransformers {
    export type Types = HeyApiTransformersPlugin;
  }

  export namespace HeyApiTypeScript {
    export type Resolvers = Required<HeyApiTypeScriptResolvers>['$resolvers'];
    export type Types = HeyApiTypeScriptPlugin;
  }

  export namespace Msw {
    export type Types = MswPlugin;
  }

  export namespace NestJs {
    export type Types = NestJsPlugin;
  }

  export namespace Orpc {
    export type Types = OrpcPlugin;
  }

  export namespace PiniaColada {
    export type Types = PiniaColadaPlugin;
  }

  export namespace Swr {
    export type Types = SwrPlugin;
  }

  export namespace TanStackAngularQuery {
    export type Types = TanStackAngularQueryPlugin;
  }

  export namespace TanStackPreactQuery {
    export type Types = TanStackPreactQueryPlugin;
  }

  export namespace TanStackReactQuery {
    export type Types = TanStackReactQueryPlugin;
  }

  export namespace TanStackSolidQuery {
    export type Types = TanStackSolidQueryPlugin;
  }

  export namespace TanStackSvelteQuery {
    export type Types = TanStackSvelteQueryPlugin;
  }

  export namespace TanStackVueQuery {
    export type Types = TanStackVueQueryPlugin;
  }

  export namespace Valibot {
    export type Resolvers = Required<ValibotResolvers>['$resolvers'];
    export type Types = ValibotPlugin;
  }

  export namespace Zod {
    export type Resolvers = Required<ZodResolvers>['$resolvers'];
    export type Types = ZodPlugin;
  }
}

// DEPRECATED
/** @deprecated Use `Plugins.HeyApiClientAngular.Client` instead. */
export type AngularClient = AngularClientImp;
/** @deprecated Use `Plugins.HeyApiClientAxios.Client` instead. */
export type AxiosClient = AxiosClientImp;
/** @deprecated Use `Plugins.HeyApiClientFetch.Client` instead. */
export type FetchClient = FetchClientImp;
/** @deprecated Use `Plugins.HeyApiClientKy.Client` instead. */
export type KyClient = KyClientImp;
/** @deprecated Use `Plugins.HeyApiClientNext.Client` instead. */
export type NextClient = NextClientImp;
/** @deprecated Use `Plugins.HeyApiClientNuxt.Client` instead. */
export type NuxtClient = NuxtClientImp;
/** @deprecated Use `Plugins.HeyApiClientOfetch.Client` instead. */
export type OfetchClient = OfetchClientImp;
