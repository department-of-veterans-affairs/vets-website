import React from 'react';
import { createSelector } from 'reselect';
import { startCase, toLower } from 'lodash';

import localStorage from '../../utilities/storage/localStorage';
import { selectProfile } from '../../user/selectors';

export const selectUserGreeting = createSelector(
  state => selectProfile(state)?.userFullName,
  state => selectProfile(state)?.email,
  () => localStorage.getItem('preferredName'),
  () => localStorage.getItem('userFirstName'),
  state => selectProfile(state)?.preferredName,
  (name, email, sessionPreferredName, sessionFirstName, preferredName) => {
    if (preferredName) localStorage.setItem('preferredName', preferredName);

    if (
      preferredName ||
      sessionPreferredName ||
      name.first ||
      sessionFirstName
    ) {
      return (
        <span
          className="user-dropdown-email"
          data-dd-privacy="mask"
          data-dd-action-name="First Name"
        >
          {preferredName ||
            sessionPreferredName ||
            startCase(toLower(name.first || sessionFirstName))}
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
