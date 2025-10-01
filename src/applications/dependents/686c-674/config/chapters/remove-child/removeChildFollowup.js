import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const choices = {
  leftSchool: { title: 'My child left school and isn’t going back' },
  gotMarried: { title: 'My child got married' },
  parentDivorced: { title: 'My parents got divorced' },
  parentDied: { title: 'My parent died' },
  leftHousehold: { title: 'My child left my household and isn’t coming back' },
  childDied: { title: 'My child died' },
  childAdoptedOutOfFamily: { title: 'My child was adopted out of my family' },
};

/** @returns {PageSchema} */
export const removeChildFollowup = {
  uiSchema: {
    'ui:title': 'Reason for removing your child',
    'view:removeDependentPickList': {
      // items: {
      //   'ui:title': 'Reason for removing xxx?',
      //   // 'ui:widget': 'radio',
      //   'ui:webcomponentField': VaCheckboxGroupField,
      //   'ui:required': () => true,
      //   'ui:errorMessages': {
      //     required: 'Select at least one option',
      //   },
      //   'ui:options': {
      //     tile: true,
      //     labelHeaderLevel: '3',
      //     enableAnalytics: true,
      //   },
      //   leftSchool: { 'ui:title': "My child left school and isn't going back" },
      //   gotMarried: { 'ui:title': 'My child got married' },
      //   parentDivorced: { 'ui:title': 'My parents got divorced' },
      //   parentDied: { 'ui:title': 'My parent died' },
      //   leftHousehold: {
      //     'ui:title': "My child left my household and isn't coming back",
      //   },
      //   childDied: { 'ui:title': 'My child died' },
      //   childAdoptedOutOfFamily: {
      //     'ui:title': 'My child was adopted out of my family',
      //   },
      // },
      items: checkboxGroupUI({
        title: 'Reason for removing your child',
        tile: true,
        labelHeaderLevel: '3',
        enableAnalytics: true,
        required: () => true,
        labels: choices,
      }),
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:removeDependentPickList': {
        type: 'array',
        items: checkboxGroupSchema(Object.keys(choices)),
        // items: {
        //   type: 'object',
        //   properties: {
        //     leftSchool: { type: 'boolean' },
        //     gotMarried: { type: 'boolean' },
        //     parentDivorced: { type: 'boolean' },
        //     parentDied: { type: 'boolean' },
        //     leftHousehold: { type: 'boolean' },
        //     childDied: { type: 'boolean' },
        //     childAdoptedOutOfFamily: { type: 'boolean' },
        //   },
        // },
      },
    },
  },
};
