import {
  titleUI,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import {
  MED_CENTER_LABELS,
  MED_CENTERS_BY_STATE,
  setPlannedClinics,
} from '../../../utils/helpers';
import { fullSchema } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { veteran } = fullSchema.properties;
const { plannedClinic } = veteran.properties;

const STATE_LABELS = createUSAStateLabels(states);

const vaMedicalCenterJson = {
  uiSchema: {
    ...titleUI(
      content['vet-info-title--facility'],
      content['vet-med-center-description'],
    ),
    'view:plannedClinicState': selectUI({
      title: content['form-address-state-label'],
      hint: content['vet-med-center-state-hint'],
      labels: STATE_LABELS,
    }),
    veteranPlannedClinic: selectUI({
      title: content['vet-info-title--facility'],
      labels: MED_CENTER_LABELS,
      updateSchema: setPlannedClinics,
    }),
  },
  schema: {
    type: 'object',
    required: ['view:plannedClinicState', 'veteranPlannedClinic'],
    properties: {
      'view:plannedClinicState': {
        type: 'string',
        enum: states.USA.map(state => state.value).filter(
          state => !!MED_CENTERS_BY_STATE[state],
        ),
      },
      veteranPlannedClinic: { ...plannedClinic, enum: [] },
    },
  },
};

export default vaMedicalCenterJson;
