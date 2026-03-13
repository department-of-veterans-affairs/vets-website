import { Locators } from '../utils/constants';

class PatientRecentRecipientsPage {
  continueButton = () => {
    return cy.findByTestId(
      Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
    );
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
