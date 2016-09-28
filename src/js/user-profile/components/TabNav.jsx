import React from 'react';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs rx-nav va-dnp">
        <TabItem tabpath="/profile" title="My Profile "/>
      </ul>
    );
  }
}

export default TabNav;
