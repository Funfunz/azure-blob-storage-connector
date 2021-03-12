import { Connector } from '../index'
import config from './configs/MCconfig'
import settings from './configs/MCsettings'
import { Funfunz } from '@funfunz/core'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

jest.mock('@funfunz/core', () => {
  return {
    Funfunz: function ({ config: configData, settings: settingsData }) {
      return {
        config: () => {
          console.log(configData, settingsData)
          return {
            config: configData,
            settings: settingsData
          }
        }
      }
    }
  }
})


const connector = new Connector(
  {
    type: 'azure-blob-storage',
    config: {
      connectionString: process.env.CONNECTION_STRING || '...',
      containerName: process.env.CONTAINER_NAME || '...'
    }
  },
  new Funfunz({
    config,
    settings: settings as any
  })
)

const mimetype = 'image/png'
const filename = 'soMouraSoJohn.png'
const entityName = 'files'
let generatedFilename = ''

describe('Azure Blog Storage Connector', () => {
  it('Upload a file', (done) => {
    connector.create({
      entityName,
      data: {
        file: {
          filename,
          createReadStream: () => {
            return fs.createReadStream(`${__dirname}/${filename}`)
          },
          mimetype
        }
      }
    }).then(
      (response) => {
        expect(Array.isArray(response)).toBeTruthy()
        const item = response[0]
        expect(item).toBeTruthy()
        expect(item.name).toBeTruthy()
        generatedFilename = item.name
        expect(item.contentLength).toBeGreaterThan(0)
        expect(item.createdOn).toBeTruthy()
        expect(item.contentType).toBe(mimetype)
        expect(item.content).toBeTruthy()
        done()
      }
    )
  })
  it('Update a file', (done) => {
    connector.update({
      filter: {
        name: {
          _eq: generatedFilename
        }
      },
      entityName,
      data: {
        file: {
          filename,
          createReadStream: () => {
            return fs.createReadStream(`${__dirname}/${filename}`)
          },
          mimetype
        }
      }
    }).then(
      (response) => {
        expect(Array.isArray(response)).toBeTruthy()
        const item = response[0]
        expect(item).toBeTruthy()
        expect(item.name).toBeTruthy()
        generatedFilename = item.name
        expect(item.contentLength).toBeGreaterThan(0)
        expect(item.createdOn).toBeTruthy()
        expect(item.contentType).toBe(mimetype)
        expect(item.content).toBeTruthy()
        done()
      }
    )
  })
  it('Query a file', (done) => {
    connector.query({
      entityName: 's3',
      filter: {
        name: {
          _eq: generatedFilename
        }
      },
      fields: ['name', 'content']
    }).then(
      (response) => {
         expect(Array.isArray(response)).toBeTruthy()
        const item = response[0]
        expect(item).toBeTruthy()
        expect(item.name).toBe(generatedFilename)
        generatedFilename = item.name
        expect(item.contentLength).toBeGreaterThan(0)
        expect(item.createdOn).toBeTruthy()
        expect(item.contentType).toBe(mimetype)
        expect(item.content).toBeTruthy()
        done()
      }
    )
  })
  it('Count files', (done) => {
    connector.query({
      entityName: 's3',
      count: true,
      fields: []
    }).then(
      (response) => {
        expect(typeof response === 'number').toBeTruthy()
        expect(response).toBeGreaterThan(0)
        done()
      }
    )
  })
  it('Delete a file', (done) => {
    connector.remove({
      entityName: 's3',
      filter: {
        name: {
          _eq: generatedFilename,
        },
      },
    }).then(
      (response) => {
        expect(typeof response === 'number').toBeTruthy()
        done()
      }
    )
  })
})
