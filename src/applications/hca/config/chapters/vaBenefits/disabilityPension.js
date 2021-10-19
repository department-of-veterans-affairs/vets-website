import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const { vaPensionType } = fullSchemaHca.properties;

const PensionInfo = (
  <>
    <AdditionalInfo triggerText="Why we ask for this information">
      <p>We use this information to help us decide these 3 things:</p>
      <ul>
        <li>What types of VA health care benefits you’re eligible for, and</li>
        <li>How soon we enroll you in VA health care, and</li>
        <li>
          How much (if anything) you’ll have to pay toward the cost of your care
        </li>
      </ul>
      <p>
        If you have a Veterans Pension, you may pay a lower copay, or no copay,
        for certain types of care and services
      </p>
    </AdditionalInfo>
  </>
);

export default {
  uiSchema: {
    'ui:title': 'Current compensation from VA',
    'ui:description':
      'Our Veterans Pension program provides monthly payments to certain wartime Veterans. To get a Veterans Pension, you must meet certain age or disability requirements and have income and net worth within certain limits.',
    vaPensionType: {
      'ui:title': 'Do you receive a Veterans pension from the VA?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          Yes: 'Yes',
          No: 'No',
        },
      },
      'ui:description': PensionInfo,
    },
  },
  schema: {
    type: 'object',
    required: ['vaPensionType'],
    properties: {
      vaPensionType,
    },
  },
};
