import {
  arrayBuilderItemFirstPageTitleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  SpecialMonthlyPensionEvidenceAlert,
  RequestNursingHomeInformationAlert,
} from '../../../components/FormAlerts';

// helper to handle both boolean and string "yes" values coming from different
// test fixtures or UX components
const isYes = val =>
  val === true ||
  (typeof val === 'string' && val.toLowerCase().startsWith('y'));

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title: 'Nursing home or increased survivor entitlement',
  }),
  needRegularAssistance: radioUI({
    title:
      'Are you claiming special monthly pension or special monthly D.I.C. because you need the regular assistance of another person, have severe visual problems, or are generally confined to your immediate premises?',
    classNames: 'vads-u-margin-bottom--2',
    'ui:options': {
      expandUnder: 'needRegularAssistanceAlert',
      expandUnderCondition: value => isYes(value),
    },
  }),
  needRegularAssistanceAlert: {
    'ui:description': SpecialMonthlyPensionEvidenceAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.needRegularAssistance),
      displayEmptyObjectOnReview: true,
    },
  },
  inNursingHome: radioUI({
    title: 'Are you in a nursing home?',
    'ui:options': {
      expandUnder: 'inNursingHomeAlert',
      expandUnderCondition: value => isYes(value),
    },
  }),
  inNursingHomeAlert: {
    'ui:description': RequestNursingHomeInformationAlert,
    'ui:options': {
      hideIf: formData => !isYes(formData?.inNursingHome),
      displayEmptyObjectOnReview: true,
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    needRegularAssistance: radioSchema(['Yes', 'No']),
    needRegularAssistanceAlert: {
      type: 'object',
      properties: {},
    },
    inNursingHome: radioSchema(['Yes', 'No']),
    inNursingHomeAlert: {
      type: 'object',
      properties: {},
    },
  },
  required: ['needRegularAssistance', 'inNursingHome'],
};

export default {
  uiSchema,
  schema,
};
