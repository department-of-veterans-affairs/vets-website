import React from 'react';

import TabItem from '../TabItem';

export const AppealsV2TabNav = (props) => {
  return (
    <ul className="va-tabs claims-status-tabs" role="tablist">
      <TabItem shortcut={1} id="v2status" tabpath={`appeals-v2/${props.appealId}/status`} title="Status"/>
      <TabItem shortcut={2} id="v2detail" tabpath={`appeals-v2/${props.appealId}/detail`} title="Detail"/>
    </ul>
  );
};

export default AppealsV2TabNav;
