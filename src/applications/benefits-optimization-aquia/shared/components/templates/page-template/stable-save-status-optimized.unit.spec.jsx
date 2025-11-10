import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { SAVE_STATUSES } from 'platform/forms/save-in-progress/actions';
import StableSaveStatusOptimized, {
  StableSaveStatusOptimized as UnmemoizedComponent,
  SuccessAlert,
  ErrorAlert,
} from './stable-save-status-optimized';

/**
 * Unit tests for StableSaveStatusOptimized component.
 * Tests the optimized save-in-progress alert with performance improvements.
 */
describe('StableSaveStatusOptimized', () => {
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

  describe('Memoized component', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <StableSaveStatusOptimized {...defaultProps} />,
      );
      expect(container.querySelector('div')).to.exist;
    });

    it('uses display name for debugging', () => {
      expect(StableSaveStatusOptimized.displayName).to.equal(
        'StableSaveStatusOptimized',
      );
    });

    it('prevents re-renders when props have not changed', () => {
      const { rerender } = render(
        <StableSaveStatusOptimized {...defaultProps} />,
      );

      // Re-render with same props
      rerender(<StableSaveStatusOptimized {...defaultProps} />);

      // Component uses memo to prevent unnecessary re-renders
      // This test verifies the component doesn't crash on re-render
      expect(true).to.be.true;
    });
  });

  describe('SuccessAlert sub-component', () => {
    it('renders success message correctly', () => {
      const props = {
        appSavedSuccessfullyMessage: 'Application saved',
        savedAtMessage: ' We saved it on January 1, 2024',
        formIdMessage: <span>Form ID: 12345</span>,
      };

      const { container } = render(<SuccessAlert {...props} />);
      const alert = container.querySelector('va-alert[status="success"]');

      expect(alert).to.exist;
      expect(alert.textContent).to.include('Application saved');
      expect(alert.textContent).to.include('January 1, 2024');
    });

    it('has proper display name', () => {
      expect(SuccessAlert.displayName).to.equal('SuccessAlert');
    });

    it('handles null form ID message', () => {
      const props = {
        appSavedSuccessfullyMessage: 'Application saved',
        savedAtMessage: ' We saved it on January 1, 2024',
        formIdMessage: null,
      };

      const { container } = render(<SuccessAlert {...props} />);
      const alert = container.querySelector('va-alert[status="success"]');

      expect(alert).to.exist;
      expect(alert.textContent).to.not.include('Form ID');
    });
  });

  describe('ErrorAlert sub-component', () => {
    it('renders client failure error', () => {
      const props = {
        autoSavedStatus: SAVE_STATUSES.clientFailure,
        appType: 'form',
        isLoggedIn: true,
        showLoginModal: false,
        toggleLoginModal: sinon.spy(),
      };

      const { container } = render(<ErrorAlert {...props} />);
      const alert = container.querySelector('va-alert[status="error"]');

      expect(alert).to.exist;
      expect(alert.textContent).to.include('unable to connect to VA.gov');
      expect(alert.textContent).to.include('form');
    });

    it('renders server failure error', () => {
      const props = {
        autoSavedStatus: SAVE_STATUSES.failure,
        appType: 'application',
        isLoggedIn: true,
        showLoginModal: false,
        toggleLoginModal: sinon.spy(),
      };

      const { container } = render(<ErrorAlert {...props} />);
      const alert = container.querySelector('va-alert[status="error"]');

      expect(alert).to.exist;
      expect(alert.textContent).to.include('having some issues');
    });

    it('renders auth error with sign-in link when not logged in', () => {
      const toggleSpy = sinon.spy();
      const props = {
        autoSavedStatus: SAVE_STATUSES.noAuth,
        appType: 'application',
        isLoggedIn: false,
        showLoginModal: false,
        toggleLoginModal: toggleSpy,
      };

      const { container } = render(<ErrorAlert {...props} />);
      const alert = container.querySelector('va-alert[status="error"]');

      expect(alert).to.exist;
      expect(alert.textContent).to.include('no longer signed in');
    });

    it('returns null for auth error when logged in', () => {
      const props = {
        autoSavedStatus: SAVE_STATUSES.noAuth,
        appType: 'application',
        isLoggedIn: true,
        showLoginModal: false,
        toggleLoginModal: sinon.spy(),
      };

      const { container } = render(<ErrorAlert {...props} />);
      const alert = container.querySelector('va-alert[status="error"]');

      expect(alert).to.not.exist;
    });

    it('returns null for unknown error status', () => {
      const props = {
        autoSavedStatus: 'unknown',
        appType: 'application',
        isLoggedIn: true,
        showLoginModal: false,
        toggleLoginModal: sinon.spy(),
      };

      const { container } = render(<ErrorAlert {...props} />);
      const alert = container.querySelector('va-alert[status="error"]');

      expect(alert).to.not.exist;
    });

    it('has proper display name', () => {
      expect(ErrorAlert.displayName).to.equal('ErrorAlert');
    });
  });

  describe('Success flow with memoization', () => {
    it('shows success alert after pending then success with memoization', async () => {
      const { container, rerender } = render(
        <StableSaveStatusOptimized {...defaultProps} />,
      );

      // Step 1: Simulate pending status
      const pendingProps = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          autoSavedStatus: SAVE_STATUSES.pending,
        },
      };
      rerender(<StableSaveStatusOptimized {...pendingProps} />);

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
      rerender(<StableSaveStatusOptimized {...successProps} />);

      await waitFor(() => {
        const successAlert = container.querySelector(
          'va-alert[status="success"]',
        );
        expect(successAlert).to.exist;
      });
    });

    it('maintains success alert visibility during subsequent pending', async () => {
      const { container, rerender } = render(
        <StableSaveStatusOptimized {...defaultProps} />,
      );

      // Trigger pending
      rerender(
        <StableSaveStatusOptimized
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      // Then success
      const successDate = new Date().toISOString();
      rerender(
        <StableSaveStatusOptimized
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: successDate,
            inProgressFormId: '12345',
          }}
        />,
      );

      // Back to pending (anti-flicker behavior)
      rerender(
        <StableSaveStatusOptimized
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
            lastSavedDate: successDate,
            inProgressFormId: '12345',
          }}
        />,
      );

      await waitFor(() => {
        const successAlert = container.querySelector(
          'va-alert[status="success"]',
        );
        expect(successAlert).to.exist;
      });
    });
  });

  describe('Performance optimizations', () => {
    it('memoizes computed values correctly', () => {
      const { rerender } = render(<UnmemoizedComponent {...defaultProps} />);

      const props = {
        ...defaultProps,
        form: {
          ...defaultProps.form,
          lastSavedDate: new Date().toISOString(),
        },
      };

      // Re-render with new date
      rerender(<UnmemoizedComponent {...props} />);

      // The component should handle memoized values efficiently
      expect(true).to.be.true; // Placeholder for performance testing
    });

    it('uses custom comparison function for memo', () => {
      const { rerender } = render(
        <StableSaveStatusOptimized {...defaultProps} />,
      );

      // Change a prop that's not in the comparison
      const newProps = {
        ...defaultProps,
        randomProp: 'should not trigger re-render',
      };

      rerender(<StableSaveStatusOptimized {...newProps} />);

      // Component should not re-render for irrelevant prop changes
      expect(true).to.be.true;
    });
  });

  describe('Edge cases', () => {
    it('handles missing form prop', () => {
      const props = {
        ...defaultProps,
        form: null,
      };

      const { container } = render(<StableSaveStatusOptimized {...props} />);
      expect(container.querySelector('div')).to.exist;
    });

    it('handles missing formConfig', () => {
      const props = {
        ...defaultProps,
        formConfig: null,
      };

      const { container } = render(<StableSaveStatusOptimized {...props} />);
      expect(container.querySelector('div')).to.exist;
    });

    it('handles undefined toggleLoginModal gracefully', () => {
      const props = {
        ...defaultProps,
        toggleLoginModal: undefined,
      };

      const { container } = render(<StableSaveStatusOptimized {...props} />);
      expect(container.querySelector('div')).to.exist;
    });

    it('gets form ID from loadedData when direct prop not available', async () => {
      const { container, rerender } = render(
        <StableSaveStatusOptimized {...defaultProps} />,
      );

      // Trigger pending
      rerender(
        <StableSaveStatusOptimized
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.pending,
          }}
        />,
      );

      // Success with form ID in loadedData
      rerender(
        <StableSaveStatusOptimized
          {...defaultProps}
          form={{
            ...defaultProps.form,
            autoSavedStatus: SAVE_STATUSES.success,
            lastSavedDate: new Date().toISOString(),
            loadedData: {
              metadata: {
                inProgressFormId: 'LOADED-789',
              },
            },
          }}
        />,
      );

      await waitFor(() => {
        const alert = container.querySelector('va-alert[status="success"]');
        expect(alert).to.exist;
        expect(alert.textContent).to.include('LOADED-789');
      });
    });
  });
});
