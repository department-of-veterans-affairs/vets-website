import mockUser from '../fixtures/user.json';
import mockNonSMUser from '../fixtures/non_sm_user.json';
import mockStatus from '../fixtures/profile-status.json';
import vamcUser from '../fixtures/vamc-ehr.json';
import mockToggles from '../fixtures/toggles-response.json';

class SecureMessagingSite {
  login = (isSMUser = true) => {
    if (isSMUser) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      cy.intercept('GET', '/v0/user', mockUser).as('mockUser');
      cy.intercept('GET', '/v0/user_transition_availabilities', mockUser);
      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/feature_toggles?*', mockToggles).as(
        'featureToggle',
      );
    } else {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      cy.intercept('GET', '/v0/user', mockNonSMUser).as('mockUser');
      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/user_transition_availabilities', {
        statusCode: 200,
      });
      cy.intercept('GET', '/v0/feature_toggles?*', mockToggles).as(
        'featureToggle',
      );
    }
  };

  loadPageUnauthenticated = () => {
    cy.visit('my-health/secure-messages/');
    cy.wait('@mockUser');
  };

  loadVAPaginationNextMessages = (interceptedPage = 1, mockMessages) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/0/threads?pageSize=10&pageNumber=${interceptedPage}&sortField=SENT_DATE&sortOrder=DESC`,
      mockMessages,
    ).as(`inboxMessagesessages${interceptedPage}`);
    cy.get('[aria-label="Pagination"]')
      .shadow()
      .find('[aria-label="Next page"')
      .click();
    cy.wait(`@inboxMessagesessages${interceptedPage}`);
  };

  loadVAPaginationPreviousMessages = (interceptedPage = 1, mockMessages) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/0/threads?pageSize=10&pageNumber=${interceptedPage}&sortField=SENT_DATE&sortOrder=DESC`,
      mockMessages,
    ).as(`inboxMessagesessages${interceptedPage}`);
    cy.get('[aria-label="Pagination"]')
      .shadow()
      .find('[aria-label="Previous page"')
      .click();
    cy.wait(`@inboxMessagesessages${interceptedPage}`);
  };

  loadVAPaginationPageMessages = (interceptedPage = 1, mockMessages) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/0/threads?pageSize=10&pageNumber=${interceptedPage}&sortField=SENT_DATE&sortOrder=DESC`,
      mockMessages,
    ).as(`inboxMessagesessages${interceptedPage}`);
    if (interceptedPage === 1) {
      cy.get('[aria-label="Pagination"]')
        .shadow()
        .find('[aria-label="Page 1, first page"]')
        .click();
    } else {
      cy.get('[aria-label="Pagination"]')
        .shadow()
        .find(`[aria-label="Page ${interceptedPage}"]`)
        .click();
    }
    cy.wait(`@inboxMessagesessages${interceptedPage}`);
  };

  verifyPaginationMessagesDisplayed = (
    displayedStartNumber,
    displayedEndNumber,
    threadLength,
  ) => {
    cy.get('[data-testid="displaying-number-of-threads"]').should(
      'have.text',
      `Showing ${displayedStartNumber} to ${displayedEndNumber} of ${threadLength} conversations sorted by Newest to oldest`,
    );
  };
}

export default SecureMessagingSite;
