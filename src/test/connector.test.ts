import { Connector } from '../index'
import config from './configs/MCconfig'
import settings from './configs/MCsettings'
import { Funfunz } from '@funfunz/core'

jest.mock('@funfunz/core', () => {
  return {
    Funfunz: function ({config: configData, settings: settingsData}) {
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
      connectionString: '...'
    }
  },
  new Funfunz({
    config,
    settings: settings as any
  })
)

describe('Azure Blog Storage Connector', () => {
  
})
