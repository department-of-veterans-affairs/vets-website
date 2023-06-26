import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
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

  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

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
      <p>Fusce risus lacus, efficitur ac magna vitae, cursus lobortis dui.</p>
      <table className="usa-table-borderless" data-testid="il-review">
        <tbody>
          {pastMode && (
            <tr>
              <td data-testid="review-year">
                <strong>Vitae:</strong>
                <br aria-hidden="true" /> {yearInput}
              </td>
              <td className="income-limits-edit">
                <button
                  aria-label="Edit year"
                  className="va-button-link"
                  href="#"
                  onClick={() => handleEditClick(ROUTES.YEAR)}
                  name="year"
                  type="button"
                >
                  Edit
                </button>
              </td>
            </tr>
          )}
          <tr>
            <td data-testid="review-zip">
              <strong>Nisci orci:</strong>
              <br aria-hidden="true" /> {zipCodeInput}
            </td>
            <td className="income-limits-edit">
              <button
                aria-label="Edit zip code"
                className="va-button-link"
                href="#"
                onClick={() => handleEditClick(ROUTES.ZIPCODE)}
                name="zipCode"
                type="button"
              >
                Edit
              </button>
            </td>
          </tr>
          <tr>
            <td data-testid="review-dependents">
              <strong>Malesuada felis ultrices:</strong>
              <br aria-hidden="true" /> {dependentsInput}
            </td>
            <td className="income-limits-edit">
              <button
                aria-label="Edit number of dependents"
                className="va-button-link"
                href="#"
                onClick={() => handleEditClick(ROUTES.DEPENDENTS)}
                name="dependents"
                type="button"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
