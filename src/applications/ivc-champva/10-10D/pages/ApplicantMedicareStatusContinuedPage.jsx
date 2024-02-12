import React, { useEffect, useState } from 'react';
import {
  VaCheckboxGroup,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import NavUpdateButton from '../helpers/NavUpdateButton';
import { applicantWording } from '../helpers/wordingCustomization';

// TODO:
// - Proptype validation
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

  return { labels, useFirstPerson, applicant, description: 'Medicare parts' };
}

export function ApplicantMedicareStatusContinuedReviewPage(props) {
  const { data } = props || {};
  const { labels, description } = generateOptions(props);
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
            {labels
              .filter(el =>
                currentApp?.applicantMedicarePart?.includes(el.value),
              )
              .map(el => el.title)
              .join(', ')}
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
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

  const { labels, useFirstPerson, applicant } = generateOptions({
    data,
    pagePerItemIndex,
  });

  useEffect(
    () => {
      setAllLabels(
        labels.map(label =>
          data?.applicants?.[pagePerItemIndex]?.applicantMedicarePart?.includes(
            label.value,
          ),
        ),
      );
    },
    [data],
  );

  const handlers = {
    onGroupChange: event => {
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

    onGoBack: () => {
      goBack();
    },

    onGoForward: event => {
      event.preventDefault();
      const testVal = { ...data };
      testVal.applicants[pagePerItemIndex].applicantMedicarePart = stringArr;
      setFormData(testVal); // Commit changes to the actual formdata
      if (onReviewPage) updatePage(); // TODO: fix this logic per docs
      goForward(data);
    },
  };

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

        <NavUpdateButton
          goBack={goBack}
          onGoForward={handlers.onGoForward}
          onReviewPage={onReviewPage}
        />
      </form>
    </>
  );
}
