import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import profile from 'applications/personalization/profile360/reducers';
import connectedApps from 'applications/personalization/profile-2/components/connected-apps/reducers/connectedApps';
import profileUi from '../reducers';

/**
 * A custom React Testing Library render function that allows for easy rendering
 * of Profile-related components. This helper sets up the reducers used by the
 * Profile application, as shown in the profile entry file
 * src/applications/personalization/profile360/profile-360-entry.jsx
 */
export function renderWithProfileReducers(
  ui,
  { initialState = {}, reducers = {}, ...renderOptions } = {},
) {
  return renderInReduxProvider(ui, {
    reducers: { ...profile, profileUi, connectedApps, ...reducers },
    initialState,
    ...renderOptions,
  });
}
