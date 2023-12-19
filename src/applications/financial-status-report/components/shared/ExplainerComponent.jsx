import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const ExplainerComponent = ({
  headline,
  strongMessage,
  detailMessage,
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
}) => {
  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <va-alert
          close-btn-aria-label="Close notification"
          full-width
          status="info"
          uswds
          visible
        >
          <h3 slot="headline">{headline}</h3>
          <p>
            <strong>{strongMessage}</strong>
          </p>
          <p>{detailMessage}</p>
        </va-alert>
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={goForward}
          submitToContinue
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

ExplainerComponent.propTypes = {
  detailMessage: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  strongMessage: PropTypes.string.isRequired,
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default ExplainerComponent;
