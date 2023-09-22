import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { primaryCaregiverFields } from '../../../definitions/constants';
import { hasHealthInsurance } from '../../../definitions/UIDefinitions/caregiverUI';
import PrimaryHealthCoverageDescription from '../../../components/FormDescriptions/PrimaryHealthCoverageDescription';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;

const primaryMedicalPage = {
  uiSchema: {
    'ui:description': PrimaryHealthCoverageDescription({
      pageTitle: 'Health care coverage',
    }),
    [primaryCaregiverFields.hasHealthInsurance]: hasHealthInsurance,
  },
  schema: {
    type: 'object',
    required: [primaryCaregiverFields.hasHealthInsurance],
    properties: {
      [primaryCaregiverFields.hasHealthInsurance]:
        primaryCaregiverProps.hasHealthInsurance,
    },
  },
};

export default primaryMedicalPage;
