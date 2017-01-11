import React from 'react';

import TabItem from './TabItem';

class MainTabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs db-tabs" role="tablist">
        <TabItem shortcut={1} tabpath={`your-claims`} title="Open Claims"/>
        <TabItem shortcut={2} tabpath={`your-claims/closed`} title="Closed Claims"/>
      </ul>
    );
  }
}

export default MainTabNav;
