import React from 'react';
import PropTypes from 'prop-types';

import TabItem from '../TabItem';

export default function AppealsV2TabNav({ appealId }) {
  return (
    <nav aria-label="Appeal">
      <ul className="tabs">
        <TabItem
          shortcut={1}
          id="v2status"
          tabpath={`appeals/${appealId}/status`}
          title="Status"
        />
        <TabItem
          shortcut={2}
          id="v2detail"
          tabpath={`appeals/${appealId}/detail`}
          title="Issues"
        />
      </ul>
    </nav>
  );
}

AppealsV2TabNav.propTypes = {
  appealId: PropTypes.string.isRequired,
};
