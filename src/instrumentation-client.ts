// oxlint-disable import/namespace
// This file exposes Sentry router instrumentation hooks without initializing Sentry.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
