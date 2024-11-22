import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '~/platform/utilities/environment';

// Mock user data
const mockUser = {
  account: {
    accountUuid: '899972dsssakkkkfatttcba6c35fff52',
  },
  profile: {
    firstName: 'John',
    lastName: 'Smith',
    verified: true,
    signIn: {
      serviceName: 'idme',
    },
  },
  prefillsAvailable: [],
  inProgressForms: [],
};

export const userLoader = async () => {
  if (mockUser) {
    // Return mock user data
    return mockUser;
  }

  try {
    const path = '/accredited_representative_portal/v0/user';
    const user = await apiRequest(`${environment.API_URL}${path}`);

    // Success condition: Check for 'serviceName'
    const serviceName = user?.profile?.signIn?.serviceName;
    if (!serviceName) {
      throw new Error('Missing user with sign-in service name.');
    }

    // Store 'serviceName' in sessionStorage for access token refreshing
    sessionStorage.setItem('serviceName', serviceName);

    // Return the user data
    return { user, isUserLoading: false, error: null };
  } catch (e) {
    const error =
      e.errors?.[0]?.detail || e.message || 'Unknown error while fetching user';

    // Otherwise, throw the error to be handled by the application
    return { user: null, isUserLoading: false, error };
  }
};
