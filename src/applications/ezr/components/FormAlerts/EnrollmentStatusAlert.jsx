import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';
import ServerErrorAlert from './ServerErrorAlert';

const EnrollmentStatusAlert = ({ showError }) => {
  return !showError ? (
    <va-alert
      status="warning"
      class="vads-u-margin-y--4"
      data-testid="ezr-enrollment-status-alert"
      uswds
    >
      <h3 slot="headline">{content['alert-enrollment-title']}</h3>
      <p>{content['alert-enrollment-message']}</p>
      <a
        className="vads-c-action-link--green"
        href="/health-care/apply/application"
      >
        {content['alert-enrollment-action']}
      </a>
    </va-alert>
  ) : (
    <ServerErrorAlert />
  );
};

EnrollmentStatusAlert.propTypes = {
  showError: PropTypes.bool,
};

export default EnrollmentStatusAlert;
