import React from 'react';
import PropTypes from 'prop-types';
import { FormNavButtonContinue } from 'platform/forms-system/src/js/components/FormNavButtons';

const OhiIntroduction = props => {
  const { contentAfterButtons, contentBeforeButtons, goForward } = props;
  return (
    <>
      <h1 className="vads-u-color--black vads-u-margin-top--0 mobile-lg:vads-u-font-size--h2 vads-u-font-size--h3">
        Submit your Other Health Insurance Certification (VA Form 10-7959c)
      </h1>
      <h2 className="vads-u-margin-bottom--4 mobile-lg:vads-u-font-size--h3 vads-u-font-size--h4">
        Report Medicare and other health insurance
      </h2>
      <p>
        We’ll now ask you questions about Medicare and any other health
        insurance you have. We need this information to process your application
        for CHAMPVA benefits.
      </p>
      <p>
        <strong>What to know before filling out this form</strong>
      </p>
      <ul className="vads-u-margin-bottom--4">
        <li>
          <strong>If you have Medicare or other health insurance</strong>,
          you’ll need to submit the front and back of your Medicare or other
          health insurance cards or documents about your coverage.
        </li>
        <li>
          <strong>If you don’t have Medicare or other health insurance</strong>,
          you won’t need to submit additional information.
        </li>
      </ul>

      {contentBeforeButtons}
      <FormNavButtonContinue goForward={goForward} useWebComponents />
      {contentAfterButtons}
    </>
  );
};

OhiIntroduction.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goForward: PropTypes.func,
};

export default OhiIntroduction;
