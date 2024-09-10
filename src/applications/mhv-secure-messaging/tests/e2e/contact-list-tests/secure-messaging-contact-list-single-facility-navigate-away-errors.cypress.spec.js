import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM Single Facility Contact list', () => {
  const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles(
    'mhv_secure_messaging_edit_contact_list',
    true,
  );
  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggle);
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList();
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
