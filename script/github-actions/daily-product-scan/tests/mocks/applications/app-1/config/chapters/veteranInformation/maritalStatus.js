/* eslint-disable deprecate/import */
import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import CustomReviewField from '../../../components/CustomReviewField';

const MaritalStatusDescription = () => {
  return (
    <div className="vads-u-margin-y--2">
      <va-additional-info trigger="Why we ask for this information">
        <p>
          We want to make sure we understand your household’s financial
          situation.
        </p>

        <p>
          We’ll ask about your income. If you’re married, we also need to
          understand your spouse’s financial situation. This allows us to make a
          more informed decision about your application.
        </p>
      </va-additional-info>
    </div>
  );
};

const { maritalStatus } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    maritalStatus: {
      'ui:title': 'Marital status',
      'ui:reviewField': CustomReviewField,
      'ui:description': MaritalStatusDescription,
    },
  },
  schema: {
    type: 'object',
    required: ['maritalStatus'],
    properties: {
      maritalStatus,
    },
  },
};
