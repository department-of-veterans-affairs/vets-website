import React from 'react';
import { createSelector } from 'reselect';
import { startCase, toLower } from 'lodash';

import localStorage from '../../utilities/storage/localStorage';
import { selectProfile } from '../../user/selectors';

export const selectUserGreeting = createSelector(
  // TODO: perhaps make these selectors fail gracefully if state.user, or any of
  // the properties on the user object are not defined
  state => selectProfile(state).userFullName,
  state => selectProfile(state).email,
  () => localStorage.getItem('userFirstName'),
  (name, email, sessionFirstName) => {
    if (name.first || sessionFirstName) {
      return (
        <span
          className="user-dropdown-email"
          data-dd-privacy="mask"
          data-dd-action-name="First Name"
        >
          {startCase(toLower(name.first || sessionFirstName))}
        </span>
      );
    }

    return [
      <span
        key="show-for-medium-up"
        className="user-dropdown-email medium-screen:vads-u-visibility--visible"
        data-dd-privacy="mask"
        data-dd-action-name="Email"
      >
        {email}
      </span>,
    ];
  },
);
