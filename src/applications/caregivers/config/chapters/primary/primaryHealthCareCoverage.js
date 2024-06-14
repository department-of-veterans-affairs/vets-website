import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { primaryCaregiverFields } from '../../../definitions/constants';
import { HeathCareCoverageDescription } from '../../../components/FormDescriptions';
import PrimaryHealthCoverageDescription from '../../../components/FormDescriptions/PrimaryHealthCoverageDescription';
import CustomYesNoReviewField from '../../../components/FormReview/CustomYesNoReviewField';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;

const primaryMedicalPage = {
  uiSchema: {
    'ui:description': PrimaryHealthCoverageDescription({
      pageTitle: 'Health care coverage',
    }),
    [primaryCaregiverFields.hasHealthInsurance]: {
      'ui:title':
        'Does the Primary Family Caregiver applicant have health care coverage, such as Medicaid, Medicare, CHAMPVA, Tricare, or private insurance?',
      'ui:description': HeathCareCoverageDescription,
      'ui:reviewField': CustomYesNoReviewField,
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
