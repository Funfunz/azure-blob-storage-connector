export default {
  name: 'files',
  connector: 'azureBlobStorage',
  visible: true,
  properties: [
    {
      name: 'name',
      type: 'string',
      isPk: true,
    },
    {
      name: 'createdOn',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'lastModified',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'contentLength',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'contentType',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'content',
      type: 'file',
    }
  ]
}