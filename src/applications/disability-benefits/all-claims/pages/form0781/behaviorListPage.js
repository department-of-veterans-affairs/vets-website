import {
  checkboxGroupSchema,
  checkboxGroupUI,
  textUI,
  // descriptionSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  BEHAVIOR_LIST_DESCRIPTION,
  BEHAVIOR_LIST_BEHAVIOR_SUBTITLES,
  BEHAVIOR_LIST_NONE_LABEL,
} from '../../content/form0781/behaviorListPages';

// move constants to content file???
import {
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../../constants';

// const schemaKeys = Object.keys(BEHAVIOR_CHANGES_WORK).concat(
//   Object.keys(BEHAVIOR_CHANGES_HEALTH),
//   Object.keys(BEHAVIOR_CHANGES_OTHER),
// );

export const uiSchema = {
  'ui:description': BEHAVIOR_LIST_DESCRIPTION,
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
  'view:optOut': checkboxGroupUI({
    title: BEHAVIOR_LIST_BEHAVIOR_SUBTITLES.none,
    labelHeaderLevel: '4',
    labels: {
      none: BEHAVIOR_LIST_NONE_LABEL,
    },
    required: false,
  }),
  'ui:validations': [
    (errors, field) => {
      const behaviorSelected = Object.values(field.behaviors || {}).some(
        selected => selected,
      );
      const otherProvided = Object.values(field.otherBehaviors || {}).some(
        entry => !!entry,
      );
      const optedOut = !!Object.values(field['view:optOut'] || {}).some(
        entry => !!entry,
      );

      if (!behaviorSelected && !otherProvided && !optedOut) {
        // when a user has not selected options nor opted out
        errors['view:optOut'].addError(
          'selection required Error message placehoder',
        );
      } else if (optedOut && (behaviorSelected || otherProvided)) {
        // when a user has selected options and opted out
        errors['view:optOut'].addError(
          'conflicting selections Error message placehoder',
        );
      }
    },
  ],
};

export const schema = {
  type: 'object',
  properties: {
    workBehaviors: checkboxGroupSchema(Object.keys(BEHAVIOR_CHANGES_WORK)),
    healthBehaviors: checkboxGroupSchema(Object.keys(BEHAVIOR_CHANGES_HEALTH)),
    otherBehaviors: checkboxGroupSchema(Object.keys(BEHAVIOR_CHANGES_OTHER)),
    unlistedBehaviors: {
      type: 'string',
    },
    'view:optOut': checkboxGroupSchema(['none']),
  },
};
