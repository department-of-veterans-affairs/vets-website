import React from 'react';
import {
  TextField,
  EmailField,
  Page,
  PhoneField,
  DebuggerView,
  SSNField
} from '@department-of-veterans-affairs/va-forms-system-core';

export default function PersonalInformationPage() {
  return (
    <>
      <Page title="Personal Information" nextPage="/page-two" prevPage="/">
        <TextField name="firstName" label="First name" />
        <TextField name="lastName" label="Last name" />
        <EmailField name="email" label="Email" />
        <PhoneField name="phone" label="Phone" required/>
        <SSNField name="ssn" label="Social Security Number" required />
      </Page>
      <DebuggerView />
    </>
  )
}