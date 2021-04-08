import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectProfile } from 'platform/user/selectors';
import {
  getDismissedHCANotification,
  getEnrollmentStatus,
  setDismissedHCANotification,
} from 'applications/hca/actions';
import {
  dismissedHCANotificationDate,
  isEnrollmentStatusLoading,
  hasApplicationInESR,
  isLoadingDismissedNotification,
  selectEnrollmentStatus,
} from 'applications/hca/selectors';

import FormItem from '../components/FormItem';
import HCAStatusAlert from '../components/HCAStatusAlert';
import {
  filterOutExpiredForms,
  isSIPEnabledForm,
  sipFormSorter,
} from '../helpers';

class YourApplications extends React.Component {
  componentDidMount() {
    if (this.props.profileState.verified) {
      this.props.getEnrollmentStatus();
      this.props.getDismissedHCANotification();
    }
  }

  dismissHCANotification = () => {
    const {
      enrollmentStatus,
      enrollmentStatusEffectiveDate,
    } = this.props.hcaEnrollmentStatus;
    this.props.setDismissedHCANotification(
      enrollmentStatus,
      enrollmentStatusEffectiveDate,
    );
  };

  render() {
    const {
      hcaEnrollmentStatus,
      savedForms,
      shouldRenderContent,
      shouldRenderHCAAlert,
    } = this.props;

    if (!shouldRenderContent) return null;

    return (
      <div className="profile-section medium-12 columns">
        <h2 className="section-header">Your applications</h2>
        {savedForms.map(form => (
          <FormItem key={form.form} savedFormData={form} />
        ))}
        {shouldRenderHCAAlert && (
          <HCAStatusAlert
            applicationDate={hcaEnrollmentStatus.applicationDate}
            enrollmentStatus={hcaEnrollmentStatus.enrollmentStatus}
            onRemove={this.dismissHCANotification}
          />
        )}
      </div>
    );
  }
}

YourApplications.propTypes = {
  getDismissedHCANotification: PropTypes.func.isRequired,
  getEnrollmentStatus: PropTypes.func.isRequired,
  setDismissedHCANotification: PropTypes.func.isRequired,
  hcaEnrollmentStatus: PropTypes.shape({
    enrollmentStatus: PropTypes.string,
    applicationDate: PropTypes.string,
  }),
  savedForms: PropTypes.arrayOf(
    PropTypes.shape({
      form: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        lastUpdated: PropTypes.number,
        expiresAt: PropTypes.number,
      }),
    }),
  ),
  shouldRenderContent: PropTypes.bool.isRequired,
  shouldRenderHCAAlert: PropTypes.bool,
};

export const mapStateToProps = state => {
  const hcaEnrollmentStatus = selectEnrollmentStatus(state);
  const isLoading =
    isEnrollmentStatusLoading(state) || isLoadingDismissedNotification(state);
  const profileState = selectProfile(state);
  const { savedForms } = profileState;
  const verifiedSavedForms = savedForms
    .filter(isSIPEnabledForm)
    .filter(filterOutExpiredForms)
    .sort(sipFormSorter);
  const hasVerifiedSavedForms = !!verifiedSavedForms.length;
  const hcaStatusEffectiveDate =
    hcaEnrollmentStatus.enrollmentStatusEffectiveDate;
  const dismissedNotificationDate = dismissedHCANotificationDate(state);
  const shouldRenderHCAAlert =
    hasApplicationInESR(state) &&
    (!dismissedNotificationDate ||
      new Date(hcaStatusEffectiveDate) > new Date(dismissedNotificationDate));
  const shouldRenderContent =
    !isLoading && (hasVerifiedSavedForms || shouldRenderHCAAlert);

  return {
    hcaEnrollmentStatus,
    profileState,
    savedForms: verifiedSavedForms,
    shouldRenderContent,
    shouldRenderHCAAlert,
  };
};

const mapDispatchToProps = {
  getDismissedHCANotification,
  getEnrollmentStatus,
  setDismissedHCANotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YourApplications);

export { YourApplications };
