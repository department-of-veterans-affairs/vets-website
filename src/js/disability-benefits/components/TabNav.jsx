import React from 'react';

import TabItem from './TabItem';

class TabNav extends React.Component {
  render() {
    return (
      <ul className="va-tabs">
        <TabItem tabpath={`your-claims/${this.props.id}/status`} title="Status"/>
        <TabItem tabpath={`your-claims/${this.props.id}/files`} title="Files"/>
        <TabItem tabpath={`your-claims/${this.props.id}/details`} title="Details"/>
      </ul>
    );
  }
}

TabNav.propTypes = {
  id: React.PropTypes.string
};

export default TabNav;
