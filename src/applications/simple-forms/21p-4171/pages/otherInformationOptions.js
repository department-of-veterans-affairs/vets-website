import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Other information'),
    otherInformationOptions: checkboxGroupUI({
      title: 'Select any that apply',
      required: false,
      labels: {
        option0: 'RadioButtonList0',
        option1: 'RadioButtonList1',
        option2: 'RadioButtonList2',
        option3: 'RadioButtonList3',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherInformationOptions: checkboxGroupSchema([
        'option0',
        'option1',
        'option2',
        'option3',
      ]),
    },
    required: [],
  },
};
