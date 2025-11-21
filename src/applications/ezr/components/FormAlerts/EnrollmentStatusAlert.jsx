import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';
import { APP_URLS } from '../../utils/appUrls';
import ServerErrorAlert from './ServerErrorAlert';

const EnrollmentStatusAlert = ({ showError }) => {
  return !showError ? (
    <va-alert status="warning" data-testid="ezr-enrollment-status-alert" uswds>
      <h3 slot="headline">{content['alert-enrollment-title']}</h3>
      <div>
        <p>{content['alert-enrollment-message']}</p>
        <a className="vads-c-action-link--green" href={APP_URLS.hca}>
          {content['alert-enrollment-action']}
        </a>
      </div>
    </va-alert>
  ) : (
    <ServerErrorAlert />
  );
};

EnrollmentStatusAlert.propTypes = {
  showError: PropTypes.bool,
};

export default EnrollmentStatusAlert;
