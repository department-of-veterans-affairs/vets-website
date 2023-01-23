import React, { useState } from 'react';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const ResolutionExplainerWidget = props => {
  const { goToPath, goBack, onReviewPage } = props;

  const [realEstateValue, setRealEstateValue] = useState(0);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (realEstateValue >= 0) {
        goToPath(`/vehicles`);
      } else {
        goToPath(`/enhanced-real-estate-assets`);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setRealEstateValue(value);
      }
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

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
  };
};

export default connect(mapStateToProps)(ResolutionExplainerWidget);
