import React, { useEffect, useState } from 'react';
import {
  VaButtonPair,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

import { getPreviousYear } from '../utilities/utils';
import { ROUTES } from '../constants';
import { updateDependents, updateEditMode } from '../actions';
import { customizeTitle } from '../utilities/customize-title';

const DependentsPage = ({
  dependents,
  editMode,
  pastMode,
  router,
  toggleEditMode,
  updateDependentsField,
  year,
  zipCode,
}) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const determineH1 = () => {
    return pastMode && year
      ? `How many dependents did you have in ${year - 1}?`
      : `How many dependents did you have last year?`;
  };

  useEffect(() => {
    document.title = customizeTitle(determineH1());
  });

  const dependentsValid = deps => {
    return deps?.match(/^[0-9]+$/) && deps >= 0 && deps <= 100;
  };

  const validDependents = dependents?.length > 0 && dependentsValid(dependents);

  useEffect(
    () => {
      let shouldRedirectToHome = !zipCode;

      if (pastMode) {
        shouldRedirectToHome = !zipCode && !year;
      }

      if (shouldRedirectToHome) {
        router.push(ROUTES.HOME);
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      waitForRenderThenFocus('h1');
    },
    [pastMode, router, year, zipCode],
  );

  const onContinueClick = () => {
    setSubmitted(true);

    if (!validDependents) {
      setError(true);
    } else if (editMode) {
      setError(false);
      toggleEditMode(false);
      router.push(ROUTES.REVIEW);
    } else {
      setError(false);
      router.push(ROUTES.REVIEW);
    }
  };

  const onBlurInput = () => {
    if (validDependents) {
      setError(false);
    }
  };

  const onDependentsInput = event => {
    setError(false);

    if (event?.target?.value) {
      updateDependentsField(parseInt(event.target.value, 10)?.toString());
    } else {
      updateDependentsField('');
    }
  };

  const onBackClick = () => {
    if (editMode) {
      toggleEditMode(false);
    }

    router.push(ROUTES.ZIPCODE);
  };

  return (
    <>
      <h1>{determineH1()}</h1>
      <form>
        <VaNumberInput
          className="vads-u-margin-bottom--1"
          data-testid="il-dependents"
          error={
            (submitted &&
              error &&
              'Please enter a number between 0 and 100.') ||
            null
          }
          hint={`Enter the total number of dependents for ${getPreviousYear(
            pastMode,
            year,
          )}, including your spouse, unmarried children under 18 years old, and other dependents.`}
          id="numberOfDependents"
          inputmode="numeric"
          label="Number of dependents"
          max={99}
          min={0}
          name="numberOfDependents"
          onBlur={onBlurInput}
          onInput={onDependentsInput}
          required
          uswds
          value={dependents || ''}
        />
        <va-additional-info trigger="Who qualifies as a dependent" uswds>
          <div>
            <p className="vads-u-margin-top--0">
              Here&#8217;s who we consider dependents for health care
              eligibility purposes:
            </p>
            <ul>
              <li>Your spouse</li>
              <li>Unmarried children who are under 18 years old</li>
              <li>Adult children who were disabled before age 18</li>
              <li>Children ages 18 to 23 who attend school full time</li>
            </ul>
          </div>
        </va-additional-info>
        <VaButtonPair
          className="vads-u-margin-top--3"
          data-testid="il-buttonPair"
          onPrimaryClick={onContinueClick}
          onSecondaryClick={onBackClick}
          continue
          uswds
        />
      </form>
    </>
  );
};

const mapStateToProps = state => ({
  dependents: state?.incomeLimits?.form?.dependents,
  editMode: state?.incomeLimits?.editMode,
  pastMode: state?.incomeLimits?.pastMode,
  year: state?.incomeLimits?.form?.year,
  zipCode: state?.incomeLimits?.form?.zipCode,
});

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
  updateDependentsField: updateDependents,
};

DependentsPage.propTypes = {
  editMode: PropTypes.bool.isRequired,
  pastMode: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  updateDependentsField: PropTypes.func.isRequired,
  zipCode: PropTypes.string.isRequired,
  dependents: PropTypes.string,
  year: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DependentsPage);
