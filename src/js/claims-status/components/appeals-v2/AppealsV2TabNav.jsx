import React from 'react';
import PropTypes from 'prop-types';

import TabItem from '../TabItem';

const AppealsV2TabNav = ({ appealId }) => {
  return (
    <ul className="va-tabs claims-status-tabs small-12 medium-10" role="tablist">
      <TabItem shortcut={1} className="appeals-tabs-item" id="v2status" tabpath={`appeals-v2/${appealId}/status`} title="Status"/>
      <TabItem shortcut={2} className="appeals-tabs-item" id="v2detail" tabpath={`appeals-v2/${appealId}/detail`} title="Detail"/>
    </ul>
  );
};

AppealsV2TabNav.PropTypes = {
  appealId: PropTypes.string.isRequired
};

export default AppealsV2TabNav;
