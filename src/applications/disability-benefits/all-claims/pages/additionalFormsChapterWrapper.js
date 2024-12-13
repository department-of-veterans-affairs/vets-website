import {
  title,
  description,
  form0781FormTile
} from '../content/additionalFormsChapterWrapper'

// [wipn] start here - I don't think the forms library supports adding components like this
// do i need to do a component?
// Next question; i need this link to route to a whole separate form flow that still saves data into the existing JSON.
export const uiSchema = {
  'ui:title': title,
  'ui:description': description,
  'view:form0781Tile': {
    'ui:title': 'form0781FormTile'
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
