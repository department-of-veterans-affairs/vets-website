import React from 'react';
import { connect } from 'react-redux';

import TabNav from '../components/TabNav';

// TODO(crew): Redux-ify the state and how it is stored here.
class Main extends React.Component {
  render() {
    return (
      <div>
        <div className="rx-app row">
          <TabNav/>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
    profile: state.profile
  };
};

export default connect(mapStateToProps)(Main);
export { Main };
