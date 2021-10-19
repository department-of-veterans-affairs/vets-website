import React from 'react';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const { vaCompensationType } = fullSchemaHca.properties;

const CompensationTypeInfo = (
  <div style={{ margin: '10px 0 20px 0' }}>
    <AdditionalInfo triggerText="Why we ask for this information">
      <p>We use this information to help us decide these 4 things:</p>
      <ul>
        <li>If you can fill out a shorter application, and</li>
        <li>What types of VA health care benefits you’re eligible for, and</li>
        <li>How soon we enroll you in VA health care, and</li>
        <li>
          How much (if anything) you’ll have to pay toward the cost of your care
        </li>
      </ul>
      <p>
        We give Veterans with service-connected disabilities the highest
        priority
      </p>
    </AdditionalInfo>
  </div>
);

export default {
  uiSchema: {
    'ui:title': 'Current compensation from VA',
    'ui:description':
      'VA disability compensation (pay) provides monthly payments to Veterans with service-connected disabilities. You may get this benefit if you got sick or injured, or had a condition that got worse, because of your active-duty service. We assign a disability rating based on the severity of your disability',
    vaCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
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
      'ui:description': CompensationTypeInfo,
    },
  },
  schema: {
    type: 'object',
    required: ['vaCompensationType'],
    properties: {
      vaCompensationType,
    },
  },
};
