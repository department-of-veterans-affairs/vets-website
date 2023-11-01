/* eslint-disable deprecate/import */
import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import CustomReviewField from '../../../components/CustomReviewField';

const { vaCompensationType } = fullSchemaHca.properties;

const CompensationInfo = () => (
  <div className="vads-u-margin-top--2 vads-u-margin-bottom--5">
    <va-additional-info trigger="Why we ask for this information">
      <p>We use this information to help us decide these 4 things:</p>
      <ul>
        <li className="vads-u-margin-left--3 vads-u-margin-bottom--2 bullet-disc">
          If you can fill out a shorter application, <strong>and</strong>
        </li>
        <li className="vads-u-margin-left--3 vads-u-margin-bottom--2 bullet-disc">
          What types of VA health care benefits you’re eligible for,
          <strong className="vads-u-margin-left--0p5">and</strong>
        </li>
        <li className="vads-u-margin-left--3 vads-u-margin-bottom--2 bullet-disc">
          How soon we enroll you in VA health care, <strong>and</strong>
        </li>
        <li className="vads-u-margin-left--3 bullet-disc">
          How much (if anything) you’ll have to pay toward the cost of your care
        </li>
      </ul>
      <p>
        We give veterans with service-connected disabilities the highest
        priority.
      </p>
    </va-additional-info>
  </div>
);

export default {
  uiSchema: {
    'ui:title': 'Current compensation from VA',
    'ui:description': PrefillMessage,
    'view:compDesc': {
      'ui:description':
        'VA disability compensation (pay) provides monthly payments to Veterans with service-connected disabilities. You may get this benefit if you got sick or injured, or had a condition that got worse, because of your active-duty service. We assign a disability rating based on the severity of your disability.',
      'ui:options': {
        classNames: 'vads-u-margin-bottom--4',
      },
    },
    vaCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationInfo,
      'ui:reviewField': CustomReviewField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lowDisability:
            'Yes, for a service-connected disability rating of up to 40%',
          highDisability:
            'Yes, for a service-connected disability rating of 50% or higher',
          none: 'No',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['vaCompensationType'],
    properties: {
      'view:compDesc': {
        type: 'object',
        properties: {},
      },
      vaCompensationType,
    },
  },
};
