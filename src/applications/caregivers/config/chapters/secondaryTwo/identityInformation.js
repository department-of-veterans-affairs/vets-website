import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from '../../../definitions/sharedUI';
import CaregiverSsnDescription from '../../../components/FormDescriptions/CaregiverSsnDescription';
import { fullSchema } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { ssn } = fullSchema.definitions;
const inputLabel = content['secondary-two-input-label'];

const secondaryTwoIdentityInformation = {
  uiSchema: {
    ...titleUI(
      content['secondary-two-info-title--id'],
      CaregiverSsnDescription,
    ),
    secondaryTwoSsnOrTin: ssnUI({ label: inputLabel, type: 'ssntin' }),
  },
  schema: {
    type: 'object',
    properties: {
      secondaryTwoSsnOrTin: ssn,
    },
  },
};

export default secondaryTwoIdentityInformation;
