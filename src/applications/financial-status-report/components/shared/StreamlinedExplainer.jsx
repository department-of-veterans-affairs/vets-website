import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const StreamlinedExplainer = ({
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
}) => {
  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <VaAlert status="info" disable-analytics="true">
          <h3 slot="headline">You can skip questions on this form</h3>
          <p>
            Based on your responses so far, you’re tentatively eligible for debt
            relief. We don’t need to ask you any more questions. Follow the
            steps on this page to submit your request.
          </p>
          <p>
            <strong>Here’s what you’ll need to do on the next page:</strong>
          </p>
          <ol>
            <li>
              Review your information and make sure it’s correct. You should
              know that any changes to your answers may affect your request.
            </li>
            <li>Sign the statement of truth.</li>
            <li>Read and accept our privacy policy.</li>
            <li>Submit your application.</li>
          </ol>
          <p>
            After you submit your request, we’ll mail you a letter with more
            details.
          </p>
        </VaAlert>
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
