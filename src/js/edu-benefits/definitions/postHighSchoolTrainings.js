import _ from 'lodash/fp';

import EducationView from '../components/EducationView';
import { uiSchema as uiSchemaDateRange } from '../../common/schemaform/definitions/dateRange';
import { states } from '../../common/utils/options-for-select';

import {
  hoursTypeLabels,
} from '../utils/helpers';

const stateLabels = states.USA.reduce((current, { label, value }) => {
  return _.merge(current, { [value]: label });
}, {});

const uiSchema = {
  'ui:title': 'Education after high school',
  'ui:description': 'Please list any post-high school trainings you have completed.',
  'ui:options': {
    itemName: 'Training',
    viewField: EducationView,
    hideTitle: true
  },
  items: {
    name: {
      'ui:title': 'Name of college, university or other training provider'
    },
    city: {
      'ui:title': 'City'
    },
    state: {
      'ui:title': 'State',
      'ui:options': {
        labels: stateLabels
      }
    },
    dateRange: uiSchemaDateRange(
      'From',
      'To'
    ),
    hours: {
      'ui:title': 'Hours completed'
    },
    hoursType: {
      'ui:title': 'Type of hours',
      'ui:options': {
        labels: hoursTypeLabels
      }
    },
    degreeReceived: {
      'ui:title': 'Degree, diploma or certificate received'
    },
    major: {
      'ui:title': 'Major or course of study (NOT for high school)'
    }
  }
};

export default uiSchema;
