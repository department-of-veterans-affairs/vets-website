import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from 'platform/utilities/ui';

import TabItem from './TabItem';

export function TabNav({ location, router, showExpressCare }) {
  const isExpressCareTab = location.pathname === '/express-care';
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
        title={showExpressCare ? 'Upcoming' : 'Upcoming appointments'}
      />
      <TabItem
        id="past"
        tabpath="/past"
        isActive={location.pathname === '/past'}
        onPreviousTab={() => {
          router.push('/');
          focusElement('#tabupcoming');
        }}
        onNextTab={() => {
          if (showExpressCare || isExpressCareTab) {
            router.push('/express-care');
            focusElement('#tabexpress-care');
          }
        }}
        title={showExpressCare ? 'Past' : 'Past appointments'}
      />
      {(showExpressCare || isExpressCareTab) && (
        <TabItem
          id="express-care"
          tabpath="/express-care"
          isActive={isExpressCareTab}
          onPreviousTab={() => {
            router.push('/past');
            focusElement('#tabpast');
          }}
          title="Express Care"
        />
      )}
    </ul>
  );
}

export default withRouter(TabNav);
