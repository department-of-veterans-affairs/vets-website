import React from 'react';

import { Toggler } from '~/platform/utilities/feature-toggles';

import TabItem from './TabItem';

const { cstUseClaimDetailsV2 } = Toggler.TOGGLE_NAMES;

export default function TabNav() {
  return (
    <nav aria-label="Claim">
      <ul className="tabs">
        <TabItem shortcut={1} tabpath="../status" title="Status" />
        <TabItem shortcut={2} tabpath="../files" title="Files" />
        <Toggler toggleName={cstUseClaimDetailsV2}>
          <Toggler.Disabled>
            <TabItem shortcut={3} tabpath="../details" title="Details" />
          </Toggler.Disabled>
          <Toggler.Enabled>
            <TabItem shortcut={3} tabpath="../overview" title="Overview" />
          </Toggler.Enabled>
        </Toggler>
      </ul>
    </nav>
  );
}

TabNav.propTypes = {};
