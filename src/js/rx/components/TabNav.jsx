import React from 'react';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs rx-nav va-dnp">
        <TabItem tabpath="/" title="Refill Active Prescriptions"/>
        <TabItem tabpath="/history" title="View Prescription History"/>
      </ul>
    );
  }
}

export default TabNav;
