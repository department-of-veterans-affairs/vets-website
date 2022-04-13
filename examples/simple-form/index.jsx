import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Formik } from 'formik';
import {
  CheckboxField,
  DateField,
  DebuggerView,
  TextField,
} from '@department-of-veterans-affairs/va-forms-system-core';

import '@department-of-veterans-affairs/component-library/dist/main.css';
import { defineCustomElements } from '@department-of-veterans-affairs/component-library';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
void defineCustomElements();

const App = () => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
  >
    <h1>Example form</h1>
    <Formik initialValues={{ foo: '', bar: true, baz: '' }}>
      <Form>
        <TextField name="foo" label="Example" required />
        <CheckboxField name="bar" label="Do you have pets?" required />
        <DateField name="baz" required />
        <DebuggerView />
      </Form>
    </Formik>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
