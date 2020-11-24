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

class FormItem extends React.Component {
  render() {
    const savedFormData = this.props.savedFormData;
    const formId = savedFormData.form;
    const {
      lastUpdated: lastSaved,
      expiresAt: expirationTime,
    } = savedFormData.metadata;
    const lastSavedDateTime = moment
      .unix(lastSaved)
      .format('MMMM D, YYYY [at] h:mm a');
    const expirationDate = moment.unix(expirationTime).format('MMMM D, YYYY');
    const isExpired = moment.unix(expirationTime).isBefore();
    const itemTitle = `Application for ${formTitles[formId]}`;
    const formIdTitle = presentableFormIDs[formId];

    const activeView = (
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
    const expiredView = (
      <DashboardAlert
        id={formId}
        status={DASHBOARD_ALERT_TYPES.closed}
        headline={itemTitle}
        subheadline={formId}
        statusHeadline="Expired"
        statusInfo={`Your application for ${formTitles[formId]} has expired`}
      >
        <a
          className="usa-button-primary application-route vads-u-margin--0"
          aria-label={`Start a new ${itemTitle}`}
          href={formLinks[formId]}
        >
          Start a new application
        </a>
        <button
          className="va-button-link remove-notification-link"
          aria-label={`Remove this notification about my ${itemTitle}`}
          onClick={() => {
            this.props.toggleModal(formId);
            recordDashboardClick(formId, 'delete-link');
          }}
        >
          <i className="fa fa-times" />
          <span className="remove-notification-label">
            Remove this notification
          </span>
        </button>
      </DashboardAlert>
    );

    return isExpired ? expiredView : activeView;
  }
}

FormItem.propTypes = {
  savedFormData: PropTypes.object.isRequired,
  toggleModal: PropTypes.func,
};

export default FormItem;
