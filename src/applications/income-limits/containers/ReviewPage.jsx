import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

import { redirectIfFormIncomplete } from '../utilities/utils';
import { getLimits } from '../api';
import { ROUTES } from '../constants';
import {
  updateEditMode,
  updateResults,
  updateResultsValidationErrorText,
  updateResultsValidationServiceError,
} from '../actions';
import { customizeTitle } from '../utilities/customize-title';

const ReviewPage = ({
  dependentsInput,
  editMode,
  pastMode,
  router,
  toggleEditMode,
  updateLimitsResults,
  updateResultsErrorText,
  updateResultsValidationError,
  yearInput,
  zipCodeInput,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const H1 = 'Review your information';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

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

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      waitForRenderThenFocus('h1');
    },
    [dependentsInput, pastMode, router, yearInput, zipCodeInput],
  );

  const onContinueClick = async () => {
    const year = yearInput || new Date().getFullYear();

    if (dependentsInput && year && zipCodeInput) {
      setSubmitting(true);

      const response = await getLimits({
        dependents: dependentsInput,
        year,
        zipCode: zipCodeInput,
      });

      setSubmitting(false);

      if (response?.data) {
        updateLimitsResults(response?.data);
        router.push(ROUTES.RESULTS);
      } else if (!response || response?.error || response?.errors) {
        // A 422 invalid request returns response.error
        // A 404 response returns response.errors
        updateResultsValidationError(true);

        const messageText = {
          DEPENDENTS:
            'Your information couldn’t go through. Please enter a number of dependents between 0 and 100.',
          YEAR:
            'Your information couldn’t go through. Please select a year again.',
          ZIP:
            'Your information couldn’t go through. Please enter a valid 5 digit zip code.',
        };

        const checkMessage = value => {
          return response?.error?.toLowerCase().includes(value);
        };

        if (checkMessage('zip')) {
          updateResultsErrorText(messageText.ZIP);
        } else if (checkMessage('dependents')) {
          updateResultsErrorText(messageText.DEPENDENTS);
        } else if (checkMessage('year')) {
          updateResultsErrorText(messageText.YEAR);
        }
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
      <h1>{H1}</h1>
      <p className="il-review">
        Make any edits that you may need to. Then select{' '}
        <strong>Continue</strong>.
      </p>
      <ul data-testid="il-review">
        {pastMode && (
          <li>
            <span data-testid="review-year">
              <strong>Year:</strong>
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
            <strong>Zip code:</strong>
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
            <strong>Number of dependents:</strong>
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
      {!submitting && (
        <VaButtonPair
          data-testid="il-buttonPair"
          onPrimaryClick={onContinueClick}
          onSecondaryClick={onBackClick}
          continue
          uswds
        />
      )}
      {submitting && (
        <va-loading-indicator
          data-testid="il-loading-indicator"
          set-focus
          message="Reviewing your information..."
        />
      )}
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
  updateResultsErrorText: updateResultsValidationErrorText,
  updateResultsValidationError: updateResultsValidationServiceError,
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
  updateResultsErrorText: PropTypes.func.isRequired,
  updateResultsValidationError: PropTypes.func.isRequired,
  zipCodeInput: PropTypes.string.isRequired,
  resultsValidationError: PropTypes.func,
  yearInput: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
