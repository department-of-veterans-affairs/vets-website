import { createSelector } from 'reselect';
import { startCase, toLower } from 'lodash';

import conditionalStorage from '../../utilities/storage/conditionalStorage';
import { selectProfile } from '../../user/selectors';

export const selectUserGreeting = createSelector(
  state => selectProfile(state).userFullName,
  () => conditionalStorage().getItem('userFirstName'),
  (name, sessionFirstName) => {
    if (name.first || sessionFirstName) {
      return startCase(toLower(name.first || sessionFirstName));
    }

    return 'My Account';
  },
);
