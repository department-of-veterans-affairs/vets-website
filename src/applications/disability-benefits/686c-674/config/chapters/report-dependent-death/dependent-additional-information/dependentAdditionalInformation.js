import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import environment from 'platform/utilities/environment';
import { TASK_KEYS } from '../../../constants';
import {
  isChapterFieldRequired,
  PensionIncomeRemovalQuestionTitle,
} from '../../../helpers';
import { deceasedDependents } from '../../../utilities';
import DependentViewField from '../../../../components/DependentViewField';
import { DependentNameHeader } from './helpers';
import { locationUISchema } from '../../../location-schema';

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
      location: locationUISchema(
        'deaths',
        'location',
        true,
        'Place of death',
        'reportDeath',
      ),
      dependentIncome: {
        'ui:options': {
          hideIf: () => environment.isProduction(),
          hideEmptyValueInReview: true,
        },
        'ui:title': PensionIncomeRemovalQuestionTitle,
        'ui:widget': 'yesNo',
      },
    },
  },
};
