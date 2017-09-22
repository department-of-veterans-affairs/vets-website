import React from 'react';
import Scroll from 'react-scroll';
import PropTypes from 'prop-types';

import { SAVE_STATUSES, saveErrors } from './save-load-actions';
import { focusElement } from '../utils/helpers';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('saveFormLinkTop', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true
  });
};

class SaveFormLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false
    };

    this.loginAttemptInProgress = false;
  }

  componentDidMount() {
    if (saveErrors.has(this.props.savedStatus)) {
      scrollToTop();
      focusElement('.schemaform-save-error');
    }
  }

  componentWillReceiveProps(newProps) {
    const loginAttemptCompleted = this.props.user.login.showModal === true
      && newProps.user.login.showModal === false
      && this.loginAttemptInProgress;

    if (loginAttemptCompleted && newProps.user.login.currentlyLoggedIn) {
      this.loginAttemptInProgress = false;
      this.saveFormAfterLogin();
    } else if (loginAttemptCompleted && !newProps.user.login.currentlyLoggedIn) {
      this.loginAttemptInProgress = false;
    }
  }

  handleSave() {
    const {
      formId,
      version,
      data
    } = this.props.form;
    const returnUrl = this.props.locationPathname;
    this.props.saveInProgressForm(formId, version, returnUrl, data);
  }

  saveFormAfterLogin = () => {
    window.dataLayer.push({
      event: `${this.props.form.trackingPrefix}sip-login-before-save`
    });
    this.handleSave();
  }

  saveForm = () => {
    if (this.props.user.login.currentlyLoggedIn) {
      this.handleSave();
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal = () => {
    this.loginAttemptInProgress = true;
    this.props.toggleLoginModal(true);
  }

  render() {
    const { savedStatus } = this.props.form;

    return (
      <div style={{ display: this.props.children ? 'inline' : null }}>
        <Element name="saveFormLinkTop"/>
        {saveErrors.has(savedStatus) &&
          <div role="alert" className="usa-alert usa-alert-error no-background-image schemaform-save-error">
            {savedStatus === SAVE_STATUSES.failure &&
              'We’re sorry, but we’re having some issues and are working to fix them. If you’re on a secure and private computer, you can leave this page open and try again later. You won’t lose any of your information. If you’re on a public computer, please log off and try again later.'}
            {savedStatus === SAVE_STATUSES.clientFailure &&
              'We’re sorry, but we’re unable to connect to Vets.gov. Please check that you’re connected to the Internet and try again.'}
            {savedStatus === SAVE_STATUSES.noAuth &&
              <span>Sorry, you’re signed out. Please <button className="va-button-link" onClick={this.openLoginModal}>sign in</button> again to save your application.</span>}
          </div>
        }
        {savedStatus !== SAVE_STATUSES.noAuth &&
          <button type="button" className="va-button-link schemaform-sip-save-link" onClick={this.saveForm}>{this.props.children || 'Finish this application later'}</button>}
      </div>
    );
  }
}

SaveFormLink.propTypes = {
  locationPathname: PropTypes.string.isRequired,
  form: PropTypes.shape({
    formId: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    trackingPrefix: PropTypes.string.isRequired,
    savedStatus: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.object.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
};

export default SaveFormLink;
