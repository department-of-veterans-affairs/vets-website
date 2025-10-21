import React from 'react';
import PropTypes from 'prop-types';
import { FormNavButtonContinue } from 'platform/forms-system/src/js/components/FormNavButtons';

const OtherHealthInsuranceInformation = props => {
  const { contentAfterButtons, contentBeforeButtons, goForward } = props;
  return (
    <>
      <h1 className="vads-u-color--black vads-u-margin-top--0 mobile-lg:vads-u-font-size--h2 vads-u-font-size--h3">
        Report other health insurance
      </h1>
      <p className="vads-u-margin-top--4">
        Now we’ll ask you about current health insurance policies that the
        applicants listed on this application have. This information ensures
        accurate payment processing.
      </p>
      <p className="vads-u-margin-bottom--4">
        You can also include past policies that were active during the time that
        you first became eligible to apply for CHAMPVA. You can submit claims
        for care you received up to 180 days after you receive your CHAMPVA
        welcome packet.
      </p>

      {contentBeforeButtons}
      <FormNavButtonContinue goForward={goForward} useWebComponents />
      {contentAfterButtons}
    </>
  );
};

OtherHealthInsuranceInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goForward: PropTypes.func,
};

export default OtherHealthInsuranceInformation;
