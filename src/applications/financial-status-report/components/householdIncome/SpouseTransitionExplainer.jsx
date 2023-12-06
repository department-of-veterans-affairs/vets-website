import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const SpouseTransitionExplainer = ({
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
          <h3 slot="headline">You added a spouse</h3>
          <p>
            <strong>
              You will now be asked additional questions about your spouse’s
              income and employment.
            </strong>
          </p>
          <p>
            After you answer these questions, you can continue back to the
            review page.
          </p>
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

SpouseTransitionExplainer.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default SpouseTransitionExplainer;
