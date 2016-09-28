import React from 'react';
import { connect } from 'react-redux';

class UserProfileApp extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

UserProfileApp.propTypes = {
  children: React.PropTypes.element
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
