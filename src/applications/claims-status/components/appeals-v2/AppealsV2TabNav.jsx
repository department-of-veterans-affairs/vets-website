import React from 'react';
import PropTypes from 'prop-types';

import TabItem from '../TabItem';

const location = {
  pathname: '/some path',
};

const AppealsV2TabNav = ({ appealId }) => (
  <nav aria-label="Appeal">
    <ul className="tabs">
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
  </nav>
);

AppealsV2TabNav.propTypes = {
  appealId: PropTypes.string.isRequired,
};

export default AppealsV2TabNav;
