import React from 'react';
import PropTypes from 'prop-types';
import {
  APP_TYPES,
  healthResourceCenterPhoneContent,
  dmcPhoneContent,
} from '../utils/helpers';

const AlertCard = ({ appType }) => {
  return (
    <>
      <va-alert
        class="row vads-u-margin-bottom--5"
        status="error"
        data-testid={`balance-card-alert-${
          appType === APP_TYPES.DEBT ? 'debt' : 'copay'
        }`}
      >
        <h2 slot="headline" className="vads-u-font-size--h3">
          We can’t access your{' '}
          {`${appType === APP_TYPES.DEBT ? 'overpayment' : 'copay'}`} records
          right now
        </h2>
        <p>We’re sorry. Something went wrong on our end. Check back soon.</p>

        {appType === APP_TYPES.DEBT ? (
          <>
            <p>
              If you need help now, contact us online through{' '}
              <a href="https://ask.va.gov">Ask VA</a> or call the Debt{' '}
              Management Center at {dmcPhoneContent()}
            </p>
          </>
        ) : (
          <p>
            If you need help now, call the VA Health Resource Center at{' '}
            {healthResourceCenterPhoneContent()}
          </p>
        )}
      </va-alert>
    </>
  );
};
AlertCard.propTypes = {
  appType: PropTypes.string,
};

export default AlertCard;
