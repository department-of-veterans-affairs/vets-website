import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { fireEvent, waitFor } from '@testing-library/react';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import SelectCareTeam from '../../containers/SelectCareTeam';
import noBlockedRecipients from '../fixtures/json-triage-mocks/triage-teams-mock.json';
import noBlocked6Recipients from '../fixtures/json-triage-mocks/triage-teams-mock-6-teams.json';
import { selectVaRadio, selectVaSelect } from '../../util/testUtils';

describe('SelectCareTeam', () => {
  const initialState = {
    sm: {
      recipients: {
        allFacilities: noBlockedRecipients.mockAllFacilities,
        allRecipients: noBlockedRecipients.mockAllRecipients,
        allowedRecipients: noBlockedRecipients.mockAllowedRecipients,
        blockedRecipients: noBlockedRecipients.mockBlockedRecipients,
        associatedTriageGroupsQty:
          noBlockedRecipients.associatedTriageGroupsQty,
        associatedBlockedTriageGroupsQty:
          noBlockedRecipients.associatedBlockedTriageGroupsQty,
        noAssociations: noBlockedRecipients.noAssociations,
        allTriageGroupsBlocked: noBlockedRecipients.allTriageGroupsBlocked,
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '662': {
              vhaId: '662',
              vamcSystemName: 'Test Facility 1',
              ehr: 'vista',
            },
            '636': {
              vhaId: '636',
              vamcSystemName: 'Test Facility 2',
              ehr: 'vista',
            },
            '587': {
              vhaId: '587',
              vamcSystemName: 'Test Facility 3',
              ehr: 'vista',
            },
            '321': {
              vhaId: '321',
              vamcSystemName: 'Test Facility 4',
              ehr: 'vista',
            },
            '954': {
              vhaId: '954',
              vamcSystemName: 'Test Facility 5',
              ehr: 'cerner',
            },
            '834': {
              vhaId: '834',
              vamcSystemName: 'Test Facility 6',
              ehr: 'cerner',
            },
          },
        },
      },
    },
  };
  it('renders the heading and radio options', () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    expect(
      screen.getByRole('heading', {
        name: /Which VA health care system do you want to send a message to?/i,
      }),
    ).to.exist;
    const vaRadio = screen.container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('label')).to.equal(
      'Select a VA health care system',
    );
    const vaRadioOption = screen.container.querySelector('va-radio-option');
    expect(vaRadioOption).to.exist;

    expect(vaRadioOption.getAttribute('id')).to.equal('636');
    expect(screen.getByTestId('care-system-636')).to.exist;
    expect(screen.getByTestId('care-system-662')).to.exist;
  });

  it('sets error attribute on va-radio after clicking Continue with no selection', () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).to.exist;
    fireEvent.click(continueButton);
    // $('va-button').__events.primaryClick(); // continue
    expect($('va-radio')).to.have.attribute(
      'error',
      'Select a VA health care system',
    );
  });

  it('removes error when a facility is selected after error', async () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).to.exist;
    fireEvent.click(continueButton);
    expect($('va-radio')).to.have.attribute(
      'error',
      'Select a VA health care system',
    );
    expect($('va-radio-option').radioOptionSelected).to.equal('');

    await waitFor(() => {
      selectVaRadio(screen.container, '636');
      expect($('va-radio')).to.not.have.attribute(
        'error',
        'Select a VA health care system',
      );
    });
  });

  it('displays health care system facilities as radio button options', async () => {
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });
    expect(screen.getByTestId('care-system-636')).to.exist; // VA Boston
    expect(screen.getByTestId('care-system-662')).to.exist; // VA Seattle
    // Check the number of radio options
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(2);
  });

  it('displays health care system facilities as select dropdown when 6 or more', async () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          allFacilities: noBlocked6Recipients.mockAllFacilities,
          allRecipients: noBlocked6Recipients.mockAllRecipients,
          allowedRecipients: noBlocked6Recipients.mockAllowedRecipients,
          blockedRecipients: noBlocked6Recipients.mockBlockedRecipients,
          associatedTriageGroupsQty:
            noBlocked6Recipients.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            noBlocked6Recipients.associatedBlockedTriageGroupsQty,
          noAssociations: noBlocked6Recipients.noAssociations,
          allTriageGroupsBlocked: noBlocked6Recipients.allTriageGroupsBlocked,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    const careSystemSelect = screen.getByTestId('care-system-select');

    const options = careSystemSelect.querySelectorAll('option');
    expect(options).to.have.lengthOf(
      customState.sm.recipients.allFacilities.length,
    );

    const careTeamSelect = screen.getByTestId('compose-recipient-select');
    const careTeamOptions = careTeamSelect.querySelectorAll('option');
    expect(careTeamOptions).to.have.lengthOf(0);
  });

  it('updates care team selection options when a care system is selected', async () => {
    const customState = {
      ...initialState,
      sm: {
        recipients: {
          allFacilities: noBlocked6Recipients.mockAllFacilities,
          allRecipients: noBlocked6Recipients.mockAllRecipients,
          allowedRecipients: noBlocked6Recipients.mockAllowedRecipients,
          blockedRecipients: noBlocked6Recipients.mockBlockedRecipients,
          associatedTriageGroupsQty:
            noBlocked6Recipients.associatedTriageGroupsQty,
          associatedBlockedTriageGroupsQty:
            noBlocked6Recipients.associatedBlockedTriageGroupsQty,
          noAssociations: noBlocked6Recipients.noAssociations,
          allTriageGroupsBlocked: noBlocked6Recipients.allTriageGroupsBlocked,
        },
      },
    };
    const screen = renderWithStoreAndRouter(<SelectCareTeam />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.SELECT_CARE_TEAM,
    });

    selectVaSelect(
      screen.container,
      '636',
      '[data-testid="care-system-select"]',
    );
    await waitFor(() => {
      const careTeamSelect = screen.getByTestId('compose-recipient-select');
      const careTeamOptions = careTeamSelect.querySelectorAll('option');
      expect(careTeamOptions).to.have.lengthOf(3);
    });
  });
});
