import {
  veteranStatusUI,
  requireServiceInfo,
  showVeteranInformation,
} from './veteranStatusUI';
import { veteranServiceInformationUI } from './veteranServiceInformationUI';
import { veteranInformationUI } from './veteranInformationUI';

import { schema as addressSchema } from '../../contactInformation/address/address'
import fullSchema from '../../0873-schema.json';

const {
  veteranStatus,
  veteranServiceInformation,
} = fullSchema.properties;

const formFields = {
  veteranStatus: 'veteranStatus',
  veteranInformation: 'veteranInformation',
  veteranServiceInformation: 'veteranServiceInformation',
};

const veteranInformationPage = {
  uiSchema: {
    [formFields.veteranStatus]: veteranStatusUI,
    [formFields.veteranInformation]: {
      ...veteranInformationUI,
      'ui:options': {
        hideIf: formData =>
          !showVeteranInformation(formData.veteranStatus.veteranStatus),
      },
    },
    [formFields.veteranServiceInformation]: {
      ...veteranServiceInformationUI,
      'ui:options': {
        hideIf: formData =>
          !requireServiceInfo(formData.veteranStatus.veteranStatus),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [formFields.veteranStatus]: veteranStatus,
      [formFields.veteranInformation]: {
        type: 'object',
        properties: {
          first: {
            $ref: "#/definitions/first"
          },
          last: {
            $ref: "#/definitions/last"
          },
          address: addressSchema(fullSchema, false),
          phone: {
            "$ref": "#/definitions/phone"
          },
          email: {
            "$ref": "#/definitions/email"
          }
        }
      },
      [formFields.veteranServiceInformation]: veteranServiceInformation,
    },
  },
};

export default veteranInformationPage;
