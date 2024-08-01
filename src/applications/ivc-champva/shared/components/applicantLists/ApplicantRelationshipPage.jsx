import React, { useState, useEffect } from 'react';
import {
  VaButton,
  VaRadio,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import PropTypes from 'prop-types';

import { additionalFilesHint } from '../../../10-10D/helpers/wordingCustomization';
import { applicantWording } from '../../utilities';

/*
Overriding these allows us to set custom property titles.
This is part of the slow advance towards converting this component
into a generally custom "Radio options + other dropdown" since it's
needed in multiple places in this form.
*/
const KEYNAME = 'applicantRelationshipToSponsor';
const PRIMARY = 'relationshipToVeteran';
const SECONDARY = 'otherRelationshipToVeteran';

export function appRelBoilerplate({ data, pagePerItemIndex }) {
  const { keyname = KEYNAME } = data;
  const currentListItem = data?.applicants?.[pagePerItemIndex];
  const personTitle = 'Sponsor';
  const applicant = applicantWording(currentListItem, false);

  const relativePossessive = applicantWording(currentListItem, true, false);

  return {
    keyname,
    currentListItem,
    personTitle,
    applicant,
    useFirstPerson: false,
    relative: applicant,
    beingVerbPresent: 'is',
    relativePossessive,
  };
}

function generateOptions({ data, pagePerItemIndex }) {
  const {
    keyname,
    currentListItem,
    personTitle,
    applicant,
    useFirstPerson,
    relativePossessive,
  } = appRelBoilerplate({ data, pagePerItemIndex });

  // Create dynamic radio labels based on above phrasing
  const options = [
    {
      label: `${
        data.sponsorIsDeceased ? 'Surviving s' : 'S'
      }pouse or partner from a legal union (including a civil union or common-law marriage`,
      value: 'spouse',
    },
    {
      label: `${
        data.sponsorIsDeceased ? 'Surviving c' : 'C'
      }hild (including adopted children or step children)`,
      value: 'child',
    },
    {
      label: 'Other relationship',
      value: 'other',
    },
  ];

  return {
    options,
    useFirstPerson,
    relativePossessive,
    applicant,
    personTitle,
    keyname,
    currentListItem,
    description: `What’s ${
      useFirstPerson ? `your` : `${applicant}’s`
    } relationship to the ${personTitle}?`,
  };
}

export function ApplicantRelationshipReviewPage(props) {
  const { data, keyname = KEYNAME, primary = PRIMARY, secondary = SECONDARY } =
    props || {};
  const genOps = props.genOp || generateOptions;
  const {
    currentListItem,
    options,
    customOtherDescription,
    description,
    useFirstPerson,
    applicant,
    personTitle,
  } = genOps(props);
  const other = currentListItem?.[keyname]?.[secondary];
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
                opt.value === currentListItem?.[keyname]?.[primary]
                  ? opt.label
                  : '',
            )}
          </dd>
        </div>

        {other ? (
          <div className="review-row">
            <dt>
              {customOtherDescription || (
                <>
                  Since {useFirstPerson ? 'your' : `${applicant}’s `}{' '}
                  relationship with the {personTitle} was not listed, please
                  describe it here
                </>
              )}
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
  genOp,
  setFormData,
  goBack,
  goForward,
  keyname = KEYNAME,
  primary = PRIMARY,
  secondary = SECONDARY,
  pagePerItemIndex,
  updatePage,
  onReviewPage,
}) {
  const relationshipStructure = {
    [primary]: undefined,
    [secondary]: undefined,
  };
  const [checkValue, setCheckValue] = useState(
    data?.applicants?.[pagePerItemIndex]?.[keyname] || relationshipStructure,
  );
  const [checkError, setCheckError] = useState(undefined);
  const [inputError, setInputError] = useState(undefined);
  const [dirty, setDirty] = useState(false);
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = <button type="submit">Update page</button>;
  const genOps = genOp || generateOptions;
  const {
    options,
    relativePossessive,
    useFirstPerson,
    applicant,
    personTitle,
    customTitle,
    customHint,
    description,
    customOtherDescription,
  } = genOps({
    data,
    pagePerItemIndex,
  });

  const handlers = {
    validate() {
      let isValid = true;
      if (!checkValue[primary]) {
        setCheckError('This field is required');
        isValid = false;
      } else {
        setCheckError(null); // Clear any existing err msg
      }
      if (checkValue[primary] === 'other' && !checkValue[secondary]) {
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
              [primary]: detail.value,
              [secondary]: undefined,
            }
          : { [primary]: detail.value };
      setDirty(true);
      setCheckValue(val);
      handlers.validate();
    },
    inputUpdate: ({ target }) => {
      const val = checkValue;
      val[secondary] = target.value;
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
          customTitle ||
            `${
              useFirstPerson ? `Your` : `${applicant}’s`
            } relationship to the ${personTitle}`,
        )['ui:title']
      }

      <form onSubmit={handlers.onGoForward}>
        <VaRadio
          class="vads-u-margin-y--2"
          label={
            description ||
            `What ${data.sponsorIsDeceased ? 'was' : 'is'} ${
              useFirstPerson ? `your` : `${applicant}’s`
            } relationship to the ${personTitle}?`
          }
          hint={customHint || additionalFilesHint}
          required
          error={checkError}
          onVaValueChange={handlers.radioUpdate}
          name={`root_${keyname}`}
        >
          {options.map(option => (
            <va-radio-option
              key={option.value}
              name={`root_${keyname}`}
              label={option.label}
              value={option.value}
              checked={checkValue[primary] === option.value}
              uswds
              aria-describedby={
                checkValue[primary] === option.value ? option.value : null
              }
            />
          ))}
        </VaRadio>
        {checkValue[primary] === 'other' && (
          <div
            className={
              checkValue[primary] === 'other'
                ? 'form-expanding-group form-expanding-group-open'
                : ''
            }
          >
            <div className="form-expanding-group-inner-enter-done">
              <div className="schemaform-expandUnder-indent">
                <VaTextInput
                  label={
                    customOtherDescription ||
                    `Since ${relativePossessive} relationship with the ${personTitle} was not listed, please describe it here`
                  }
                  name="other-relationship-description"
                  onInput={handlers.inputUpdate}
                  required={checkValue[primary] === 'other'}
                  error={inputError}
                  value={checkValue[secondary]}
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
  genOp: PropTypes.func,
  keyname: PropTypes.string,
  title: PropTypes.func,
};

ApplicantRelationshipPage.propTypes = {
  data: PropTypes.object,
  genOp: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  keyname: PropTypes.string,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  primary: PropTypes.string,
  secondary: PropTypes.string,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
