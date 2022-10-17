import React from 'react';
import {
  AddressField,
  EmailField,
  Page,
  PhoneField,
  TextField,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

export default function ClaimantContactInformation(props) {
  const formikContext = useFormikContext();

  return (
    <>
      <Page
        {...props}
        fieldNames={[
          'firmName',
          'officialPosition',
          'claimantAddress',
          'claimantEmail',
          'claimantPhone',
        ]}
      >
        {formikContext?.values?.relationship?.isEntity && (
          <>
            <TextField
              label="Full name of firm, corporation or state agency"
              name="firmName"
            />
            <TextField
              label="Position of person signing on behalf of firm, corporation or state agency"
              name="officialPosition"
            />
          </>
        )}
        <AddressField
          label="Address"
          name="claimantAddress"
          legend="Full Address"
          legendClasses="sr-only"
          srOnlyLegend
        />
        <EmailField label="Email Address" name="claimantEmail" />
        <PhoneField label="Phone number" name="claimantPhone" />
      </Page>
    </>
  );
}
