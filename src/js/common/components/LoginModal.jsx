import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from './Modal';


class LoginModal extends React.Component {
  getModalContents = (user) => {
    let contents = (<div>
      <button className="usa-button-primary">Sign in</button>
      <button className="usa-button-outline" onClick={this.props.onClose}>Cancel</button>
    </div>);

    // Shouldn't in get here, but just in case
    if (user.login.currentlyLoggedIn) {
      contents = (<div>
        You're already signed in as {user.profile.userFullName.first} {user.profile.userFullName.last}!
      </div>);
    }

    return contents;
  }

  render() {
    return (
      <Modal
          contents={this.getModalContents(this.props.user)}
          onClose={this.props.onClose}
          visible={this.props.visible}
          title={this.props.title || 'Sign in'}/>
    );
  }
}

LoginModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(LoginModal);
