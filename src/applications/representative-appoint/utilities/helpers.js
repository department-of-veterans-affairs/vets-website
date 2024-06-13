import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';

export const representativeTypeMap = {
  Attorney: 'attorney',
  'Claims Agent': 'claims agent',
  'Veterans Service Officer (VSO)': 'Veterans Service Officer (VSO)',
};

export const checkboxGroupSchemaWithReviewLabels = keys => {
  const schema = checkboxGroupSchema(keys);
  keys.forEach(key => {
    schema.properties[key] = {
      ...schema.properties[key],
      enum: [true, false],
      enumNames: ['Selected', 'Not selected'],
    };
  });
  return schema;
};
