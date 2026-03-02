import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { act, cleanup, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import oneBlockedRecipient from '../fixtures/json-triage-mocks/triage-teams-one-blocked-mock.json';
import oneBlockedFacility from '../fixtures/json-triage-mocks/triage-teams-facility-blocked-mock.json';
import noAssociationsAtAll from '../fixtures/json-triage-mocks/triage-teams-no-associations-at-all-mock.json';
import oneAssociatedFacility from '../fixtures/json-triage-mocks/triage-teams-one-facility-mock.json';
import drupalStaticData from '../fixtures/json-triage-mocks/drupal-data-mock.json';
import reducer from '../../reducers';
import EditContactList from '../../containers/EditContactList';
import { ErrorMessages, Paths } from '../../util/constants';
import { checkVaCheckbox, getProps } from '../../util/testUtils';

describe('Edit Contact List container', async () => {
  const initialVistaRecipients = noBlockedRecipients.mockAllRecipients.filter(
    r => r.ohTriageGroup === false,
  );
  const initialState = {
    drupalStaticData,
    sm: {
      recipients: {
        allowedRecipients: [...noBlockedRecipients.mockAllowedRecipients],
        blockedRecipients: [...noBlockedRecipients.mockBlockedRecipients],
        associatedTriageGroupsQty:
          noBlockedRecipients.associatedTriageGroupsQty,
        associatedBlockedTriageGroupsQty:
          noBlockedRecipients.associatedBlockedTriageGroupsQty,
        noAssociations: noBlockedRecipients.noAssociations,
        allTriageGroupsBlocked: noBlockedRecipients.allTriageGroupsBlocked,
        vistaFacilities: [...noBlockedRecipients.mockVistaFacilities],
        blockedFacilities: [...noBlockedRecipients.mockBlockedFacilities],
        allRecipients: [...noBlockedRecipients.mockAllRecipients],
        vistaRecipients: initialVistaRecipients,
      },
    },
  };

  const setup = (state = initialState, path = Paths.CONTACT_LIST) => {
    return renderWithStoreAndRouter(<EditContactList />, {
      initialState: state,
      reducers: reducer,
      path,
    });
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
    screen.unmount();
  });

  it('renders just one facility with all triage groups if only one facility is associated', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allowedRecipients: [...oneAssociatedFacility.mockAllowedRecipients],
          blockedRecipients: [...oneAssociatedFacility.mockBlockedRecipients],
          associatedTriageGroupsQty:
            oneAssociatedFacility.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            oneAssociatedFacility.associatedBlockedTriageGroupsQty,
          noAssociations: oneAssociatedFacility.noAssociations,
          allTriageGroupsBlocked: oneAssociatedFacility.allTriageGroupsBlocked,
          vistaFacilities: [...oneAssociatedFacility.mockVistaFacilities],
          blockedFacilities: [...oneAssociatedFacility.mockBlockedFacilities],
          allRecipients: [...oneAssociatedFacility.mockAllRecipients],
          vistaRecipients: [
            ...oneAssociatedFacility.mockAllRecipients.filter(
              r => !r.ohTriageGroup,
            ),
          ],
        },
      },
    };
    const screen = setup(customState);

    const facilityGroups = await screen.findAllByTestId(/-facility-group$/);
    expect(facilityGroups.length).to.equal(1);

    await waitFor(() => {
      const instructionParagraph = screen.getByText((_, el) => {
        const normalizedText = el.textContent.replace(/\s+/g, ' ').trim();
        return (
          el.tagName === 'P' &&
          normalizedText.includes(
            'Select and save the care teams you want to send messages to. You must select at least 1 care team.',
          ) &&
          normalizedText.includes(
            'Note: You can only edit care teams from some facilities.',
          )
        );
      });
      expect(instructionParagraph).to.exist;

      const selectAllTeams = screen.getAllByTestId(/select-all-/);
      expect(selectAllTeams[0]).to.have.attribute(
        'label',
        'Select all 6 teams',
      );
    });

    screen.unmount();
  });

  it('renders multiple groups if multiple facilities are connected', async () => {
    const screen = setup();

    const facilityGroups = await screen.findAllByTestId(/-facility-group$/);
    expect(facilityGroups.length).to.equal(2);

    await waitFor(() => {
      const instructionParagraph = screen.getByText((_, el) => {
        const normalizedText = el.textContent.replace(/\s+/g, ' ').trim();
        return (
          el.tagName === 'P' &&
          normalizedText.includes(
            'Select and save the care teams you want to send messages to. You must select at least 1 care team from 1 of your facilities.',
          ) &&
          normalizedText.includes(
            'Note: You can only edit care teams from some facilities.',
          )
        );
      });
      expect(instructionParagraph).to.exist;

      const selectAllTeams = screen.getAllByTestId(/select-all-/);
      expect(selectAllTeams[0]).to.have.attribute(
        'label',
        'Select all 4 teams',
      );
      expect(selectAllTeams[1]).to.have.attribute(
        'label',
        'Select all 2 teams',
      );

      const allTriageTeams = screen.getAllByTestId(/contact-list-select-team-/);
      const vistaRecipientsCount =
        initialState.sm.recipients.vistaRecipients.length;
      expect(allTriageTeams.length).to.equal(vistaRecipientsCount);
      allTriageTeams.forEach(team =>
        expect(team).to.have.attribute('checked', 'true'),
      );
    });
    screen.unmount();
  });

  it('blocked team does not appear in list of teams', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allowedRecipients: [...oneBlockedRecipient.mockAllowedRecipients],
          blockedRecipients: [...oneBlockedRecipient.mockBlockedRecipients],
          associatedTriageGroupsQty:
            oneBlockedRecipient.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            oneBlockedRecipient.associatedBlockedTriageGroupsQty,
          noAssociations: oneBlockedRecipient.noAssociations,
          allTriageGroupsBlocked: oneBlockedRecipient.allTriageGroupsBlocked,
          vistaFacilities: [...oneBlockedRecipient.mockVistaFacilities],
          blockedFacilities: [...oneBlockedRecipient.mockBlockedFacilities],
          allRecipients: [...oneBlockedRecipient.mockAllRecipients],
        },
      },
    };
    const screen = setup(customState);

    await waitFor(() => {
      expect(screen.getByTestId('blocked-triage-group-alert')).to.exist;

      const blockedTeam = screen.queryByTestId(
        'contact-list-select-team-2710520',
      );
      expect(blockedTeam).to.be.null;
    });
    screen.unmount();
  });

  it('blocked facility does not appear in list of contacts', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allowedRecipients: [...oneBlockedFacility.mockAllowedRecipients],
          blockedRecipients: [...oneBlockedFacility.mockBlockedRecipients],
          associatedTriageGroupsQty:
            oneBlockedFacility.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            oneBlockedFacility.associatedBlockedTriageGroupsQty,
          noAssociations: oneBlockedFacility.noAssociations,
          allTriageGroupsBlocked: oneBlockedFacility.allTriageGroupsBlocked,
          vistaFacilities: [...oneBlockedFacility.mockVistaFacilities],
          blockedFacilities: [...oneBlockedFacility.mockBlockedFacilities],
          allRecipients: [...oneBlockedFacility.mockAllRecipients],
          vistaRecipients: [
            ...oneBlockedFacility.mockAllRecipients.filter(
              r => !r.ohTriageGroup,
            ),
          ],
        },
      },
    };
    const screen = setup(customState);

    await waitFor(() => {
      expect(screen.getByTestId('blocked-triage-group-alert')).to.exist;

      const facilities = screen.getAllByTestId(/-facility-group$/);
      expect(facilities.length).to.equal(
        oneBlockedFacility.mockAllFacilities.length - 1,
      );
      facilities.forEach(facility =>
        expect(facility).to.not.have.attribute('label', 'Test Facility 3'),
      );
    });
    screen.unmount();
  });

  it('oracle health teams do not appear in list of contacts', async () => {
    const oracleHealthTeams = noBlockedRecipients.mockAllRecipients.filter(
      r => r.ohTriageGroup,
    );

    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allowedRecipients: [...noBlockedRecipients.mockAllowedRecipients],
          blockedRecipients: [...noBlockedRecipients.mockBlockedRecipients],
          associatedTriageGroupsQty:
            noBlockedRecipients.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            noBlockedRecipients.associatedBlockedTriageGroupsQty,
          noAssociations: noBlockedRecipients.noAssociations,
          allTriageGroupsBlocked: noBlockedRecipients.allTriageGroupsBlocked,
          vistaFacilities: [...noBlockedRecipients.mockVistaFacilities],
          blockedFacilities: [...noBlockedRecipients.mockBlockedFacilities],
          allRecipients: [...noBlockedRecipients.mockAllRecipients],
          vistaRecipients: [...initialVistaRecipients],
        },
      },
    };
    const { getAllByTestId, queryByTestId, container, unmount } = setup(
      customState,
    );
    const vistaRecipientsCount =
      customState.sm.recipients.vistaRecipients.length;
    await waitFor(() => {
      const allTriageTeams = getAllByTestId(/contact-list-select-team-/);
      expect(allTriageTeams.length).to.equal(vistaRecipientsCount);
      allTriageTeams.forEach(team =>
        expect(team).to.have.attribute('checked', 'true'),
      );
    });
    const oracleHealthTeam = oracleHealthTeams[0];
    const oracleHealthTeamCheckbox = queryByTestId(
      `contact-list-select-team-${oracleHealthTeam.id}`,
    );
    expect(oracleHealthTeamCheckbox).to.be.null;
    expect(
      container.querySelectorAll(
        `va-checkbox[label="${oracleHealthTeam.name}"]`,
      ),
    ).to.not.exist;
    unmount();
  });

  it('modifies all teams in one facility when "select all" is checked', async () => {
    const screen = setup();

    const testFacility2TeamsTrue = await screen.findByTestId(
      'Test-Facility-2-teams',
    );
    const checkboxesTrue = testFacility2TeamsTrue.querySelectorAll(
      'va-checkbox',
    );

    checkboxesTrue.forEach(team =>
      expect(team).to.have.attribute('checked', 'true'),
    );

    const selectAll = await screen.findByTestId(
      'select-all-Test-Facility-2-teams',
    );
    await waitFor(() => {
      expect(selectAll).to.have.attribute('checked', 'true');
    });

    await checkVaCheckbox(selectAll, false);

    expect(selectAll).to.have.attribute('checked', 'false');

    const testFacility2TeamsFalse = await screen.findByTestId(
      'Test-Facility-2-teams',
    );

    await waitFor(() => {
      const checkboxesFalse = testFacility2TeamsFalse.querySelectorAll(
        'va-checkbox',
      );

      checkboxesFalse.forEach(team =>
        expect(team).to.have.attribute('checked', 'false'),
      );
    });

    screen.unmount();
  });

  it('prevents navigating away if unsaved changes', async () => {
    const screen = setup();

    const guardModal = screen.getByTestId('sm-route-navigation-guard-modal');
    expect(guardModal).to.have.attribute('visible', 'false');

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    checkVaCheckbox(checkbox, false);

    expect(checkbox).to.have.attribute('checked', 'false');

    const cancelButton = screen.getByTestId('contact-list-go-back');
    fireEvent.click(cancelButton);

    waitFor(() => {
      expect(guardModal).to.have.attribute('visible', 'true');
    }, 1000);
    screen.unmount();
  });

  it('saves changes and displays alert on "save" click', async () => {
    const screen = setup();

    const guardModal = screen.getByTestId('sm-route-navigation-guard-modal');
    expect(guardModal).to.have.attribute('visible', 'false');

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    checkVaCheckbox(checkbox, false);

    expect(checkbox).to.have.attribute('checked', 'false');

    const saveButton = screen.getByTestId('contact-list-save');
    mockApiRequest(200, true);
    fireEvent.click(saveButton);

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert.getAttribute('status')).to.equal('success');
      expect(screen.getByText('Contact list changes saved')).to.exist;
    });
    screen.unmount();
  });

  it('displays loading indicator when save is in progress', async () => {
    const screen = setup();

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    checkVaCheckbox(checkbox, false);

    expect(checkbox).to.have.attribute('checked', 'false');

    // Initially, loading indicator should not be present
    expect(screen.queryByTestId('contact-list-saving-indicator')).to.be.null;

    const saveButton = screen.getByTestId('contact-list-save');
    mockApiRequest(200, true);
    fireEvent.click(saveButton);

    // Loading indicator should appear during save
    await waitFor(() => {
      const loadingIndicator = screen.getByTestId(
        'contact-list-saving-indicator',
      );
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator).to.have.attribute(
        'message',
        'Saving your contact list...',
      );
    });

    screen.unmount();
  });

  it('displays error state on first checkbox when "save" is clicked if zero teams are checked', async () => {
    const screen = setup(initialState);

    const selectAllFacility2 = await screen.findByTestId(
      'select-all-Test-Facility-2-teams',
    );
    await waitFor(() => {
      expect(selectAllFacility2).to.have.attribute('checked', 'true');
    });

    await checkVaCheckbox(selectAllFacility2, false);

    const selectAllFacility1 = await screen.findByTestId(
      'select-all-Test-Facility-1-teams',
    );
    expect(selectAllFacility1).to.have.attribute('checked', 'true');

    await checkVaCheckbox(selectAllFacility1, false);

    const saveButton = screen.getByTestId('contact-list-save');
    fireEvent.click(saveButton);

    const checkboxInput = await screen.getByTestId(
      'Test-Facility-2-facility-group',
    );
    const checkboxInputError = checkboxInput[getProps(checkboxInput)].error;

    expect(checkboxInputError).to.equal(
      ErrorMessages.ContactList.MINIMUM_SELECTION,
    );
  });

  it('adds eventListener if path is /contact-list', async () => {
    // Create spy BEFORE setup to capture all addEventListener calls across Node versions
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');

    const screen = setup();

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    // Count beforeunload listeners after initial render (varies by Node version)
    const initialBeforeunloadCount = addEventListenerSpy
      .getCalls()
      .filter(call => call.args[0] === 'beforeunload').length;

    // Click checkbox to trigger a contact list change - wrap in act to ensure state updates flush
    await act(async () => {
      checkVaCheckbox(checkbox, false);
    });

    // Verify a NEW beforeunload listener was added after the change
    await waitFor(() => {
      const newBeforeunloadCount = addEventListenerSpy
        .getCalls()
        .filter(call => call.args[0] === 'beforeunload').length;
      expect(newBeforeunloadCount).to.be.above(initialBeforeunloadCount);
    });

    addEventListenerSpy.restore();
  });

  it('removes eventListener if contact list changes are reverted', async () => {
    // Create spies BEFORE setup to capture all calls across Node versions
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    const removeEventListenerSpy = sinon.spy(window, 'removeEventListener');

    const screen = setup();

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    // Count beforeunload listeners after initial render
    const initialBeforeunloadCount = addEventListenerSpy
      .getCalls()
      .filter(call => call.args[0] === 'beforeunload').length;

    // Click checkbox to trigger a contact list change - wrap in act to ensure state updates flush
    await act(async () => {
      checkVaCheckbox(checkbox, false);
    });

    // Verify a NEW beforeunload listener was added
    await waitFor(() => {
      const newBeforeunloadCount = addEventListenerSpy
        .getCalls()
        .filter(call => call.args[0] === 'beforeunload').length;
      expect(newBeforeunloadCount).to.be.above(initialBeforeunloadCount);
    });

    // Click checkbox again to revert the change - wrap in act to ensure state updates flush
    await act(async () => {
      checkVaCheckbox(checkbox, true);
    });

    // Verify beforeunload listener was removed
    await waitFor(() => {
      expect(removeEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });

    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });

  it('error alert displayed if "save" clicked and an error is returned', async () => {
    const errorResponse = {
      errors: [
        {
          title: 'Service unavailable',
          detail: 'Backend Service Outage',
          code: '403',
          status: '403',
        },
      ],
    };

    const screen = setup();

    const guardModal = screen.getByTestId('sm-route-navigation-guard-modal');
    expect(guardModal).to.have.attribute('visible', 'false');

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    checkVaCheckbox(checkbox, false);

    expect(checkbox).to.have.attribute('checked', 'false');

    const saveButton = screen.getByTestId('contact-list-save');
    mockApiRequest({ ...errorResponse, status: 403 }, false);
    fireEvent.click(saveButton);

    // NODE 22 FIX: Split assertions into separate waitFor calls. In Node 22,
    // the alert component may render before its text content is populated.
    // First wait for the alert to appear with error status, then wait for the text.
    // This doesn't change test behavior - we're still verifying the same things,
    // just in a more resilient order that handles async rendering differences.
    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
    });

    await waitFor(() => {
      const alertText = screen.getByTestId('alert-text');
      expect(alertText.textContent).to.include(
        "We're sorry. We couldn't save your changes. Try saving again.",
      );
    });

    screen.unmount();
  });

  it('"No teams" alert displayed if there are no triage teams loaded', async () => {
    const customState = {
      drupalStaticData,
      sm: {
        recipients: {
          allowedRecipients: [...noAssociationsAtAll.mockAllowedRecipients],
          blockedRecipients: [...noAssociationsAtAll.mockBlockedRecipients],
          associatedTriageGroupsQty:
            noAssociationsAtAll.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            noAssociationsAtAll.associatedBlockedTriageGroupsQty,
          noAssociations: noAssociationsAtAll.noAssociations,
          allTriageGroupsBlocked: noAssociationsAtAll.allTriageGroupsBlocked,
          vistaFacilities: [...noAssociationsAtAll.mockVistaFacilities],
          blockedFacilities: [...noAssociationsAtAll.mockBlockedFacilities],
          allRecipients: [...noAssociationsAtAll.mockAllRecipients],
          error: true,
        },
      },
    };
    const screen = setup(customState);

    const noTeamsAlert = screen.getByTestId('contact-list-empty-alert');
    expect(noTeamsAlert).to.have.attribute('status', 'error');

    expect(screen.getByText('We can’t load your contact list right now')).to
      .exist;

    screen.unmount();
  });

  it('should redirect to draft message on go back button click if an active draft is present', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        breadcrumbs: {
          previousUrl: Paths.COMPOSE,
        },
        threadDetails: {
          drafts: [{ messageId: '123123' }],
        },
      },
    };

    const screen = setup(customState);

    const cancelButton = await screen.findByTestId('contact-list-go-back');
    fireEvent.click(cancelButton);

    expect(screen.history.location.pathname).to.equal(
      `${Paths.MESSAGE_THREAD}123123/`,
    );

    screen.unmount();
  });
});
