import React from 'react';
import Scroll from 'react-scroll';
import PropTypes from 'prop-types';
import moment from 'moment';

import LoginModal from '../components/LoginModal';
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
  }

  componentDidMount() {
    if (saveErrors.has(this.props.savedStatus)) {
      scrollToTop();
      focusElement('.schemaform-save-error');
    }
    this.timer = setInterval(() => this.props.saveFormInline(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  openLoginModal = () => {
    // console.log('opening login modal');
    this.setState({ modalOpened: true });
  }

  closeLoginModal = () => {
    this.setState({ modalOpened: false });
  }

  saveFormAfterLogin = (...args) => {
    window.dataLayer.push({
      event: `${this.props.trackingPrefix}sip-login-before-save`
    });
    this.props.saveForm(...args);
  }

  saveForm = (...args) => {
    if (this.props.user.login.currentlyLoggedIn) {
      this.props.saveForm(...args);
    } else {
      this.openLoginModal();
    }
  }
  render() {
    const {
      savedStatus,
      lastSavedDate,
      saveInlineInProgress
    } = this.props;

    // TODO: Remove LoginModal from here
    return (
      <div>
        <Element name="saveFormLinkTop"/>
        <LoginModal
          key={1}
          title="Sign in to save your application"
          onClose={this.closeLoginModal}
          visible={this.state.modalOpened}
          user={this.props.user}
          onUpdateLoginUrl={this.props.onUpdateLoginUrl}
          onLogin={this.saveFormAfterLogin}/>
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
        {!!lastSavedDate && !saveInlineInProgress &&
        <p className="schemaform-save-notice">Application has been saved. Last saved at {moment(lastSavedDate).format('MM/DD/YY h:mm a')}</p>}
        {saveInlineInProgress && <p className="schemaform-save-notice">Loading...</p>}
        {savedStatus !== SAVE_STATUSES.noAuth &&
          <button type="button" className="va-button-link schemaform-sip-save-link" onClick={this.saveForm}>Finish this application later</button>}
      </div>
    );
  }
}

SaveFormLink.propTypes = {
  saveForm: PropTypes.func.isRequired,
  savedStatus: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onUpdateLoginUrl: PropTypes.func.isRequired,
  trackingPrefix: PropTypes.string
};

export default SaveFormLink;
