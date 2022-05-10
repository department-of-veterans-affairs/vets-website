import React from 'react';
import {
  TextField,
  EmailField,
  Page,
  DebuggerView,
  SSNField
} from '@department-of-veterans-affairs/va-forms-system-core';

export default function PersonalInformationPage() {
  return (
    <>
      <Page title="Personal Information" nextPage="page-two">
        <TextField name="firstName" label="First name" required/>
        <TextField name="lastName" label="Last name" required/>
        <EmailField name="email" label="Email" required />
        <SSNField name="ssn" label="Social Security Number" required />
      </Page>
      <DebuggerView />
    </>
  )
}