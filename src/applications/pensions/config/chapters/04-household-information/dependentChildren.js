import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
import ListItemView from '../../../components/ListItemView';
import { DependentsMinItem, formatFullName } from '../../../helpers';

const { dependents } = fullSchemaPensions.properties;

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
        fullName: merge({}, fullNameUI, {
          first: {
            'ui:title': 'Child’s first name',
          },
          last: {
            'ui:title': 'Child’s last name',
          },
          middle: {
            'ui:title': 'Child’s middle name',
          },
          suffix: {
            'ui:title': 'Child’s suffix',
          },
        }),
        childDateOfBirth: currentOrPastDateUI('Date of birth'),
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
            fullName: dependents.items.properties.fullName,
            childDateOfBirth: dependents.items.properties.childDateOfBirth,
          },
        },
      },
    },
  },
};
