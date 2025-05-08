import path from 'path';

import testForm from '@department-of-veterans-affairs/platform-testing/form-tester';
import { createTestConfig } from '@department-of-veterans-affairs/platform-testing/form-tester/utilities';

import formConfig from '../../form/form';
import manifest from '../../manifest.json';

import mockUser from './fixtures/mocks/mockUser.json';
import inProgressForms from './fixtures/mocks/in-progress-forms.json';

// `appName`, `arrayPages`, and `rootUrl` don't need to be explicitly defined.
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['prefill'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    pageHooks: {
      introduction: () => {
        cy.findAllByText(/get started/i)
          .first()
          .click();
      },
    },
    skip: true,
    setupPerTest: () => {
      cy.login(mockUser);

      cy.intercept('PUT', '/v0/in_progress_forms/0873', inProgressForms);

      cy.get('@testData').then(_data => {
        cy.intercept('GET', 'v0/in_progress_forms/0873', {
          formData: {
            fullName: {
              first: 'Terrence',
              middle: 'Faustino',
              last: 'Montgomery',
            },
            email: 'myemail65825144@unattended.com',
            phone: '9898989898',
            address: {
              street: '99 Madison Ave',
              street2: 'Fl 20',
              city: 'New York',
              state: 'NY',
              country: 'USA',
              postalCode: '10016',
            },
            veteranServiceInformation: {
              dateOfBirth: '1969-06-11',
              socialSecurityNumber: '796321635',
              branchOfService: 'Army',
              serviceDateRange: { from: '1999-09-29', to: '2008-10-27' },
            },
          },
          metadata: { version: 0, prefill: true, returnUrl: '/topic' },
        });
      });

      cy.intercept('POST', '/v0/contact-us/inquiries', {
        statusCode: 200,
        response: {
          confirmationNumber: '000123456000A',
          dateSubmitted: '10-30-2020',
        },
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
