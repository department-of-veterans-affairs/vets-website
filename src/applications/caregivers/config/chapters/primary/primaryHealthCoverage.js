import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { PrimaryHealthCoverage } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { hasHealthInsurance } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;

const primaryMedicalPage = {
  uiSchema: {
    'ui:description': PrimaryHealthCoverage({
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
