import React from 'react';
import { connect } from 'react-redux';

import SignInProfileButton from '../../common/components/SignInProfileButton';
import TabNav from '../components/TabNav';

class Main extends React.Component {
  render() {
    return (
      <div>
        <SignInProfileButton/>
        <div className="rx-app row">
          <TabNav/>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Main);
