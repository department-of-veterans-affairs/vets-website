import React, { useEffect, useState } from 'react';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';
import { CustomCheckboxRadioReviewPage } from '../components/CustomCheckboxRadioReviewPage';
import { applicantWording } from '../helpers/wordingCustomization';

const keyname = 'applicantMedicarePart';

function generateOptions({ data, pagePerItemIndex }) {
  const applicant = applicantWording(
    data?.applicants?.[pagePerItemIndex],
  ).slice(0, -3); // remove 's_

  // Determine what tense/person the phrasing should be in
  const useFirstPerson =
    data?.certifierRole === 'applicant' && +pagePerItemIndex === 0;

  const labels = [
    {
      value: 'partA',
      title: 'Part A',
      description: `${
        useFirstPerson ? "I'm" : `${applicant} is `
      } enrolled in Medicare Part A`,
    },
    {
      value: 'partB',
      title: 'Part B',
      description: `${
        useFirstPerson ? "I'm" : `${applicant} is `
      } enrolled in Medicare Part A`,
    },
    {
      value: 'partD',
      title: 'Part D',
      description: `${
        useFirstPerson ? "I'm" : `${applicant} is `
      } enrolled in Medicare Part D`,
    },
  ];

  return {
    labels,
    useFirstPerson,
    applicant,
    keyname,
    description: 'Medicare parts',
  };
}

export function ApplicantMedicareStatusContinuedReviewPage(props) {
  return CustomCheckboxRadioReviewPage({
    ...props,
    useLabels: true,
    generateOptions,
  });
}

export default function ApplicantMedicareStatusContinuedPage({
  data,
  setFormData,
  goBack,
  goForward,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const [allLabels, setAllLabels] = useState([]);
  const [stringArr, setStringArr] = useState('');
  const [error, setError] = useState(undefined);
  const [dirty, setDirty] = useState(false);

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = <button type="submit">Update page</button>;
  const { labels, useFirstPerson, applicant } = generateOptions({
    data,
    pagePerItemIndex,
  });

  useEffect(
    () => {
      setAllLabels(
        labels.map(label =>
          data?.applicants?.[pagePerItemIndex]?.[keyname]?.includes(
            label.value,
          ),
        ),
      );
      setStringArr(data?.applicants?.[pagePerItemIndex]?.[keyname]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const handlers = {
    validate() {
      let isValid = true;
      if (!stringArr) {
        setError('This field is required');
        isValid = false;
      } else {
        setError(null);
      }
      return isValid;
    },
    onGroupChange: event => {
      setDirty(true);
      const checkboxIndex = Number(event.target.dataset.index);
      const isChecked = event.detail.checked;

      const newData = allLabels.map(
        (val, index) => (index === checkboxIndex ? isChecked : val),
      );

      const dataArray = labels.reduce((result, label, index) => {
        if (newData[index]) {
          result.push(label.value);
        }
        return result;
      }, []);

      setAllLabels(newData);
      setStringArr(dataArray.join(', '));
    },

    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const testVal = { ...data };
      testVal.applicants[pagePerItemIndex][keyname] = stringArr;
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
    [data, stringArr],
  );

  return (
    <>
      {
        titleUI(
          `${
            useFirstPerson ? `Your` : `${applicant}'s`
          } Medicare status (continued)`,
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaCheckboxGroup
          label={`What parts of Medicare ${
            useFirstPerson ? 'are you' : `is ${applicant}`
          } enrolled in?`}
          hint="You can select more than one"
          error={error}
          required
          onVaChange={handlers.onGroupChange}
        >
          {labels.map((el, index) => (
            <va-checkbox
              key={el.title}
              data-index={index}
              label={el.title}
              checked={allLabels?.[index]}
            />
          ))}
        </VaCheckboxGroup>
        {onReviewPage ? updateButton : navButtons}
      </form>
    </>
  );
}

ApplicantMedicareStatusContinuedReviewPage.propTypes = {
  props: PropTypes.object,
};

ApplicantMedicareStatusContinuedPage.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
