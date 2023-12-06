import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

import { ROUTES } from '../constants';
import { updateEditMode, updateYear } from '../actions';
import { customizeTitle } from '../utilities/customize-title';

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
  const H1 = 'Income limits from past years going back to 2001';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

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

  const onContinueClick = () => {
    setSubmitted(true);

    if (!yearInput) {
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
    updateYearField(event.target.value);
  };

  const makeYearArray = () => {
    const years = [];
    let currentYear = new Date().getFullYear();
    const earliestYear = 2001;

    while (currentYear >= earliestYear) {
      years.push(currentYear);

      currentYear -= 1;
    }

    const options = years.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    ));

    options.unshift(
      <option key="Select a year" value="">
        Select a year
      </option>,
    );

    return options;
  };

  return (
    <>
      <h1>{H1}</h1>
      <p>
        Select the year you&#8217;d like to check income limits for. Then answer
        2 questions to find out how your income may have affected your VA health
        care eligibility and costs for that year.
      </p>
      <p>
        You&#8217;ll need information about your previous year&#8217;s household
        income and deductions to check income limits. Limits vary by where you
        live and change each year.
      </p>
      <VaSelect
        autocomplete="false"
        data-testid="il-year"
        error={(submitted && error && 'Please select a year.') || null}
        id="year"
        label="Year"
        name="year"
        required
        value={yearInput}
        onVaSelect={onYearInput}
      >
        {makeYearArray()}
      </VaSelect>
      <VaButtonPair
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
