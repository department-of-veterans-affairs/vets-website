import React from 'react';
import { connect } from 'react-redux';

import TabNav from '../components/TabNav';

class Main extends React.Component {
  render() {
    return (
      <div className="rx-app row">
        <TabNav/>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Main);
