import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
export default ({ includeServiceNumber, pageTitle }) => {
  const schema = {
    properties: {
      veteranId: webComponentPatterns.ssnOrVaFileNumberSchema,
    },
    type: 'object',
  };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle),
    veteranId: webComponentPatterns.ssnOrVaFileNumberUI(),
  };

  if (includeServiceNumber) {
    schema.properties.serviceNumber = webComponentPatterns.serviceNumberSchema;
    uiSchema.serviceNumber = webComponentPatterns.serviceNumberUI();
  }

  return {
    path: 'identification-information',
    title: pageTitle,
    schema,
    uiSchema,
  };
};
