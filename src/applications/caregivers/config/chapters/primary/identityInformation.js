import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { ssnUI } from '../../../definitions/sharedUI';
import CaregiverSsnDescription from '../../../components/FormDescriptions/CaregiverSsnDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { ssn } = FULL_SCHEMA.definitions;
const inputLabel = content['primary-input-label'];

const primaryIdentityInformation = {
  uiSchema: {
    ...titleUI(content['primary-info-title--id'], CaregiverSsnDescription),
    primarySsnOrTin: ssnUI({ label: inputLabel, type: 'ssntin' }),
  },
  schema: {
    type: 'object',
    properties: {
      primarySsnOrTin: ssn,
    },
  },
};

export default primaryIdentityInformation;
