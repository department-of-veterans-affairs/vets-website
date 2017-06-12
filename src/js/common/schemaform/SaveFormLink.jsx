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
    let content = (<div>
      <a onClick={this.openLoginModal}>Sign in before saving your application</a>
      <LoginModal
          key={1}
          title="Sign in to save your application"
          onClose={this.closeLoginModal}
          visible={this.state.modalOpened}
          user={this.props.user}
          onUpdateLoginUrl={this.props.onUpdateLoginUrl}/>
    </div>);

    if (this.props.user.login.currentlyLoggedIn) {
      content = <a onClick={saveForm}>Save and come back later</a>;
    }

    if (savedStatus === SAVE_STATUSES.noAuth) {
      content = <p>no-auth message</p>;
    } else if (savedStatus === SAVE_STATUSES.failure) {
      content = <p>failure message</p>;
    } else if (savedStatus === SAVE_STATUSES.pending) {
      content = <p>spinner or something</p>;
    }

    // TODO: If we get a no-auth, we should reset the link after login
    //  Or, as a temporary solution, include the save link in the no-auth
    //  message..?
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
