import React from 'react';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const {
  remarks,
} = fullSchema.properties.form8940.properties.unemployability.properties;

const additionalInformationDescription = (
  <div>
    <h3 className="vads-u-font-size--h4">Additional Information</h3>
    <p>
      If there’s any other information you’d like to give us as part of your
      claim, please add it here.
    </p>
    <p>
      It’s important to tell us why your service-connected disability is the
      reason you’re no longer able to work. Providing specific examples will
      help us understand your claim.
    </p>
  </div>
);

const textareaLabel = (
  <p>
    If you’ve left one or more jobs because of your service-connected
    disabilities, please note that.
  </p>
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': additionalInformationDescription,
  unemployability: {
    remarks: {
      'ui:title': textareaLabel,
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 3200,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        remarks,
      },
    },
  },
};
