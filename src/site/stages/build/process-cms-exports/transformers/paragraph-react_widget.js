// omit.js uses export default function
const omit = require('lodash/fp/omit');

const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'react_widget',
    fieldButtonFormat: getDrupalValue(entity.fieldButtonFormat),
    fieldCtaWidget: getDrupalValue(entity.fieldCtaWidget),
    fieldDefaultLink: entity.fieldDefaultLink[0]
      ? {
          url: { path: entity.fieldDefaultLink[0].uri },
          title: entity.fieldDefaultLink[0].title,
        }
      : null,
    fieldErrorMessage: entity.fieldErrorMessage[0]
      ? omit(['format'], entity.fieldErrorMessage[0])
      : null,
    fieldLoadingMessage: getDrupalValue(entity.fieldLoadingMessage),
    fieldTimeout: getDrupalValue(entity.fieldTimeout),
    fieldWidgetType: getDrupalValue(entity.fieldWidgetType),
  },
});
module.exports = {
  filter: [
    'field_button_format',
    'field_cta_widget',
    'field_default_link',
    'field_error_message',
    'field_loading_message',
    'field_timeout',
    'field_widget_type',
  ],
  transform,
};
