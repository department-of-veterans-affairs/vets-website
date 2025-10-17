import React from 'react';
import PropTypes from 'prop-types';
import { FormNavButtonContinue } from 'platform/forms-system/src/js/components/FormNavButtons';

const MedicareIntroduction = props => {
  const { contentAfterButtons, contentBeforeButtons, goForward } = props;
  return (
    <>
      <h1 className="vads-u-color--black vads-u-margin-top--0 mobile-lg:vads-u-font-size--h2 vads-u-font-size--h3">
        Report Medicare
      </h1>
      <ul className="vads-u-margin-y--4">
        <li>
          <strong>If you currently have Medicare</strong>, provide your plan
          information to help us complete your CHAMPVA benefits application.
          This also helps us coordinate benefits and process your claims faster.
        </li>
        <li>
          <strong>If you’re pre-enrolled in Medicare</strong> with a future
          effective date, you need to submit using the Other Health Insurance
          Certification (VA Form 10-7959c) before you file your first claim.
        </li>
      </ul>

      {contentBeforeButtons}
      <FormNavButtonContinue goForward={goForward} useWebComponents />
      {contentAfterButtons}
    </>
  );
};

MedicareIntroduction.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goForward: PropTypes.func,
};

export default MedicareIntroduction;
