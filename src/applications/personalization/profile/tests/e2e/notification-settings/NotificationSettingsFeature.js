import { PROFILE_PATHS } from '@@profile/constants';
import mockUser36 from '@@profile/tests/fixtures/users/user-36.json';

const generateExistenceCheck = exists => {
  if (typeof exists === 'undefined' || typeof exists === 'string') {
    throw new Error('generateExistenceCheck requires a boolean argument');
  }

  return exists ? 'exist' : 'not.exist';
};

class NotificationSettingsFeature {
  APPEAL_STATUS_NOTIFICATION_TEXT = 'Appeal status updates';

  loginAsUser36AndVisitNotficationSettingsPage = () => {
    cy.login(mockUser36);
    cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
  };

  confirmHearingReminderNotificationSanityCheck = () => {
    // check that hearing notification is rendering first
    cy.findByRole('radio', {
      name: /^do not notify me of.*hearing reminder.*by text/i,
    }).should('exist');
  };

  confirmAppealsStatusSetting = ({ exists }) => {
    cy.findByText(this.APPEAL_STATUS_NOTIFICATION_TEXT).should(
      generateExistenceCheck(exists),
    );
  };

  confirmPaymentNotificationSetting = ({ exists }) => {
    cy.findByRole('radio', {
      name: /^Notify me of Disability and pension deposit notifications by text/i,
    }).should(generateExistenceCheck(exists));

    cy.findByRole('radio', {
      name: /^Do not notify me of Disability and pension deposit notifications by text/i,
    }).should(generateExistenceCheck(exists));
  };

  confirmQuickSubmitNotificationSetting = ({ exists }) => {
    cy.findByRole('radio', {
      name: /^Notify me of QuickSubmit Upload Status by text/i,
    }).should(generateExistenceCheck(exists));

    cy.findByRole('radio', {
      name: /^Do not notify me of QuickSubmit Upload Status by text/i,
    }).should(generateExistenceCheck(exists));
  };
}

export default new NotificationSettingsFeature();
