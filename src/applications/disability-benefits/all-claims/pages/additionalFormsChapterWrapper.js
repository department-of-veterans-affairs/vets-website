import {
  title,
  description,
  form0781StatusBadge,
  form0781Description,
  form0781EnterFormLink,
  form0781OptOutLink
} from '../content/additionalFormsChapterWrapper'

// [wipn8923] build here
// make this depend on showForm0781Tile
export const uiSchema = {
  'ui:title': title,
  'ui:description': description,
  'view:form0781Tile': {
    'view:form0781StatusBadge': form0781StatusBadge,
    'view:form0781Description': form0781Description,
    'view:form0781EnterFormLink': form0781EnterFormLink,
    'view:form0781OptOutLink': form0781OptOutLink
  }
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
