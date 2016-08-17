import React from 'react';

import TabNav from './TabNav';

class Main extends React.Component {
  render() {
    return (
      <div>
        <TabNav/>
        {this.props.children}
      </div>
    );
  }
}

export default Main;
