import PropTypes from 'prop-types';
import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';
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
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
          <Toggler.Disabled>
            <TabItem
              shortcut={3}
              tabpath={`your-claims/${id}/details`}
              title="Details"
            />
          </Toggler.Disabled>
          <Toggler.Enabled>
            <TabItem
              shortcut={4}
              tabpath={`your-claims/${id}/overview`}
              title="Overview"
            />
          </Toggler.Enabled>
        </Toggler>
      </ul>
    </nav>
  );
}

TabNav.propTypes = {
  id: PropTypes.string,
};
