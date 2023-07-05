import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
import { redirectIfFormIncomplete } from '../utilities/utils';
import { getData } from '../api';
import { ROUTES } from '../constants';
import { updateEditMode, updateResults } from '../actions';

const ReviewPage = ({
  dependentsInput,
  editMode,
  pastMode,
  router,
  toggleEditMode,
  updateLimitsResults,
  yearInput,
  zipCodeInput,
}) => {
  useEffect(() => {
    if (editMode) {
      updateEditMode(false);
    }
  });

  useEffect(
    () => {
      redirectIfFormIncomplete(
        dependentsInput,
        pastMode,
        router,
        yearInput,
        zipCodeInput,
      );

      waitForRenderThenFocus('h1');
      scrollToTop();
    },
    [dependentsInput, pastMode, router, yearInput, zipCodeInput],
  );

  const onContinueClick = async () => {
    const year = yearInput || new Date().getFullYear();

    if (dependentsInput && year && zipCodeInput) {
      const response = await getData({
        dependents: dependentsInput,
        year,
        zipCode: zipCodeInput,
      });

      if (response) {
        updateLimitsResults(response?.data);
        router.push(ROUTES.RESULTS);
      }
    }
  };

  const onBackClick = () => {
    router.push(ROUTES.DEPENDENTS);
  };

  const handleEditClick = destination => {
    toggleEditMode(true);
    router.push(destination);
  };

  return (
    <>
      <h1>Aenean tristique mollis</h1>
      <p className="il-review">
        Fusce risus lacus, efficitur ac magna vitae, cursus lobortis dui.
      </p>
      <ul data-testid="il-review">
        {pastMode && (
          <li>
            <span data-testid="review-year">
              <strong>Vitae:</strong>
              <br /> {yearInput}
            </span>
            <span className="income-limits-edit">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                aria-label="Edit year"
                href="#"
                onClick={() => handleEditClick(ROUTES.YEAR)}
                name="year"
              >
                Edit
              </a>
            </span>
          </li>
        )}
        <li>
          <span data-testid="review-zip">
            <strong>Nisci orci:</strong>
            <br /> {zipCodeInput}
          </span>
          <span className="income-limits-edit">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              aria-label="Edit zip code"
              href="#"
              onClick={() => handleEditClick(ROUTES.ZIPCODE)}
              name="zipCode"
            >
              Edit
            </a>
          </span>
        </li>
        <li>
          <span data-testid="review-dependents">
            <strong>Malesuada felis ultrices:</strong>
            <br /> {dependentsInput}
          </span>
          <span className="income-limits-edit">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              aria-label="Edit number of dependents"
              href="#"
              onClick={() => handleEditClick(ROUTES.DEPENDENTS)}
              name="dependents"
            >
              Edit
            </a>
          </span>
        </li>
      </ul>
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
  dependentsInput: state?.incomeLimits?.form?.dependents,
  editMode: state?.incomeLimits?.editMode,
  pastMode: state?.incomeLimits?.pastMode,
  yearInput: state?.incomeLimits?.form?.year,
  zipCodeInput: state?.incomeLimits?.form?.zipCode,
});

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
  updateLimitsResults: updateResults,
};

ReviewPage.propTypes = {
  dependentsInput: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  pastMode: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  updateLimitsResults: PropTypes.func.isRequired,
  zipCodeInput: PropTypes.string.isRequired,
  yearInput: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
