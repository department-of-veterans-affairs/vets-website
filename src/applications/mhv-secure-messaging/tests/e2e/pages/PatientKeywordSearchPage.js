import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockMessages from '../fixtures/messages-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';

class PatientKeywordSearchPage {
  newMessageIndex = 0;

  loadPage = (doAxeCheck = false) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_CATEGORY, mockCategories).as(
      'categories',
    );
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}?page*`,
      mockFolders,
    ).as('folders');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/messages*`,
      mockMessages,
    ).as('inboxMessages');
    this.loadedMessagesData = mockMessages;
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0*`,
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_RECIPIENT}?useCache=false`,
      mockRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
    if (doAxeCheck) {
      cy.injectAxe();
    }

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages');
    if (doAxeCheck) {
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    }
  };

  typeSearchInputFieldText = text => {
    cy.get(Locators.ALERTS.TEXT_INPUT)
      .shadow()
      .find('[id="inputField"]')
      .focus()
      .realType(text);
    //   .should('have.value', text);
  };

  // This method clicks the Search button.
  clickSubmitSearchButton = () => {
    cy.get('.search-button > .fas').realClick();
  };

  // This method verifies the highlighted text in the messages returned after clicking the search button.

  verifySelectedFolder = () => {
    cy.get(Locators.ALERTS.SEARCH_DROPDOWN)
      .shadow()
      .find('select')
      .should('be.selected');
  };
  // This method selects the folder from the drop down menu.

  selectFolder = name => {
    cy.get(Locators.ALERTS.SEARCH_DROPDOWN)
      .shadow()
      .find('select')
      .focus()
      //   .chooseSelectOptionByTyping(name, { force: true });
      .select(`${name}`, { force: true });
  };
}
export default PatientKeywordSearchPage;
