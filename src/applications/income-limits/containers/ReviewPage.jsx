import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';

import { ROUTES } from '../constants';
import { updateEditMode } from '../actions';

const ReviewPage = ({
  dependentsInput,
  editMode,
  router,
  toggleEditMode,
  zipCodeInput,
}) => {
  useEffect(() => {
    if (editMode) {
      updateEditMode(false);
    }
  });

  const onContinueClick = () => {
    router.push(ROUTES.RESULTS);
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
          <tr>
            <td>
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
            <td>
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
  zipCodeInput: state?.incomeLimits?.form?.zipCode,
});

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
};

ReviewPage.propTypes = {
  dependentsInput: PropTypes.string,
  editMode: PropTypes.bool.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  toggleEditMode: PropTypes.func,
  zipCodeInput: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
