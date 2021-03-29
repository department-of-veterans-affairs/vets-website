import React from 'react';
// import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { representativeFields } from 'applications/caregivers/definitions/constants';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

// const { representative } = fullSchema.properties;
// const veteranProps = veteran.properties;
// const { address, phone } = fullSchema.definitions;

const RepresentativeIntroContent = () => {
  return (
    <section>
      <p>
        Some family caregivers are also the Veteran’s legal representative.
        These representatives have the legal authority to make certain decisions
        for the Veteran.
      </p>

      <p>Here's what you should know</p>
      <ul>
        <li>
          You can still continue with this application to apply for the program
          even if you’re not the Veteran’s legal representative.
        </li>

        <li>
          If you are the Veteran’s legal representative, you can upload one or
          more documents to show your legal status. If you don't upload your
          documents now, we'll ask you to provide them later
        </li>
      </ul>
    </section>
  );
};

const RepresentativeAdditionalInfo = () => {
  return (
    <div className="vads-u-margin-top--1">
      <AdditionalInfo triggerText="What documents can I submit to show legal status as a representative?">
        <ul>
          <p>
            To show that you’re the Veteran’s legal representative, you’ll need
            to upload one of these current documents:
          </p>

          <li>
            Power of attorney, <strong>or</strong>
          </li>

          <li>
            Legal guardianship order, <strong>or</strong>
          </li>

          <li>
            Another legal document that confirms your legal status as the
            Veteran’s representative. This document can be from by a federal,
            state, local, or tribal court.
          </li>
        </ul>

        <p className="vads-u-margin-top--4">
          <strong>Note:</strong> Being a Veteran’s closest family member or next
          of kin doesn’t mean you’re their representative. You need a separate
          legal document to show your status as the representative.
        </p>
      </AdditionalInfo>
    </div>
  );
};

const representativePage = {
  uiSchema: {
    'ui:description': RepresentativeIntroContent(),
    [representativeFields.signAsRepresentative]: {
      'ui:title':
        "Do you have legal representative documents you'd like to share with us?",
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          yes: 'Yes. I want to upload my documents now',
          noRep: "Yes. But I'll provide my documents later",
          no: 'No',
        },
      },
    },
    'view:placeholder': {
      'ui:description': RepresentativeAdditionalInfo(),
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      [representativeFields.signAsRepresentative]: {
        type: 'string',
        enum: ['yes', 'noRep', 'no'],
      },
      'view:placeholder': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default representativePage;
