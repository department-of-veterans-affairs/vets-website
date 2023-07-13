import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaButtonPair,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
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

      waitForRenderThenFocus('h1');
      scrollToTop();
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
      <h1>Ipsum quia dolor sit amet consectetur adipisci velit</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non
        tortor massa. Fusce eros mi, porttitor eu neque nec, mattis vehicula
        urna. Integer consectetur urna ex, ac tempor urna feugiat ut.
      </p>{' '}
      <p>
        Curabitur euismod fermentum ante, non maximus ex feugiat quis. Fusce
        dignissim commodo mauris. Duis posuere congue elit. Aenean ut fermentum
        quam. Morbi faucibus lacus eu tristique tempor. Fusce at leo ipsum.
        Maecenas at augue arcu. Duis eu lacinia ligula, quis sodales felis.
        Praesent aliquet dictum nisl, vel rhoncus eros luctus vulputate. Nullam
        a massa ut tellus consectetur porttitor.
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
