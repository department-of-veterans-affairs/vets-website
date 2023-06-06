import path from 'path';
import featureTogglesEnabled from './fixtures/toggle-covid-feature.json';

describe('COVID-19 Research Form', () => {
  describe('when entering valid information and submitting', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', featureTogglesEnabled).as(
        'feature',
      );
      cy.visit('coronavirus-research/volunteer/update/update-form?id=abc123');
      cy.injectAxe();
    });

    // Skipping tests until routing is in place
    it('should load form page', () => {
      cy.url().should('include', 'coronavirus-research/volunteer/update');
      cy.axeCheck();
      cy.get('h1').contains(
        'Coronavirus research volunteer list survey update',
      );
      cy.axeCheck();
    });

    it('should successfully submit the Covid Research form', () => {
      cy.fixture(
        path.join(__dirname, 'fixtures', 'reviewAndSubmitData.json'),
      ).then(dataElements => {
        dataElements.values.forEach(element => {
          switch (element.type) {
            case 'radio':
            case 'select':
              cy.get(`#${element.labelId}`).contains(element.labelName);
              element.fieldId.split('|').forEach(id => {
                cy.get(`#${id}`).check();
              });
              break;
            case 'dropDown':
              cy.get(`#${element.fieldId}`).select(element.fieldName);
              break;
            case 'text':
              cy.get(`#${element.fieldId}`).type(element.fieldName);
              break;
            default:
              break;
          }
        });
      });

      cy.axeCheck();
      cy.get('.usa-button-primary').contains('Continue');
      cy.get('.usa-button-primary').click();

      // Review Page
      cy.url().should(
        'include',
        'coronavirus-research/volunteer/update/review-and-submit',
      );
      cy.expandAccordions();
      cy.get('h1').contains(
        'Coronavirus research volunteer list survey update',
      );
      cy.axeCheck();

      // Confirm review fields are as expected based on test data
      cy.fixture(
        path.join(__dirname, 'fixtures', 'reviewAndSubmitData.json'),
      ).then(dataElements => {
        dataElements.values.forEach(element => {
          if (element.labelName !== undefined) {
            const displayLabel =
              element.reviewLabelName !== undefined
                ? element.reviewLabelName
                : element.labelName;

            // Handle multiple Select entries that will have identical reviewLabelName but uniqe fieldNames
            if (element.fieldName.includes('|')) {
              element.fieldName.split('|').forEach(name => {
                cy.get('dd')
                  .contains(name)
                  .prev('dt')
                  .contains(displayLabel);
              });
            } else {
              cy.get('dt')
                .contains(displayLabel)
                .next('dd')
                .contains(element.fieldName);
            }
          }
        });
      });

      cy.get('[name="consentAgreementAccepted"]')
        .find('[type="checkbox"]')
        .check({
          force: true,
        });

      cy.intercept('POST', '**/covid-research/volunteer/update', {
        status: 200,
      }).as('response');

      cy.get('.usa-button-primary').contains('Submit volunteer form');
      cy.get('.usa-button-primary').click();
      cy.wait('@response');

      // Confirmation page
      cy.url().should(
        'include',
        'coronavirus-research/volunteer/update/confirmation',
      );
      cy.axeCheck();

      cy.get('.confirmation-page-title').contains(
        'Thank you for signing up for our coronavirus research volunteer list',
      );

      cy.get('h2').contains(
        'If we think you may be eligible for one of our research studies',
      );
      cy.get('h2').contains(
        'If we don’t think you may be eligible for any studies',
      );
      cy.get('h2').contains(
        'If you have questions or would like us to remove you from the volunteer list',
      );

      cy.get('a').contains('research@va.gov');
      cy.axeCheck();
    });
  });
});
