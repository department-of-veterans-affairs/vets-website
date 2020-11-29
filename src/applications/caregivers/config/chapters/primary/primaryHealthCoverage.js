import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

import { PrimaryHealthCoverage } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;

const primaryMedicalPage = {
  uiSchema: {
    'ui:description': PrimaryHealthCoverage({
      pageTitle: 'Health care coverage',
    }),
    [primaryCaregiverFields.hasHealthInsurance]: {
      'ui:title':
        'Does the Primary Family Caregiver applicant have health care coverage, such as Medicaid, Medicare, CHAMPVA, Tricare, or private insurance?',
      'ui:widget': 'yesNo',
    },
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
