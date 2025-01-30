import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  BEHAVIOR_LIST_DESCRIPTION,
  BEHAVIOR_LIST_BEHAVIORS_TITLE,
} from '../../content/form0781/behaviorListPages';
import {
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../../constants';

const schemaKeys = Object.keys(BEHAVIOR_CHANGES_WORK).concat(
  Object.keys(BEHAVIOR_CHANGES_HEALTH),
  Object.keys(BEHAVIOR_CHANGES_OTHER),
);

export const uiSchema = {
  'ui:description': BEHAVIOR_LIST_DESCRIPTION,
  behaviors: checkboxGroupUI({
    title: BEHAVIOR_LIST_BEHAVIORS_TITLE,
    labels: {
      ...BEHAVIOR_CHANGES_WORK,
      ...BEHAVIOR_CHANGES_HEALTH,
      ...BEHAVIOR_CHANGES_OTHER,
    },
    required: false,
  }),
  otherBehaviors: {
    'ui:title': 'placeholder title',
    'ui:description': 'placeholde description',
  },
  'view:optOut': checkboxGroupUI({
    title: 'None',
    labels: {
      none: 'no selection placeholder',
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
    behaviors: checkboxGroupSchema(schemaKeys),
    otherBehaviors: {
      type: 'string',
      properties: {},
    },
    'view:optOut': checkboxGroupSchema(['none']),
  },
};
