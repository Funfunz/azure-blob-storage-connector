import Debug from 'debug'
import mime from 'mime'
import { v4 as uuid } from 'uuid'
import type { FileUpload } from 'graphql-upload'
import type { ICreateArgs, IQueryArgs, IRemoveArgs, IUpdateArgs, DataConnector, IDataConnector } from '@funfunz/core/lib/types/connector'
import {IAzureBlobStorageOptions, IBlobItem } from './types'

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'

const debug = Debug('funfunz:AzureBlobStorageConnector')


export class Connector implements DataConnector {
  public connection: ContainerClient
  // eslint-disable-next-line no-unused-vars
  constructor(connector: IDataConnector<IAzureBlobStorageOptions>) {
    this.connection = BlobServiceClient.fromConnectionString(
      connector.config.connectionString
    ).getContainerClient(connector.config.containerName)
    debug('Start')
    debug('connectionString', connector.config.connectionString)
    debug('End')
  }

  public async query(args: IQueryArgs): Promise<IBlobItem[] | number> {
    const prefix = (args?.filter?.name as { _eq: string })?._eq || ''
    const blobs = this.connection.listBlobsFlat({ prefix })
    const results: IBlobItem[] = []
    for await (const blob of blobs) {
      results.push({
        name: blob.name,
        createdOn: blob.properties.createdOn?.toISOString(),
        lastModified: blob.properties.lastModified?.toISOString(),
        contentLength: blob.properties.contentLength as number,
        contentType: blob.properties.contentType,
        content: `${this.connection.url}/${blob.name}`
      })
    }
    return args.count ? results.length : results
  }

  public async update(args: IUpdateArgs): Promise<IBlobItem[] | number> {
    const { createReadStream, mimetype } = await args.data.content as FileUpload
    const blobsFound = await this.query({ ...args, fields: args.fields || ['name'] }) as IBlobItem[]
    await Promise.all(blobsFound.map(({ name }) => {
      const blobClient = this.connection.getBlockBlobClient(name)
      return blobClient.uploadStream(createReadStream(), undefined, undefined, {
        blobHTTPHeaders: {
          blobContentType: mimetype
        }
      })
    }))
    return blobsFound 
  }

  public async create(args: ICreateArgs): Promise<IBlobItem[] | IBlobItem | number> {
    const { createReadStream, mimetype } = await args.data.content as FileUpload
    const blobName = `${uuid()}.${mime.getExtension(mimetype)}`
    const blobClient = this.connection.getBlockBlobClient(blobName)
    await blobClient.uploadStream(createReadStream(), undefined, undefined, {
      blobHTTPHeaders: {
        blobContentType: mimetype
      }
    })
    return await this.query({
      entityName: args.entityName,
      fields: args.fields || ['name', 'content', 'contentType'],
      filter: { name: { _eq: blobName }},
    }) 
  }

  public async remove(args: IRemoveArgs): Promise<number> {
    const blobsFound = await this.query({ ...args, fields: ['name'] }) as IBlobItem[]
    await Promise.all(blobsFound.map(({ name }) => {
      const blobClient = this.connection.getBlockBlobClient(name)
      return blobClient.delete()
    }))
    return blobsFound.length
  }
}