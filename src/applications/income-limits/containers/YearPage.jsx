import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import { ROUTES } from '../constants';
import { updateEditMode, updateYear } from '../actions';

const YearPage = ({
  editMode,
  pastMode,
  router,
  toggleEditMode,
  updateYearField,
  yearInput,
}) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(
    () => {
      // If pastMode is null, the home screen hasn't been used yet
      const shouldRedirectToHome = pastMode === null;

      if (shouldRedirectToHome) {
        router.push(ROUTES.HOME);
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      waitForRenderThenFocus('h1');
    },
    [pastMode, router],
  );

  const yearIsValid = year =>
    year && +year >= 2001 && +year <= new Date().getFullYear();

  const onContinueClick = () => {
    setSubmitted(true);

    if (!yearIsValid(yearInput)) {
      setError(true);
    } else if (editMode) {
      setError(false);
      toggleEditMode(false);
      router.push(ROUTES.REVIEW);
    } else {
      router.push(ROUTES.ZIPCODE);
    }
  };

  const onBackClick = () => {
    router.push(ROUTES.HOME);
  };

  const onYearInput = event => {
    const year = event?.target?.value;

    if (error && year?.length === 4 && yearIsValid(year)) {
      setError(false);
    }

    updateYearField(event.target.value);
  };

  return (
    <>
      <h1>Income limits from past years going back to 2001</h1>
      <p>
        Enter the year you&#8217;d like to check income limits for. Then answer
        2 questions to find out how your income may have affected your VA health
        care eligibility and costs for that year.
      </p>
      <p>
        You&#8217;ll need information about your previous year&#8217;s household
        income and deductions to check income limits. Limits vary by where you
        live and change each year.
      </p>
      <VaTextInput
        data-testid="il-year"
        error={submitted && error ? 'Enter a valid four digit year.' : null}
        id="year"
        inputmode="numeric"
        label="Year"
        maxlength={4}
        onInput={onYearInput}
        required
        value={yearInput}
      />
      <VaButtonPair
        class="vads-u-margin-top--1"
        data-testid="il-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
      />
    </>
  );
};

const mapStateToProps = state => ({
  editMode: state?.incomeLimits?.editMode,
  pastMode: state?.incomeLimits?.pastMode,
  yearInput: state?.incomeLimits?.form?.year,
});

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
  updateYearField: updateYear,
};

YearPage.propTypes = {
  editMode: PropTypes.bool.isRequired,
  pastMode: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  updateYearField: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func,
  yearInput: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YearPage);
