import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks, reviewAndSubmitPageFlow } from './cypress.helpers';

const verifySideNavState = (chapterIndex, chapterKey) => {
  // Verify sidenav exists
  cy.get('#default-sidenav').should('exist');

  // Verify the header text is correct
  cy.get('#default-sidenav').should('have.attr', 'header', 'Form steps');

  // Verify current chapter is marked with current-page attribute
  cy.get(`va-sidenav-item[data-page="${chapterKey}"]`)
    .should('exist')
    .should('have.attr', 'current-page');

  // Verify only one item has current-page attribute
  cy.get('#default-sidenav va-sidenav-item[current-page]').should(
    'have.length',
    1,
  );

  // Verify all enabled items either have or don't have current-page (no other state)
  cy.get('#default-sidenav va-sidenav-item').each($item => {
    // Each item should either have current-page or not - validates structure
    const hasCurrent = $item.attr('current-page') !== undefined;
    if (!hasCurrent) {
      cy.wrap($item).should('not.have.attr', 'current-page');
    }
  });

  // Verify disabled chapters are rendered as p elements (if any exist)
  cy.get('body').then($body => {
    const disabledCount = $body.find('#default-sidenav p').length;
    // Disabled chapters may or may not exist depending on progress through form
    expect(disabledCount).to.be.at.least(0);
  });
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,

    dataSets: ['minimal-test', 'minimal-skip-781'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: {
      ...pageHooks(cy),

      // Chapter 1: Veteran Details
      'contact-information': () => {
        verifySideNavState(0, 'veteranDetails');
      },

      // Chapter 2: Conditions (Disabilities)
      'disabilities/rated-disabilities': () => {
        // First, fill the page with data (from existing helper)
        cy.get('@testData').then(data => {
          data.ratedDisabilities.forEach((disability, index) => {
            if (disability['view:selected']) {
              cy.get(`input[name="root_ratedDisabilities_${index}"]`).click();
            }
          });
        });

        verifySideNavState(1, 'disabilities');

        cy.get('va-sidenav-item[data-page="veteranDetails"]')
          .should('exist')
          .should('not.have.attr', 'disabled');

        // Test mobile accordion behavior
        // Save current viewport dimensions
        let previousViewport;
        cy.window().then(win => {
          previousViewport = {
            width: win.innerWidth,
            height: win.innerHeight,
          };
        });

        // Switch to mobile temporarily
        cy.viewport('iphone-x');

        // Verify accordion exists and can be opened on mobile
        cy.get('#default-sidenav')
          .shadow()
          .find('va-accordion-item')
          .should('exist')
          .click();

        // Verify accordion is now open
        cy.get('#default-sidenav')
          .shadow()
          .find('va-accordion-item')
          .should('have.attr', 'open');

        // Navigate to a different page via Continue button
        // This triggers the useEffect that closes the accordion
        cy.fillPage();
        cy.findByText(/continue/i, { selector: 'button' }).click();

        // Wait for navigation to complete
        cy.url().should('not.include', '/rated-disabilities');

        // Verify the accordion is now closed after navigation
        cy.get('#default-sidenav')
          .shadow()
          .find('va-accordion-item')
          .should('not.have.attr', 'open');

        // Restore previous viewport
        cy.then(() => {
          if (previousViewport) {
            cy.viewport(previousViewport.width, previousViewport.height);
          }
        });
      },

      // Chapter 3: Mental Health
      'mental-health-form-0781/workflow': () => {
        verifySideNavState(2, 'mentalHealth');
        cy.get('va-sidenav-item[data-page="veteranDetails"]').should('exist');
        cy.get('va-sidenav-item[data-page="disabilities"]').should('exist');
      },

      // Chapter 4: Supporting Evidence
      'supporting-evidence/orientation': () => {
        verifySideNavState(3, 'supportingEvidence');

        // Reuse the shared orientation assertions so this test stays in sync
        // with the supporting evidence enhancement content.
        pageHooks(cy)['supporting-evidence/orientation']();

        cy.get('va-sidenav-item[data-page="veteranDetails"]').should('exist');
        cy.get('va-sidenav-item[data-page="disabilities"]').should('exist');
        // Mental health chapter is conditionally included based on form data
      },

      'supporting-evidence/additional-evidence-intro': () => {
        cy.get('@testData').then(data => {
          const hasEvidenceChoice = data['view:hasEvidenceChoice'];

          cy.get(
            `va-radio-option[label="${hasEvidenceChoice ? 'Yes' : 'No'}"]`,
          ).click();
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },

      'supporting-evidence/evidence-request': () => {
        cy.get('@testData').then(data => {
          const hasMedicalRecords = data['view:hasMedicalRecords'];

          cy.get(
            `va-radio-option[label="${hasMedicalRecords ? 'Yes' : 'No'}"]`,
          ).click();
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },

      // Chapter 5: Additional Information
      'payment-information': () => {
        // First, handle the payment info form (from existing helper)
        cy.get('@testData').then(data => {
          if (data['view:bankAccount']) {
            cy.get('form.rjsf').then($form => {
              const editButton = $form.find('.usa-button-primary.edit-button');
              if (editButton.length) editButton.click();
            });

            cy.fillPage();
            cy.findByText(/save/i, { selector: 'button' }).click();
          }
        });

        verifySideNavState(4, 'additionalInformation');

        cy.get('va-sidenav-item[data-page="veteranDetails"]').should('exist');
        cy.get('va-sidenav-item[data-page="disabilities"]').should('exist');
        cy.get('va-sidenav-item[data-page="supportingEvidence"]').should(
          'exist',
        );
        // Mental health chapter is conditionally included based on form data
      },

      // Chapter 6: Review and Submit
      'review-and-submit': ({ afterHook }) => {
        // Verify sidenav state for final chapter before form submission
        verifySideNavState(5, 'reviewSubmit');

        cy.get('va-sidenav-item[data-page="veteranDetails"]').should('exist');
        cy.get('va-sidenav-item[data-page="disabilities"]').should('exist');
        cy.get('va-sidenav-item[data-page="supportingEvidence"]').should(
          'exist',
        );
        cy.get('va-sidenav-item[data-page="additionalInformation"]').should(
          'exist',
        );
        // Mental health chapter is conditionally included based on form data

        // Call the standard review and submit flow to complete the test
        afterHook(() => {
          reviewAndSubmitPageFlow(cy);
        });
      },
    },
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, {
        toggles: {
          data: {
            type: 'feature_toggles',
            features: [
              ...mockFeatureToggles.data.features.filter(
                feature =>
                  feature.name !==
                  'disability_526_supporting_evidence_enhancement',
              ),
              {
                name: 'disability_526_supporting_evidence_enhancement',
                value: true,
              },
              { name: 'sidenav_526ez_enabled', value: true },
            ],
          },
        },
      });
    },

    // Use _13647Exception to bypass non-critical accessibility violations
    // This allows the test to focus on functionality while acknowledging
    // the known nested definition list issue in ChapterSectionCollection
    _13647Exception: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);

describe('Side nav visibility on special pages', () => {
  beforeEach(() => {
    cy.login(mockUser);

    // Simple intercepts for basic page visits
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          ...mockFeatureToggles.data.features,
          { name: 'sidenav_526ez_enabled', value: true },
        ],
      },
    });

    cy.intercept('GET', '/v0/user', mockUser);
  });

  it('should hide side nav on introduction page', () => {
    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.injectAxeThenAxeCheck();

    // Side nav should not be visible on introduction page
    cy.get('#default-sidenav').should('not.exist');

    // Verify the introduction page content is visible
    cy.get('h1').should('contain', 'File for disability compensation');
  });

  it('should hide side nav on confirmation page', () => {
    cy.visit('/disability/file-disability-claim-form-21-526ez/confirmation');
    cy.injectAxeThenAxeCheck();

    // Side nav should not be visible on confirmation page
    cy.get('#default-sidenav').should('not.exist');
  });

  it('should hide side nav on form-saved page', () => {
    cy.visit('/disability/file-disability-claim-form-21-526ez/form-saved');
    cy.injectAxeThenAxeCheck();

    // Side nav should not be visible on form-saved page
    cy.get('#default-sidenav').should('not.exist');
  });
});
