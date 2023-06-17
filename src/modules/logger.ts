import { Logger as TsLogger } from 'tslog';
import { ILogObjMeta } from 'tslog/dist/types/interfaces';

export class Logger extends TsLogger<unknown> {
  constructor(moduleName: string) {
    super({
      name: moduleName,
    });
  }

  info(...args: unknown[]): ILogObjMeta | undefined {
    if (process.env.ENV == 'dev') {
      return super.info(...args);
    }
  }
}
