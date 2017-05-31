import _ from 'lodash/fp';
import { createSelector } from 'reselect';

import { states, vaMedicalFacilities } from '../../utils/options-for-select';
import { createUSAStateLabels } from '../helpers';

// Turns the facility list for each state into an array of strings
export const medicalCentersByState = _.mapValues((val) => {
  return val.map(center => center.value);
}, vaMedicalFacilities);

// Merges all the state facilities into one object with values as keys
// and labels as values
export const medicalCenterLabels = Object.keys(vaMedicalFacilities).reduce((labels, state) => {
  const stateLabels = vaMedicalFacilities[state].reduce((centers, center) => {
    return Object.assign(centers, {
      [center.value]: center.label
    });
  }, {});

  return Object.assign(labels, stateLabels);
}, {});

const stateLabels = createUSAStateLabels(states);

export function facilityUI(
  fieldName = 'vaMedicalFacility',
  label = 'Select your preferred VA medical facility',
  stateInputSelector = ({ formData }) => _.get('view:vaFacility.view:facilityState', formData)) {
  const stateSelector = createSelector(
    stateInputSelector,
    state => {
      if (state) {
        return {
          'enum': medicalCentersByState[state]
        };
      }

      return {
        'enum': []
      };
    }
  );

  return {
    'ui:title': label,
    'view:facilityState': {
      'ui:title': 'State',
      'ui:options': {
        labels: stateLabels
      }
    },
    [fieldName]: {
      'ui:title': 'Center/clinic',
      'ui:options': {
        labels: medicalCenterLabels,
        updateSchema: (formData, schema, uiSchema, index) => stateSelector({ formData, index })
      }
    }
  };
}

export function facilitySchema(field = 'vaMedicalFacility') {
  return {
    type: 'object',
    required: ['view:facilityState', field],
    properties: {
      'view:facilityState': {
        type: 'string',
        'enum': states.USA.map(state => state.value)
      },
      [field]: {
        type: 'string',
        'enum': []
      }
    }
  };
}
