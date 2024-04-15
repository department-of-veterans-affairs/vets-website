import React, { useEffect } from 'react';
import {
  FullNameField,
  Page,
  RadioGroup,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import ExpandingGroup from '../components/ExpandingGroup';

export default function PreviousNames(props) {
  const { values, setFieldValue } = useFormikContext();

  useEffect(
    () => {
      if (
        values?.previousNames &&
        values?.veteranServedUnderAnotherName === 'false'
      ) {
        setFieldValue(`previousNames`, [
          {
            first: '',
            middle: '',
            last: '',
            suffix: '',
          },
        ]);
      }
    },
    [values?.veteranServedUnderAnotherName],
  );

  return (
    <>
      <Page
        {...props}
        fieldNames={['veteranServedUnderAnotherName', 'previousNames']}
      >
        <div>
          <RadioGroup
            name="veteranServedUnderAnotherName"
            label="Did the Veteran serve under another name?"
            required
            options={[
              { label: 'Yes', value: true, key: 1 },
              { label: 'No', value: false, key: 2 },
            ]}
          />
          {values?.veteranServedUnderAnotherName === 'true' ? (
            <ExpandingGroup open showPlus>
              <FullNameField name="previousNames[0]" />
              <va-button disabled text="Add another name" />
            </ExpandingGroup>
          ) : null}
        </div>
      </Page>
    </>
  );
}
