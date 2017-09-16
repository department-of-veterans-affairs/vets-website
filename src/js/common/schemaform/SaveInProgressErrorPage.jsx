import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  LOAD_STATUSES,
  PREFILL_STATUSES,
  fetchInProgressForm,
  setFetchFormStatus,
  removeInProgressForm
} from './save-load-actions';

import SignInLink from '../components/SignInLink';
import ProgressButton from '../components/form-elements/ProgressButton';

import { updateLogInUrls } from '../../login/actions';


// For now, this only handles loading errors, but it could feasibly be reworked
//  to handle save errors as well if we need it to.
class SaveInProgressErrorPage extends React.Component {
  getBackButton = (primary = false) => {
    const buttonClass = primary ? 'usa-button-primary' : 'usa-button-outline';
    return (
      <ProgressButton
        onButtonClick={this.goBack}
        buttonClass={buttonClass}
        buttonText="Back"
        beforeText="«"/>
    );
  }

  goBack = () => {
    this.props.setFetchFormStatus(LOAD_STATUSES.notAttempted);
    this.props.router.goBack();
  }
  // Reload the form and try again.
  reloadForm = () => {
    // formConfig is put in this.props.routes[length - 1]
    const formConfig = this.props.route.formConfig;
    if (this.props.isStartingOver) {
      this.props.removeInProgressForm(formConfig.formId, formConfig.migrations);
    } else {
      this.props.fetchInProgressForm(
        formConfig.formId,
        formConfig.migrations,
        this.props.prefillStatus === PREFILL_STATUSES.pending
      );
    }
  }

  render() {
    const { loadedStatus } = this.props;
    const { noAuth, notFound } = this.props.route.formConfig.savedFormMessages || {};
    let content;

    switch (loadedStatus) {
      case LOAD_STATUSES.noAuth:
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">You have been signed out. {noAuth}</div>
            <div>
              <div style={{ marginTop: '30px' }}>
                {this.getBackButton()}
                <SignInLink
                  type="button"
                  className="usa-button-primary"
                  onLogin={this.reloadForm}
                  isLoggedIn={this.props.isLoggedIn}
                  loginUrl={this.props.loginUrls.idme}
                  onUpdateLoginUrl={this.props.updateLogInUrl}>Sign in</SignInLink>
              </div>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.failure:
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">We’re sorry, but something went wrong. Please try applying again in a few moments.</div>
            <div style={{ marginTop: '30px' }}>
              {this.getBackButton()}
              <button className="usa-button-primary" onClick={this.reloadForm}>Resume previous application</button>
            </div>
          </div>
        );
        break;
      case LOAD_STATUSES.notFound:
        content = (
          <div>
            <div className="usa-alert usa-alert-error no-background-image">We’re sorry, but something went wrong. We can’t find your application. {notFound}</div>
            <div style={{ marginTop: '30px' }}>
              {this.getBackButton(true)}
            </div>
          </div>
        // <button className="usa-button-primary" onClick={this.startOver}>Start over</button>
        );
        break;
      default: // Shouldn’t get here...
        content = null;
        break;
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

SaveInProgressErrorPage.propTypes = {
  loadedStatus: PropTypes.string.isRequired,
  savedFormMessages: PropTypes.shape({
    notFound: PropTypes.string,
    noAuth: PropTypes.string
  }),

  isStartingOver: PropTypes.bool.isRequired,
  // For SignInLink
  isLoggedIn: PropTypes.bool.isRequired,
  loginUrls: PropTypes.object,
  updateLogInUrls: PropTypes.func.isRequired
};

const mapStateToProps = (store) => ({
  loadedStatus: store.form.loadedStatus,
  prefillStatus: store.form.prefillStatus,
  isLoggedIn: store.user.login.currentlyLoggedIn,
  loginUrls: store.user.login.loginUrls,
  isStartingOver: store.form.isStartingOver
});

const mapDispatchToProps = {
  updateLogInUrls,
  fetchInProgressForm,
  removeInProgressForm,
  setFetchFormStatus
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SaveInProgressErrorPage));

export { SaveInProgressErrorPage };
