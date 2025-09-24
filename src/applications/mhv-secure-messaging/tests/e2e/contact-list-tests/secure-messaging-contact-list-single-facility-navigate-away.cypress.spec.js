import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import ContactListPage from '../pages/ContactListPage';
import { AXE_CONTEXT, Paths } from '../utils/constants';

describe('SM SINGLE FACILITY CONTACT LIST NAVIGATE AWAY', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    ContactListPage.loadContactList();
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
          `http://localhost:3001${Paths.UI_MAIN}/medications/about`,
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
          `http://localhost:3001${Paths.UI_MAIN}/find-locations`,
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
        expect(win.location.href).to.eq(
          `http://localhost:3001${Paths.UI_MAIN}/inbox/`,
        );
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
          `http://localhost:3001${Paths.UI_MAIN}/contact-list`,
        );
      });
    });
  });
});
