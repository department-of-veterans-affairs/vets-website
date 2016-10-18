import React from 'react';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs rx-nav va-dnp">
        <TabItem tabpath="/rx" title="Refill Prescriptions"/>
        <TabItem tabpath="/rx/history" title="View History"/>
      </ul>
    );
  }
}

export default TabNav;
