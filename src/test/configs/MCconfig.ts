const config = {
  connectors: {
    azureBlobStorage: {
      type: "@funfunz/azure-blob-storage-connector",
      config: {
        connectionString: process.env.CONNECTION_STRING,
        containerName: process.env.CONTAINER_NAME
      },
    }
  }
}
export default config