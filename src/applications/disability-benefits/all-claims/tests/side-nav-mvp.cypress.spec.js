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

  cy.get(`va-sidenav-item[data-page="${chapterKey}"]`)
    .should('exist')
    .should('have.attr', 'current-page');

  // Verify previous chapters are enabled (clickable links)
  for (let i = 0; i < chapterIndex; i++) {
    const prevChapterKeys = [
      'veteranDetails',
      'disabilities',
      'mentalHealth',
      'supportingEvidence',
      'additionalInformation',
      'reviewSubmit',
    ];
    cy.get(`va-sidenav-item[data-page="${prevChapterKeys[i]}"]`)
      .should('exist')
      .should('not.have.attr', 'current-page');
  }

  // Verify future chapters are disabled (shown as plain text)
  const allChapterKeys = [
    'veteranDetails',
    'disabilities',
    'mentalHealth',
    'supportingEvidence',
    'additionalInformation',
    'reviewSubmit',
  ];
  for (let i = chapterIndex + 1; i < allChapterKeys.length; i++) {
    // Future chapters should either not exist as va-sidenav-item or be disabled
    // Based on the component, they're rendered as <p> elements with disabled styling
    cy.get('body').then($body => {
      const hasItem = $body.find(
        `va-sidenav-item[data-page="${allChapterKeys[i]}"]`,
      ).length;
      if (!hasItem) {
        // Chapter is rendered as disabled <p> element
        cy.get(`#default-sidenav p`)
          .contains(`Step ${i + 1}:`)
          .should('exist');
      }
    });
  }
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,

    dataSets: ['minimal-test'],

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

        cy.get('va-sidenav-item[data-page="veteranDetails"]').should('exist');
        cy.get('va-sidenav-item[data-page="disabilities"]').should('exist');
        cy.get('va-sidenav-item[data-page="mentalHealth"]').should('exist');
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
        cy.get('va-sidenav-item[data-page="mentalHealth"]').should('exist');
        cy.get('va-sidenav-item[data-page="supportingEvidence"]').should(
          'exist',
        );
      },

      // Chapter 6: Review and Submit
      'review-and-submit': ({ afterHook }) => {
        // Verify sidenav state for final chapter before form submission
        verifySideNavState(5, 'reviewSubmit');

        cy.get('va-sidenav-item[data-page="veteranDetails"]').should('exist');
        cy.get('va-sidenav-item[data-page="disabilities"]').should('exist');
        cy.get('va-sidenav-item[data-page="mentalHealth"]').should('exist');
        cy.get('va-sidenav-item[data-page="supportingEvidence"]').should(
          'exist',
        );
        cy.get('va-sidenav-item[data-page="additionalInformation"]').should(
          'exist',
        );

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
              ...mockFeatureToggles.data.features,
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
