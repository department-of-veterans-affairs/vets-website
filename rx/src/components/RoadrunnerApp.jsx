import React from 'react';

import Nav from './Nav';

class RoadrunnerApp extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
        <hr/>
        <Nav/>
      </div>
    );
  }
}

RoadrunnerApp.propTypes = {
  children: React.PropTypes.element
};

export default RoadrunnerApp;
