import React from 'react';
import { connect } from 'react-redux';

class VALettersApp extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div>{children}</div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile
  };
}

export default connect(mapStateToProps)(VALettersApp);
