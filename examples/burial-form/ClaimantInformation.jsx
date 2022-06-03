import React, { useEffect } from 'react';
import {
  FullNameField,
  Page,
  RadioGroup
} from '@department-of-veterans-affairs/va-forms-system-core';

export default function ClaimantInformation(props) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });
  
  return (
    <>
      <Page {...props} nextPage="/veteran-information" prevPage="/">
        <p>
          You aren’t required to fill in all fields, but we can review your application faster if you provide more information.
        </p>
        <FullNameField name="claimantFullName"/>
        <RadioGroup
          name="relationship.type"
          label="Relationship to the deceased Veteran"
          required
          options={
            [
              {label: "Spouse", value: "Spouse", key: 1},
              {label: "Child", value: "Child", key: 2},
              {label: "Parent", value: "Parent", key: 3},
              {label: "Executor/Administrator of estate", value: "Executor/Administrator of estate", key: 4},
              {label: "Other", value: "Other", key: 5},
            ]
          }
        />
      </Page>
    </>
  )
}