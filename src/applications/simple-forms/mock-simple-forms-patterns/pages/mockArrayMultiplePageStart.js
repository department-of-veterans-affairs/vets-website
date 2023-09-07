import React from 'react';
import {
  fullNameSchema,
  fullNameUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export function childViewCard({ formData }) {
  return (
    <div className="vads-u-padding--2">
      <strong>
        {formData.fullName?.first} {formData.fullName?.last}
      </strong>
      <br />
    </div>
  );
}

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('Child Information'),
    exampleArrayData: {
      'ui:options': {
        itemName: 'Child',
        viewField: childViewCard,
        keepInPageOnReview: true,
        customTitle: ' ',
        useDlWrap: true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        fullName: fullNameUI(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      exampleArrayData: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            fullName: fullNameSchema,
          },
        },
      },
    },
  },
};
