import { veteranStatusUI, requireServiceInfo } from './veteranStatusUI';
import { veteranInformationUI } from './veteranInformationUI';
import fullSchema from '../../0873-schema.json';

const { veteranStatus, veteranInformation } = fullSchema.properties;

const formFields = {
  veteranStatus: 'veteranStatus',
  veteranInformation: 'veteranInformation',
};

const veteranInformationPage = {
  uiSchema: {
    [formFields.veteranStatus]: veteranStatusUI,
    [formFields.veteranInformation]: {
      ...veteranInformationUI,
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
    },
  },
};

export default veteranInformationPage;
