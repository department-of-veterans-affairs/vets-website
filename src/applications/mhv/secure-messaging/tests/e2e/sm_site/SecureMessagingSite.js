import mockUser from '../fixtures/userResponse/user.json';
import mockNonSMUser from '../fixtures/non_sm_user.json';
import mockStatus from '../fixtures/profile-status.json';
import vamcUser from '../fixtures/vamc-ehr.json';
import mockToggles from '../fixtures/toggles-response.json';
import mockFacilities from '../fixtures/facilityResponse/facilities-no-cerner.json';

class SecureMessagingSite {
  login = (
    isSMUser = true,
    user = mockUser,
    userFacilities = mockFacilities,
  ) => {
    if (isSMUser === true) {
      cy.login();
      window.localStorage.setItem('isLoggedIn', true);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
      cy.intercept('GET', '/v0/user', user).as('mockUser');
      cy.intercept('GET', '/v0/user_transition_availabilities', user);
      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/feature_toggles?*', mockToggles).as(
        'featureToggle',
      );
      const facilityIDs = [];
      const objectIDs = [];
      for (
        let i = 0;
        i < user.data.attributes.vaProfile.facilities.length;
        i += 1
      ) {
        const obj = user.data.attributes.vaProfile.facilities[i];
        facilityIDs.push(`vha_${obj.facilityId}`);
        objectIDs.push('[object%20Object]');
      }

      cy.intercept(
        'GET',
        `/v1/facilities/va?ids=${facilityIDs.join(',')}`,
        userFacilities,
      ).as('facilities');

      cy.intercept(
        'GET',
        `v1/facilities/va?ids=${objectIDs.join(',')}`,
        userFacilities,
      ).as('facilitiesSet');
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
    cy.get('va-pagination')
      .shadow()
      .find('button:contains("Next")')
      .click();
    cy.wait(`@inboxMessagesessages${interceptedPage}`);
  };

  loadVAPaginationPreviousMessages = (interceptedPage = 1, mockMessages) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/0/threads?pageSize=10&pageNumber=${interceptedPage}&sortField=SENT_DATE&sortOrder=DESC`,
      mockMessages,
    ).as(`inboxMessagesessages${interceptedPage}`);
    cy.get('va-pagination')
      .shadow()
      .find('button:contains("Previous")')
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
      cy.get('va-pagination')
        .shadow()
        .find('button:contains("1")')
        .click();
    } else {
      cy.get('va-pagination')
        .shadow()
        .find(`button:contains("${interceptedPage}")`)
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
