import React from 'react';
import { createSelector } from 'reselect';
import { startCase, toLower } from 'lodash';

import localStorage from '../../utilities/storage/localStorage';
import { selectProfile } from '../../user/selectors';

export const selectUserGreeting = createSelector(
  state => selectProfile(state).userFullName,
  state => selectProfile(state).email,
  () => localStorage.getItem('userFirstName'),
  (name, email, sessionFirstName) => {
    if (name.first || sessionFirstName) {
      return (
        <span className="user-dropdown-email">
          {startCase(toLower(name.first || sessionFirstName))}
        </span>
      );
    }

    return [
      <span
        key="show-for-small-only"
        className="small-screen:vads-u-visibility--visible medium-screen:vads-u-display--none"
      >
        My Account
      </span>,
      <span
        key="show-for-medium-up"
        className="user-dropdown-email medium-screen:vads-u-visibility--visible"
      >
        {email}
      </span>,
    ];
  },
);
