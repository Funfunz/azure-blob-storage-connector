import { BlobItem, BlobServiceClient } from '@azure/storage-blob'
import dotenv from 'dotenv'

dotenv.config()

const { 
  CONNECTION_STRING,
  CONTAINER_NAME,
} = process.env as Record<string, string>

const blobServiceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING)

async function createContainer(containerName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const createContainerResponse = await containerClient.create()
  console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId)
  return createContainerResponse
}

async function listContainers() {
  let i = 1
  const containers = blobServiceClient.listContainers()
  for await (const container of containers) {
    console.log(`Container ${i++}: ${container.name}`)
  }
  return containers
}

async function uploadBlob(containerName: string, blobName: string, content: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  const uploadBlobResponse = await blockBlobClient.upload(content, content.length)
  console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId)
  return uploadBlobResponse
}

async function listBlobs(containerName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blobs = containerClient.listBlobsFlat()
  const results: BlobItem[] = []
  for await (const blob of blobs) {
    results.push(blob)
  }
  console.log(results)
  return results
}

async function downloadBlob(containerName: string, blobName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blobClient = containerClient.getBlobClient(blobName)

  const downloadBlockBlobResponse = await blobClient.download()
  if (downloadBlockBlobResponse.readableStreamBody) {
    const readableStream = downloadBlockBlobResponse.readableStreamBody
    const downloaded = await (new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data))
      })
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      readableStream.on('error', reject)
    })) as Buffer
    console.log(`Downloaded blob content: ${downloaded}`)
    return downloaded.toString()
  }
}


async function main() {
  //await createContainer(CONTAINER_NAME)
  //await listContainers()
  //const blobName = `blob-${new Date().getTime()}`
  //const content = 'Hello world'
  //await uploadBlob(CONTAINER_NAME, blobName, content)
  //listBlobs(CONTAINER_NAME)
  //downloadBlob(CONTAINER_NAME, 'blob-1615392268568')
}

main()
