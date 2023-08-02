import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const TransitionTest = ({
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
}) => {
  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <VaAlert
          background-only
          class="row vads-u-margin-top--3 vads-u-margin-left--1"
          status="info"
          disable-analytics="true"
        >
          <h4 slot="headline">You can skip questions on this form</h4>
          <p className="vads-u-font-size--base vads-u-font-family--sans">
            Based on your responses so far, we’ll ask you fewer questions on
            this form. And after you submit your application, we’ll approve your
            reuqest automatically.
          </p>
          <h5>Here’s what you’ll need to do on the next page:</h5>
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
            After you submit your application, we’ll approve your request and
            send you a letter with more details.
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

TransitionTest.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default TransitionTest;
