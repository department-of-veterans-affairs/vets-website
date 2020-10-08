import {
  veteranStatusUI,
  requireServiceInfo,
  showVeteranInformation,
} from './veteranStatusUI';
import { veteranServiceInformationUI } from './veteranServiceInformationUI';
import { veteranInformationUI } from './veteranInformationUI';

import { schema } from 'platform/forms/definitions/address';
import fullSchema from '../../0873-schema.json';
import SectionHeader from '../../content/SectionHeader';

const { veteranStatus, veteranServiceInformation } = fullSchema.properties;

const formFields = {
  veteranStatus: 'veteranStatus',
  veteranInformation: 'veteranInformation',
  veteranServiceInformation: 'veteranServiceInformation',
};

const veteranInformationPage = {
  uiSchema: {
    [formFields.veteranStatus]: {
      'ui:description': SectionHeader(
        'How does a Veteran relate to your Question?',
      ),
      ...veteranStatusUI,
    },
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
            $ref: '#/definitions/first',
          },
          last: {
            $ref: '#/definitions/last',
          },
          address: schema(fullSchema),
          phone: {
            $ref: '#/definitions/phone',
          },
          email: {
            $ref: '#/definitions/email',
          },
        },
      },
      [formFields.veteranServiceInformation]: veteranServiceInformation,
    },
  },
};

export default veteranInformationPage;
