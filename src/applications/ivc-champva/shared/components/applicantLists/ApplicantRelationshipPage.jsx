import React, { useState, useEffect, useRef } from 'react';
import {
  VaButton,
  VaRadio,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import { CustomPageNavButtons } from '../CustomPageNavButtons';

import { ADDITIONAL_FILES_HINT } from '../../constants';
import { applicantWording } from '../../utilities';
import { validateText } from '../../validations';

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
  const personTitle = 'Veteran';
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

/**
 * Assembles radio options and returns customized wording for use in the display
 * @param {Object} param0.data Formdata object
 * @param {Number|String} param0.pagePerItemIndex list loop current index
 * @param {Object} param0.customWordingloop Object containing custom wording overrides.
 *  Wording that may be overridden includes: personTitle, customTitle, customHint,
 *  description, customOtherDescription.
 * @returns
 */
function generateOptions({ data, pagePerItemIndex, customWording }) {
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
      }pouse or partner from a legal union (including a civil union or common-law marriage)`,
      value: 'spouse',
    },
    {
      label: `${
        data.sponsorIsDeceased ? 'Surviving c' : 'C'
      }hild (including adopted children or step children)`,
      value: 'child',
    },
  ];

  return {
    ...customWording,
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
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 dd-privacy-hidden">
          {props.title(currentListItem)}
        </h4>
        <VaButton
          secondary
          onClick={props.editPage}
          text="Edit"
          label={`Edit ${props.title(currentListItem)}`}
          uswds
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt className="dd-privacy-hidden">{description}</dt>
          <dd className="dd-privacy-hidden">
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
                  Since{' '}
                  <span className="dd-privacy-hidden">
                    {useFirstPerson ? 'your' : `${applicant}’s `}
                  </span>{' '}
                  relationship with the{' '}
                  <span className="dd-privacy-hidden">{personTitle}</span> was
                  not listed, please describe it here
                </>
              )}
            </dt>
            <dd className="dd-privacy-hidden">{other}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  ) : null;
}

export default function ApplicantRelationshipPage(props) {
  const {
    data,
    fullData,
    genOp,
    setFormData,
    goForward,
    keyname = KEYNAME,
    primary = PRIMARY,
    secondary = SECONDARY,
    pagePerItemIndex,
    updatePage,
    onReviewPage,
    customWording,
  } = props;

  // fulldata is present in array builder pages:
  const fullOrItemData = fullData ?? data;
  const relationshipStructure = {
    [primary]: undefined,
    [secondary]: undefined,
  };
  const [checkValue, setCheckValue] = useState(
    fullOrItemData?.applicants?.[pagePerItemIndex]?.[keyname] ||
      relationshipStructure,
  );
  const [checkError, setCheckError] = useState(undefined);
  const [inputError, setInputError] = useState(undefined);
  const [dirty, setDirty] = useState(false);

  const radioRef = useRef(null); // Used to set focus when in error state

  const navButtons = CustomPageNavButtons(props);

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
    data: fullOrItemData,
    pagePerItemIndex,
    customWording, // For hint override when using default configuration
  });

  const setFocusOnRadio = () => {
    if (radioRef.current) {
      const element =
        radioRef.current.querySelector('input') || radioRef.current;
      element.focus();
    }
  };

  const handlers = {
    validate: (nextValue = checkValue) => {
      let isValid = true;

      // clear any existing errors
      setCheckError(undefined);
      setInputError(undefined);

      // primary field validation
      if (!nextValue[primary]) {
        setCheckError('This field is required');
        isValid = false;
      }

      // secondary field validation (for "other" option)
      if (nextValue[primary] === 'other') {
        if (!nextValue[secondary]) {
          setInputError('This field is required');
          isValid = false;
        } else {
          const errMsg = validateText(nextValue[secondary]);
          if (errMsg) {
            setInputError(errMsg);
            isValid = false;
          }
        }
      }

      // spouse validation - only one spouse allowed
      if (nextValue[primary] === 'spouse') {
        const hasExistingSpouse = fullOrItemData.applicants?.some(
          (item, idx) =>
            item?.applicantRelationshipToSponsor?.relationshipToVeteran ===
              'spouse' && idx !== parseInt(pagePerItemIndex, 10),
        );
        if (hasExistingSpouse) {
          setCheckError(
            'Only one applicant can have a spousal or partner relationship to the Veteran',
          );
          isValid = false;
        }
      }

      // we have an error, set focus on the input
      if (!isValid) setFocusOnRadio();

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
      handlers.validate(val);
    },
    inputUpdate: ({ target }) => {
      const val = { ...checkValue, [secondary]: target.value };
      setDirty(true);
      setCheckValue(val);
      handlers.validate(val);
    },
    onGoForward: event => {
      event.preventDefault();
      if (!handlers.validate()) return;
      const testVal = { ...fullOrItemData };
      testVal.applicants[pagePerItemIndex][keyname] = checkValue;
      setFormData(testVal);
      if (onReviewPage) updatePage();
      goForward({ formData: data });
    },
  };

  useEffect(
    () => {
      if (dirty) handlers.validate(checkValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkValue],
  );
  return (
    <>
      <form onSubmit={handlers.onGoForward}>
        <span className="dd-privacy-hidden">
          {
            titleUI(
              customTitle ||
                `${
                  useFirstPerson ? `Your` : `${applicant}’s`
                } relationship to the ${personTitle}`,
            )['ui:title']
          }
        </span>
        <VaRadio
          class="vads-u-margin-y--2 dd-privacy-hidden"
          label={
            description ||
            `What ${data.sponsorIsDeceased ? 'was' : 'is'} ${
              useFirstPerson ? `your` : `${applicant}’s`
            } relationship to the ${personTitle}?`
          }
          hint={customHint || ADDITIONAL_FILES_HINT}
          required
          error={checkError ?? undefined}
          onVaValueChange={handlers.radioUpdate}
          name={`root_${keyname}`}
          ref={radioRef}
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
  contentAfterButtons: PropTypes.object,
  customWording: PropTypes.object,
  data: PropTypes.object,
  fullData: PropTypes.object,
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
