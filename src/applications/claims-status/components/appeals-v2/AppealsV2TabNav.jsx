import React from 'react';

import TabItem from '../TabItem';

const AppealsV2TabNav = () => (
  <ul className="va-tabs claims-status-tabs small-12 medium-10" role="tablist">
    <TabItem
      shortcut={1}
      className="appeals-tabs-item"
      id="v2status"
      tabpath="status"
      title="Status"
    />
    <TabItem
      shortcut={2}
      className="appeals-tabs-item"
      id="v2detail"
      tabpath="detail"
      title="Issues"
    />
  </ul>
);

export default AppealsV2TabNav;
