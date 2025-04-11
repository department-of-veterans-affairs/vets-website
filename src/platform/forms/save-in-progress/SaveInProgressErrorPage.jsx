import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
  fetchInProgressForm,
  setFetchFormStatus,
  removeInProgressForm,
} from './actions';

import SignInLink from '../components/SignInLink';

import { toggleLoginModal } from '../../site-wide/user-nav/actions';
import {
  CONTINUE_APP_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
} from '../../forms-system/src/js/constants';

const DEFAULT_FORBIDDEN_MESSAGE = `
  We're sorry. We can't give you access to this information. For help, please call the VA.gov help desk at 855-574-7286 (TTY: 711). We’re here Monday–Friday, 8:00 a.m.–8:00 p.m. ET.
`;

// For now, this only handles loading errors, but it could feasibly be reworked
//  to handle save errors as well if we need it to.
class SaveInProgressErrorPage extends React.Component {
  componentDidMount() {
    if (this.props.loadedStatus === LOAD_STATUSES.notAttempted) {
      this.props.router.replace(this.props.location.basename);
    }
  }

  getBackButton = (primary = false) => {
    return primary ? (
      <VaButtonPair primaryLabel="« Back" onPrimaryClick={this.goBack} />
    ) : (
      <VaButtonPair secondaryLabel="« Back" onSecondaryClick={this.goBack} />
    );
  };

  goBack = () => {
    this.props.setFetchFormStatus(LOAD_STATUSES.notAttempted);
    this.props.router.goBack();
  };

  // Reload the form and try again.
  reloadForm = () => {
    // formConfig is put in this.props.routes[length - 1]
    const { formConfig } = this.props.route;
    if (this.props.isStartingOver) {
      this.props.removeInProgressForm(formConfig.formId, formConfig.migrations);
    } else {
      this.props.fetchInProgressForm(
        formConfig.formId,
        formConfig.migrations,
        this.props.prefillStatus === PREFILL_STATUSES.pending,
      );
    }
  };

  render() {
    const { loadedStatus, formConfig } = this.props;
    let content;
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
    const continueAppButtonText =
      formConfig?.customText?.continueAppButtonText ||
      CONTINUE_APP_DEFAULT_MESSAGE;
    const { forbidden, noAuth, notFound } = formConfig.savedFormMessages || {};
    switch (loadedStatus) {
      case LOAD_STATUSES.noAuth:
        content = (
          <div>
            <div className="usa-alert usa-alert-error background-color-only">
              You’re signed out of your account. {noAuth}
            </div>
            <div>
              <div style={{ marginTop: '30px' }}>
                {this.getBackButton()}
                <SignInLink
                  type="button"
                  className="usa-button-primary"
                  onLogin={this.reloadForm}
                  isLoggedIn={this.props.isLoggedIn}
                  showLoginModal={this.props.showLoginModal}
                  toggleLoginModal={this.props.toggleLoginModal}
                >
                  Sign In
                </SignInLink>
              </div>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.failure:
        content = (
          <div>
            <div className="usa-alert usa-alert-error background-color-only">
              We’re sorry. We’re having some server issues and are working to
              fix them. Please try applying again in a few moments.
            </div>
            <div style={{ marginTop: '30px' }}>
              {this.getBackButton()}
              <button className="usa-button-primary" onClick={this.reloadForm}>
                {continueAppButtonText}
              </button>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.forbidden:
        content = (
          <div>
            <div className="usa-alert usa-alert-error background-color-only">
              {forbidden || DEFAULT_FORBIDDEN_MESSAGE}
            </div>
            <div style={{ marginTop: '30px' }} />
          </div>
        );
        break;
      case LOAD_STATUSES.clientFailure:
        content = (
          <div>
            <div className="usa-alert usa-alert-error background-color-only">
              We’re sorry, but we’re unable to connect to VA.gov. Please check
              that you’re connected to the Internet and try again.
            </div>
            <div style={{ marginTop: '30px' }}>
              {this.getBackButton()}
              <button className="usa-button-primary" onClick={this.reloadForm}>
                {continueAppButtonText}
              </button>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.invalidData:
        content = (
          <div>
            <div className="usa-alert usa-alert-error background-color-only">
              We’re sorry. Something went wrong when we tried to access your
              {appType}. We’re working to fix this. You can try applying again
              in a few moments or start your {appType} over.
            </div>
            <div style={{ marginTop: '30px' }}>
              {this.getBackButton()}
              <button className="usa-button-primary" onClick={this.reloadForm}>
                {continueAppButtonText}
              </button>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.notFound:
        content = (
          <div>
            <div className="usa-alert usa-alert-error background-color-only">
              We’re sorry. Something went wrong when we tried to find your{' '}
              {appType}. {notFound}
            </div>
            <div style={{ marginTop: '30px' }}>{this.getBackButton(true)}</div>
          </div>
          // <button className="usa-button-primary" onClick={this.startOver}>Start over</button>
        );
        break;
      default:
        // Shouldn’t get here...
        content = null;
        break;
    }

    return <div>{content}</div>;
  }
}

SaveInProgressErrorPage.propTypes = {
  formConfig: PropTypes.shape({
    savedFormMessages: PropTypes.shape({
      notFound: PropTypes.string,
      noAuth: PropTypes.string,
    }),
    customText: PropTypes.shape({
      continueAppButtonText: PropTypes.string,
    }),
  }).isRequired,
  // For SignInLink
  isLoggedIn: PropTypes.bool.isRequired,
  isStartingOver: PropTypes.bool.isRequired,
  loadedStatus: PropTypes.string.isRequired,
};

SaveInProgressErrorPage.defaultProps = {
  formConfig: {
    customText: {
      continueAppButtonText: '',
    },
  },
};

const mapStateToProps = (store, ownProps) => ({
  loadedStatus: store.form.loadedStatus,
  prefillStatus: store.form.prefillStatus,
  isLoggedIn: store.user.login.currentlyLoggedIn,
  showLoginModal: store.navigation.showLoginModal,
  isStartingOver: store.form.isStartingOver,
  formConfig: ownProps.formConfig,
});

const mapDispatchToProps = {
  fetchInProgressForm,
  removeInProgressForm,
  setFetchFormStatus,
  toggleLoginModal,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SaveInProgressErrorPage),
);

export { SaveInProgressErrorPage };
