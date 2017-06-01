import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoginModal from '../components/LoginModal';

// TODO: Come up with a better name than SaveFormLink
class SaveFormLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: false
    };
  }

  openLoginModal = () => {
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
    const action = this.props.loggedIn ? saveForm : this.openLoginModal;
    let content = (<div>
      <a onClick={action}>Save and come back later</a>
      <LoginModal
          key={1}
          title="Sign in to save your application"
          onClose={this.closeLoginModal}
          visible={this.state.modalOpened}/>
    </div>);

    if (savedStatus === 'no-auth') {
      content = <p>no-auth message</p>;
    } else if (savedStatus === 'failure') {
      content = <p>failure message</p>;
    } else if (savedStatus === 'pending') {
      content = <p>spinner or something</p>;
    } else if (savedStatus === 'success') {
      content = <p>success message</p>;
      // TODO: Redirect to a page like: https://marvelapp.com/2hj59b1/screen/28358414
    }

    // TODO: If we get a no-auth, we should reset the link after login
    //  Or, as a temporary solution, include the save link in the no-auth
    //  message..?
    return content;
  }
}

SaveFormLink.propTypes = {
  saveForm: PropTypes.func.isRequired,
  savedStatus: PropTypes.string.isRequired
};

// I'd rather not have this linked to redux, but then again, I'd rather not pass
//  the prop through too many components; after login, all those parents would
//  be rerendered unnecessarily.
const mapStateToProps = (state) => ({
  loggedIn: state.user.login.currentlyLoggedIn
});

export default connect(mapStateToProps)(SaveFormLink);
