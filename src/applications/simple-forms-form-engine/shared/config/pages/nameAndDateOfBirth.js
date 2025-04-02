import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
export default ({ includeDateOfBirth, pageTitle }) => {
  const schema = {
    properties: {
      fullName: webComponentPatterns.fullNameSchema,
    },
    type: 'object',
  };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle),
    fullName: webComponentPatterns.fullNameUI(),
  };

  if (includeDateOfBirth) {
    schema.properties.dateOfBirth = webComponentPatterns.dateOfBirthSchema;
    uiSchema.dateOfBirth = webComponentPatterns.dateOfBirthUI();
  }

  return {
    path: 'name-and-date-of-birth',
    title: pageTitle,
    schema,
    uiSchema,
  };
};
