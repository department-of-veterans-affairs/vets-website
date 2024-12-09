import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import user from './fixtures/mocks/user.json';
import inProgressForm from './fixtures/mocks/in-progress-form.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
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
      cy.fillPage();
      selectCheckboxGroupWebComponent(data[`${field}`]);
      cy.findByText(/Continue/i, { selector: 'button' }).click();
    });
  });
};

const vamcUser = {
  data: {
    nodeQuery: {
      count: 0,
      entities: [],
    },
  },
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'mocks'),
    dataSets: ['test-data'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText('Start your Application').click();
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
      'military-service-experiences/0/branch-date-range': selectDropdownHook(
        'branch',
        data => data.militaryServiceExperiences[0].branch,
      ),
      'military-service-experiences/0/discharge-character': selectDropdownHook(
        'characterOfDischarge',
        data => data.militaryServiceExperiences[0].characterOfDischarge,
      ),
      'employment-status': selectCheckboxGroupHook('employmentStatus'),
      'employers/0/address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            selectDropdownWebComponent(
              'address_state',
              data.employers[0].address.state,
            );
            selectCheckboxGroupWebComponent(
              data.employers[0].primaryWorkAddress,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'employment-activities': selectCheckboxGroupHook('employmentActivities'),
      'educational-institutions/0/address': selectDropdownHook(
        'address_state',
        data => data.educationalInstitutions[0].address.state,
      ),
      'educational-institutions/0/degree-information': selectDropdownHook(
        'degree',
        data => data.educationalInstitutions[0].degree,
      ),
      jurisdictions: selectDropdownHook(
        'jurisdiction',
        data => data.jurisdiction,
      ),
      'jurisdictions-summary': selectYesNoHook('view:hasJurisdictions', [
        {
          text:
            'Are you currently admitted to practice before any jurisdictions?',
          value: true,
        },
        {
          text: 'Do you have another jurisdiction to add?',
          value: false,
        },
      ]),
      'agencies-courts': selectDropdownHook(
        'agencyOrCourt',
        data => data.agencyOrCourt,
      ),
      'agencies-courts-summary': selectYesNoHook('view:hasAgenciesOrCourts', [
        {
          text:
            'Are you currently admitted to practice before any state or Federal agency or any Federal court?',
          value: true,
        },
        {
          text: 'Do you have another state or Federal agency or court to add?',
          value: false,
        },
      ]),
      'conviction-details': selectCheckboxGroupHook(
        'convictionDetailsCertification',
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
              name: 'accredited_representative_portal_frontend',
              value: true,
            },
          ],
        },
      });
      cy.intercept('POST', formConfig.submitUrl, {
        confirmationNumber: '48fac28c-b332-4549-a45b-3423297111f4',
      });
      cy.intercept('GET', '/accredited_representative_portal/v0/user', {
        statusCode: 200,
        body: user,
      }).as('fetchUser');
      cy.intercept(
        'PUT',
        '/accredited_representative_portal/v0/in_progress_forms/21a',
        inProgressForm,
      );
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
    },
  },
  manifest,
  formConfig,
);

/**
 * TODO: Seems test is flaky, particularly:
 *   https://github.com/department-of-veterans-affairs/vets-website/actions/runs/11914754010/job/33204259093
 */
testForm({ ...testConfig, skip: true });
