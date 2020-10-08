import {
  veteranStatusUI,
  requireServiceInfo,
  showVeteranInformation,
} from './veteranStatusUI';
import { veteranServiceInformationUI } from './veteranServiceInformationUI';
import { veteranInformationUI } from './veteranInformationUI';
import fullSchema from '../../0873-schema.json';

const {
  veteranStatus,
  veteranInformation,
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
      [formFields.veteranInformation]: veteranInformation,
      [formFields.veteranServiceInformation]: veteranServiceInformation,
    },
  },
};

export default veteranInformationPage;
