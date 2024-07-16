import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from '../../../definitions/sharedUI';
import fullSchema from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { ssn } = fullSchema.definitions;
const inputLabel = content['vet-input-label'];

const veteranIdentityInformation = {
  uiSchema: {
    ...titleUI(content['vet-info-title--id']),
    veteranSsnOrTin: ssnUI({ label: inputLabel, type: 'ssn' }),
  },
  schema: {
    type: 'object',
    required: ['veteranSsnOrTin'],
    properties: {
      veteranSsnOrTin: ssn,
    },
  },
};

export default veteranIdentityInformation;
