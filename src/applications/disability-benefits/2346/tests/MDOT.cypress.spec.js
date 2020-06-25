import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const dataSetToUserMap = {
  happyPath: 'fx:users/gregUserData',
  noTempAddress: 'fx:users/markUserData',
  noBatteries: 'fx:users/jerryUserData',
  noAccessories: 'fx:users/eddieUserData',
  noItemsEligible: 'fx:users/paulineUserData',
};

const happyPathPageHooks = {
  introduction: () => {
    cy.findAllByText(/order/i, { selector: 'button' })
      .first()
      .click();
  },

  address: () => {
    cy.findAllByText('Edit permanent address', { selector: 'button' })
      .first()
      .click();
    cy.findByLabelText(/Country/i).select('Canada');
    cy.findByLabelText(/Province/i).type('Alberta');
    cy.findByLabelText(/International Postal Code/i).type('T7N');
    cy.findByText(/Save permanent address/i).click();
    cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
    cy.findByText(/Continue/i).click();
  },

  supplies: () => {
    cy.get('#1').click();
    cy.get('#3').click();
    cy.get('#5').click();
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  },
};

const noTempAddressPageHooks = {
  introduction: () => {
    cy.findAllByText(/order/i, { selector: 'button' })
      .first()
      .click();
  },

  address: () => {
    cy.findAllByText('Add a temporary address', { selector: 'button' })
      .first()
      .click();
    cy.findByLabelText(/Country/i).select('Canada');
    cy.findByLabelText(/Street address/i).type('205 Test Lane');
    cy.findByLabelText(/City/i).type('Calgary');
    cy.findByLabelText(/Province/i).type('Alberta');
    cy.findByLabelText(/International Postal Code/i).type('T7N');
    cy.findByText(/Save temporary address/i).click();
    cy.findAllByLabelText(/Email address/i)
      .first()
      .type('vet@vet.com');
    cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
    cy.findByText(/Continue/i).click();
  },

  supplies: () => {
    cy.get('#1').click();
    cy.get('#3').click();
    cy.get('#5').click();
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  },
};

const noBatteriesPageHooks = {
  introduction: () => {
    cy.findAllByText(/order/i, { selector: 'button' })
      .first()
      .click();
  },

  address: () => {
    cy.findAllByText('Edit permanent address', { selector: 'button' })
      .first()
      .click();
    cy.findByLabelText(/Country/i).select('Canada');
    cy.findByLabelText(/Province/i).type('Alberta');
    cy.findByLabelText(/International Postal Code/i).type('T7N');
    cy.findByText(/Save permanent address/i).click();
    cy.findAllByLabelText(/Email address/i)
      .first()
      .type('vet@vet.com');
    cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
    cy.findByText(/Continue/i).click();
  },

  supplies: () => {
    cy.get('#3').click();
    cy.get('#5').click();
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  },
};

const noAccessoriesPageHooks = {
  introduction: () => {
    cy.findAllByText(/order/i, { selector: 'button' })
      .first()
      .click();
  },

  address: () => {
    cy.findAllByText('Edit permanent address', { selector: 'button' })
      .first()
      .click();
    cy.findByLabelText(/Country/i).select('Canada');
    cy.findByLabelText(/Province/i).type('Alberta');
    cy.findByLabelText(/International Postal Code/i).type('T7N');
    cy.findByText(/Save permanent address/i).click();
    cy.findAllByLabelText(/Email address/i)
      .first()
      .type('vet@vet.com');
    cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
    cy.findByText(/Continue/i).click();
  },

  supplies: () => {
    cy.get('#1').click();
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  },
};

const noItemsEligiblePageHooks = {
  introduction: () => {
    cy.findAllByText(/order/i, { selector: 'button' })
      .first()
      .click();
  },

  address: () => {
    cy.findAllByText('Edit permanent address', { selector: 'button' })
      .first()
      .click();
    cy.findByLabelText(/Country/i).select('Canada');
    cy.findByLabelText(/Province/i).type('Alberta');
    cy.findByLabelText(/International Postal Code/i).type('T7N');
    cy.findByText(/Save permanent address/i).click();
    cy.findAllByLabelText(/Email address/i)
      .first()
      .type('vet@vet.com');
    cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
    cy.findByText(/Continue/i).click();
  },

  supplies: () => {
    cy.findAllByText(/Continue/i, { selector: 'button' })
      .first()
      .click();
  },
};

// let pageHooksData = {};

// const getPageHookData = () => {
//   cy.get('@testKey').then(testKey => {
//     switch (testKey) {
//       case 'happyPath':
//         pageHooksData = happyPathPageHooks;
//         break;
//       case 'noTempAddress':
//         pageHooksData = noTempAddressPageHooks;
//         break;
//       case 'noBatteries':
//         pageHooksData = noBatteriesPageHooks;
//         break;
//       case 'noAccessories':
//         pageHooksData = noAccessoriesPageHooks;
//         break;
//       case 'noItemsEligible':
//         pageHooksData = noItemsEligiblePageHooks;
//         break;
//       default:
//         break;
//     }
//     return pageHooksData;
//   });
// };

const testConfig = createTestConfig(
  {
    dataPrefix: 'testData',

    dataSets: [
      'happyPath',
      'noTempAddress',
      'noBatteries',
      'noAccessories',
      'noItemsEligible',
    ],

    fixtures: {
      data: path.join(__dirname, 'data'),
      users: path.join(__dirname, 'data/users'),
    },

    pageHooks: () => {
      let pageHooksData;
      cy.wrap(
        cy.get('@testKey').then(testKey => {
          switch (testKey) {
            case 'happyPath':
              pageHooksData = happyPathPageHooks;
              break;
            case 'noTempAddress':
              pageHooksData = noTempAddressPageHooks;
              break;
            case 'noBatteries':
              pageHooksData = noBatteriesPageHooks;
              break;
            case 'noAccessories':
              pageHooksData = noAccessoriesPageHooks;
              break;
            case 'noItemsEligible':
              pageHooksData = noItemsEligiblePageHooks;
              break;
            default:
              break;
          }
          return pageHooksData;
        }),
      );
    },

    setup: () => {
      cy.log('Logging something before starting tests.');
    },

    setupPerTest: () => {
      cy.get('@testKey').then(testKey => {
        cy.login();
        cy.route('GET', 'v0/user', dataSetToUserMap[testKey]);
      });
      cy.get('@testData').then(testData => {
        cy.route('GET', 'v0/in_progress_forms/MDOT', testData);
      });
      cy.route('POST', '/v0/mdot/supplies', 200);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
