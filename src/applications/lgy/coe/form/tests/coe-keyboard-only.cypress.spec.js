import formConfig from '../config/form';

import mockPrefill from './fixtures/mocks/prefill.json';
import mockProgress from './fixtures/mocks/in-progress-forms.json';
import mockUser from './fixtures/mocks/user.json';
import mockStatus from './fixtures/mocks/status.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import data from './fixtures/data/maximal-test.json';

describe('Certificate of Eligibility keyboard only navigation', () => {
  it('should navigate through a maximal form', () => {
    cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
    cy.intercept('GET', 'v0/in_progress_forms/26-1880', mockPrefill);
    cy.intercept('PUT', 'v0/in_progress_forms/26-1880', mockProgress);
    cy.intercept('GET', '/v0/coe/status', mockStatus);
    cy.intercept('POST', formConfig.submitUrl, { status: 200 });

    cy.login(mockUser);

    const { chapters } = formConfig;
    cy.visit('/housing-assistance/home-loans/request-coe-form-26-1880');
    cy.injectAxeThenAxeCheck();

    // Intro page
    cy.tabToStartForm();

    // Veteran personal info
    cy.url().should(
      'include',
      chapters.applicantInformationChapter.pages.applicantInformationSummary
        .path,
    );
    cy.typeInFullName('root_fullName', data.fullName);
    cy.typeInDate('root_dateOfBirth', data.dateOfBirth);
    cy.tabToContinueForm();

    // Contact info
    cy.url().should(
      'include',
      chapters.contactInformationChapter.pages.mailingAddress.path,
    );
    cy.typeInIfDataExists(
      '#root_applicantAddress_street',
      data.applicantAddress.street,
    );
    cy.typeInIfDataExists(
      '#root_applicantAddress_street2',
      data.applicantAddress.street2,
    );
    cy.typeInIfDataExists(
      '#root_applicantAddress_city',
      data.applicantAddress.city,
    );
    cy.tabToElement('#root_applicantAddress_state');
    cy.chooseSelectOptionUsingValue(data.applicantAddress.state);
    cy.typeInIfDataExists(
      '#root_applicantAddress_postalCode',
      data.applicantAddress.postalCode,
    );
    cy.tabToContinueForm();

    // Additional contact info
    cy.url().should(
      'include',
      chapters.contactInformationChapter.pages.additionalInformation.path,
    );
    cy.typeInIfDataExists('#root_contactPhone', data.contactPhone);
    cy.typeInIfDataExists('#root_contactEmail', data.contactEmail);
    cy.tabToContinueForm();

    // Service status
    cy.url().should(
      'include',
      chapters.serviceHistoryChapter.pages.serviceStatus.path,
    );
    cy.tabToElement('input[name="root_identity"]');
    cy.chooseRadio(data.identity);
    cy.tabToContinueForm();

    // Service history
    cy.url().should(
      'include',
      chapters.serviceHistoryChapter.pages.serviceHistory.path,
    );
    const toursLength = data.periodsOfService.length;
    data.periodsOfService.forEach((period, index) => {
      const branchSelector = `#root_periodsOfService_${index}_serviceBranch`;
      if (index < toursLength) {
        cy.get(':focus').then($el => {
          // service branch is focused when add another button is activated
          if (!$el.is(branchSelector)) {
            cy.tabToElement(
              branchSelector,
              index === 0, // forward or backward
              true, // exists?
            );
          }
          cy.findSelectOptionByTyping(period.serviceBranch);
          cy.typeInDate(
            `root_periodsOfService_${index}_dateRange_from`,
            data.periodsOfService[index].dateRange.from,
          );
          cy.typeInDate(
            `root_periodsOfService_${index}_dateRange_to`,
            data.periodsOfService[index].dateRange.to,
          );
          if (index + 1 < toursLength) {
            cy.tabToElement('.va-growable-add-btn');
            cy.realPress('Space');
          }
        });
      }
    });
    cy.tabToContinueForm();

    // Loan history
    cy.url().should('include', chapters.loansChapter.pages.loanScreener.path);
    cy.tabToElement('[name="root_vaLoanIndicator"]');
    cy.chooseRadio(data.vaLoanIndicator ? 'Y' : 'N');
    cy.tabToContinueForm();

    // Loan history
    // Only adding one loan because tabbing takes a lot of time
    cy.url().should('include', chapters.loansChapter.pages.loanHistory.path);
    if (data.relevantPriorLoans.length) {
      const index = 0;
      const root = `root_relevantPriorLoans_${index}_`;
      const firstLoan = data.relevantPriorLoans?.[index];

      const from = firstLoan.dateRange.from
        .split('-')
        .map(v => parseInt(v, 10).toString());

      cy.tabToElement(`#${root}dateRange_fromMonth`);
      cy.chooseSelectOptionUsingValue(from[1]);
      cy.tabToElement(`input[name="${root}dateRange_fromYear"]`);
      cy.typeInFocused(from[0]);

      const to = firstLoan.dateRange.to
        .split('-')
        .map(v => parseInt(v, 10).toString());
      cy.tabToElement(`#${root}dateRange_toMonth`);
      cy.chooseSelectOptionUsingValue(to[1]);
      cy.tabToElement(`input[name="${root}dateRange_toYear"]`);
      cy.typeInFocused(to[0]);

      cy.typeInIfDataExists(
        `#${root}propertyAddress_propertyAddress1`,
        firstLoan.propertyAddress.propertyAddress1,
      );
      cy.typeInIfDataExists(
        `#${root}propertyAddress_propertyAddress2`,
        firstLoan.propertyAddress.propertyAddress2,
      );
      cy.typeInIfDataExists(
        `#${root}propertyAddress_propertyCity`,
        firstLoan.propertyAddress.propertyCity,
      );
      cy.tabToElement(`#${root}propertyAddress_propertyState`);
      cy.chooseSelectOptionUsingValue(firstLoan.propertyAddress.propertyState);
      cy.typeInIfDataExists(
        `#${root}propertyAddress_propertyZip`,
        firstLoan.propertyAddress.propertyZip,
      );

      cy.typeInIfDataExists(`#${root}vaLoanNumber`, firstLoan.vaLoanNumber);
      cy.tabToElement(`[name="${root}propertyOwned"]`);
      cy.chooseRadio(firstLoan.propertyOwned ? 'Y' : 'N');

      if (firstLoan.propertyOwned) {
        cy.tabToElement(`[name="${root}intent"]`);
        cy.chooseRadio(firstLoan.intent);
      }
    }

    cy.tabToContinueForm();

    // Upload supporting docs
    // TODO: Figure out how to test keyboard only uploads
    cy.tabToContinueForm();

    // Review & submit page
    cy.url().should('include', 'review-and-submit');
    cy.tabToElement('input[type="checkbox"]');
    cy.realPress('Space');
    cy.tabToSubmitForm();

    // Check confirmation page print button
    cy.url().should('include', 'confirmation');
    cy.get('button.screen-only').should('exist');
  });
});
