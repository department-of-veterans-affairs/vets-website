import { createSelector } from 'reselect';
import { startCase, toLower } from 'lodash';

import conditionalStorage from '../../utilities/storage/conditionalStorage';
import { selectProfile } from '../../user/selectors';

const desktopMediaQuery = window.matchMedia('(min-width: 768px)');

export const selectUserGreeting = createSelector(
  state => selectProfile(state).userFullName,
  state => selectProfile(state).email,
  () => conditionalStorage().getItem('userFirstName'),
  (name, email, sessionFirstName) => {
    if (name.firsts || sessionFirstName) {
      return startCase(toLower(name.first || sessionFirstName));
    }

    if (desktopMediaQuery.matches) {
      return email;
    }

    return 'My Account';
  },
);
