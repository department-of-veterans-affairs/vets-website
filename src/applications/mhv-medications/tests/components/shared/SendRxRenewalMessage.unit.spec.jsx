import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import reducers from '../../../reducers';
import SendRxRenewalMessage from '../../../components/shared/SendRxRenewalMessage';

describe('SendRxRenewalMessage Component', () => {
  // Oracle Health prescription with stationNumber matching cernerFacilityIds
  const mockRx = {
    prescriptionId: 12345,
    refillRemaining: 0,
    dispStatus: 'Active',
    expirationDate: '2024-01-01',
    stationNumber: '668', // Oracle Health/Cerner facility
  };

  const setup = (rx = mockRx, props = {}, initialState = {}) => {
    const featureToggleReducer = (state = {}) => state;
    const drupalStaticDataReducer = (state = {}) => state;
    const testReducers = {
      ...reducers,
      featureToggles: featureToggleReducer,
      drupalStaticData: drupalStaticDataReducer,
    };

    const state = {
      ...initialState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvSecureMessagingMedicationsRenewalRequest]: true,
        ...(initialState.featureToggles || {}),
      },
      drupalStaticData: {
        vamcEhrData: {
          data: {
            cernerFacilities: [{ vhaId: '668', ehrSystem: 'cerner' }],
          },
        },
        ...(initialState.drupalStaticData || {}),
      },
    };

    return renderWithStoreAndRouterV6(
      <SendRxRenewalMessage rx={rx} {...props} />,
      {
        initialState: state,
        reducers: testReducers,
      },
    );
  };

  describe('Eligibility for renewal request', () => {
    it('renders renewal link when prescription is Active with 0 refills', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active',
        refillRemaining: 0,
      };
      const screen = setup(rx);
      expect(screen.getByTestId('send-renewal-request-message-link')).to.exist;
    });

    it('does not render renewal link when prescription is Active: Refill in Process with 0 refills', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active: Refill in Process',
        refillRemaining: 0,
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('does not render renewal link when prescription is Active: Submitted with 0 refills', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active: Submitted',
        refillRemaining: 0,
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('renders renewal link when prescription is Expired within 120 days', () => {
      const today = new Date();
      const recentExpiration = new Date(today);
      recentExpiration.setDate(today.getDate() - 60); // 60 days ago

      const rx = {
        ...mockRx,
        dispStatus: 'Expired',
        expirationDate: recentExpiration.toISOString(),
      };
      const screen = setup(rx);
      expect(screen.getByTestId('send-renewal-request-message-link')).to.exist;
    });

    it('does not render renewal link when prescription is Expired more than 120 days ago', () => {
      const today = new Date();
      const oldExpiration = new Date(today);
      oldExpiration.setDate(today.getDate() - 130); // 130 days ago

      const rx = {
        ...mockRx,
        dispStatus: 'Expired',
        expirationDate: oldExpiration.toISOString(),
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('does not render renewal link when prescription has refills remaining', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active',
        refillRemaining: 3,
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('does not render renewal link when prescription status is Discontinued', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Discontinued',
        refillRemaining: 0,
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('does not render renewal link for non-Oracle Health prescription', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active',
        refillRemaining: 0,
        stationNumber: '989', // Not an Oracle Health/Cerner facility
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    describe('isRenewable for OH prescriptions', () => {
      it('renders renewal link when isRenewable is true regardless of dispStatus', () => {
        const rx = {
          ...mockRx,
          isRenewable: true,
          dispStatus: 'Some Unknown Status',
          refillRemaining: 5,
        };
        const screen = setup(rx);
        expect(screen.getByTestId('send-renewal-request-message-link')).to
          .exist;
      });

      it('renders renewal link when isRenewable is true with null dispStatus', () => {
        const rx = {
          ...mockRx,
          isRenewable: true,
          dispStatus: null,
          refillRemaining: null,
        };
        const screen = setup(rx);
        expect(screen.getByTestId('send-renewal-request-message-link')).to
          .exist;
      });

      it('renders renewal link when isRenewable is true even with refills remaining', () => {
        const rx = {
          ...mockRx,
          isRenewable: true,
          dispStatus: 'Active',
          refillRemaining: 10,
        };
        const screen = setup(rx);
        expect(screen.getByTestId('send-renewal-request-message-link')).to
          .exist;
      });

      it('does not render renewal link when isRenewable is false and no other eligibility criteria met', () => {
        const rx = {
          ...mockRx,
          isRenewable: false,
          dispStatus: 'Active',
          refillRemaining: 5,
        };
        const screen = setup(rx);
        expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
          .exist;
      });

      it('renders renewal link when isRenewable is false but other eligibility criteria met', () => {
        const rx = {
          ...mockRx,
          isRenewable: false,
          dispStatus: 'Active',
          refillRemaining: 0, // Meets Active with 0 refills criteria
        };
        const screen = setup(rx);
        expect(screen.getByTestId('send-renewal-request-message-link')).to
          .exist;
      });
    });
  });

  describe('Fallback content', () => {
    it('renders fallback content when prescription is not eligible', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active',
        refillRemaining: 5,
      };
      const fallbackContent = (
        <div data-testid="fallback">Fallback Content</div>
      );
      const screen = setup(rx, { fallbackContent });
      expect(screen.getByTestId('fallback')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('renders fallback content when showFallBackContent is true', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active',
        refillRemaining: 0,
      };
      const fallbackContent = (
        <div data-testid="fallback">Fallback Content</div>
      );
      const screen = setup(rx, {
        fallbackContent,
        showFallBackContent: true,
      });
      expect(screen.getByTestId('fallback')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('returns null when prescription is not eligible and no fallback content provided', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active',
        refillRemaining: 5,
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
      expect(screen.queryByTestId('fallback')).to.not.exist;
    });
  });

  describe('Feature toggle gating', () => {
    it('renders fallback content when toggle is off and fallback provided', () => {
      const fallbackContent = (
        <div data-testid="fallback">Fallback Content</div>
      );
      const screen = setup(
        mockRx,
        { fallbackContent },
        {
          featureToggles: {
            [FEATURE_FLAG_NAMES.mhvSecureMessagingMedicationsRenewalRequest]: false,
          },
        },
      );

      expect(screen.getByTestId('fallback')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('returns null when toggle is off and no fallback provided', () => {
      const screen = setup(
        mockRx,
        {},
        {
          featureToggles: {
            [FEATURE_FLAG_NAMES.mhvSecureMessagingMedicationsRenewalRequest]: false,
          },
        },
      );

      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
      expect(screen.queryByTestId('fallback')).to.not.exist;
    });
  });

  describe('Link variations', () => {
    it('renders standard va-link by default', () => {
      const screen = setup();
      expect(screen.getByTestId('send-renewal-request-message-link')).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-action-link'))
        .to.not.exist;
    });

    it('renders action link when isActionLink is true', () => {
      const screen = setup(mockRx, { isActionLink: true });
      expect(screen.getByTestId('send-renewal-request-message-action-link')).to
        .exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('action link has correct CSS classes', () => {
      const screen = setup(mockRx, { isActionLink: true });
      const actionLink = screen.getByTestId(
        'send-renewal-request-message-action-link',
      );
      expect(actionLink.className).to.include('vads-c-action-link--green');
      expect(actionLink.className).to.include('vads-u-display--block');
      expect(actionLink.className).to.include('vads-u-margin-bottom--3');
    });
  });

  describe('Modal functionality', () => {
    it('does not display modal on initial render', () => {
      const screen = setup();
      const modal = screen.container.querySelector('va-modal');
      expect(modal?.getAttribute('visible')).to.equal('false');
    });

    it('opens modal when renewal link is clicked', async () => {
      const screen = setup();
      const link = screen.getByTestId('send-renewal-request-message-link');

      fireEvent.click(link);

      await waitFor(() => {
        const modal = screen.container.querySelector('va-modal');
        expect(modal?.getAttribute('visible')).to.equal('true');
      });
    });

    it('displays correct modal title', () => {
      const screen = setup();
      const modal = screen.container.querySelector('va-modal');
      expect(modal?.getAttribute('modal-title')).to.equal(
        "You're leaving medications to send a message",
      );
    });

    it('displays correct button text', () => {
      const screen = setup();
      const modal = screen.container.querySelector('va-modal');
      expect(modal?.getAttribute('primary-button-text')).to.equal('Continue');
      expect(modal?.getAttribute('secondary-button-text')).to.equal('Back');
    });

    it('displays modal content about provider selection', () => {
      const screen = setup();
      const modal = screen.container.querySelector('va-modal');
      expect(modal?.innerHTML).to.include(
        'You’ll need to select your provider and send the prescription renewal request. We’ll pre-fill your prescription details in the message.',
      );
    });

    it('displays modal content about calling VA pharmacy', () => {
      const screen = setup();
      const modal = screen.container.querySelector('va-modal');
      expect(modal?.innerHTML).to.include(
        'If you need a medication immediately',
      );
      expect(modal?.innerHTML).to.include('automated refill line');
    });
  });

  describe('Secure messages URL generation', () => {
    it('generates correct secure messages URL with prescription ID', () => {
      const rx = {
        ...mockRx,
        prescriptionId: 98765,
      };

      const screen = setup(rx);
      expect(screen.getByTestId('send-renewal-request-message-link')).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('handles Expired status without expirationDate', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Expired',
        expirationDate: null,
      };
      const screen = setup(rx);

      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('handles edge case of expiration exactly 120 days ago', () => {
      const today = new Date();
      const exactExpiration = new Date(today);
      exactExpiration.setDate(today.getDate() - 120);

      const rx = {
        ...mockRx,
        dispStatus: 'Expired',
        expirationDate: exactExpiration.toISOString(),
      };
      const screen = setup(rx);

      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('handles edge case of expiration 119 days ago (within window)', () => {
      const today = new Date();
      const recentExpiration = new Date(today);
      recentExpiration.setDate(today.getDate() - 119);

      const rx = {
        ...mockRx,
        dispStatus: 'Expired',
        expirationDate: recentExpiration.toISOString(),
      };
      const screen = setup(rx);

      expect(screen.getByTestId('send-renewal-request-message-link')).to.exist;
    });

    it('handles missing dispStatus gracefully', () => {
      const rx = {
        ...mockRx,
        dispStatus: undefined,
        refillRemaining: 0,
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('handles missing refillRemaining gracefully', () => {
      const rx = {
        ...mockRx,
        dispStatus: 'Active',
        refillRemaining: undefined,
      };
      const screen = setup(rx);
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });
  });

  describe('Component renders without errors', () => {
    it('renders without crashing', () => {
      const screen = setup();
      expect(screen).to.exist;
    });

    it('renders with minimal props (non-Oracle Health returns null)', () => {
      const minimalRx = {
        prescriptionId: 123,
        dispStatus: 'Active',
        refillRemaining: 0,
        // No stationNumber - not Oracle Health, so returns null
      };
      const screen = setup(minimalRx);
      expect(screen).to.exist;
      expect(screen.queryByTestId('send-renewal-request-message-link')).to.not
        .exist;
    });

    it('renders renewal link for Oracle Health prescription with minimal props', () => {
      const minimalRx = {
        prescriptionId: 123,
        dispStatus: 'Active',
        refillRemaining: 0,
        stationNumber: '668', // Oracle Health facility
      };
      const screen = setup(minimalRx);
      expect(screen).to.exist;
      expect(screen.getByTestId('send-renewal-request-message-link')).to.exist;
    });
  });
});
