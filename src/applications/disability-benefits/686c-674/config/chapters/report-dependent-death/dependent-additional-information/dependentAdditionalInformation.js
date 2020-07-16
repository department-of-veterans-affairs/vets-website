import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import {
  isChapterFieldRequired,
  stateTitle,
  cityTitle,
} from '../../../helpers';
import { deceasedDependents } from '../../../utilities';
import DependentViewField from '../../../../components/DependentViewField';
import { DependentNameHeader } from './helpers';

export const schema =
  deceasedDependents.properties.dependentAdditionalInformation;

export const uiSchema = {
  deaths: {
    'ui:options': { viewField: DependentViewField },
    items: {
      'ui:title': DependentNameHeader,
      date: {
        ...currentOrPastDateUI('Date of death'),
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
      },
      location: {
        'ui:title': 'Place of death',
        city: {
          'ui:title': cityTitle,
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
        state: {
          'ui:title': stateTitle,
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
      },
    },
  },
};
