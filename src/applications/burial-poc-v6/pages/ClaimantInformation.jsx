import React, { useEffect } from 'react';
import {
  TextField,
  FullNameField,
  Page,
  RadioGroup,
  CheckboxField,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import ExpandingGroup from '../components/ExpandingGroup';

export default function ClaimantInformation(props) {
  const { values, setFieldValue } = useFormikContext();
  const getOptions = [
    { label: 'Spouse', value: 'spouse', key: 1 },
    { label: 'Child', value: 'child', key: 2 },
    { label: 'Parent', value: 'parent', key: 3 },
    {
      label: 'Executor/Administrator of estate',
      value: 'executorAdministratorEstate',
      key: 4,
    },
    { label: 'Other', value: 'other', key: 5 },
  ];

  useEffect(
    () => {
      if (values.relationship.type !== 'other') {
        setFieldValue('relationship.other', '');
        setFieldValue('claimingAsFirm', undefined);
        // Burial Allowance field depends on relationship value is equals to 'Other'
        // Remove benefitsUnclaimedRemains field when relationship is not 'Other
        setFieldValue('benefitsUnclaimedRemains', undefined);
      }

      if (values.relationship.type !== 'spouse') {
        // Burial Allowance field depends on relationship value is equals to 'Spouse'
        // Remove previouslyReceivedAllowance field when relationship is not 'Spouse
        setFieldValue('previouslyReceivedAllowance', undefined);
      }
    },
    [values.relationship.type],
  );

  return (
    <>
      <Page {...props} fieldNames={['claimantFullName', 'relationship']}>
        <p>
          You aren’t required to fill in all fields, but we can review your
          application faster if you provide more information.
        </p>
        <FullNameField
          name="claimantFullName"
          label="your"
          legend="Full Name"
          legendClasses="sr-only"
        />
        <div>
          <RadioGroup
            name="relationship.type"
            label="Relationship to the deceased Veteran"
            required
            options={getOptions}
          />
          {values.relationship.type === 'other' && (
            <ExpandingGroup open showPlus>
              <TextField
                name="relationship.other"
                label="Please specify claimant's relationship to deceased Veteran"
                required={values.relationship.type === 'other'}
              />
              <CheckboxField
                name="claimingAsFirm"
                label="Claiming as a firm, corporation or state agency"
              />
            </ExpandingGroup>
          )}
        </div>
      </Page>
    </>
  );
}
