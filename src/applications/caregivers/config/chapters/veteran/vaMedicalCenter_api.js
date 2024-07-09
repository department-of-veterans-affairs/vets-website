// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PreferredFacilityApiDescription from '../../../components/FormDescriptions/PreferrerdFacilityApiDescription';
import FacilitySearch from '../../../components/FormFields/FacilitySearch';
import content from '../../../locales/en/content.json';
import fullSchema from '../../10-10CG-schema.json';

const { veteran } = fullSchema.properties;
const { plannedClinic } = veteran.properties;

const vaMedicalCenterApi = {
  uiSchema: {
    ...titleUI(
      content['vet-info-title--facility'],
      PreferredFacilityApiDescription,
    ),
    veteranPlannedClinic: {
      'ui:widget': FacilitySearch,
      'ui:options': {
        hideLabelText: true,
      },
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranPlannedClinic: plannedClinic,
    },
  },
};

export default vaMedicalCenterApi;
