import {
  checkboxGroupSchema,
  checkboxGroupUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import {
  behaviorListDescription,
  behaviorListNoneLabel,
  behaviorListAdditionalInformation,
  behaviorListPageTitle,
  validateBehaviorSelections,
  behaviorListValidationError,
  showConflictingAlert,
} from '../../content/form0781/behaviorListPages';
import {
  BEHAVIOR_LIST_BEHAVIOR_SUBTITLES,
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../../constants';

export const uiSchema = {
  'ui:title': titleWithTag(behaviorListPageTitle, form0781HeadingTag),
  'ui:description': behaviorListDescription,
  'view:conflictingResponseAlert': {
    'ui:description': behaviorListValidationError,
    'ui:options': {
      hideIf: formData => showConflictingAlert(formData) === false,
    },
  },
  workBehaviors: checkboxGroupUI({
    title: BEHAVIOR_LIST_BEHAVIOR_SUBTITLES.work,
    labelHeaderLevel: '4',
    labels: {
      ...BEHAVIOR_CHANGES_WORK,
    },
    required: false,
  }),
  healthBehaviors: checkboxGroupUI({
    title: BEHAVIOR_LIST_BEHAVIOR_SUBTITLES.health,
    labelHeaderLevel: '4',
    labels: {
      ...BEHAVIOR_CHANGES_HEALTH,
    },
    required: false,
  }),
  otherBehaviors: checkboxGroupUI({
    title: BEHAVIOR_LIST_BEHAVIOR_SUBTITLES.other,
    labelHeaderLevel: '4',
    labels: {
      ...BEHAVIOR_CHANGES_OTHER,
    },
    required: false,
  }),
  unlistedBehaviors: textUI({
    title: BEHAVIOR_LIST_BEHAVIOR_SUBTITLES.unlisted,
  }),
  'view:noneCheckbox': checkboxGroupUI({
    title: BEHAVIOR_LIST_BEHAVIOR_SUBTITLES.none,
    labelHeaderLevel: '4',
    labels: {
      none: behaviorListNoneLabel,
    },
    required: false,
  }),
  'view:behaviorAdditionalInformation': {
    'ui:description': behaviorListAdditionalInformation,
  },
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
  'ui:validations': [validateBehaviorSelections],
};

export const schema = {
  type: 'object',
  properties: {
    'view:conflictingResponseAlert': {
      type: 'object',
      properties: {},
    },
    workBehaviors: checkboxGroupSchema(Object.keys(BEHAVIOR_CHANGES_WORK)),
    healthBehaviors: checkboxGroupSchema(Object.keys(BEHAVIOR_CHANGES_HEALTH)),
    otherBehaviors: checkboxGroupSchema(Object.keys(BEHAVIOR_CHANGES_OTHER)),
    'view:noneCheckbox': checkboxGroupSchema(['none']),
    'view:behaviorAdditionalInformation': {
      type: 'object',
      properties: {},
    },
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
