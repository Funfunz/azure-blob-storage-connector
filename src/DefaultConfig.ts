import { IEntityInfo } from '@funfunz/core/lib/generator/configurationTypes'

export const model = (options: Pick<IEntityInfo, 'name' | 'visible' | 'connector'>): IEntityInfo => ({
  ...options,
  properties: [
    {
      name: 'name',
      type: 'string',
      isPk: true,
      filterable: ['_eq'],
    },
    {
      name: 'createdOn',
      type: 'string',
      readOnly: true,
      filterable: false,
    },
    {
      name: 'lastModified',
      type: 'string',
      readOnly: true,
      filterable: false,
    },
    {
      name: 'contentLength',
      type: 'number',
      readOnly: true,
      filterable: false,
    },
    {
      name: 'contentType',
      type: 'string',
      readOnly: true,
      filterable: false,
    },
    {
      name: 'content',
      type: 'file',
      filterable: false,
    }
  ]
})