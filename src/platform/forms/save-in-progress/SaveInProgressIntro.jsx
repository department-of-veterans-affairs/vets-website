import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import { getNextPagePath } from 'us-forms-system/lib/js/routing';

import {
  formDescriptions,
  formBenefits,
} from '../../../applications/personalization/profile360/util/helpers';
import { toggleLoginModal } from '../../site-wide/user-nav/actions';
import { fetchInProgressForm, removeInProgressForm } from './actions';
import FormStartControls from './FormStartControls';
import { getIntroState } from './selectors';
import DowntimeNotification, {
  externalServiceStatus,
} from '../../monitoring/DowntimeNotification';
import DowntimeMessage from './DowntimeMessage';

class SaveInProgressIntro extends React.Component {
  getAlert(savedForm) {
    let alert;
    const {
      formId,
      renderSignInMessage,
      prefillEnabled,
      verifyRequiredPrefill,
      verifiedPrefillAlert,
      unverifiedPrefillAlert,
    } = this.props;
    const { profile, login } = this.props.user;
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(formId)
    );
    if (login.currentlyLoggedIn) {
      if (savedForm) {
        const savedAt = this.props.lastSavedDate
          ? moment(this.props.lastSavedDate)
          : moment.unix(savedForm.lastUpdated);
        const expiresAt = moment.unix(savedForm.metadata.expiresAt);
        const expirationDate = expiresAt.format('MMM D, YYYY');
        const isExpired = expiresAt.isBefore();

        if (!isExpired) {
          const lastSavedDateTime = moment
            .unix(savedAt)
            .format('M/D/YYYY [at] h:mm a');
          alert = (
            <div>
              <div className="usa-alert usa-alert-info no-background-image schemaform-sip-alert">
                <div className="schemaform-sip-alert-title">
                  <strong>Your form is in progress</strong>
                </div>
                <div className="saved-form-metadata-container">
                  <span className="saved-form-item-metadata">
                    Your {formDescriptions[formId]} is in progress.
                  </span>
                  <br />
                  <span className="saved-form-item-metadata">
                    Your application was last saved on {lastSavedDateTime}
                  </span>
                  <div className="expires-container">
                    You can continue applying now, or come back later to finish
                    your application. Your application{' '}
                    <span className="expires">
                      will expire on {expirationDate}.
                    </span>
                  </div>
                </div>
                <div>{this.props.children}</div>
              </div>
              <br />
            </div>
          );
        } else {
          alert = (
            <div>
              <div className="usa-alert usa-alert-warning no-background-image schemaform-sip-alert">
                <div className="schemaform-sip-alert-title">
                  <strong>Your form has expired</strong>
                </div>
                <div className="saved-form-metadata-container">
                  <span className="saved-form-metadata">
                    Your saved {formDescriptions[formId]} has expired. If you
                    want to apply for {formBenefits[formId]}, please start a new
                    application.
                  </span>
                </div>
                <div>{this.props.children}</div>
              </div>
              <br />
            </div>
          );
        }
      } else if (prefillAvailable && !verifiedPrefillAlert) {
        alert = (
          <div>
            <div className="usa-alert usa-alert-info schemaform-sip-alert">
              <div className="usa-alert-body">
                <strong>Note:</strong> Since you’re signed in to your account,
                we can prefill part of your application based on your account
                details. You can also save your form in progress, and come back
                later to finish filling it out.
              </div>
            </div>
            <br />
          </div>
        );
      } else if (prefillAvailable && verifiedPrefillAlert) {
        alert = verifiedPrefillAlert;
      } else {
        alert = (
          <div>
            <div className="usa-alert usa-alert-info schemaform-sip-alert">
              <div className="usa-alert-body">
                You can save this form in progress, and come back later to
                finish filling it out.
              </div>
            </div>
            <br />
          </div>
        );
      }
    } else if (renderSignInMessage) {
      alert = renderSignInMessage(prefillEnabled);
    } else if (prefillEnabled && !verifyRequiredPrefill) {
      const { retentionPeriod } = this.props;
      alert = (
        <div>
          <div className="usa-alert usa-alert-info schemaform-sip-alert">
            <div className="usa-alert-body">
              <strong>
                If you’re signed in to your account, your application process
                can go more smoothly. Here’s why:
              </strong>
              <br />
              <ul>
                <li>
                  We can prefill part of your application based on your account
                  details.
                </li>
                <li>
                  You can save your form in progress, and come back later to
                  finish filling it out. You have {retentionPeriod} from the
                  date you start or update your application to submit the form.
                  After {retentionPeriod}, the form won’t be saved, and you’ll
                  need to start over.
                </li>
              </ul>
              <br />
              <button
                className="va-button-link"
                onClick={() => this.props.toggleLoginModal(true)}
              >
                Sign in to your account.
              </button>
            </div>
          </div>
          <br />
        </div>
      );
    } else if (prefillEnabled && unverifiedPrefillAlert) {
      alert = unverifiedPrefillAlert;
    } else {
      alert = (
        <div>
          <div className="usa-alert usa-alert-info schemaform-sip-alert">
            <div className="usa-alert-body">
              You can save this form in progress, and come back later to finish
              filling it out.
              <br />
              <button
                className="va-button-link"
                onClick={() => this.props.toggleLoginModal(true)}
              >
                Sign in to your account.
              </button>
            </div>
          </div>
          <br />
        </div>
      );
    }
    return alert;
  }

  getStartPage = () => {
    const {
      pageList,
      pathname,
      saveInProgress: { formData },
    } = this.props;
    const data = formData || {};
    // pathname is only provided when the first page is conditional
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  renderDowntime = (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = this.props.downtime.message || DowntimeMessage;

      return (
        <Message isAfterSteps={this.props.buttonOnly} downtime={downtime} />
      );
    }

    return children;
  };

  render() {
    const { profile } = this.props.user;
    const startPage = this.getStartPage();
    const savedForm =
      profile && profile.savedForms.find(f => f.form === this.props.formId);
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(this.props.formId)
    );
    let expiresAt;
    let isExpired;
    if (savedForm) {
      expiresAt = moment.unix(savedForm.metadata.expiresAt);
      isExpired = expiresAt.isBefore();
    }

    if (profile.loading && !this.props.resumeOnly) {
      return (
        <div>
          <LoadingIndicator message="Checking to see if you have a saved version of this application..." />
          <br />
        </div>
      );
    }

    if (this.props.resumeOnly && !savedForm) {
      return null;
    }

    const content = (
      <div>
        {!this.props.buttonOnly && this.getAlert(savedForm)}
        <FormStartControls
          resumeOnly={this.props.resumeOnly}
          isExpired={isExpired}
          messages={this.props.messages}
          startText={this.props.startText}
          startPage={startPage}
          formId={this.props.formId}
          returnUrl={this.props.returnUrl}
          migrations={this.props.migrations}
          prefillTransformer={this.props.prefillTransformer}
          fetchInProgressForm={this.props.fetchInProgressForm}
          removeInProgressForm={this.props.removeInProgressForm}
          prefillAvailable={prefillAvailable}
          formSaved={!!savedForm}
        />
        {!this.props.buttonOnly && this.props.afterButtonContent}
        <br />
      </div>
    );

    if (this.props.downtime && !this.props.isLoggedIn) {
      return (
        <DowntimeNotification
          appTitle={this.props.formId}
          render={this.renderDowntime}
          dependencies={this.props.downtime.dependencies}
        >
          {content}
        </DowntimeNotification>
      );
    }

    return content;
  }
}

