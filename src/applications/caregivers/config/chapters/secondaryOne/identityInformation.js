import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from '../../../definitions/sharedUI';
import CaregiverSsnDescription from '../../../components/FormDescriptions/CaregiverSsnDescription';
import { fullSchema } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { ssn } = fullSchema.definitions;
const inputLabel = content['secondary-one-input-label'];

const secondaryOneIdentityInformation = {
  uiSchema: {
    ...titleUI(
      content['secondary-one-info-title--id'],
      CaregiverSsnDescription,
    ),
    secondaryOneSsnOrTin: ssnUI({ label: inputLabel, type: 'ssntin' }),
  },
  schema: {
    type: 'object',
    properties: {
      secondaryOneSsnOrTin: ssn,
    },
  },
};

export default secondaryOneIdentityInformation;
