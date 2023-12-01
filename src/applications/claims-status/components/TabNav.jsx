import PropTypes from 'prop-types';
import React from 'react';

import TabItem from './TabItem';

export default function TabNav({ id }) {
  return (
    <nav aria-label="Claim">
      <ul className="tabs">
        <TabItem
          shortcut={1}
          tabpath={`your-claims/${id}/status`}
          title="Status"
        />
        <TabItem
          shortcut={2}
          tabpath={`your-claims/${id}/files`}
          title="Files"
        />
        <TabItem
          shortcut={3}
          tabpath={`your-claims/${id}/details`}
          title="Details"
        />
        <TabItem
          shortcut={4}
          tabpath={`your-claims/${id}/overview`}
          title="Overview"
        />
      </ul>
    </nav>
  );
}

TabNav.propTypes = {
  id: PropTypes.string,
};
