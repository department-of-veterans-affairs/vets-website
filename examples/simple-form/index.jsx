import React from 'react';

import { Form, Formik } from 'formik';
import {
  CheckboxField,
  DebuggerView,
  TextField,
  CheckboxFieldGroup,
  FullNameField
} from '@department-of-veterans-affairs/va-forms-system-core';

const checkboxProps = {
  label: 'Military Service Details',
  name: 'serviceStatus',
  id: '12',
  /**
   * If `required` is true, the default message will be used. If `required` is a
   * string, it will be used as the error message.
   */
  required: true,
  values: {},
  options: [
    {
      name: 'purpleHeartRecipient',
      label: 'Purple Heart award recipient',
      required: false,
    },
    {
      name: 'isFormerPow',
      label: 'Former Prisoner of War',
      required: false,
    },
    {
      name: 'postNov111998Combat',
      label: 'Served in combat theater of operations after November 11, 1998',
      required: false,
    },
    {
      name: 'disabledInLineOfDuty',
      label: 'Discharged or retired from the military for a disability incurred in the line of duty',
      required: false,
    },
    {
      name: 'sawAsiaCombat',
      label: 'Served in Southwest Asia during the Gulf War between August 2, 1990, and Nov 11, 1998',
      required: false,
    },
    {
      name: 'vietnamService',
      label: 'Served in Vietnam between January 9, 1962, and May 7, 1975',
      required: false,
    },
    {
      name: 'exposedToRadiation',
      label: 'Exposed to radiation while in the military',
      required: false,
    },
    {
      name: 'radiumTreatments',
      label: 'Received nose/throat radium treatments while in the military',
      required: false,
    },
    {
      name: 'campLejeune',
      label: 'Received nose/throat radium treatments while in the military',
      required: false,
    },
  ],
};

const SimpleApp = () => (
  <div className='vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column'>
    <h1>Example form</h1>
    <Formik
      initialValues={{
        email: "",
        serviceStatus: {
          purpleHeartRecipient: false,
          isFormerPow: false,
          postNov111998Combat: false,
          disabledInLineOfDuty: false,
          sawAsiaCombat: false,
          vietnamService: false,
          exposedToRadiation: false,
          radiumTreatments: false,
          campLejeune: false,
        },
        contactMethod: null,
      }}
    >
      <Form>
        <CheckboxField name="bar" label="Do you have pets?" required />
        <TextField name="foo" label="Example" required />
        <CheckboxFieldGroup {...checkboxProps} />
        <FullNameField name="fullName" label="fullName"/>
        <button type="submit" className="btn">
          {' '}
          submit
        </button>
        <DebuggerView />
      </Form>
    </Formik>
  </div>
);

export default SimpleApp;
