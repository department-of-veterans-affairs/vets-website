import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Verify alert for invalid url', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
  });

  it('Invalid landing page url', () => {
    FolderLoadPage.verifyUrlError();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Invalid Inbox page url', () => {
    cy.visit(`${Paths.UI_MAIN}/inbox1`);
    FolderLoadPage.verifyUrlError();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Invalid folders url', () => {
    cy.visit(`${Paths.UI_MAIN}/folder`);
    FolderLoadPage.verifyUrlError();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
