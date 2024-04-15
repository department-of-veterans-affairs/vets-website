import React, { useState, useEffect } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { CustomCheckboxRadioReviewPage } from '../components/CustomCheckboxRadioReviewPage';

import { additionalFilesHint } from '../helpers/wordingCustomization';
import { applicantWording } from '../../shared/utilities';

const keyname = 'applicantHasOhi';

function generateOptions({ data, pagePerItemIndex }) {
  const applicant = applicantWording(
    data?.applicants?.[pagePerItemIndex],
    undefined,
    false,
  );

  // const useFirstPerson =
  //   data?.certifierRole === 'applicant' && +pagePerItemIndex === 0;

  const options = [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ];
  return {
    options,
    useFirstPerson: false,
    applicant,
    keyname,
    description: 'Has other health insurance',
  };
}

export function ApplicantOhiStatusReviewPage(props) {
  return CustomCheckboxRadioReviewPage({
    ...props,
    useLabels: false,
    generateOptions,
  });
}

export default function ApplicantOhiStatusPage({
  data,
  goBack,
  goForward,
  pagePerItemIndex,
  setFormData,
  updatePage,
  onReviewPage,
}) {
  const [checkValue, setCheckValue] = useState(
    data?.applicants?.[pagePerItemIndex]?.[keyname],
  );
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState(undefined);
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
      setCheckValue(detail.value);
      setDirty(true);
    },

    onGoForward: event => {
      setDirty(true);
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
          } have other health insurance (other than Medicare)?`}
          hint={additionalFilesHint}
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

ApplicantOhiStatusReviewPage.propTypes = {
  data: PropTypes.object,
};

ApplicantOhiStatusPage.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
