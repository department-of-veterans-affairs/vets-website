import React, { useState } from 'react';
import {
  VaButton,
  VaRadio,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import NavUpdateButton from '../helpers/NavUpdateButton';
import { applicantWording } from '../helpers/wordingCustomization';

// TODO:
// - Add props validation
const keyname = 'applicantRelationshipToSponsor';

function generateOptions({ data, pagePerItemIndex }) {
  const currentListItem = data?.applicants?.[pagePerItemIndex];
  const personTitle = 'Sponsor';
  const applicant = applicantWording(currentListItem).slice(0, -3); // remove 's_

  // Determine what tense/person the phrasing should be in
  const useFirstPerson =
    data?.certifierRole === 'applicant' && +pagePerItemIndex === 0;

  // Set up grammatically appropriate articles
  const relativeBeingVerb = `${`${
    !useFirstPerson
      ? `${applicant} ${data.sponsorIsDeceased ? 'was' : 'is'}`
      : `${data.sponsorIsDeceased ? 'I was' : 'I’m'}`
  }`}`;

  const relativePossessive = `${`${
    useFirstPerson ? 'your' : `${applicant}’s`
  }`}`;

  // Create dynamic radio labels based on above phrasing;
  // e.g., if sponsor is deceased and we're the applicant,
  // phrasing would be like "I was the Sponsor's spouse".
  const options = [
    {
      label: `${relativeBeingVerb} the ${personTitle}'s spouse`,
      value: 'spouse',
    },
    {
      label: `${relativeBeingVerb} the ${personTitle}'s child`,
      value: 'child',
    },
    {
      label: `${relativeBeingVerb} the ${personTitle}'s caretaker`,
      value: 'caretaker',
    },
    {
      label: `${`${
        applicant && !useFirstPerson ? `${applicant} doesn’t` : 'We don’t'
      }`} have a relationship that’s listed here`,
      value: 'other',
    },
  ];

  return {
    options,
    useFirstPerson,
    relativePossessive,
    relativeBeingVerb,
    applicant,
    personTitle,
    keyname,
    currentListItem,
    description: `Relationship to ${personTitle}`,
  };
}

const relationshipStructure = {
  relationshipToVeteran: undefined,
  otherRelationshipToVeteran: undefined,
};

export function ApplicantRelationshipReviewPage(props) {
  const { data } = props || {};
  const { options, description, personTitle } = generateOptions(props);
  const currentApp = data?.applicants?.[props.pagePerItemIndex];
  const other = currentApp?.[keyname]?.otherRelationshipToVeteran;
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
                opt.value === currentApp?.[keyname]?.relationshipToVeteran
                  ? opt.label
                  : '',
            )}
          </dd>
        </div>

        {other ? (
          <div className="review-row">
            <dt>Other relationship to {personTitle}</dt>
            <dd>{other}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  ) : null;
}

export default function ApplicantRelationshipPage({
  data,
  setFormData,
  goBack,
  goForward,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const [checkValue, setCheckValue] = useState(
    data?.applicants?.[pagePerItemIndex]?.applicantRelationshipToSponsor ||
      relationshipStructure,
  );

  const {
    options,
    relativePossessive,
    currentListItem,
    personTitle,
  } = generateOptions({
    data,
    pagePerItemIndex,
  });

  const handlers = {
    radioUpdate: ({ detail }) => {
      const val =
        detail.value === 'other'
          ? {
              relationshipToVeteran: detail.value,
              otherRelationshipToVeteran: undefined,
            }
          : { relationshipToVeteran: detail.value };
      setCheckValue(val);
    },

    inputUpdate: ({ target }) => {
      const val = checkValue;
      val.otherRelationshipToVeteran = target.value;
      setCheckValue(val);
    },

    onGoBack: () => {
      goBack();
    },

    onGoForward: event => {
      event.preventDefault();

      // TODO: implement proper validation before proceeding
      // i.e., if 'other' is required, it must be filled out
      const testVal = { ...data }; // is this useful? It's a shallow copy.

      testVal.applicants[
        pagePerItemIndex
      ].applicantRelationshipToSponsor = checkValue;

      setFormData(testVal); // Commit changes to the actual formdata
      if (onReviewPage) updatePage();
      goForward(data);
    },
  };

  return (
    <>
      {
        titleUI(
          `${applicantWording(currentListItem)} relationship to ${personTitle}`,
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaRadio
          class="vads-u-margin-y--2"
          label={`What's ${applicantWording(
            currentListItem,
          )} relationship to the ${personTitle}?`}
          required
          onVaValueChange={handlers.radioUpdate}
        >
          {options.map(option => (
            <va-radio-option
              key={option.value}
              name="describes-you"
              label={option.label}
              value={option.value}
              checked={checkValue.relationshipToVeteran === option.value}
              aria-describedby={
                checkValue.relationshipToVeteran === option.value
                  ? option.value
                  : null
              }
            />
          ))}
        </VaRadio>
        {checkValue.relationshipToVeteran === 'other' && (
          <div
            className={
              checkValue.relationshipToVeteran === 'other'
                ? 'form-expanding-group form-expanding-group-open'
                : ''
            }
          >
            <div className="form-expanding-group-inner-enter-done">
              <div className="schemaform-expandUnder-indent">
                <VaTextInput
                  label={`Since ${relativePossessive} relationship with the ${personTitle} was not listed, please describe it here`}
                  onInput={handlers.inputUpdate}
                  required={checkValue.relationshipToVeteran === 'other'}
                  value={checkValue.otherRelationshipToVeteran}
                  uswds
                />
              </div>
            </div>
          </div>
        )}

        <NavUpdateButton
          goBack={goBack}
          onGoForward={handlers.onGoForward}
          onReviewPage={onReviewPage}
        />
      </form>
    </>
  );
}
