import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const StreamlinedExplainer = ({
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
          <h3 slot="headline">You can skip questions on this form</h3>
          <p>
            <strong>
              Based on your responses so far, you’re tentatively eligible for
              debt relief. We don’t need to ask you any more questions.
            </strong>
          </p>
          <p>
            After you submit your request, we’ll mail you a letter with more
            details.
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

StreamlinedExplainer.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default StreamlinedExplainer;
