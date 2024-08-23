import { PROFILE_PATHS } from '@@profile/constants';
import mockUser36 from '@@profile/tests/fixtures/users/user-36.json';

const generateExistenceCheck = exists => {
  if (typeof exists === 'undefined' || typeof exists === 'string') {
    throw new Error('generateExistenceCheck requires a boolean argument');
  }

  return exists ? 'exist' : 'not.exist';
};

class NotificationSettingsFeature {
  APPEAL_HEARING_NOTIFICATION_TEXT = `Board of Veterans' Appeals hearing reminder`;

  APPEAL_STATUS_NOTIFICATION_TEXT = 'Appeal status updates';

  DISABILITY_PENSION_DEPOSIT_NOTIFICATION_TEXT =
    'Disability and pension deposit notifications';

  NEW_BENEFIT_OVERPAYMENT_DEBT_NOTIFICATION =
    'New benefit overpayment debt notification';

  NEW_HEALTH_CARE_COPAY_BILL_NOTIFICATION = 'New health care copay bill';

  QUICK_SUBMIT_NOTIFICATION_TEXT = 'QuickSubmit Upload Status';

  loginAsUser36AndVisitNotficationSettingsPage = () => {
    cy.login(mockUser36);
    cy.visit(PROFILE_PATHS.NOTIFICATION_SETTINGS);
  };

  confirmHearingReminderNotificationSanityCheck = () => {
    // check that hearing notification is rendering first
    cy.findByText(this.APPEAL_HEARING_NOTIFICATION_TEXT).should('exist');
  };

  confirmAppealsStatusSetting = ({ exists }) => {
    cy.findByText(this.APPEAL_STATUS_NOTIFICATION_TEXT).should(
      generateExistenceCheck(exists),
    );
  };

  confirmPaymentNotificationSetting = ({ exists }) => {
    cy.findByText(this.DISABILITY_PENSION_DEPOSIT_NOTIFICATION_TEXT).should(
      generateExistenceCheck(exists),
    );
  };

  confirmNewBenefitOverpaymentDebtNotificationSetting = ({ exists }) => {
    cy.findByText(this.NEW_BENEFIT_OVERPAYMENT_DEBT_NOTIFICATION).should(
      generateExistenceCheck(exists),
    );
  };

  confirmNewHealthCareCopayBillNotificationSetting = ({ exists }) => {
    cy.findByText(this.NEW_HEALTH_CARE_COPAY_BILL_NOTIFICATION).should(
      generateExistenceCheck(exists),
    );
  };

  confirmQuickSubmitNotificationSetting = ({ exists }) => {
    cy.findByText(this.QUICK_SUBMIT_NOTIFICATION_TEXT).should(
      generateExistenceCheck(exists),
    );
  };
}

export default new NotificationSettingsFeature();
