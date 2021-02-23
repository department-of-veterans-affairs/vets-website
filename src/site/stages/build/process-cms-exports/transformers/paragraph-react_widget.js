// omit.js uses export default function
const omit = require('lodash/fp/omit');

const { getDrupalValue, createLink } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'paragraph',
    entityBundle: 'react_widget',
    fieldButtonFormat: getDrupalValue(entity.fieldButtonFormat),
    fieldCtaWidget: getDrupalValue(entity.fieldCtaWidget),
    fieldDefaultLink: createLink(entity.fieldDefaultLink, ['url', 'title']),
    fieldErrorMessage: entity.fieldErrorMessage[0]
      ? omit(['format', 'processed'], entity.fieldErrorMessage[0])
      : null,
    fieldLoadingMessage: getDrupalValue(entity.fieldLoadingMessage),
    fieldTimeout:
      entity.fieldTimeout.length === 0
        ? null
        : getDrupalValue(entity.fieldTimeout),
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
