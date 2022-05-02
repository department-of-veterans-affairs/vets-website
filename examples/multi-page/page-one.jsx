import React from 'react';
import { Link } from 'react-router-dom';
import {
    TextField,
    EmailField,
    Page, 
    DebuggerView
  } from '@department-of-veterans-affairs/va-forms-system-core';

export default function PersonalInformationPage() {
    return (
        <>
            <Page title="Personal Information" nextPage="page-two">
                <TextField name="firstName" label="First name"/>
                <TextField name="lastName" label="Last name"/>
                <EmailField name="email" label="Email" />
                <DebuggerView />
            </Page>
        </>
    )
}