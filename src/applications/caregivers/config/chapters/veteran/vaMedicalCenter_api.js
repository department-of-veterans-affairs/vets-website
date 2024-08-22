import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PreferredFacilityApiDescription from '../../../components/FormDescriptions/PreferredFacilityApiDescription';
import FacilitySearch from '../../../components/FormFields/FacilitySearch';
import { validatePlannedClinic } from '../../../utils/validation';
import content from '../../../locales/en/content.json';

const vaMedicalCenterApi = {
  uiSchema: {
    ...titleUI(
      content['vet-info-title--facility'],
      PreferredFacilityApiDescription,
    ),
    'view:plannedClinic': {
      'ui:field': FacilitySearch,
      'ui:validations': [validatePlannedClinic],
      'ui:options': {
        hideLabelText: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:plannedClinic': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default vaMedicalCenterApi;
