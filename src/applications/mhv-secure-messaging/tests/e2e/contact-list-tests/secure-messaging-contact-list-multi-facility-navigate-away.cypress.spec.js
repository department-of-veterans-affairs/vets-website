import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import mockToggles from '../fixtures/toggles-response.json';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockMixRecipients from '../fixtures/multi-facilities-recipients-response.json';

const baseUrl = Cypress.config('baseUrl');

describe('SM SINGLE FACILITY CONTACT LIST', () => {
  beforeEach(() => {
    SecureMessagingSite.login(
      mockToggles,
      mockEhrData,
      true,
      mockMixedCernerFacilitiesUser,
      mockFacilities,
    );
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList(mockMixRecipients);
    ContactListPage.selectAllCheckBox();
  });

  it('navigate away using secondary navigation', () => {
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.visit(`${Paths.UI_MAIN}/medications/about`);

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(
          `${baseUrl}${Paths.UI_MAIN}/medications/about`,
        );
      });
    });
  });

  it(`navigate away using navbar`, () => {
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.visit(`${Paths.UI_MAIN}/find-locations`);

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(
          `${baseUrl}${Paths.UI_MAIN}/find-locations`,
        );
      });
    });
  });

  it(`navigate away using browser back button`, () => {
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.go(`back`);

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(`${baseUrl}${Paths.UI_MAIN}/inbox/`);
      });
    });
  });

  it(`navigate away using browser reload`, () => {
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.reload();

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(
          `${baseUrl}${Paths.UI_MAIN}/contact-list`,
        );
      });
    });
  });
});
