import React from 'react';

import TabItem from './TabItem';

export default function TabNav() {
  return (
    <ul className="va-tabs claims-status-tabs" role="tablist">
      <TabItem shortcut={1} tabpath="../status" title="Status" />
      <TabItem shortcut={2} tabpath="../files" title="Files" />
      <TabItem shortcut={3} tabpath="../details" title="Details" />
    </ul>
  );
}
