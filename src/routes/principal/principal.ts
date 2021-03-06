import { notFound } from '../../common/xBuild';
import { setMultistatusResponse, setOptions } from '../../common/response';
import winston from '../../common/winston';
import { CalDavOptionsModule } from '../..';
import { CalendarContext } from '../../koa';

import routePropfind from './propfind';
// import routeReport from './report';

export default function(opts: CalDavOptionsModule) {
  const log = winston({ ...opts, label: 'principal' });
  const methods = {
    propfind: routePropfind(opts),
    // report: reportReport(opts)
  };

  return async function(ctx: CalendarContext) {
    const method = ctx.method.toLowerCase();
    setMultistatusResponse(ctx);

    if (method === 'options') {
      setOptions(ctx, ['OPTIONS', 'PROPFIND']);
      return;
    }
    if (!methods[method]) {
      log.warn(`method handler not found: ${method}`);
      ctx.body = notFound(ctx.url);
      return;
    }

    ctx.body = await methods[method](ctx);
  };
}
