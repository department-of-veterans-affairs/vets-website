import React from 'react';
import { connect } from 'react-redux';

class ConfirmAddress extends React.Component {
  render() {
    return (
      <div>Placeholder for confirm address</div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile
  };
}

export default connect(mapStateToProps)(ConfirmAddress);
