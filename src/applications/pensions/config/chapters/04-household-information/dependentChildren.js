import React from 'react';
import PropTypes from 'prop-types';

import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ListItemView from '../../../components/ListItemView';
import { DependentsMinItem, formatFullName } from '../../../helpers';
import { doesHaveDependents } from './helpers';

const DependentNameView = ({ formData }) => (
  <ListItemView title={formatFullName(formData.fullName)} />
);

DependentNameView.propTypes = {
  formData: PropTypes.shape({
    fullName: PropTypes.object,
  }),
};

/** @type {PageSchema} */
export default {
  title: 'Dependent children',
  path: 'household/dependents/add',
  depends: doesHaveDependents,
  uiSchema: {
    ...titleUI('Dependent children'),
    dependents: {
      'ui:options': {
        itemName: 'Dependent',
        itemAriaLabel: data => data.fullName && formatFullName(data.fullName),
        viewField: DependentNameView,
        reviewTitle: 'Dependent children',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
      },
      'ui:errorMessages': {
        minItems: DependentsMinItem,
      },
      items: {
        fullName: fullNameUI(title => `Child’s ${title}`),
        childDateOfBirth: dateOfBirthUI(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['fullName', 'childDateOfBirth'],
          properties: {
            fullName: fullNameSchema,
            childDateOfBirth: dateOfBirthSchema,
          },
        },
      },
    },
  },
};
