export interface IAzureBlobStorageOptions {
  connectionString: string
  containerName: string
}

export interface IBlobItem {
  name: string
  createdOn?: string
  lastModified?: string
  contentLength: number,
  contentType?: string
  content?: string
}