import Debug from 'debug'
import { Funfunz } from '@funfunz/core'
import type { ICreateArgs, IQueryArgs, IRemoveArgs, IUpdateArgs, DataConnector, IDataConnector } from '@funfunz/core/lib/types/connector'
import { IAzureBlobStorageOptions } from './types'

const debug = Debug('funfunz:AzureBlobStorageConnector')

export class Connector implements DataConnector{
  private funfunz: Funfunz
  public connection: IAzureBlobStorageOptions
  constructor(connector: IDataConnector, funfunz: Funfunz) {
    this.funfunz = funfunz
    this.connection = connector.config as IAzureBlobStorageOptions
    debug('Start')
    Object.keys(connector).forEach(
      (key) => {
        debug(key, (connector)[key])
      }
    )
    debug('End')
  }

  public query(args: IQueryArgs): Promise<Record<string, unknown>[] | number> {
    console.log(args)
    return Promise.resolve([])
  }

  public update(args: IUpdateArgs): Promise<Record<string, unknown>[] | number> {
    console.log(args)
    return Promise.resolve([])
  }

  public create(args: ICreateArgs): Promise<Record<string, unknown>[] | Record<string, unknown> | number> {
    console.log(args)
    return Promise.resolve([])
  }

  public remove(args: IRemoveArgs): Promise<number> {
    console.log(args)
    return Promise.resolve(0)
  }
}