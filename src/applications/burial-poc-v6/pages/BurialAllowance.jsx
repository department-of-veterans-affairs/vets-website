import React from 'react';
import {
  Page,
  RadioGroup,
  TextField,
} from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

export default function BurialAllowance(props) {
  const { values } = useFormikContext();

  const getBurialAllowanceRequestedOptions = () => {
    const allowanceTypes = [
      {
        label:
          'Service-connected death (for a Veteran death related to, or resulting from, a service-connected disability)',
        value: 'service',
        key: 1,
      },
      {
        label: 'Non-service-connected death',
        value: 'nonService',
        key: 2,
      },
    ];

    const locationOfDeath = values?.locationOfDeath?.location;
    if (
      locationOfDeath === 'vaMedicalCenter' ||
      locationOfDeath === 'nursingHome'
    ) {
      allowanceTypes.push({
        label: 'VA medical center death',
        value: 'vaMC',
        key: 3,
      });
    }
    return allowanceTypes;
  };

  return (
    <>
      <Page
        {...props}
        title="Burial allowance"
        fieldNames={[
          'burialAllowanceRequested',
          'burialCost',
          'previouslyReceivedAllowance',
          'benefitsUnclaimedRemains',
        ]}
      >
        <div
          className={`form-expanding-group ${
            values?.burialAllowanceRequested === 'vaMC'
              ? 'form-expanding-group-open'
              : ''
          }`}
        >
          <RadioGroup
            name="burialAllowanceRequested"
            label="Type of burial allowance requested"
            required
            options={getBurialAllowanceRequestedOptions()}
          />
          {values?.burialAllowanceRequested === 'nonService' && (
            <va-alert
              status="warning"
              background-only
              class="vads-u-margin-y--2"
            >
              <span>
                If filing for a non-service-connected allowance, the Veteran’s
                burial date must be no more than 2 years from the current date.
                Find out if you still qualify.
                <a href="/burials-memorials/eligibility/" target="_blank">
                  Learn about eligibility
                </a>
              </span>
            </va-alert>
          )}
          {values?.burialAllowanceRequested === 'vaMC' && (
            <div className="form-expanding-group-open">
              <TextField label="Actual burial cost" name="burialCost" />
            </div>
          )}
        </div>

        {values?.relationship?.type === 'spouse' && (
          <div className="vads-u-margin-y--3">
            <RadioGroup
              name="previouslyReceivedAllowance"
              label="Did you previously receive a VA burial allowance?"
              required
              options={[
                { label: 'Yes', value: true, key: 1 },
                { label: 'No', value: false, key: 2 },
              ]}
            />
          </div>
        )}

        {values?.relationship?.type === 'Other' && (
          <div className="vads-u-margin-y--3">
            <RadioGroup
              name="benefitsUnclaimedRemains"
              label="Are you seeking burial benefits for the unclaimed remains of a Veteran?"
              required
              options={[
                { label: 'Yes', value: true, key: 1 },
                { label: 'No', value: false, key: 2 },
              ]}
            />
          </div>
        )}
      </Page>
    </>
  );
}
