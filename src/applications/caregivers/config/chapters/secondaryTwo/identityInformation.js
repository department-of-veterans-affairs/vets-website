// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from '../../../definitions/sharedUI';
import CaregiverSsnDescription from '../../../components/FormDescriptions/CaregiverSsnDescription';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

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
