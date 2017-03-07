import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const schema = commonDefinitions.gender;

export const uiSchema = (title = 'Gender') => {
  return {
    'ui:title': title,
    'ui:widget': 'gender'
  };
};
