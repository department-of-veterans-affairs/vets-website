import React from 'react';
import { Route } from 'react-router-dom'
import { FormRouter, DebuggerView } from '@department-of-veterans-affairs/va-forms-system-core';
import PersonalInformationPage from './page-one';
import ContactInformationPage from './page-two';

const NoMatch = (props) => (
    <main style={{ padding: '1rem' }}>
      <p>There is nothing here! {props.name}</p>
    </main>
  );

const FormApp = (props) => {
    // Let users extract and use formData here
    // initialValues would ideally be provided by a json-schema
    return (
        <div className='vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column'>
            <FormRouter basename={props.basename} formData={props.initialValues}>
                <Route index element={<PersonalInformationPage />} />
                <Route path="/page-two" element={<ContactInformationPage />} />
                <Route path="*" element={<NoMatch name="No Routes for App" />} />
            </FormRouter>
        </div>
    )
}

export default FormApp