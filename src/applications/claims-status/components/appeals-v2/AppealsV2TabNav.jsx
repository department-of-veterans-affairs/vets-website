import React from 'react';
import PropTypes from 'prop-types';

import TabItem from '../TabItem';

const location = {
  pathname: '/some path',
};

const AppealsV2TabNav = ({ appealId }) => (
  <ul className="tabs" role="tablist">
    <TabItem
      shortcut={1}
      id="v2status"
      tabpath={`appeals/${appealId}/status`}
      title="Status"
      location={location}
    />
    <TabItem
      shortcut={2}
      id="v2detail"
      tabpath={`appeals/${appealId}/detail`}
      title="Issues"
      location={location}
    />
  </ul>
);

AppealsV2TabNav.propTypes = {
  appealId: PropTypes.string.isRequired,
};

export default AppealsV2TabNav;
