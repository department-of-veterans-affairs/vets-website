import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';

import TabItem from './TabItem';

export default function TabNav() {
  const history = useHistory();
  const location = useLocation();

  const pathWithSlash = location.pathname.endsWith('/')
    ? location.pathname
    : `${location.pathname}/`;

  return (
    <ul className="va-tabs vaos-appts__tabs" role="tablist">
      <TabItem
        id="upcoming"
        tabpath="/"
        isActive={pathWithSlash === '/'}
        firstTab
        onNextTab={() => {
          history.push('/past');
          focusElement('#tabpast');
        }}
        title={'Upcoming appointments'}
      />
      <TabItem
        id="past"
        tabpath="/past"
        isActive={pathWithSlash.endsWith('past/')}
        onPreviousTab={() => {
          history.push('/');
          focusElement('#tabupcoming');
        }}
        title={'Past appointments'}
      />
    </ul>
  );
}