SaveInProgressIntro.propTypes = {
  buttonOnly: PropTypes.bool,
  afterButtonContent: PropTypes.element,
  prefillEnabled: PropTypes.bool,
  formId: PropTypes.string.isRequired,
  messages: PropTypes.object,
  migrations: PropTypes.array,
  prefillTransformer: PropTypes.func,
  returnUrl: PropTypes.string,
  lastSavedDate: PropTypes.number,
  user: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  saveInProgress: PropTypes.object.isRequired,
  fetchInProgressForm: PropTypes.func.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  retentionPeriod: PropTypes.string,
  startText: PropTypes.string,
  pathname: PropTypes.string,
  toggleLoginModal: PropTypes.func.isRequired,
  renderSignInMessage: PropTypes.func,
  verifyRequiredPrefill: PropTypes.bool,
  verifiedPrefillAlert: PropTypes.element,
  unverifiedPrefillAlert: PropTypes.element,
  downtime: PropTypes.object,
};

SaveInProgressIntro.defaultProps = {
  retentionPeriod: '60 days',
};

export const introSelector = getIntroState;

function mapStateToProps(state) {
  return {
    saveInProgress: introSelector(state),
  };
}

export default connect(mapStateToProps)(SaveInProgressIntro);

export { SaveInProgressIntro };

export const introActions = {
  fetchInProgressForm,
  removeInProgressForm,
  toggleLoginModal,
};
