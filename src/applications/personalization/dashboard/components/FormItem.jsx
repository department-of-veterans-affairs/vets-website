import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import {
  formTitles,
  formLinks,
  presentableFormIDs,
  recordDashboardClick,
} from '../helpers';
import DashboardAlert, {
  DASHBOARD_ALERT_TYPES,
} from 'applications/personalization/dashboard/components/DashboardAlert';

function FormItem({ savedFormData }) {
  const formId = savedFormData.form;
  const {
    lastUpdated: lastSaved,
    expiresAt: expirationTime,
  } = savedFormData.metadata;
  const lastSavedDateTime = moment
    .unix(lastSaved)
    .format('MMMM D, YYYY [at] h:mm a');
  const expirationDate = moment.unix(expirationTime).format('MMMM D, YYYY');
  const itemTitle = `Application for ${formTitles[formId]}`;
  const formIdTitle = presentableFormIDs[formId];

  return (
    <DashboardAlert
      id={formId}
      status={DASHBOARD_ALERT_TYPES.inProgress}
      headline={itemTitle}
      subheadline={formIdTitle}
      statusHeadline="In progress"
    >
      <p>
        <strong>Application last saved on:</strong> {lastSavedDateTime}
      </p>
      <p>
        <strong>This application expires on:</strong> {expirationDate}
      </p>
      <a
        className="usa-button-primary application-route vads-u-margin--0"
        aria-label={`Continue your ${itemTitle}`}
        href={`${formLinks[formId]}resume`}
        onClick={recordDashboardClick(formId, 'continue-button')}
      >
        Continue your application
      </a>
    </DashboardAlert>
  );
}

FormItem.propTypes = {
  savedFormData: PropTypes.object.isRequired,
  toggleModal: PropTypes.func,
};

export default FormItem;
