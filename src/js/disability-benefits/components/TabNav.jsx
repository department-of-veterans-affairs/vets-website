import React from 'react';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs">
        <TabItem tabpath="/your-claims/status" title="Status"/>
        <TabItem tabpath="/your-claims/files" title="Files"/>
        <TabItem tabpath="/your-claims/details" title="Details"/>
      </ul>
    );
  }
}

export default TabNav;
