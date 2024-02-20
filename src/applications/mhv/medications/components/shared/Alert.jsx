import React from 'react';
import PropTypes from 'prop-types';
import FeedbackEmail from './FeedbackEmail';

const Alert = props => {
  const { isAlertVisible, paginatedPrescriptionsList } = props;

  return (
    <div visible={isAlertVisible} className="no-print vads-u-margin-top--5">
      {!paginatedPrescriptionsList && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="warning"
          visible={isAlertVisible}
          uswds
        >
          <h2 slot="headline">We can’t access your medications right now</h2>
          <div>
            <section className="vads-u-margin-bottom--0">
              <p>
                We’re sorry. There’s a problem with our system. Check back
                later.
              </p>
              <p>
                <strong>If it still doesn’t work,</strong> email us at{' '}
                <FeedbackEmail />.
              </p>
              <p>
                <strong>If you need to request a refill now,</strong> call your
                VA pharmacy. You can find the pharmacy phone number on your
                prescription label.
              </p>
            </section>
          </div>
        </va-alert>
      )}
      {paginatedPrescriptionsList?.length <= 0 && (
        <va-alert status="info" uswds>
          <div>
            <h4 className="vads-u-margin-top--0" data-testid="alert-message">
              You don’t have any medications in your medications list
            </h4>
            <strong>Note</strong>: If you’re taking any medications or
            supplements, tell your care team at your next appointment.
          </div>
        </va-alert>
      )}
      <div className="vads-u-margin-bottom--4" />
    </div>
  );
};

export default Alert;

Alert.propTypes = {
  isAlertVisible: PropTypes.string,
  paginatedPrescriptionsList: PropTypes.array,
  ssoe: PropTypes.any,
};
