import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { PrimaryHealthCoverage } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const { primaryCaregiverUI } = definitions;

const primaryMedicalPage = {
  uiSchema: {
    'ui:description': PrimaryHealthCoverage({
      pageTitle: 'Health care coverage',
    }),
    [primaryCaregiverFields.medicaidEnrolled]:
      primaryCaregiverUI.medicaidEnrolledUI,
    [primaryCaregiverFields.medicareEnrolled]:
      primaryCaregiverUI.medicareEnrolledUI,
    [primaryCaregiverFields.tricareEnrolled]:
      primaryCaregiverUI.tricareEnrolledUI,
    [primaryCaregiverFields.champvaEnrolled]:
      primaryCaregiverUI.champvaEnrolledUI,
    [primaryCaregiverFields.otherHealthInsurance]:
      primaryCaregiverUI.otherHealthInsuranceUI,
    // optionally require
    [primaryCaregiverFields.otherHealthInsuranceName]:
      primaryCaregiverUI.otherHealthInsuranceNameUI,
  },
  schema: {
    type: 'object',
    required: [
      primaryCaregiverFields.medicaidEnrolled,
      primaryCaregiverFields.medicareEnrolled,
      primaryCaregiverFields.tricareEnrolled,
      primaryCaregiverFields.champvaEnrolled,
      primaryCaregiverFields.otherHealthInsurance,
    ],
    properties: {
      [primaryCaregiverFields.medicaidEnrolled]:
        primaryCaregiverProps.medicaidEnrolled,
      [primaryCaregiverFields.medicareEnrolled]:
        primaryCaregiverProps.medicareEnrolled,
      [primaryCaregiverFields.tricareEnrolled]:
        primaryCaregiverProps.tricareEnrolled,
      [primaryCaregiverFields.champvaEnrolled]:
        primaryCaregiverProps.champvaEnrolled,
      [primaryCaregiverFields.otherHealthInsurance]: {
        type: 'boolean',
      },
      [primaryCaregiverFields.otherHealthInsuranceName]:
        primaryCaregiverProps.otherHealthInsuranceName,
    },
  },
};

export default primaryMedicalPage;
