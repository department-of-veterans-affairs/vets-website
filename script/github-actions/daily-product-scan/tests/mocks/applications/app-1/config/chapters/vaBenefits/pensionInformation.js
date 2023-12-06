/* eslint-disable deprecate/import */
import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
// eslint-disable-next-line deprecate/import
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import CustomReviewField from '../../../components/CustomReviewField';

const { vaPensionType } = fullSchemaHca.properties;

const PensionInfo = () => (
  <div className="vads-u-margin-top--2 vads-u-margin-bottom--5">
    <va-additional-info trigger="Why we ask for this information">
      <p>We use this information to help us decide these 3 things:</p>
      <ul>
        <li className="vads-u-margin-left--3 vads-u-margin-bottom--2 bullet-disc">
          What types of VA health care benefits you’re eligible for,
          <strong className="vads-u-margin-left--0p5">and</strong>
        </li>
        <li className="vads-u-margin-left--3 vads-u-margin-bottom--2 bullet-disc">
          How soon we enroll you in a VA health care, <strong>and</strong>
        </li>
        <li className="vads-u-margin-left--3 bullet-disc">
          How much (if anything) you’ll have to pay toward the cost of your care
        </li>
      </ul>
      <p>
        If you have a Veterans Pension, you may pay a lower copay, or no copay,
        for certain types of care and services.
      </p>
    </va-additional-info>
  </div>
);

export default {
  uiSchema: {
    'ui:title': 'Current compensation',
    'ui:description': PrefillMessage,
    'view:compDesc': {
      'ui:description':
        'Our Veterans Pension program provides monthly payments to certain wartime Veterans. To get a Veterans Pension, you must meet certain age or disability requirements and have income and net worth certain limits.',
      'ui:options': {
        classNames: 'vads-u-margin-bottom--4',
      },
    },
    vaPensionType: {
      'ui:title': 'Do you receive a Veterans pension from the VA?',
      'ui:description': PensionInfo,
      'ui:reviewField': CustomReviewField,
      'ui:required': () => true,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          pension: 'Yes',
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
      vaPensionType,
    },
  },
};
