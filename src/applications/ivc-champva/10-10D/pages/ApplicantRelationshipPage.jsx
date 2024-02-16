import React, { useState, useEffect } from 'react';
import {
  VaButton,
  VaRadio,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';

import { applicantWording } from '../helpers/wordingCustomization';

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

  // Create dynamic radio labels based on above phrasing
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
  const {
    currentListItem,
    options,
    description,
    useFirstPerson,
    applicant,
    personTitle,
  } = generateOptions(props);
  const other = currentListItem?.[keyname]?.otherRelationshipToVeteran;
  return data ? (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {props.title(currentListItem)}
        </h4>
        <VaButton secondary onClick={props.editPage} text="Edit" uswds />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{description}</dt>
          <dd>
            {options.map(
              opt =>
                opt.value === currentListItem?.[keyname]?.relationshipToVeteran
                  ? opt.label
                  : '',
            )}
          </dd>
        </div>

        {other ? (
          <div className="review-row">
            <dt>
              Since {useFirstPerson ? 'your' : `${applicant}'s `} relationship
              with the {personTitle} was not listed, please describe it here
            </dt>
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
    data?.applicants?.[pagePerItemIndex]?.[keyname] || relationshipStructure,
  );
  const [checkError, setCheckError] = useState(undefined);
  const [inputError, setInputError] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = <button type="submit">Update page</button>;
  const {
    options,
    relativePossessive,
    useFirstPerson,
    applicant,
    personTitle,
  } = generateOptions({
    data,
    pagePerItemIndex,
  });

  const handlers = {
    validate() {
      let isValid = true;
      if (!checkValue.relationshipToVeteran) {
        setCheckError('This field is required');
        isValid = false;
      } else {
        setCheckError(null); // Clear any existing err msg
      }
      if (
        checkValue.relationshipToVeteran === 'other' &&
        !checkValue.otherRelationshipToVeteran
      ) {
        setInputError('This field is required');
        isValid = false;
      } else {
        setInputError(null);
      }
      return isValid;
    },
    radioUpdate: ({ detail }) => {
      const val =
        detail.value === 'other'
          ? {
              relationshipToVeteran: detail.value,
              otherRelationshipToVeteran: undefined,
            }
          : { relationshipToVeteran: detail.value };
      setDirty(true);
      setCheckValue(val);
      handlers.validate();
    },
    inputUpdate: ({ target }) => {
      const val = checkValue;
      val.otherRelationshipToVeteran = target.value;
      setDirty(true);
      setCheckValue(val);
      handlers.validate();
    },
    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const testVal = { ...data };
      testVal.applicants[pagePerItemIndex][keyname] = checkValue;
      setFormData(testVal);
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
          `${
            useFirstPerson ? `Your` : `${applicant}'s`
          } relationship to the ${personTitle}`,
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaRadio
          class="vads-u-margin-y--2"
          label={`What's ${
            useFirstPerson ? `your` : `${applicant}'s`
          } relationship to the ${personTitle}?`}
          required
          error={checkError}
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
                  error={inputError}
                  value={checkValue.otherRelationshipToVeteran}
                  uswds
                />
              </div>
            </div>
          </div>
        )}
        {onReviewPage ? updateButton : navButtons}
      </form>
    </>
  );
}

ApplicantRelationshipReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  title: PropTypes.func,
};

ApplicantRelationshipPage.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
