import React from 'react';
import PropTypes from 'prop-types';
import {
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ArrayDescription from '../../../components/ArrayDescription';
import ListItemView from '../../../components/ListItemView';
import { formatFullName, showMultiplePageResponse } from '../../../helpers';
import { doesHavePreviousNames } from './helpers';

export const OtherNameView = ({ formData }) => (
  <ListItemView title={formatFullName(formData.previousFullName)} />
);

OtherNameView.propTypes = {
  formData: PropTypes.shape({
    previousFullName: PropTypes.object,
  }),
};

/** @type {PageSchema} */
export default {
  title: 'List of other service names',
  path: 'military/other-names/add',
  depends: formData =>
    !showMultiplePageResponse() && doesHavePreviousNames(formData),
  uiSchema: {
    ...titleUI(
      'List of other service names',
      <ArrayDescription message="Add other service names" />,
    ),
    previousNames: {
      'ui:options': {
        itemName: 'Name',
        itemAriaLabel: data =>
          data.previousFullName && formatFullName(data.previousFullName),
        viewField: OtherNameView,
        reviewTitle: 'Previous names',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
        useVaCards: true,
        showSave: true,
        reviewMode: true,
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
