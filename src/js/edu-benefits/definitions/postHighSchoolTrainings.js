import EducationView from '../components/EducationView';
import { uiSchema as uiSchemaDateRange } from '../../common/schemaform/definitions/dateRange';

import {
  hoursTypeLabels,
  stateLabels
} from '../utils/helpers';

const uiSchema = {
  'ui:title': 'Education after high school',
  'ui:description': 'Please list any courses or training programs you took after you graduated from high school.',
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
      'ui:title': 'What did you study?'
    }
  }
};

export default uiSchema;
