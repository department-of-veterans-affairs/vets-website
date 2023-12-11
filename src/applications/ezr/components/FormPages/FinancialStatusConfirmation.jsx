import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { LAST_YEAR } from '../../utils/constants';

const FinancialStatusConfirmation = props => {
  const {
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;
  const THIS_YEAR = LAST_YEAR + 1;
  const NEXT_YEAR = THIS_YEAR + 1;

  return (
    <>
      <va-alert status="info" class="vads-u-margin-bottom--4" uswds>
        <h3 slot="headline">You can skip questions on this form</h3>
        <div>
          <p>
            Our records show that you already shared your household financial
            information for {LAST_YEAR}. You can share your household financial
            information only once each year.
          </p>
          <p>
            Example: If you share your {LAST_YEAR} income in {THIS_YEAR}, you
            can’t share financial information again in {THIS_YEAR}. You’ll need
            to wait until {NEXT_YEAR} to share your {THIS_YEAR} information.
          </p>
          <p>Next we’ll ask about your insurance information.</p>
        </div>
      </va-alert>

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};

FinancialStatusConfirmation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default FinancialStatusConfirmation;
