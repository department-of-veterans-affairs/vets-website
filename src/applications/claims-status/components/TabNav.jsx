import React from 'react';

import TabItem from './TabItem';

export default function TabNav() {
  return (
    <nav aria-label="Claim">
      <ul className="tabs">
        <TabItem shortcut={1} tabpath="../status" title="Status" />
        <TabItem shortcut={2} tabpath="../files" title="Files" />
        <TabItem shortcut={3} tabpath="../overview" title="Overview" />
      </ul>
    </nav>
  );
}

TabNav.propTypes = {};
