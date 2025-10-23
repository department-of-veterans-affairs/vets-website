import { textUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  first: {
    ...textUI({ title: 'First name', required: true }),
    'ui:required': () => true,
  },
  last: {
    ...textUI({ title: 'Last name', required: true }),
    'ui:required': () => true,
  },
};
