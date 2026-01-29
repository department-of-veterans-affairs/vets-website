import mockMessages from '../fixtures/threads-response.json';
// import mockCategories from '../fixtures/categories-response.json';
// import mockToggles from '../fixtures/toggles-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import mockTrashMessages from '../fixtures/trashResponse/trash-messages-response.json';
import { Data, Assertions, Locators, Paths, Alerts } from '../utils/constants';
import SharedComponents from './SharedComponents';

class FolderLoadPage {
  // update to make this.loadFolderMessages method independent of 'PatientInboxPage.loadInboxMessages();'
  // foldersSetup = () => {
  //   cy.intercept('GET', Paths.INTERCEPT.FEATURE_TOGGLES, mockToggles).as(
  //     'featureToggle',
  //   );
  //   cy.intercept('GET', Paths.INTERCEPT.MESSAGE_CATEGORY, mockCategories).as(
  //     'categories',
  //   );
  //   cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER, mockFolders).as(
  //     'folders',
  //   );
  //   // cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_THREAD, mockMessages).as(
  //   //   'inboxMessages',
  //   // );
  //   cy.visit('my-health/secure-messages/inbox/', {
  //     onBeforeLoad: win => {
  //       cy.stub(win, 'print');
  //     },
  //   });
  // };

  loadFolders = (foldersResponse = mockFolders) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDER}`,
      foldersResponse,
    ).as('foldersResponse');
    cy.get('[data-testid="folders-inner-nav"]>a').click({ force: true });
  };

  loadFolderMessages = (
    folderName,
    folderNumber,
    folderResponseIndex,
    messagesList,
  ) => {
    // this.foldersSetup();
    this.loadFolders();
    cy.intercept('GET', `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderNumber}*`, {
      data: mockFolders.data[folderResponseIndex],
    }).as('folderMetaData');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderNumber}/threads*`,
      messagesList,
    ).as('folderThreadResponse');

    cy.get(`[data-testid=${folderName}]>a`).click({ force: true });
    // cy.wait('@folderMetaData');
    // cy.wait('@folderThreadResponse');
    // cy.wait('@featureToggle');
    // cy.wait('@mockUser');
  };

  loadDraftMessages = (messagesList = mockDraftMessages) => {
    this.loadFolderMessages('Drafts', -2, 1, messagesList);
  };

  // this method no longer needed as sent folder link was moved to nav-bar
  loadSentMessages = (messagesList = mockSentMessages) => {
    this.loadFolderMessages('Sent', -1, 2, messagesList);
  };

  loadDeletedMessages = (messagesList = mockTrashMessages) => {
    this.loadFolderMessages('Deleted', -3, 3, messagesList);
  };

  verifyFolderHeaderText = text => {
    cy.get(Locators.FOLDERS.FOLDER_HEADER).should('have.text', `${text}`);
  };

  verifyBackToMessagesButton = () => {
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_RECIPIENT, mockRecipients);
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_FOLDER_MESS, mockMessages);

    cy.contains(Data.BACK_TO_MSG)
      .should('be.visible')
      .click({ force: true });
    cy.get(Locators.HEADER).should('contain', Assertions.MESSAGES);
  };

  clickAndNavigateToLastPage = index => {
    cy.get(Locators.ALERTS.PAGIN_LIST)
      .eq(index)
      .click();
  };

  verifyPaginationElements = () => {
    cy.get(Locators.ALERTS.PAGIN_LIST).each(el => {
      cy.wrap(el).should('be.visible');
    });
  };

  backToParentFolder = () => {
    SharedComponents.clickBackBreadcrumb();
  };

  backToInbox = name => {
    cy.get(Locators.LINKS.CRUMB)
      .contains(name)
      .click({ force: true });
  };

  verifyBreadCrumbsLength = num => {
    cy.get(Locators.LINKS.CRUMB).should('have.length', num);
  };

  verifyBreadCrumbText = (index, text) => {
    cy.get(Locators.LINKS.CRUMB_LIST).within(() => {
      cy.get('a')
        .eq(index)
        .should('contain.text', text);
    });
  };

  verifyUrlError = () => {
    cy.visit(`${Paths.UI_MAIN}/dummy`);
    cy.get('[data-testid="secure-messaging"]')
      .find('h1')
      .should('have.text', Alerts.PAGE_NOT_FOUND);
    // // Testing for more than the testId or heading of the PageNotFound
    // //   component is "diving into the details" of the implementation of the
    // //   PageNotFound component. Lean on the component unit specs to handle
    // //   testing these specifics.
    // cy.get('[data-testid="secure-messaging"]')
    //   .find('p')
    //   .should('have.text', Alerts.TRY_SEARCH);
    // cy.get('#mobile-query').should('be.visible');
    // cy.get('input[type="submit"]').should('be.visible');
    // cy.get('#common-questions').should('be.visible');
    // cy.get('#popular-on-vagov').should('be.visible');
  };
}

export default new FolderLoadPage();
