import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { ssnUI } from '../../../definitions/sharedUI';
import CaregiverSsnDescription from '../../../components/FormDescriptions/CaregiverSsnDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { ssn } = FULL_SCHEMA.definitions;
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
