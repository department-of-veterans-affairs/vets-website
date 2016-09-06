import React from 'react';
import { connect } from 'react-redux';

class AppMessaging extends React.Component {
  render() {
    return (
      <div className="messaging"></div>
    );
  }
}

AppMessaging.propTypes = {
  children: React.PropTypes.element
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(AppMessaging);
