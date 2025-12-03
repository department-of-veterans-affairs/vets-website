import VeteranInformation from '../components/VeteranInformation';
import ConfirmationVeteranInformation from '../components/confirmationFields/ConfirmationVeteranInformation';

const veteranInformation = {
  uiSchema: {
    'ui:description': VeteranInformation,
    'ui:options': {
      hideOnReview: true,
    },
    'ui:confirmationField': ConfirmationVeteranInformation,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default veteranInformation;
