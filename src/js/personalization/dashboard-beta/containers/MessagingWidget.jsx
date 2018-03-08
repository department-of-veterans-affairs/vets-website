import React from 'react';
import { connect } from 'react-redux';

class MessagingWidget extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <h2>Messages</h2>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;

  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingWidget);
export { MessagingWidget };
