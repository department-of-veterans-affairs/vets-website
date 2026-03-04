import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI(`How you'll take the prep course`),
  prepCourseTakenOnline: {
    ...yesNoUI({
      title: 'Will the prep course be taken online?',
      required: () => true,
      errorMessages: {
        required: 'You must make a selection',
      },
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    prepCourseTakenOnline: yesNoSchema,
  },
  required: ['prepCourseTakenOnline'],
};

export { schema, uiSchema };
