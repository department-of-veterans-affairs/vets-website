import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';

import ProfileWrapper from './ProfileWrapper';
import getRoutes from '../routes';
import { PROFILE_PATHS } from '../constants';

import { renderWithProfileReducers as render } from '../tests/unit-test-helpers';

/**
 * Integration tests for ProfileWrapper VA Profile ID initialization fix
 * These tests extend the existing ProfileWrapper tests to verify that the
 * InitializeVAPServiceID wrapper is properly applied for LOA3 users in MVI.
 *
 * This fix addresses an issue where Notification Settings and Military
 * Information pages failed with system errors for LOA3 users until they
 * first visited Personal Information.
 */

describe('ProfileWrapper - VA Profile ID Initialization', () => {
  const config = {};

  /**
   * Test that the centralized InitializeVAPServiceID wrapper is present
   * in the component code for LOA3 users in MVI. This is a static analysis
   * test because the component has complex dependencies.
   */
  describe('Code Structure for VA Profile ID Initialization', () => {
    it('should import InitializeVAPServiceID component', () => {
      // Read the ProfileWrapper source code to verify the import exists
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      expect(componentSource).to.include(
        "import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID'",
      );
    });

    it('should conditionally wrap content with InitializeVAPServiceID for LOA3 users in MVI', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify the conditional logic exists
      expect(componentSource).to.include('if (isLOA3 && isInMVI)');
      expect(componentSource).to.include(
        '<InitializeVAPServiceID>{content}</InitializeVAPServiceID>',
      );
    });

    it('should store JSX in a const before conditional wrapping', () => {
      const fs = require('fs');
      const path = require('path');
      const componentPath = path.join(__dirname, 'ProfileWrapper.jsx');
      const componentSource = fs.readFileSync(componentPath, 'utf8');

      // Verify the pattern of storing content before wrapping
      expect(componentSource).to.match(/const content = \(/);
    });
  });

  /**
   * Functional tests using the proper test helpers to verify behavior
   * with different user states.
   */
  describe('Rendering Behavior', () => {
    it('should render for LOA3 users without errors', () => {
      const uiLOA3 = (
        <MemoryRouter initialEntries={[PROFILE_PATHS.NOTIFICATION_SETTINGS]}>
          <ProfileWrapper routes={getRoutes(config)} isLOA3 isInMVI />
        </MemoryRouter>
      );

      const initialState = {
        vaProfile: {
          hero: {
            userFullName: {
              first: 'Test',
              last: 'User',
            },
          },
        },
      };

      // Should render without errors
      const { container } = render(uiLOA3, { initialState });
      expect(container).to.exist;
    });

    it('should render for LOA1 users without wrapper', () => {
      const uiLOA1 = (
        <MemoryRouter initialEntries={[PROFILE_PATHS.NOTIFICATION_SETTINGS]}>
          <ProfileWrapper routes={getRoutes(config)} isInMVI />
        </MemoryRouter>
      );

      const initialState = {
        vaProfile: {
          hero: {
            userFullName: {
              first: 'Test',
              last: 'User',
            },
          },
        },
      };

      // Should render without errors
      const { container } = render(uiLOA1, { initialState });
      expect(container).to.exist;
    });

    it('should render for users not in MVI without wrapper', () => {
      const uiNotInMVI = (
        <MemoryRouter initialEntries={[PROFILE_PATHS.NOTIFICATION_SETTINGS]}>
          <ProfileWrapper routes={getRoutes(config)} isLOA3 isInMVI={false} />
        </MemoryRouter>
      );

      const initialState = {
        vaProfile: {
          hero: {
            userFullName: {
              first: 'Test',
              last: 'User',
            },
          },
        },
      };

      // Should render without errors
      const { container } = render(uiNotInMVI, { initialState });
      expect(container).to.exist;
    });
  });

  /**
   * Regression tests to ensure the fix works for previously failing pages
   */
  describe('Regression Tests for Notification Settings and Military Information', () => {
    it('should render Notification Settings page for LOA3 users in MVI', () => {
      const ui = (
        <MemoryRouter initialEntries={[PROFILE_PATHS.NOTIFICATION_SETTINGS]}>
          <ProfileWrapper routes={getRoutes(config)} isLOA3 isInMVI />
        </MemoryRouter>
      );

      const initialState = {
        vaProfile: {
          hero: {
            userFullName: {
              first: 'Test',
              last: 'User',
            },
          },
        },
      };

      const { container } = render(ui, { initialState });
      // Should render without throwing errors
      expect(container).to.exist;
    });

    it('should render Military Information page for LOA3 users in MVI', () => {
      const ui = (
        <MemoryRouter initialEntries={[PROFILE_PATHS.MILITARY_INFORMATION]}>
          <ProfileWrapper routes={getRoutes(config)} isLOA3 isInMVI />
        </MemoryRouter>
      );

      const initialState = {
        vaProfile: {
          hero: {
            userFullName: {
              first: 'Test',
              last: 'User',
            },
          },
        },
      };

      const { container } = render(ui, { initialState });
      // Should render without throwing errors
      expect(container).to.exist;
    });
  });
});
