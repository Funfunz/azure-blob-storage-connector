import Debug from 'debug'
import { Funfunz } from '@funfunz/core'
import type { ICreateArgs, IQueryArgs, IRemoveArgs, IUpdateArgs, DataConnector, IDataConnector } from '@funfunz/core/lib/types/connector'
import { IAzureBlobStorageOptions } from './types'

import { BlobServiceClient } from '@azure/storage-blob'

const debug = Debug('funfunz:AzureBlobStorageConnector')

export class Connector implements DataConnector{
  private funfunz: Funfunz
  public connection: BlobServiceClient
  constructor(connector: IDataConnector<IAzureBlobStorageOptions>, funfunz: Funfunz) {
    this.funfunz = funfunz
    this.connection = BlobServiceClient.fromConnectionString(connector.config.connectionString)
    debug('Start')
    debug('connectionString', connector.config.connectionString)
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