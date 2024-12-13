import {
  title,
  description,
} from '../content/additionalFormsChapterWrapper'

export const uiSchema = {
  'ui:title': title,
  'ui:description': description,
  'view:form0781Tile': form0781FormTile
};

export const schema = {
  type: 'object',
  properties: {
    'view:form0781Tile': {
      type: 'object',
      properties: {},
    }
  },
};
