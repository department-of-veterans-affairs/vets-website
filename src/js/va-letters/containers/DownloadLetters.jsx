import React from 'react';
import { connect } from 'react-redux';

class DownloadLetters extends React.Component {
  render() {
    return (
      <div>Placeholder for download letters</div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile
  };
}

export default connect(mapStateToProps)(DownloadLetters);
