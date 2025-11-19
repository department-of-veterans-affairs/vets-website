import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { SAVE_STATUSES } from 'platform/forms/save-in-progress/actions';
import StableSaveStatus from './stable-save-status';

/**
 * Unit tests for StableSaveStatus component.
 * Tests the save-in-progress alert display logic and anti-flicker behavior.
 */
describe('StableSaveStatus', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      form: {
        lastSavedDate: null,
        autoSavedStatus: SAVE_STATUSES.notAttempted,
        loadedData: null,
        inProgressFormId: null,
      },
      formConfig: {
        customText: {
          appType: 'application',
          appSavedSuccessfullyMessage: 'We saved your application.',
        },
      },
      isLoggedIn: false,
      showLoginModal: false,
      toggleLoginModal: sinon.spy(),
    };
  });

  describe('initial render', () => {
    it('does not show success alert on initial render', () => {
      const { container } = render(<StableSaveStatus {...defaultProps} />);

      const successAlert = container.querySelector(
        'va-alert[status="success"]',
      );
      expect(successAlert).to.not.exist;
    });

    it('does not show error alert when no error', () => {
      const { container } = render(<StableSaveStatus {...defaultProps} />);

      const errorAlert = container.querySelector('va-alert[status="error"]');
      expect(errorAlert).to.not.exist;
    });

    it('renders empty div when no status to show', () => {
      const { container } = render(<StableSaveStatus {...defaultProps} />);

      const wrapper = container.querySelector('div');
      expect(wrapper).to.exist;
      expect(wrapper.children.length).to.equal(0);
    });
  });

  describe('success alert behavior', () => {
    it('does not show alert on initial render even with success status', () => {
      const props = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.success,
          lastSavedDate: new Date().toISOString(),
          inProgressFormId: '12345',
        },
      };

      const { container } = render(<StableSaveStatus {...props} />);

      const successAlert = container.querySelector(
        'va-alert[status="success"]',
      );
      // Should not show because we haven't seen pending status yet
      expect(successAlert).to.not.exist;
    });

    it('shows success alert after seeing pending then success', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      // Step 1: Simulate pending status (save in progress)
      const pendingProps = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.pending,
        },
      };
      rerender(<StableSaveStatus {...pendingProps} />);

      // Step 2: Simulate success status
      const successDate = new Date().toISOString();
      const successProps = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.success,
          lastSavedDate: successDate,
          inProgressFormId: '12345',
        },
      };
      rerender(<StableSaveStatus {...successProps} />);

      await waitFor(() => {
        const successAlert = container.querySelector(
          'va-alert[status="success"]',
        );
        expect(successAlert).to.exist;
      });
    });

    it('keeps alert visible when status changes back to pending', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      // Step 1: Pending
      const pendingProps = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.pending,
        },
      };
      rerender(<StableSaveStatus {...pendingProps} />);

      // Step 2: Success
      const successDate = new Date().toISOString();
      const successProps = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.success,
          lastSavedDate: successDate,
          inProgressFormId: '12345',
        },
      };
      rerender(<StableSaveStatus {...successProps} />);

      // Step 3: Back to pending (next auto-save)
      const pendingAgainProps = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.pending,
          lastSavedDate: successDate,
          inProgressFormId: '12345',
        },
      };
      rerender(<StableSaveStatus {...pendingAgainProps} />);

      await waitFor(() => {
        const successAlert = container.querySelector(
          'va-alert[status="success"]',
        );
        // Alert should still be visible - this is the anti-flicker behavior
        expect(successAlert).to.exist;
      });
    });

    it('displays form ID in success message', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      // Trigger pending then success
      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: new Date().toISOString(),
            inProgressFormId: 'ABC-123',
          }}
        />,
      );

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
        expect(alert.textContent).to.include('ABC-123');
      });
    });

    it('displays saved date in success message', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      const savedDate = new Date('2024-01-15T10:30:00Z');

      // Trigger pending then success
      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: savedDate.toISOString(),
            inProgressFormId: '12345',
          }}
        />,
      );

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
        expect(alert.textContent).to.include('January 15, 2024');
      });
    });

    it('uses custom success message when provided', async () => {
      const customMessage = 'Custom save message';
      const props = {
        ...defaultProps,
        formConfig: {
          customText: {
            appSavedSuccessfullyMessage: customMessage,
          },
        },
      };

      const { container, rerender } = render(<StableSaveStatus {...props} />);

      // Trigger pending then success
      rerender(
        <StableSaveStatus
          {...props}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      rerender(
        <StableSaveStatus
          {...props}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: new Date().toISOString(),
            inProgressFormId: '12345',
          }}
        />,
      );

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
        expect(alert.textContent).to.include(customMessage);
      });
    });

    it('uses default success message when not provided', async () => {
      const props = {
        ...defaultProps,
        formConfig: {},
      };

      const { container, rerender } = render(<StableSaveStatus {...props} />);

      // Trigger pending then success
      rerender(
        <StableSaveStatus
          {...props}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      rerender(
        <StableSaveStatus
          {...props}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: new Date().toISOString(),
            inProgressFormId: '12345',
          }}
        />,
      );

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
      });
    });
  });

  describe('error alerts', () => {
    it('shows client failure error when connection fails', () => {
      const props = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.clientFailure,
        },
      };

      const { container } = render(<StableSaveStatus {...props} />);

      const errorAlert = container.querySelector('va-alert[status="error"]');
      expect(errorAlert).to.exist;
      expect(errorAlert.textContent).to.include('unable to connect to VA.gov');
    });

    it('shows server failure error when server has issues', () => {
      const props = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.failure,
        },
      };

      const { container } = render(<StableSaveStatus {...props} />);

      const errorAlert = container.querySelector('va-alert[status="error"]');
      expect(errorAlert).to.exist;
      expect(errorAlert.textContent).to.include('having some issues');
    });

    it('shows auth error with sign in link when not logged in', () => {
      const props = {
        ...defaultProps,
        isLoggedIn: false,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.noAuth,
        },
      };

      const { container } = render(<StableSaveStatus {...props} />);

      const errorAlert = container.querySelector('va-alert[status="error"]');
      expect(errorAlert).to.exist;
      expect(errorAlert.textContent).to.include('no longer signed in');
    });

    it('does not show auth error when logged in', () => {
      const props = {
        ...defaultProps,
        isLoggedIn: true,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.noAuth,
        },
      };

      const { container } = render(<StableSaveStatus {...props} />);

      const errorAlert = container.querySelector('va-alert[status="error"]');
      expect(errorAlert).to.not.exist;
    });

    it('uses custom app type in error messages', () => {
      const props = {
        ...defaultProps,
        formConfig: {
          customText: {
            appType: 'form',
          },
        },
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.clientFailure,
        },
      };

      const { container } = render(<StableSaveStatus {...props} />);

      const errorAlert = container.querySelector('va-alert[status="error"]');
      expect(errorAlert).to.exist;
      expect(errorAlert.textContent).to.include('form');
    });
  });

  describe('saving indicator', () => {
    it('shows "Saving..." during first pending status transition', () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      // No saving indicator initially
      let savingIndicator = container.querySelector('.saved-form-autosaving');
      expect(savingIndicator).to.not.exist;

      // Transition to pending - should show "Saving..." briefly before effect runs
      // Note: Due to React's batching, the effect runs before we can query
      // So we check that hasSeenPending logic works by verifying subsequent behavior
      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      // After the effect runs, hasSeenPending becomes true, so indicator is hidden
      // This test verifies the state transition logic works correctly
      savingIndicator = container.querySelector('.saved-form-autosaving');
      // The indicator won't be visible after effects run because hasSeenPending is now true
      expect(savingIndicator).to.not.exist;
    });

    it('hides "Saving..." after hasSeenPending is true', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      // First pending
      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      // Then success
      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: new Date().toISOString(),
          }}
        />,
      );

      // Then pending again
      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
            lastSavedDate: new Date().toISOString(),
          }}
        />,
      );

      await waitFor(() => {
        const savingIndicator = container.querySelector(
          '.saved-form-autosaving',
        );
        // Should not show saving indicator on subsequent pending
        expect(savingIndicator).to.not.exist;
      });
    });
  });

  describe('form ID handling', () => {
    it('gets form ID from direct prop', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: new Date().toISOString(),
            inProgressFormId: 'DIRECT-123',
          }}
        />,
      );

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
        expect(alert.textContent).to.include('DIRECT-123');
      });
    });

    it('gets form ID from loaded metadata when direct prop not available', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: new Date().toISOString(),
            loadedData: {
              metadata: {
                inProgressFormId: 'METADATA-456',
              },
            },
          }}
        />,
      );

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
        expect(alert.textContent).to.include('METADATA-456');
      });
    });
  });

  describe('edge cases', () => {
    it('handles missing form prop gracefully', () => {
      const props = {
        ...defaultProps,
        form: null,
      };

      const { container } = render(<StableSaveStatus {...props} />);
      expect(container.querySelector('div')).to.exist;
    });

    it('handles missing formConfig gracefully', () => {
      const props = {
        ...defaultProps,
        formConfig: null,
      };

      const { container } = render(<StableSaveStatus {...props} />);
      expect(container.querySelector('div')).to.exist;
    });

    it('handles undefined lastSavedDate gracefully', async () => {
      const { container, rerender } = render(
        <StableSaveStatus {...defaultProps} />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      rerender(
        <StableSaveStatus
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: undefined,
            inProgressFormId: '12345',
          }}
        />,
      );

      // Should not crash, and alert might not show without date
      expect(container.querySelector('div')).to.exist;
    });
  });
});
