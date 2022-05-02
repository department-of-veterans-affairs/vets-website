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
  label: 'What breakfast?',
  name: 'breakfast',
  id: '12',
  /**
   * If `required` is true, the default message will be used. If `required` is a
   * string, it will be used as the error message.
   */
  required: true,
  values: {},
  options: [
    {
      name: 'eggs',
      label: 'Eggs',
      content: '🐥🐣',
      checked: true,
      required: false,
    },
    {
      name: 'protein',
      label: 'Protein Shake',
      content: '🏋️',
      required: true,
    },
    {
      name: 'toast',
      label: 'Toast',
      content: '🍞',
      required: false,
    },
    {
      name: 'fruit',
      label: 'Fruit',
      content: '🍐',
      required: false,
    },
  ],
};

const SimpleApp = () => (
  <div className='vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column'>
    <h1>Example form</h1>
    <Formik
      initialValues={{
        bar: true,
        breakfast: {
          eggs: true,
          protein: false,
          toast: false,
          fruit: false,
        },
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
