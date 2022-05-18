import React from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Page,
  DebuggerView,
} from '@department-of-veterans-affairs/va-forms-system-core';

export default function ContactInformationPage() {
  return (
    <>
      <Page title="Address Information" nextPage="/" prevPage="/page-one">
        <TextField name="street" label="Street line 1" />
        <TextField name="streetTwo" label="Street line 2" />
        <TextField name="streetThree" label="Street line 3" />
        <TextField name="state" label="State" />
        <TextField name="zipcode" label="Zip code" />
      </Page>
      <DebuggerView />
    </>
  )
}