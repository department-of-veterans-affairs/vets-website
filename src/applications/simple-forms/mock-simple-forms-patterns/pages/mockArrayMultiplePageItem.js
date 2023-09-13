import React from 'react';
import {
  addressSchema,
  addressUI,
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

const ChildNameHeader = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <div>
      <p className="vads-u-font-weight--bold vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary vads-u-font-family--serif">
        {first[0].toUpperCase()}
        {first.slice(1).toLowerCase()} {last[0].toUpperCase()}
        {last.slice(1).toLowerCase()}
      </p>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    exampleArrayData: {
      'ui:options': {
        viewField: childViewCard,
      },
      items: {
        'ui:title': ChildNameHeader,
        address: addressUI({
          omit: ['isMilitary'],
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      exampleArrayData: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            address: addressSchema({
              omit: ['isMilitary'],
            }),
          },
        },
      },
    },
  },
};
