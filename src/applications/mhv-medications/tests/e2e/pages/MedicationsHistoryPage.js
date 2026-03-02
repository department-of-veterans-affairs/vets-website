import { medicationsUrls } from '../../../util/constants';
import allergies from '../fixtures/allergies.json';
import rxList from '../fixtures/listOfPrescriptions.json';

class MedicationsHistoryPage {
  visitPage = () => {
    cy.visit(medicationsUrls.MEDICATIONS_HISTORY);
  };

  visitPageWithPrescriptions = (medications = rxList) => {
    cy.intercept('GET', '/my_health/v1/prescriptions?*', medications).as(
      'prescriptionsList',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergies');
    cy.visit(medicationsUrls.MEDICATIONS_HISTORY);
  };

  visitPageWithApiError = () => {
    cy.intercept('GET', '/my_health/v1/prescriptions?*', {
      statusCode: 500,
      body: {
        errors: [
          {
            title: 'Internal Server Error',
            detail: 'An error occurred while processing your request.',
            status: '500',
          },
        ],
      },
    }).as('prescriptionsError');
    cy.visit(medicationsUrls.MEDICATIONS_HISTORY);
    cy.wait('@prescriptionsError');
  };

  visitPageWithEmptyList = () => {
    cy.intercept('GET', '/my_health/v1/prescriptions?*', {
      data: [],
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 10,
          totalPages: 0,
          totalEntries: 0,
        },
        filterCount: {},
      },
    }).as('emptyPrescriptions');
    cy.visit(medicationsUrls.MEDICATIONS_HISTORY);
  };

  verifyHeading = () => {
    cy.findByTestId('medication-history-heading').should(
      'have.text',
      'Medication history',
    );
  };

  verifyHeadingFocused = () => {
    cy.get('h1').should('be.focused');
  };

  verifyInProgressLink = () => {
    cy.get('a[href$="/in-progress"]').should(
      'contain',
      'Go to your in-progress medications',
    );
  };

  verifyRefillLink = () => {
    cy.get('a[href$="/refill"]').should('contain', 'Refill medications');
  };

  verifyLoadingIndicator = () => {
    cy.findByTestId('loading-indicator').should('exist');
  };

  verifyMedicationsListVisible = () => {
    cy.findByTestId('medication-list').should('exist');
  };

  verifyMedicationCardVisible = () => {
    cy.get('[data-testid="medications-history-details-link"]')
      .first()
      .should('exist');
  };

  verifySortDropdownVisible = () => {
    cy.findByTestId('sort-dropdown').should('exist');
  };

  verifyApiErrorNotification = () => {
    cy.get('[data-testid="api-error-notification"]').should('be.visible');
  };

  verifyEmptyListMessage = () => {
    cy.contains(
      'You don’t have any VA prescriptions or medication records',
    ).should('be.visible');
  };

  verifyNeedHelpSection = () => {
    cy.findByTestId('rx-need-help-container').should('exist');
  };

  verifyNeedHelpAllergiesLink = () => {
    cy.findByTestId('go-to-allergies-and-reactions-link').should('exist');
  };

  verifyNeedHelpSeiLink = () => {
    cy.findByTestId('go-to-self-entered-health-information-link').should(
      'exist',
    );
  };

  verifyNeedHelpManagingMedsLink = () => {
    cy.findByTestId('learn-more-about-managing-medications-online-link').should(
      'exist',
    );
  };

  verifyNeedHelpMessageLink = () => {
    cy.findByTestId('start-a-new-message-link').should('exist');
  };

  verifyNeedHelpNotificationSettingsLink = () => {
    cy.findByTestId('go-to-update-notification-settings-link').should('exist');
  };

  verifyPaginationExists = () => {
    cy.get('#pagination').should('exist');
  };

  verifyPageTotalInfo = (start, end, total) => {
    cy.findByTestId('page-total-info').should(
      'contain',
      `Showing ${start} - ${end} of ${total}`,
    );
  };

  selectSortOption = text => {
    cy.findByTestId('sort-dropdown')
      .find('#options')
      .select(text, {
        force: true,
      });
  };
}

export default MedicationsHistoryPage;
