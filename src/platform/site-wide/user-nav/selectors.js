import { createSelector } from 'reselect';
import { startCase, toLower } from 'lodash';

import conditionalStorage from '../../utilities/storage/conditionalStorage';
import { selectProfile } from '../../user/selectors';

export const selectUserGreetingMobile = createSelector(
  state => selectProfile(state).userFullName,
  () => conditionalStorage().getItem('userFirstName'),
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
  () => conditionalStorage().getItem('userFirstName'),
  (name, email, sessionFirstName) => {
    if (name.first || sessionFirstName) {
      return startCase(toLower(name.first || sessionFirstName));
    }
    return email;
  },
);
