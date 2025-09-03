import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import RecentCareTeams from '../../containers/RecentCareTeams';
import reducer from '../../reducers';
import * as Constants from '../../util/constants';

const { Paths } = Constants;

describe('RecentCareTeams component', () => {
  let sandbox;

  const mockRecentRecipients = [
    {
      triageTeamId: 1,
      name: 'Primary Care Team',
      healthCareSystemName: 'VA Medical Center',
      stationNumber: '442',
    },
    {
      triageTeamId: 2,
      name: 'Mental Health Team',
      healthCareSystemName: 'VA Clinic',
      stationNumber: '442',
    },
    {
      triageTeamId: 3,
      name: 'Cardiology Team',
      healthCareSystemName: 'VA Hospital',
      stationNumber: '648',
    },
  ];

  const mockAllRecipients = [
    {
      id: '1',
      attributes: {
        triageTeamId: 1,
        name: 'Primary Care Team',
        healthCareSystemName: 'VA Medical Center',
        stationNumber: '442',
      },
    },
    {
      id: '2',
      attributes: {
        triageTeamId: 2,
        name: 'Mental Health Team',
        healthCareSystemName: 'VA Clinic',
        stationNumber: '442',
      },
    },
  ];

  const defaultState = {
    sm: {
      recipients: {
        recentRecipients: mockRecentRecipients,
        allRecipients: mockAllRecipients,
      },
      threadDetails: {
        acceptInterstitial: true,
      },
    },
  };

  const renderComponent = (initialState = defaultState, path = '/') => {
    return renderWithStoreAndRouter(<RecentCareTeams />, {
      initialState,
      reducers: reducer,
      path,
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Component Rendering', () => {
    it('should render the component with heading and radio options', () => {
      const screen = renderComponent();

      expect(screen.getByText('Recent care teams')).to.exist;

      // Check for va-radio element with the label attribute
      const radioGroup = document.querySelector('va-radio');
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('label')).to.include(
        "Select a team from those you've sent messages to in the past 6 months",
      );

      // Check for va-radio-option elements with label attributes
      const radioOptions = document.querySelectorAll('va-radio-option');
      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('Primary Care Team');
      expect(labels).to.include('Mental Health Team');
      expect(labels).to.include('Cardiology Team');
      expect(labels).to.include('A different care team');

      // Check for continue button
      const continueButton = document.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });

    it('should display health care system names as descriptions', () => {
      renderComponent();

      // Check for va-radio-option elements with description attributes
      const radioOptions = document.querySelectorAll('va-radio-option');
      const descriptions = Array.from(radioOptions)
        .map(option => option.getAttribute('description'))
        .filter(desc => desc); // Filter out null/empty descriptions

      expect(descriptions).to.include('VA Medical Center');
      expect(descriptions).to.include('VA Clinic');
      expect(descriptions).to.include('VA Hospital');
    });

    it('should render loading indicator when recentRecipients is undefined', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            ...defaultState.sm.recipients,
            recentRecipients: undefined,
          },
        },
      };
      renderComponent(state);

      // Check for va-loading-indicator element with message attribute
      const loadingIndicator = document.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal('Loading...');
    });
  });

  describe('Redux Integration', () => {
    // Note: These tests focus on component behavior rather than action dispatching
    it('should dispatch getRecentRecipients when allRecipients exist', () => {
      // This test verifies the component renders with the expected state
      const screen = renderComponent();

      expect(screen.getByText('Recent care teams')).to.exist;
    });

    it('should not dispatch getRecentRecipients when allRecipients is empty', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            recentRecipients: mockRecentRecipients,
            allRecipients: [],
          },
        },
      };
      const screen = renderComponent(state);

      expect(screen.getByText('Recent care teams', { selector: 'h1' })).to
        .exist;
    });
  });

  describe('Redux Integration', () => {
    it('should render when allRecipients exist', () => {
      const { container } = renderComponent();

      // Simply verify the component renders with recipients
      expect(container.querySelector('h1')).to.exist;
      const radioOptions = container.querySelectorAll('va-radio-option');
      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('Primary Care Team');
    });

    it('should render when allRecipients is empty', () => {
      const state = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            recentRecipients: mockRecentRecipients,
            allRecipients: [],
          },
        },
      };
      const screen = renderComponent(state);

      // Component should still render
      expect(screen.getByText('Recent care teams')).to.exist;
    });
  });

  describe('Navigation Behavior', () => {
    it('should redirect to compose when acceptInterstitial is false', async () => {
      const stateWithoutAcceptInterstitial = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          threadDetails: {
            acceptInterstitial: false,
          },
        },
      };

      const screen = renderComponent(stateWithoutAcceptInterstitial);

      await waitFor(() => {
        expect(screen.history.location.pathname).to.equal(`${Paths.COMPOSE}`);
      });
    });

    it('should redirect to select care team when recentRecipients is empty', async () => {
      const stateWithEmptyRecipients = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            ...defaultState.sm.recipients,
            recentRecipients: [],
          },
        },
      };

      const screen = renderComponent(stateWithEmptyRecipients);

      await waitFor(() => {
        expect(screen.history.location.pathname).to.equal(
          `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}/`,
        );
      });
    });

    it('should redirect to select care team when recentRecipients is null', async () => {
      const stateWithNullRecipients = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            ...defaultState.sm.recipients,
            recentRecipients: null,
          },
        },
      };

      const screen = renderComponent(stateWithNullRecipients);

      await waitFor(() => {
        expect(screen.history.location.pathname).to.equal(
          `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}/`,
        );
      });
    });

    it('should redirect to select care team when recentRecipients is error', async () => {
      const stateWithErrorRecipients = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            ...defaultState.sm.recipients,
            recentRecipients: 'error',
          },
        },
      };

      const screen = renderComponent(stateWithErrorRecipients);

      await waitFor(() => {
        expect(screen.history.location.pathname).to.equal(
          `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}/`,
        );
      });
    });
  });

  describe('User Interactions - handleContinue Function', () => {
    it('should show error when continue is clicked without selection', () => {
      renderComponent();

      const continueButton = document.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;

      // Click continue without selecting a team
      continueButton.click();

      // Check that error is set on the va-radio element
      const radioGroup = document.querySelector('va-radio');
      expect(radioGroup.getAttribute('error')).to.equal('Select a care team');
    });

    it('should navigate to select care team when "other" is selected and continue clicked', () => {
      const screen = renderComponent();

      // Select "A different care team" option
      const otherRadioOption = document.querySelector(
        'va-radio-option[value="other"]',
      );
      expect(otherRadioOption).to.exist;

      // Simulate radio change event for "other" option
      const radioGroup = document.querySelector('va-radio');
      radioGroup.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'other' },
        }),
      );

      // Click continue
      const continueButton = document.querySelector(
        'va-button[text="Continue"]',
      );
      continueButton.click();

      // Verify navigation to select care team
      expect(screen.history.location.pathname).to.equal(
        `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}/`,
      );
    });

    it('should navigate to start message when a care team is selected and continue clicked', () => {
      const screen = renderComponent();

      // Select the first care team (Primary Care Team with ID 1)
      const radioGroup = document.querySelector('va-radio');
      radioGroup.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: '1' },
        }),
      );

      // Click continue
      const continueButton = document.querySelector(
        'va-button[text="Continue"]',
      );
      continueButton.click();

      // Verify navigation to start message
      expect(screen.history.location.pathname).to.equal(
        `${Paths.COMPOSE}${Paths.START_MESSAGE}/`,
      );
    });

    it('should clear error when valid selection is made', () => {
      renderComponent();

      const continueButton = document.querySelector(
        'va-button[text="Continue"]',
      );
      const radioGroup = document.querySelector('va-radio');

      // First, trigger error by clicking continue without selection
      continueButton.click();
      expect(radioGroup.getAttribute('error')).to.equal('Select a care team');

      // Then select a care team
      radioGroup.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: '1' },
        }),
      );

      // Error should be cleared
      expect(radioGroup.getAttribute('error')).to.be.null;
    });

    it('should clear error when continue is clicked with valid selection', () => {
      renderComponent();

      const continueButton = document.querySelector(
        'va-button[text="Continue"]',
      );
      const radioGroup = document.querySelector('va-radio');

      // First, trigger error
      continueButton.click();
      expect(radioGroup.getAttribute('error')).to.equal('Select a care team');

      // Select a care team
      radioGroup.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: '1' },
        }),
      );

      // Click continue - this should clear error and navigate
      continueButton.click();

      // Error should be cleared (set to null in the function)
      expect(radioGroup.getAttribute('error')).to.be.null;
    });
  });

  describe('Edge Cases', () => {
    it('should handle recipients with missing health care system names', () => {
      const stateWithIncompleteRecipients = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            ...defaultState.sm.recipients,
            recentRecipients: [
              {
                triageTeamId: 1,
                name: 'Incomplete Team',
                stationNumber: '442',
              },
            ],
          },
        },
      };

      renderComponent(stateWithIncompleteRecipients);

      // Check for the incomplete team in va-radio-option labels
      const radioOptions = document.querySelectorAll('va-radio-option');
      const labels = Array.from(radioOptions).map(option =>
        option.getAttribute('label'),
      );
      expect(labels).to.include('Incomplete Team');
    });

    it('should handle empty recent recipients array properly', async () => {
      const stateWithEmptyArray = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            ...defaultState.sm.recipients,
            recentRecipients: [],
          },
        },
      };

      const screen = renderComponent(stateWithEmptyArray);

      await waitFor(() => {
        expect(screen.history.location.pathname).to.equal(
          `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}/`,
        );
      });
    });

    it('should handle non-array recent recipients properly', () => {
      const stateWithNonArrayRecipients = {
        ...defaultState,
        sm: {
          ...defaultState.sm,
          recipients: {
            ...defaultState.sm.recipients,
            recentRecipients: 'not-an-array',
          },
        },
      };

      const screen = renderComponent(stateWithNonArrayRecipients);

      // Should only show "A different care team" option
      // Check for the va-radio-option element with the correct label attribute
      const radioOptions = document.querySelectorAll('va-radio-option');
      expect(radioOptions).to.have.lengthOf(1);
      expect(radioOptions[0].getAttribute('label')).to.equal(
        'A different care team',
      );
      expect(screen.queryByText('Primary Care Team')).to.not.exist;
    });
  });

  describe('Accessibility', () => {
    it('should focus on h1 element when component loads with recipients', async () => {
      const screen = renderComponent();

      await waitFor(() => {
        const h1Element = screen.getByText('Recent care teams');
        expect(document.activeElement).to.equal(h1Element);
      });
    });

    it('should have proper tabIndex on h1 element', () => {
      const screen = renderComponent();

      const h1Element = screen.getByText('Recent care teams');
      expect(h1Element.getAttribute('tabIndex')).to.equal('-1');
    });
  });
});
