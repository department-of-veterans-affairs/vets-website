import path from 'path';
import { Validator } from 'jsonschema';

import caregiversSchema from 'vets-json-schema/dist/10-10CG-schema.json';

import formConfig from 'applications/caregivers/config/form';
import manifest from 'applications/caregivers/manifest.json';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import featureToggles from '../../e2e/fixtures/mocks/feature-toggles.json';
import mockUpload from '../../e2e/fixtures/mocks/mock-upload.json';
import formSubmit from '../../e2e/fixtures/mocks/form-submission.json';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import {
  veteranLabel,
  primaryLabel,
  secondaryOneLabel,
  secondaryTwoLabel,
} from 'applications/caregivers/definitions/content';

const signAsParty = (partyLabel, signature) => {
  cy.findByTestId(partyLabel)
    .find('input')
    .first()
    .type(signature);

  cy.findByTestId(partyLabel)
    .find('[type="checkbox"]')
    .check();
};

const testSecondaryTwo = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['twoSecondaryCaregivers'],
    fixtures: {
      data: path.join(__dirname, 'data'),
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', 'v0/form1010cg/attachments', mockUpload);
      cy.intercept('POST', '/v0/caregivers_assistance_claims', req => {
        const data = JSON.parse(req.body.caregiversAssistanceClaim.form);
        const validator = new Validator();

        const result = validator.validate(data, caregiversSchema);
        if (!result.valid) {
          req.reply({
            statusCode: 422,
          });
        }
        expect(result.valid).to.be.true;
        req.reply(formSubmit);
      });
    },
    pageHooks: {
      introduction: () => {
        // Hit the start button
        cy.findAllByText(/start/i, { selector: 'a' })
          .first()
          .click();
      },
      'review-and-submit': () => {
        signAsParty(veteranLabel, 'Micky Mouse');

        signAsParty(primaryLabel, 'Mini Mouse');

        signAsParty(secondaryOneLabel, 'George Geef Goofus');

        signAsParty(secondaryTwoLabel, 'Donald Duck');
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testSecondaryTwo);
