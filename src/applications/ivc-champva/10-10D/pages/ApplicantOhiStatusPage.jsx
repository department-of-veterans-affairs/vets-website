import React, { useState } from 'react';
import {
  VaRadio,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import NavUpdateButton from '../helpers/NavUpdateButton';
import { applicantWording } from '../helpers/wordingCustomization';

// TODO:
// - Update labels on display page

const keyname = 'applicantHasOhi';

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
              opt => (opt.value === currentApp?.[keyname] ? opt.label : ''),
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

  const { options, useFirstPerson, applicant } = generateOptions({
    data,
    pagePerItemIndex,
  });

  const handlers = {
    radioUpdate: ({ detail }) => {
      setCheckValue(detail.value);
    },

    onGoBack: () => {
      goBack();
    },

    onGoForward: event => {
      event.preventDefault();

      const testVal = { ...data };

      testVal.applicants[pagePerItemIndex].applicantHasOhi = checkValue;

      setFormData(testVal); // Commit changes to the actual formdata
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

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

        <NavUpdateButton
          goBack={goBack}
          onGoForward={handlers.onGoForward}
          onReviewPage={onReviewPage}
        />
      </form>
    </>
  );
}
