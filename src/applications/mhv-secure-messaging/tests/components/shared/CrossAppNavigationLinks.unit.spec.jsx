import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { cleanup, waitFor } from '@testing-library/react';
import reducer from '../../../reducers';
import BlockedTriageGroupAlert from '../../../components/shared/BlockedTriageGroupAlert';
import StaleMessageAlert from '../../../components/shared/StaleMessageAlert';
import EditSignatureLink from '../../../components/ComposeForm/EditSignatureLink';
import {
  BlockedTriageAlertStyles,
  ParentComponent,
  RecipientStatus,
  Recipients,
  Paths,
} from '../../../util/constants';

/**
 * These tests verify that cross-app navigation links use vanilla VADS components
 * (VaLink, VaLinkAction) instead of router wrappers (RouterLink, RouterLinkAction).
 *
 * Cross-app destinations like /find-locations and /profile/* are different SPAs
 * and require full browser navigation, not React Router client-side navigation.
 */
describe('Cross-App Navigation Links', () => {
  afterEach(() => {
    cleanup();
  });

  describe('BlockedTriageGroupAlert - /find-locations link', () => {
    const initialState = {
      sm: {
        recipients: {
          associatedBlockedTriageGroupsQty: 1,
          blockedRecipients: [{ id: 222333 }],
          allRecipients: [{ id: 222333 }],
        },
      },
      drupalStaticData: {
        vamcEhrData: {
          data: {
            ehrDataByVhaId: {},
          },
        },
      },
    };

    it('renders /find-locations as VaLinkAction (not RouterLinkAction)', async () => {
      const screen = renderWithStoreAndRouter(
        <BlockedTriageGroupAlert
          alertStyle={BlockedTriageAlertStyles.ALERT}
          parentComponent={ParentComponent.COMPOSE_FORM}
          currentRecipient={{
            recipientId: 222333,
            name: 'Test Team',
            type: Recipients.CARE_TEAM,
            status: RecipientStatus.BLOCKED,
          }}
        />,
        {
          initialState,
          reducers: reducer,
        },
      );

      await waitFor(() => {
        const link = screen.container.querySelector(
          'va-link-action[href*="/find-locations"]',
        );
        expect(link).to.exist;
        expect(link.getAttribute('text')).to.equal(
          'Find your VA health facility',
        );
        // Verify it's a cross-app link - browser navigation expected
        expect(link.getAttribute('href')).to.include('/find-locations');
      });
    });
  });

  describe('StaleMessageAlert - mixed internal and cross-app links', () => {
    it('renders /find-locations as VaLinkAction for OH messages', () => {
      const screen = renderWithStoreAndRouter(
        <StaleMessageAlert visible isOhMessage />,
        {
          initialState: { sm: {} },
          reducers: reducer,
        },
      );

      // /find-locations should be VaLinkAction (cross-app)
      const findFacilityLink = screen.container.querySelector(
        'va-link[href="/find-locations"]',
      );
      expect(findFacilityLink).to.exist;
      expect(findFacilityLink.getAttribute('text')).to.equal(
        'Find your VA health facility',
      );
    });

    it('renders Paths.COMPOSE as RouterLinkAction (same SPA internal navigation)', () => {
      const screen = renderWithStoreAndRouter(
        <StaleMessageAlert visible isOhMessage={false} />,
        {
          initialState: { sm: {} },
          reducers: reducer,
          path: '/my-health/secure-messages',
        },
      );

      // Paths.COMPOSE is internal to SM app - should use RouterLinkAction
      const composeLink = screen.container.querySelector(
        `va-link-action[href="/my-health/secure-messages${Paths.COMPOSE}"]`,
      );
      expect(composeLink).to.exist;
      expect(composeLink.getAttribute('text')).to.equal('Start a new message');
    });
  });

  describe('EditSignatureLink - /profile cross-app link', () => {
    const initialState = {
      sm: {
        preferences: {
          signature: {
            includeSignature: true,
          },
        },
      },
      featureToggles: { loading: false },
    };

    it('renders /profile link as VaLink (not RouterLink)', () => {
      const screen = renderWithStoreAndRouter(<EditSignatureLink />, {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      });

      const link = screen.getByTestId('edit-signature-link');
      expect(link).to.exist;
      // Should be va-link (standard link, not action link)
      expect(link.tagName).to.equal('VA-LINK');
      // Cross-app destination
      expect(link.getAttribute('href')).to.equal(
        '/profile/personal-information#messaging-signature',
      );
      expect(link.getAttribute('text')).to.equal(
        'Edit signature for all messages',
      );
    });
  });
});
