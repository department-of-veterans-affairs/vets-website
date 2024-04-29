import React from 'react';
import PropTypes from 'prop-types';
import {
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ListItemView from '../../../components/ListItemView';
import { formatFullName, updateMultiresponseUiOptions } from '../../../helpers';
import { doesHavePreviousNames } from './helpers';

export const PreviousNameView = ({ formData }) => (
  <ListItemView title={formatFullName(formData.previousFullName)} />
);

PreviousNameView.propTypes = {
  formData: PropTypes.shape({
    previousFullName: PropTypes.object,
  }),
};

/** @type {PageSchema} */
export default {
  title: 'Previous names',
  path: 'military/general/add',
  depends: doesHavePreviousNames,
  uiSchema: {
    ...titleUI('Add other service names'),
    previousNames: {
      'ui:options': {
        itemName: 'Name',
        itemAriaLabel: data =>
          data.previousFullName && formatFullName(data.previousFullName),
        viewField: PreviousNameView,
        reviewTitle: 'Previous names',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
        useVaCards: true,
        updateSchema: updateMultiresponseUiOptions,
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
