import React from 'react';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="medium-8 columns">
          <ul className="va-tabs">
            <TabItem tabpath="/your-claims/status" title="Status"/>
            <TabItem tabpath="/your-claims/files" title="Files"/>
            <TabItem tabpath="/your-claims/details" title="Details"/>
          </ul>
        </div>
      </div>
    );
  }
}

export default TabNav;
