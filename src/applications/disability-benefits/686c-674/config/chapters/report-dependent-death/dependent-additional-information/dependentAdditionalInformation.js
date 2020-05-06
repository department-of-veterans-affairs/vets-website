import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
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
      date: currentOrPastDateUI('Dependent’s date of death'),
      location: {
        'ui:title': 'Place of death',
        city: {
          'ui:title': 'City or county',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
        state: {
          'ui:title': 'State (or Country if outside the USA)',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
      },
    },
  },
};
