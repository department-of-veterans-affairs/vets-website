import React from 'react';

import TabItem from '../TabItem';

export default function AppealsV2TabNav() {
  return (
    <nav aria-label="Appeal">
      <ul className="tabs">
        <TabItem shortcut={1} id="v2status" tabpath="status" title="Status" />
        <TabItem shortcut={2} id="v2detail" tabpath="detail" title="Issues" />
      </ul>
    </nav>
  );
}

AppealsV2TabNav.propTypes = {};
