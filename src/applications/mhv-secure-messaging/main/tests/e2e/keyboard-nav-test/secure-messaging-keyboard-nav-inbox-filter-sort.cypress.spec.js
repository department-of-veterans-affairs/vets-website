import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';

describe('Keyboard Navigation for Filter & Sort functionalities', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const filteredData = {
    data: inboxFilterResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('test'),
    ),
  };

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });

  it('Verify filter works correctly', () => {
    landingPage.inputFilterDataByKeyboard('test');
    landingPage.submitFilerByKeyboard(filteredData);
    landingPage.verifyFilterResults('test', filteredData);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    landingPage.inputFilterDataByKeyboard('test');
    landingPage.submitFilerByKeyboard(filteredData);
    landingPage.clearFilterByKeyboard();
    landingPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const testData = { ...inboxFilterResponse };

    testData.data.sort(
      (a, b) =>
        new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
    );

    // TODO wrap below to method

    // landingPage.verifySorting();

    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        cy.get(Locators.DROPDOWN)
          .shadow()
          .find('select')
          .select(`Oldest to newest`, { force: true });

        cy.intercept(
          'GET',
          `${Paths.INTERCEPT.MESSAGE_FOLDERS}/0/threads**`,
          testData,
        );
        cy.tabToElement('[data-testid="sort-button"]');
        cy.realPress('Enter');
        // cy.get(Locators.BUTTONS.SORT).click({ force: true });

        cy.get(Locators.THREAD_LIST)
          .find(Locators.DATE_RECEIVED)
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting${JSON.stringify(listAfter)}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
