import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import mockEhrData from '../fixtures/userResponse/vamc-ehr-cerner-mixed.json';
import mockMixedCernerFacilitiesUser from '../fixtures/userResponse/user-cerner-mixed.json';
import mockFacilities from '../fixtures/facilityResponse/cerner-facility-mock-data.json';
import mockMixRecipients from '../fixtures/multi-facilities-recipients-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM Single Facility Contact list', () => {
  const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_edit_contact_list',
      value: true,
    },
  ]);
  beforeEach(() => {
    SecureMessagingSite.login(
      updatedFeatureToggle,
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
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.visit(`${Paths.UI_MAIN}/medications/about`);

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(
          `http://localhost:3001${Paths.UI_MAIN}/medications/about`,
        );
      });
    });
  });

  it(`navigate away using navbar`, () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.visit(`${Paths.UI_MAIN}/find-locations`);

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(
          `http://localhost:3001${Paths.UI_MAIN}/find-locations`,
        );
      });
    });
  });

  it(`navigate away using browser back button`, () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.go(`back`);

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(
          `http://localhost:3001${Paths.UI_MAIN}/inbox/`,
        );
      });
    });
  });

  it(`navigate away using browser reload`, () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.window().then(win => {
      const beforeUnloadStub = cy.stub();

      win.addEventListener('beforeunload', beforeUnloadStub);

      cy.reload();

      cy.then(() => {
        expect(beforeUnloadStub).to.have.been.called;
        expect(win.location.href).to.eq(
          `http://localhost:3001${Paths.UI_MAIN}/contact-list`,
        );
      });
    });
  });
});
