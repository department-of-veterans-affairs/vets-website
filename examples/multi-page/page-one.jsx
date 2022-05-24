import React from 'react';
import {
  DateField,
  DebuggerView,
  FullNameField,
  Page,
  RadioGroup
} from '@department-of-veterans-affairs/va-forms-system-core';

export default function PersonalInformationPage() {
  return (
    <>
      <Page title="Step 1 of 6: Claimant Information" nextPage="/page-two" prevPage="/">
        <FullNameField name="claimantFullName"/>
        <RadioGroup
          name="relationship.type"
          label="Relationship to the deceased Veteran"
          required
          options={
            [
              {label: "Spouse", value: "Spouse", key: 1, checked: false},
              {label: "Child", value: "Child", key: 2, checked: false},
              {label: "Parent", value: "Parent", key: 3, checked: false},
              {label: "Executor/Administrator of estate", value: "Executor/Administrator of estate", key: 4, checked: false},
              {label: "Other", value: "Other", key: 5, checked: false},
            ]
          }
        />
        <DateField name="dob" label="Date of burial(includes cremation or interment)" required/>
      </Page>
      <DebuggerView />
    </>
  )
}