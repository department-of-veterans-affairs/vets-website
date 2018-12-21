import { createSelector } from 'reselect';
import { startCase, toLower } from 'lodash';

import localStorage from '../../utilities/storage/localStorage';
import { selectProfile } from '../../user/selectors';

export const selectUserGreetingMobile = createSelector(
  state => selectProfile(state).userFullName,
  state => selectProfile(state).email,
  () => localStorage.getItem('userFirstName'),
  (name, email, sessionFirstName) => {
    if (name.first || sessionFirstName) {
      return startCase(toLower(name.first || sessionFirstName));
    }
    return 'My Account';
  },
);

export const selectUserGreeting = createSelector(
  state => selectProfile(state).userFullName,
  state => selectProfile(state).email,
  () => localStorage.getItem('userFirstName'),
  (name, email, sessionFirstName) => {
    if (name.first || sessionFirstName) {
      return startCase(toLower(name.first || sessionFirstName));
    }
    return email;
  },
);
