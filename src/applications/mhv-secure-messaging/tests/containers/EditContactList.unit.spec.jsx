import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
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
        allFacilities: [...noBlockedRecipients.mockAllFacilities],
        blockedFacilities: [...noBlockedRecipients.mockBlockedFacilities],
        allRecipients: [...noBlockedRecipients.mockAllRecipients],
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
          allFacilities: [...oneAssociatedFacility.mockAllFacilities],
          blockedFacilities: [...oneAssociatedFacility.mockBlockedFacilities],
          allRecipients: [...oneAssociatedFacility.mockAllRecipients],
        },
      },
    };
    const screen = setup(customState);

    const facilityGroups = await screen.findAllByTestId(/-facility-group$/);
    expect(facilityGroups.length).to.equal(1);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Select the teams you want to show in your contact list. You must select at least one team.',
        ),
      ).to.exist;

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
    expect(facilityGroups[0]).to.have.attribute('label', 'Test Facility 2');
    expect(facilityGroups[1]).to.have.attribute('label', 'Test Facility 1');

    await waitFor(() => {
      expect(
        screen.getByText(
          'Select the teams you want to show in your contact list. You must select at least one team from one of your facilities.',
        ),
      ).to.exist;
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
      expect(allTriageTeams.length).to.equal(
        noBlockedRecipients.associatedTriageGroupsQty,
      );
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
          allFacilities: [...oneBlockedRecipient.mockAllFacilities],
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
          allFacilities: [...oneBlockedFacility.mockAllFacilities],
          blockedFacilities: [...oneBlockedFacility.mockBlockedFacilities],
          allRecipients: [...oneBlockedFacility.mockAllRecipients],
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
    const screen = setup();

    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.false;

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    checkVaCheckbox(checkbox, false);

    await waitFor(() => {
      expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });
  });

  it('removes eventListener if contact list changes are reverted', async () => {
    const screen = setup();

    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    const removeEventListenerSpy = sinon.spy(window, 'removeEventListener');
    expect(addEventListenerSpy.calledWith('beforeunload')).to.be.false;

    const checkbox = await screen.findByTestId(
      'contact-list-select-team-1013155',
    );

    checkVaCheckbox(checkbox, false);

    await waitFor(() => {
      expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });

    checkVaCheckbox(checkbox, true);

    await waitFor(() => {
      expect(removeEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });
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

    await waitFor(() => {
      const alert = document.querySelector('va-alert');
      expect(alert.getAttribute('status')).to.equal('error');
      expect(
        screen.getByText(
          "We're sorry. We couldn't save your changes. Try saving again.",
        ),
      ).to.exist;
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
          allFacilities: [...noAssociationsAtAll.mockAllFacilities],
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
