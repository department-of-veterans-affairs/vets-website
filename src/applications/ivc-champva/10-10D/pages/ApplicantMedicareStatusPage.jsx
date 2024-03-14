import React, { useState, useEffect } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { CustomCheckboxRadioReviewPage } from '../components/CustomCheckboxRadioReviewPage';

import { applicantWording } from '../helpers/wordingCustomization';

const keyname = 'applicantMedicareStatus';

export function generateOptions({ data, pagePerItemIndex }) {
  const applicant = applicantWording(
    data?.applicants?.[pagePerItemIndex],
    undefined,
    false,
  );

  const useFirstPerson =
    data?.certifierRole === 'applicant' && +pagePerItemIndex === 0;

  const options = [
    {
      label: `Yes, ${
        useFirstPerson ? "I'm" : `${applicant} is `
      } enrolled in Medicare`,
      value: 'enrolled',
    },
    {
      label: `No, ${
        useFirstPerson ? "I'm" : `${applicant} is `
      } 65 or over, eligible, but not enrolled in Medicare`,
      value: 'over65Eligible',
    },
    {
      label: `No, ${
        useFirstPerson ? "I'm" : `${applicant} is `
      } 65 or over and not eligible for Medicare`,
      value: 'over65Ineligible',
    },
    {
      label: `No, ${
        useFirstPerson ? "I'm" : `${applicant} is `
      } under 65 and not eligible for Medicare`,
      value: 'under65Ineligible',
    },
  ];

  return {
    options,
    useFirstPerson,
    applicant,
    keyname,
    description: 'Enrolled in Medicare',
  };
}

export function ApplicantMedicareStatusReviewPage(props) {
  return CustomCheckboxRadioReviewPage({
    ...props,
    useLabels: false,
    generateOptions,
  });
}

export function ApplicantMedicareStatusPage({
  data,
  setFormData,
  goBack,
  goForward,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const [checkValue, setCheckValue] = useState(
    data?.applicants?.[pagePerItemIndex]?.[keyname],
  );
  const [error, setError] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
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
      setDirty(true);
      setCheckValue(detail.value);
    },
    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const testVal = { ...data };
      testVal.applicants[pagePerItemIndex][keyname] = checkValue;
      setFormData(testVal); // Commit changes to the actual formdata
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  useEffect(
    () => {
      if (dirty) handlers.validate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, checkValue],
  );

  return (
    <>
      {
        titleUI(
          `${useFirstPerson ? `Your` : `${applicant}'s`} Medicare status`,
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaRadio
          class="vads-u-margin-y--2"
          label={`${
            useFirstPerson ? `Are you` : `Is ${applicant}`
          } enrolled in Medicare?`}
          required
          error={error}
          uswds
          onVaValueChange={handlers.radioUpdate}
        >
          {options.map(option => (
            <va-radio-option
              key={option.value}
              name="describes-you"
              label={option.label}
              value={option.value}
              checked={checkValue === option.value}
              uswds
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

ApplicantMedicareStatusReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  props: PropTypes.object,
  title: PropTypes.func,
};

ApplicantMedicareStatusPage.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
