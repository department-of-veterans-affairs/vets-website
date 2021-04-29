import { serviceDecoration } from '../../schemaImports';

export const schema = serviceDecoration;

export const uiSchema = {
  hasPurpleHeart: {
    'ui:title': 'Have you received a purple heart?',
    'ui:widget': 'yesNo',
  },
};
