import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import ProfileWrapper from './ProfileWrapper.jsx';
import getRoutes from '../routes';
import { PROFILE_PATHS } from '../constants';
import { renderWithProfileReducers as render } from '../tests/unit-test-helpers';

// Shared config and initial Redux state used by all tests
const config = {};
const initialState = {
  vaProfile: {
    hero: {
      userFullName: { first: 'Test', last: 'User' },
    },
  },
};

// Small helper to render the wrapper at a given path with auth/MVI flags
const renderAt = (path, props = {}) => {
  const ui = (
    <MemoryRouter initialEntries={[path]}>
      <ProfileWrapper routes={getRoutes(config)} {...props} />
    </MemoryRouter>
  );
  return render(ui, { initialState });
};

describe('ProfileWrapper - VA Profile ID Initialization (integration)', () => {
  describe('Rendering behavior by auth/MVI state', () => {
    it('renders for LOA3 users in MVI', () => {
      const { container } = renderAt(PROFILE_PATHS.NOTIFICATION_SETTINGS, {
        isLOA3: true,
        isInMVI: true,
      });
      expect(container).to.exist;
    });

    it('renders for LOA1 users (not LOA3) without errors', () => {
      const { container } = renderAt(PROFILE_PATHS.NOTIFICATION_SETTINGS, {
        isInMVI: true,
      });
      expect(container).to.exist;
    });

    it('renders for users not in MVI without errors', () => {
      const { container } = renderAt(PROFILE_PATHS.NOTIFICATION_SETTINGS, {
        isLOA3: true,
        isInMVI: false,
      });
      expect(container).to.exist;
    });
  });

  describe('Regression: pages render without errors', () => {
    it('Notification Settings renders for LOA3 users in MVI', () => {
      const { container } = renderAt(PROFILE_PATHS.NOTIFICATION_SETTINGS, {
        isLOA3: true,
        isInMVI: true,
      });
      expect(container).to.exist;
    });

    it('Military Information renders for LOA3 users in MVI', () => {
      const { container } = renderAt(PROFILE_PATHS.MILITARY_INFORMATION, {
        isLOA3: true,
        isInMVI: true,
      });
      expect(container).to.exist;
    });
  });
});
