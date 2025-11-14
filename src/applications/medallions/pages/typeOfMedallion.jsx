import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const EvidenceRequestBanner = () => {
  return (
    <va-alert status="info" uswds>
      <h3 slot="headline">
        We need your help to finish reviewing your application
      </h3>
      <p>
        We need you to provide supporting documents to verify eligibility for a
        VA Medal of Honor medallion.
      </p>
      <p>
        You can do this in the supporting documents page at the end of this
        form. You must upload discharge papers showing Medal of Honor
        eligibility in order to receive one.
      </p>
    </va-alert>
  );
};

const TypeDescription = ({ formData }) => {
  return (
    <div>
      {formData?.typeOfMedallionRadio === 'medalOfHonor' && (
        <EvidenceRequestBanner />
      )}
      <p>
        The Veteran may be eligible for a bronze medallion or a Medal of Honor
        medallion.
      </p>
      <a
        href="https://www.cem.va.gov/hmm/types.asp#Medallions"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about the types of medallions (opens in a new tab)
      </a>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Type of medallion'),
    'ui:description': TypeDescription,
    typeOfMedallionRadio: radioUI({
      title: 'What type of medallion are you applying for?',
      labels: {
        bronze: 'Bronze',
        medalOfHonor: 'Medal of Honor',
      },
      required: () => true,
      errorMessages: {
        required: 'Please select a response',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      typeOfMedallionRadio: radioSchema(['bronze', 'medalOfHonor']),
    },
  },
};
