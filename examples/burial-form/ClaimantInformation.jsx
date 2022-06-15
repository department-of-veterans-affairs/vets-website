import React, { useEffect } from 'react';
import {
  TextField,
  FullNameField,
  Page,
  RadioGroup,
  CheckboxField
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';
import { ExpandingGroupClass } from '../Constant';

export default function ClaimantInformation(props) {
  const { values, setFieldValue } = useFormikContext();
  const getOptions = [
    {label: "Spouse", value: "Spouse", key: 1},
    {label: "Child", value: "Child", key: 2},
    {label: "Parent", value: "Parent", key: 3},
    {label: "Executor/Administrator of estate", value: "Executor/Administrator of estate", key: 4},
    {label: "Other", value: "Other", key: 5},
  ]

  useEffect(() => {
    if (values.relationship.type !== "Other") {
      setFieldValue('relationship.other', '')
      setFieldValue('claimingAsFirm', undefined)
    }
  }, [values.relationship.type])

  
  return (
    <>
      <Page {...props}>
        <p>
          You aren’t required to fill in all fields, but we can review your application faster if you provide more information.
        </p>
        <FullNameField name="claimantFullName" label="your"/>
        <div className={values.relationship.type === "Other" ? `${ExpandingGroupClass}` : ''}>
          <RadioGroup
            name="relationship.type"
            label="Relationship to the deceased Veteran"
            required
            options={getOptions}
          />
          {
            values.relationship.type === "Other" && (
              <>
                <TextField 
                    className="vads-u-border-color--primary-alt-light vads-u-border-left--4px vads-u-padding-left--2 vads-u-padding-y--0p5 vads-u-margin-left--neg2p5" 
                    name="relationship.other" 
                    label="Please specify"
                    required={values.relationship.type === 'Other'}    
                />
                <CheckboxField name="claimingAsFirm" label="Claiming as a firm, corporation or state agency" />
              </>
            )
          }
        </div>
      </Page>
    </>
  )
}