import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from 'platform/utilities/ui';

import TabItem from './TabItem';

export function TabNav({ location, router }) {
  return (
    <ul className="va-tabs vaos-appts__tabs" role="tablist">
      <TabItem
        id="upcoming"
        tabpath="/"
        isActive={location.pathname === '/'}
        firstTab
        onNextTab={() => {
          router.push('/past');
          focusElement('#tabpast');
        }}
        title="Upcoming appointments"
      />
      <TabItem
        id="past"
        tabpath="/past"
        isActive={location.pathname === '/past'}
        onPreviousTab={() => {
          router.push('/');
          focusElement('#tabupcoming');
        }}
        title="Past appointments"
      />
    </ul>
  );
}

export default withRouter(TabNav);
