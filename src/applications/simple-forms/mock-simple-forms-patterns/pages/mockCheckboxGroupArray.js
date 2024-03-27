import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    allTheItemsCheckbox: checkboxGroupUI({
      title: 'Checkbox group with followup array',
      required: true,
      labels: {
        a: 'Option A',
        b: 'Option B',
        c: 'Option C',
        d: 'Option D',
        e: 'Option E',
        f: 'Option F',
        g: 'Option G',
        h: 'Option H',
        i: 'Option I',
        j: 'Option J',
        k: 'Option K',
        l: 'Option L',
        m: 'Option M',
        n: 'Option N',
        o: 'Option O',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      allTheItemsCheckbox: checkboxGroupSchema([
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
      ]),
    },
    required: ['allTheItemsCheckbox'],
  },
};
