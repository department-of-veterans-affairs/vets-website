import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Medication Status', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  beforeEach(() => {
    cy.visit('my-health/about-medications/');
    site.login();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
    listPage.clickGotoMedicationsLink();
  });

  it('verify information on list view for active status zero refills', () => {
    listPage.verifyInformationBasedOnStatusActiveNoRefillsLeft();
  });

  it('verify information on list view for active refill in process', () => {
    listPage.verifyInformationBasedOnStatusActiveRefillInProcess();
  });

  it('verify information on list view for active refills left', () => {
    listPage.verifyInformationBasedOnStatusActiveRefillsLeft();
  });

  it('verify information on list view for non-VA prescriptions', () => {
    listPage.verifyInformationBasedOnStatusNonVAPrescription();
  });
  it('verify information on list view for active onHold refills', () => {
    listPage.verifyInformationBasedOnStatusActiveOnHold();
  });

  it('verify information on list view for parked prescriptions', () => {
    listPage.verifyInformationBasedOnStatusActiveParked();
  });

  it('verify information on list view for discontinued prescription', () => {
    listPage.verifyInformationBasedOnStatusDiscontinued();
  });

  it('verify information on list view for expired prescription', () => {
    listPage.verifyInformationBasedOnStatusExpired();
  });

  it('verify information on list view for transferred prescription', () => {
    listPage.verifyInformationBasedOnStatusTransferred();
  });

  it('verify information on list view for unknown prescription', () => {
    listPage.verifyInformationBasedOnStatusUnknown();
  });

  it('verify information on list view for submitted prescription', () => {
    listPage.verifyInformationBaseOnStatusSubmitted();
  });
});
