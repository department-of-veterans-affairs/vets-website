import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const InsuranceInformation = props => {
  const {
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  return (
    <>
      <h3 data-testid="hca-custom-page-title">Your health insurance</h3>
      <p>
        In the next few questions, we’ll ask you about your health insurance.
      </p>

      <p>
        Health insurance includes any coverage that you get through a spouse or
        significant other. Health insurance also includes private insurance or
        insurance from your employer.
      </p>

      <p>
        We ask for this information for billing purposes only. Your health
        insurance coverage doesn’t affect the VA health care benefits you can
        get.
      </p>

      <va-additional-info trigger="Why giving us your health insurance information may help you">
        <div>
          <p className="vads-u-font-weight--bold vads-u-margin-top--0">
            Giving us your health insurance information may help you for these
            reasons:
          </p>
          <ul className="vads-u-margin-bottom--0">
            <li>
              We must bill your private health insurance provider for any care,
              supplies, or medicines we provide to treat your
              non-service-connected conditions. If you have a VA copay, we may
              be able to use the payments from your provider to cover some or
              all of your copay.
            </li>
            <li>
              Your private insurance provider may apply your VA health care
              charges toward your annual deductible. Your annual deductible is
              the amount of money you pay toward your care each year before your
              insurance starts to pay for care.
            </li>
          </ul>
        </div>
      </va-additional-info>

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};

InsuranceInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default InsuranceInformation;
