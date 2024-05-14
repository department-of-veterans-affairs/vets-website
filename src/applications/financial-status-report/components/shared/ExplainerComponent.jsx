import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from '@department-of-veterans-affairs/platform-forms-system/FormNavButtons';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

const ExplainerComponent = ({
  headline,
  strongMessage,
  detailMessage,
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
}) => {
  React.useEffect(() => {
    // focus on the h3  when the page loads for screen readers
    waitForRenderThenFocus('h3');
  }, []);
  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <va-alert
          close-btn-aria-label="Close notification"
          full-width
          status="info"
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
