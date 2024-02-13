import React, { useState, useEffect } from 'react';
import {
  VaRadio,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { applicantWording } from '../helpers/wordingCustomization';

function generateOptions({ data, pagePerItemIndex }) {
  const applicant = applicantWording(
    data?.applicants?.[pagePerItemIndex],
  ).slice(0, -3); // remove 's_

  const useFirstPerson =
    data?.certifierRole === 'applicant' && +pagePerItemIndex === 0;

  const options = [
    {
      label: `Yes, ${
        useFirstPerson ? 'I have' : `${applicant} has `
      } other health insurance`,
      value: 'yes',
    },
    {
      label: `No, ${
        useFirstPerson ? "I don't have" : `${applicant} doesn't have `
      } other health insurance`,
      value: 'no',
    },
  ];
  return {
    options,
    useFirstPerson,
    applicant,
    description: 'Has other health insurance',
  };
}

export function ApplicantOhiStatusReviewPage(props) {
  const { data } = props || {};
  const { options, description } = generateOptions(props);
  const currentApp = data?.applicants?.[props.pagePerItemIndex];
  return data ? (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {props.title(currentApp)}
        </h4>
        <VaButton secondary onClick={props.editPage} text="Edit" uswds />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{description}</dt>
          <dd>
            {options.map(
              opt =>
                opt.value === currentApp?.applicantHasOhi ? opt.label : '',
            )}
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
}

export default function ApplicantOhiStatusPage({
  data,
  setFormData,
  goBack,
  goForward,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const [checkValue, setCheckValue] = useState(
    data?.applicants?.[pagePerItemIndex]?.applicantHasOhi,
  );
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState(undefined);
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Update page</button>;
  const { options, useFirstPerson, applicant } = generateOptions({
    data,
    pagePerItemIndex,
  });

  const handlers = {
    validate() {
      let isValid = true;
      if (!checkValue) {
        setError('This field is required');
        isValid = false;
      } else {
        setError(null); // Clear any existing err msg
      }
      return isValid;
    },
    radioUpdate: ({ detail }) => {
      setCheckValue(detail.value);
      setDirty(true);
    },

    onGoForward: event => {
      setDirty(true);
      event.preventDefault();
      if (!handlers.validate()) return;
      const testVal = { ...data };
      testVal.applicants[pagePerItemIndex].applicantHasOhi = checkValue;
      setFormData(testVal); // Commit changes to the actual formdata
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  useEffect(
    () => {
      if (dirty) handlers.validate();
    },
    [checkValue],
  );

  return (
    <>
      {
        titleUI(
          `${
            useFirstPerson ? 'Your' : `${applicant}'s`
          } other health insurance status`,
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaRadio
          class="vads-u-margin-y--2"
          label={`${
            useFirstPerson ? 'Do you' : `Does ${applicant}`
          } have other health insurance (that is not Medicare)?`}
          required
          error={error}
          onVaValueChange={handlers.radioUpdate}
        >
          {options.map(option => (
            <va-radio-option
              key={option.value}
              name="describes-you"
              label={option.label}
              value={option.value}
              checked={checkValue === option.value}
              aria-describedby={
                checkValue === option.value ? option.value : null
              }
            />
          ))}
        </VaRadio>

        {onReviewPage ? updateButton : navButtons}
      </form>
    </>
  );
}
