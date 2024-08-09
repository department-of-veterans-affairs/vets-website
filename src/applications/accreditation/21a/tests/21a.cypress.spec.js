import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import {
  selectCheckboxGroupWebComponent,
  selectDropdownWebComponent,
  selectYesNoWebComponent,
} from './helpers';

const selectDropdownHook = (field, dataPath) => ({ afterHook }) => {
  afterHook(() => {
    cy.get('@testData').then(data => {
      cy.fillPage();
      selectDropdownWebComponent(field, dataPath(data));
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  });
};

const selectYesNoHook = (selector, conditions) => ({ afterHook }) => {
  afterHook(() => {
    cy.get('.usa-legend').then($el => {
      const text = $el.text();
      conditions.forEach(condition => {
        if (text.includes(condition.text)) {
          selectYesNoWebComponent(selector, condition.value);
        }
      });
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  });
};

const selectCheckboxGroupHook = field => ({ afterHook }) => {
  afterHook(() => {
    cy.get('@testData').then(data => {
      cy.fillPage;
      selectCheckboxGroupWebComponent(data[`${field}`]);
      cy.findByText(/Continue/i, { selector: 'button' }).click();
    });
  });
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['test-data'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText('Start your application without signing in').click();
        });
      },
      'place-of-birth': selectDropdownHook(
        'placeOfBirth_state',
        data => data.placeOfBirth.state,
      ),
      'home-address': selectDropdownHook(
        'homeAddress_state',
        data => data.homeAddress.state,
      ),
      'work-address': selectDropdownHook(
        'workAddress_state',
        data => data.workAddress.state,
      ),
      'other-address': selectDropdownHook(
        'otherAddress_state',
        data => data.otherAddress.state,
      ),
      'military-service-experiences-summary': selectYesNoHook(
        'view:isAVeteran',
        [
          { text: 'Have you ever served in the military?', value: true },
          {
            text: 'Do you have another military service experience to add?',
            value: false,
          },
        ],
      ),
      'military-service-experiences/0/experience': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            selectDropdownWebComponent(
              'branch',
              data.militaryServiceExperiences[0].branch,
            );
            selectDropdownWebComponent(
              'characterOfDischarge',
              data.militaryServiceExperiences[0].characterOfDischarge,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employers/0/address-phone-number': selectDropdownHook(
        'address_state',
        data => data.employers[0].address.state,
      ),
      'employment-activities': selectCheckboxGroupHook('employmentActivities'),
      'agencies-courts-summary': selectYesNoHook('view:hasAgenciesOrCourts', [
        {
          text:
            'Are you currently permitted to practice before any state or federal agency or any federal court?',
          value: true,
        },
        {
          text: 'Do you have another agency or court to add?',
          value: false,
        },
      ]),
      'court-martial-details': selectDropdownHook(
        'militaryAuthorityAddress_state',
        data => data.militaryAuthorityAddress.state,
      ),
      'character-references/0/address': selectDropdownHook(
        'address_state',
        data => data.characterReferences[0].address.state,
      ),
      'character-references-summary': selectYesNoHook(
        'view:hasCharacterReferences',
        [
          { text: 'You can add 3 more character references.', value: true },
          { text: 'You can add 2 more character references.', value: true },
          { text: 'You can add 1 more character reference.', value: false },
        ],
      ),
      'character-references/1/address': selectDropdownHook(
        'address_state',
        data => data.characterReferences[1].address.state,
      ),
      'character-references/2/address': selectDropdownHook(
        'address_state',
        data => data.characterReferences[2].address.state,
      ),
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#veteran-signature')
            .shadow()
            .find('input')
            .type('First Middle Last');
          cy.get(`va-checkbox[name="veteran-certify"]`)
            .shadow()
            .find('input')
            .check({ force: true });
          cy.findByText(/Submit/i, { selector: 'button' }).click();
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: '21a',
              value: true,
            },
          ],
        },
      });
      cy.intercept('POST', formConfig.submitUrl, {
        confirmationNumber: '48fac28c-b332-4549-a45b-3423297111f4',
      });
    },

    // TODO: Remove this skip when the form has a content page in prod
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
