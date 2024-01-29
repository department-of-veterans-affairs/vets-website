import React from 'react';
import PropTypes from 'prop-types';
import {
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ListItemView from '../../../components/ListItemView';

export const PreviousNameView = ({ formData }) => {
  const { first = '', middle = '', last = '', suffix = '' } =
    formData.previousFullName || {};

  // Filter out empty strings and join non-empty parts with a space
  const fullName = [first, middle, last, suffix].filter(Boolean).join(' ');

  return <ListItemView title={fullName} />;
};

PreviousNameView.propTypes = {
  formData: PropTypes.shape({
    previousFullName: PropTypes.string,
  }),
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Add other service names',
    previousNames: {
      'ui:options': {
        itemName: 'Name',
        viewField: PreviousNameView,
        reviewTitle: 'Previous names',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
      },
      items: {
        previousFullName: fullNameUI(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      previousNames: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['previousFullName'],
          properties: {
            previousFullName: fullNameSchema,
          },
        },
      },
    },
  },
};
