import React from 'react';
import PropTypes from 'prop-types';

import LoginModal from '../components/LoginModal';
import { SAVE_STATUSES } from './save-load-actions';

// TODO: Come up with a better name than SaveFormLink
class SaveFormLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false
    };
  }

  openLoginModal = () => {
    // console.log('opening login modal');
    this.setState({ modalOpened: true });
  }

  closeLoginModal = () => {
    this.setState({ modalOpened: false });
  }

  render() {
    const {
      saveForm,
      savedStatus
    } = this.props;
    let content = <a onClick={saveForm}>Save and finish later</a>;

    if (!this.props.user.login.currentlyLoggedIn) {
      // if we have a noAuth status, that means they tried to save and got a 401, which
      // likely means their session is expired (since they were logged in before)
      content = (<div>
        {savedStatus === SAVE_STATUSES.noAuth
            ? <span>Sorry, your session has expired. Please <a onClick={this.openLoginModal}>sign in</a> again.</span>
            : <span><a onClick={this.openLoginModal}>Sign in</a> before saving your application</span>}
        <LoginModal
            key={1}
            title="Sign in to save your application"
            onClose={this.closeLoginModal}
            visible={this.state.modalOpened}
            user={this.props.user}
            onUpdateLoginUrl={this.props.onUpdateLoginUrl}/>
      </div>);
    }

    if (savedStatus === SAVE_STATUSES.failure) {
      content = <span>failure message</span>;
    } else if (savedStatus === SAVE_STATUSES.pending) {
      content = <span>spinner or something</span>;
    }

    return content;
  }
}

SaveFormLink.propTypes = {
  saveForm: PropTypes.func.isRequired,
  savedStatus: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  onUpdateLoginUrl: PropTypes.func.isRequired
};

export default SaveFormLink;
