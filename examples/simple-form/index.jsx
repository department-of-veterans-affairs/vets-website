import React from 'react';
import ReactDOM from 'react-dom';

import { Formik, Form } from 'formik';
import {
  TextField,
  DebuggerView,
} from '@department-of-veterans-affairs/formulate';

import 'web-components/dist/component-library/component-library.css';
import { defineCustomElements } from 'web-components/loader';

void defineCustomElements();

const App = () => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
  >
    <h1>Example form</h1>
    <Formik initialValues={{ foo: '' }}>
      <Form>
        <TextField name="foo" label="Example" required />
        <DebuggerView />
      </Form>
    </Formik>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
