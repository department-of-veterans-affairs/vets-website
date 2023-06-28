import React from 'react';
// WIP file

function PrivateProviderTreatmentView(props) {
  return (
    <div>
      <strong>{props.formData.providerFacilityName}</strong>
      <p>this is a description</p>
    </div>
  );
}

/** @type {PageSchema} */
export default {
  uiSchema: {
    providerFacility: {
      'ui:title': 'the title',
      'ui:description': 'issusDescription',
      //   'ui:field': PrivateProviderTreatmentView,
      'ui:options': {
        itemName: 'Provider Facility',
        viewField: PrivateProviderTreatmentView,
        title: 'New Thingy',
        reviewTitle: 'New Thingy',
        // hideTitle: true,
        doNotScroll: true,
        confirmRemove: true,
        // itemName: 'income',
      },
      items: {
        providerFacilityName: {
          'ui:title': 'Name of private provider or hospital',
          // 'ui:webComponentField': VaTextInputField,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      providerFacility: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          required: ['providerFacilityName'],
          properties: {
            providerFacilityName: {
              type: 'string',
              maxLength: 100,
            },
          },
        },
      },
    },
  },
};
