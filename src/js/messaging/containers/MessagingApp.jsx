import React from 'react';
import { connect } from 'react-redux';

class MessagingApp extends React.Component {
  render() {
    return (
      <div className="messaging"></div>
    );
  }
}

MessagingApp.propTypes = {
  children: React.PropTypes.element
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(MessagingApp);
