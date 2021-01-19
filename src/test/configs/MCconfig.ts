const config = {
  connectors: {
    mainDatabase: {
      type: "@funfunz/azure-blob-storage-connector",
      config: {
        connectionString: '...'
      },
    }
  }
}
export default config