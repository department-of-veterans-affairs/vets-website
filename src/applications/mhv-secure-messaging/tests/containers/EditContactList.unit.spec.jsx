import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup, waitFor } from '@testing-library/react';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import oneBlockedRecipient from '../fixtures/json-triage-mocks/triage-teams-one-blocked-mock.json';
import oneBlockedFacility from '../fixtures/json-triage-mocks/triage-teams-facility-blocked-mock.json';
import drupalStaticData from '../fixtures/json-triage-mocks/drupal-data-mock.json';
import reducer from '../../reducers';
import EditContactList from '../../containers/EditContactList';
import { Paths } from '../../util/constants';

describe('Edit Contact List container', () => {
  const initialState = {
    drupalStaticData,
    sm: {
      recipients: {
        allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
        blockedRecipients: noBlockedRecipients.mockBlockedRecipients,
        associatedTriageGroupsQty:
          noBlockedRecipients.associatedTriageGroupsQty,
        associatedBlockedTriageGroupsQty:
          noBlockedRecipients.associatedBlockedTriageGroupsQty,
        noAssociations: noBlockedRecipients.noAssociations,
        allTriageGroupsBlocked: noBlockedRecipients.allTriageGroupsBlocked,
        allFacilities: noBlockedRecipients.mockAllFacilities,
        blockedFacilities: noBlockedRecipients.mockBlockedFacilities,
        allRecipients: noBlockedRecipients.mockAllRecipients,
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
  });

  it('renders multiple groups if multiple facilities are connected', async () => {
    const screen = setup();

    const facilityGroups = screen.getAllByTestId('contact-list-facility-group');
    expect(facilityGroups.length).to.equal(2);
    expect(facilityGroups[0]).to.have.attribute('label', 'Test Facility 2');
    expect(facilityGroups[1]).to.have.attribute('label', 'Test Facility 1');

    await waitFor(() => {
      const selectAllTeams = screen.getAllByTestId(
        'contact-list-select-all-teams',
      );
      expect(selectAllTeams[0]).to.have.attribute(
        'label',
        'Select all 4 Test Facility 2 teams',
      );
      expect(selectAllTeams[1]).to.have.attribute(
        'label',
        'Select all 2 Test Facility 1 teams',
      );

      const allTriageTeams = screen.getAllByTestId('contact-list-select-team');
      expect(allTriageTeams.length).to.equal(
        noBlockedRecipients.associatedTriageGroupsQty,
      );
      allTriageTeams.forEach(team =>
        expect(team).to.have.attribute('checked', 'true'),
      );
    });
  });

  it('blocked team does not appear in list of teams', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allowedRecipients: oneBlockedRecipient.mockAllowedRecipients,
          blockedRecipients: oneBlockedRecipient.mockBlockedRecipients,
          associatedTriageGroupsQty:
            oneBlockedRecipient.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            oneBlockedRecipient.associatedBlockedTriageGroupsQty,
          noAssociations: oneBlockedRecipient.noAssociations,
          allTriageGroupsBlocked: oneBlockedRecipient.allTriageGroupsBlocked,
          allFacilities: oneBlockedRecipient.mockAllFacilities,
          blockedFacilities: oneBlockedRecipient.mockBlockedFacilities,
          allRecipients: oneBlockedRecipient.mockAllRecipients,
        },
      },
    };
    const screen = setup(customState);

    await waitFor(() => {
      expect(screen.getByTestId('blocked-triage-group-alert')).to.exist;

      const allTriageTeams = screen.getAllByTestId('contact-list-select-team');
      expect(allTriageTeams.length).to.equal(
        oneBlockedRecipient.associatedTriageGroupsQty - 1,
      );
      allTriageTeams.forEach(team =>
        expect(team).to.not.have.attribute(
          'label',
          'SM_TO_VA_GOV_TRIAGE_GROUP_TEST',
        ),
      );
    });
  });

  it('blocked facility does not appear in list of contacts', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          allowedRecipients: oneBlockedFacility.mockAllowedRecipients,
          blockedRecipients: oneBlockedFacility.mockBlockedRecipients,
          associatedTriageGroupsQty:
            oneBlockedFacility.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            oneBlockedFacility.associatedBlockedTriageGroupsQty,
          noAssociations: oneBlockedFacility.noAssociations,
          allTriageGroupsBlocked: oneBlockedFacility.allTriageGroupsBlocked,
          allFacilities: oneBlockedFacility.mockAllFacilities,
          blockedFacilities: oneBlockedFacility.mockBlockedFacilities,
          allRecipients: oneBlockedFacility.mockAllRecipients,
        },
      },
    };
    const screen = setup(customState);

    await waitFor(() => {
      expect(screen.getByTestId('blocked-triage-group-alert')).to.exist;

      const facilities = screen.getAllByTestId('contact-list-facility-group');
      expect(facilities.length).to.equal(
        oneBlockedFacility.mockAllFacilities.length - 1,
      );
      facilities.forEach(facility =>
        expect(facility).to.not.have.attribute('label', 'Test Facility 3'),
      );
    });
  });
});
