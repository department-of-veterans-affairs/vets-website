import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const RealEstateOwnershipValue = props => {
  const { goToPath, goBack, onReviewPage } = props;
  const dispatch = useDispatch();

  const formData = useSelector(state => state.form.data);
  const realEstateValue = formData?.realEstateValue || 0;

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (realEstateValue >= 0) {
        goToPath(`/vehicles`);
      } else {
        goToPath(`/enhanced-real-estate-assets`);
      }
    },
    onRealEstateValueChange: ({ target }) => {
      dispatch(
        setData({
          ...formData,
          realEstateValue: target.value || 0,
        }),
      );
    },
  };
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={handlers.onSubmit}>
      <div>
        <h3>Your real estate assets</h3>
      </div>
      <va-number-input
        label="What is the estimated value of your property?"
        name="property-value"
        value={realEstateValue}
        id="property-value"
        onInput={handlers.onRealEstateValueChange}
        inputmode="decimal"
        required
      />
      <br />
      <va-additional-info trigger="Why do I need to provide this information?">
        <p>
          We want to make sure we fully understand your financial situation. We
          ask for details about your real estate assets because it allows us to
          make a more informed decision on your request.
        </p>
        <br />
        <p>
          We won’t take collection action against real estate you own to resolve
          your debt.
        </p>
      </va-additional-info>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

RealEstateOwnershipValue.propTypes = {
  goToPath: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
};

export default RealEstateOwnershipValue;
