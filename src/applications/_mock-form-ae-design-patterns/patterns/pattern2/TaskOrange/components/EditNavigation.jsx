import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const EditNavigation = ({ options, router, data }) => {
  const address = data.veteranAddress;
  const stateRequiredCountries = new Set(['USA', 'CAN', 'MEX']);

  function addErrorMessage(element, message) {
    const inputElement = element;
    inputElement.style.border = '5px solid #b50909';

    const errorMessage = document.createElement('span');
    errorMessage.className =
      'vads-u-color--secondary-dark vads-u-font-size--md vads-u-font-weight--bold';
    errorMessage.textContent = message;
    inputElement.parentNode.insertBefore(
      errorMessage,
      inputElement.nextSibling,
    );
  }

  const validateAddress = () => {
    let hasErrors = false;

    const stateField = document.getElementById('root_veteranAddress_state');
    const postalCodeField = document.getElementById(
      'root_veteranAddress_postalCode',
    );
    const streetField = document.getElementById('root_veteranAddress_street');
    const cityField = document.getElementById('root_veteranAddress_city');

    if (
      stateRequiredCountries.has(address.country) &&
      (address.state?.length < 2 || address.state === undefined)
    ) {
      addErrorMessage(stateField, 'Please enter a state or province');
      hasErrors = true;
    }
    if (address.street === undefined) {
      addErrorMessage(streetField, 'Please enter a street address');
      hasErrors = true;
    }
    if (address.city === undefined) {
      addErrorMessage(cityField, 'Please enter a city');
      hasErrors = true;
    }
    if (address.postalCode === undefined || address.postalCode?.length < 5) {
      addErrorMessage(postalCodeField, 'Please enter a valid postal code');
      hasErrors = true;
    }

    return !hasErrors;
  };

  const saveSuccess = () => {
    if (validateAddress()) {
      router.push({
        pathname: '/2/task-orange/review-then-submit',
        state: {
          reviewId: options?.reviewId,
          success: true,
        },
      });
    }
  };

  const onCancel = () => {
    if (location.search.includes('?review')) {
      router.push({
        pathname: '/2/task-orange/review-then-submit',
      });
    } else {
      router.goBack();
    }
  };

  return (
    <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-flex-direction--column vads-u-margin-top--3">
      <div className="vads-u-display--block mobile-lg:vads-u-display--flex">
        <button
          type="button"
          className="vads-u-margin-top--0 mobile-lg:vads-u-width--auto vads-u-width--full"
          data-action="save-edit"
          data-testid="save-edit-button"
          aria-live="polite"
          onClick={saveSuccess}
        >
          Save
        </button>
        <va-button
          data-testid="cancel-edit-button"
          secondary=""
          class="vads-u-margin--0 vads-u-margin-top--0 vads-u-width--full mobile-lg:vads-u-width--auto"
          text="Cancel"
          // onClick={() =>
          //   router.push({
          //     pathname: '/2/task-orange/review-then-submit',
          //   })
          // }
          onClick={onCancel}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.form.data, // Replace with actual state structure
});

// export const EditNavigationWithRouter = withRouter(EditNavigation);
export const EditNavigationWithRouter = connect(mapStateToProps)(
  withRouter(EditNavigation),
);

EditNavigation.propTypes = {
  options: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  data: PropTypes.object,
};
