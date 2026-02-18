import { Data, Locators } from '../utils/constants';

class PatientRecentRecipientsPage {
  continueButton = () => {
    return cy.findByTestId(
      Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
    );
  };

  selectDifferentRecipient = () => {
    cy.findByText(cy.contains(Data.CURATED_LIST.SELECT_CARE_TEAM)).click();
  };

  selectCareTeamRecipientByIndex = index => {
    cy.findByTestId('recent-care-teams-radio-group')
      .find('va-radio-option')
      .eq(index)
      .find('input[type="radio"]')
      .check({ force: true });
  };
}

export default new PatientRecentRecipientsPage();
