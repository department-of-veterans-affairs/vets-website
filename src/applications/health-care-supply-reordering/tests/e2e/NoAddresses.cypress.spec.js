import { appName, rootUrl } from '../../manifest.json';
import ipfMdotGetMock from '../data/noAddresses.json';
import userMock from '../data/users/markUserData.json';

let heading;

const ipfMdotPutMock = {
  data: {
    id: '12345',
    type: 'in_progress_forms',
    attributes: {
      formId: 'MDOT',
      createdAt: '2020-06-30T00:00:00.000Z',
      updatedAt: '2020-06-30T00:00:00.000Z',
      metadata: {},
    },
  },
};

const mdotSuppliesPostMock = [
  {
    status: 'Order Processed',
    orderId: '12345',
    productId: '9999',
  },
];

describe(`${appName} -- Veteran w/o address`, () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', { data: { features: [] } });
    cy.intercept('GET', '/v0/in_progress_forms/MDOT', ipfMdotGetMock);
    cy.intercept('PUT', '/v0/in_progress_forms/MDOT', ipfMdotPutMock);
    cy.intercept('POST', '/v0/mdot/supplies', mdotSuppliesPostMock);
    cy.intercept('GET', '/v0/user', userMock);
  });

  beforeEach(() => {
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
  });

  it('fills out address', () => {
    // introduction
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 1,
      name: /^Order hearing aid and CPAP supplies/,
    };
    cy.findByRole('heading', heading); // .should('have.focus');
    cy.findAllByRole('link', {
      name: /^Start your hearing aid and CPAP supplies order/,
    })
      .first()
      .click();

    // veteran information - name, dob
    cy.injectAxeThenAxeCheck();
    cy.findByText(/^Continue$/).click();

    // Permanent address
    cy.get('select#options[name="root_permanentAddress_country"]').select(
      'USA',
    );

    cy.get('va-text-input[name="root_permanentAddress_street"]')
      .shadow()
      .find('input')
      .as('streetInput');

    cy.get('@streetInput').clear();
    cy.get('@streetInput').type('345 Mailing Address St.');

    cy.get('va-text-input[name="root_permanentAddress_street2"]')
      .shadow()
      .find('input')
      .as('streetTwoInput');

    cy.get('@streetTwoInput').clear();
    cy.get('@streetTwoInput').type('apartment 2');

    cy.get('va-text-input[name="root_permanentAddress_city"]')
      .shadow()
      .find('input')
      .as('city');

    cy.get('@city').clear();
    cy.get('@city').type('Chicago');

    cy.get('select#options[name="root_permanentAddress_state"]').select('AL');

    cy.get('va-text-input[name="root_permanentAddress_postalCode"]')
      .shadow()
      .find('input')
      .as('zipcode');

    cy.get('@zipcode').clear();
    cy.get('@zipcode').type('19143');

    cy.findByText(/^Save permanent address$/).click();

    // Temp address
    cy.get('select#options[name="root_temporaryAddress_country"]').select(
      'USA',
    );

    cy.get('va-text-input[name="root_temporaryAddress_street"]')
      .shadow()
      .find('input')
      .as('streetInput');

    cy.get('@streetInput').clear();
    cy.get('@streetInput').type('345 Mailing Address St.');

    cy.get('va-text-input[name="root_temporaryAddress_street2"]')
      .shadow()
      .find('input')
      .as('streetTwoInput');

    cy.get('@streetTwoInput').clear();
    cy.get('@streetTwoInput').type('apartment 2');

    cy.get('va-text-input[name="root_temporaryAddress_city"]')
      .shadow()
      .find('input')
      .as('city');

    cy.get('@city').clear();
    cy.get('@city').type('Chicago');

    cy.get('select#options[name="root_temporaryAddress_state"]').select('AL');

    cy.get('va-text-input[name="root_temporaryAddress_postalCode"]')
      .shadow()
      .find('input')
      .as('zipcode');

    cy.get('@zipcode').clear();
    cy.get('@zipcode').type('19143');

    cy.findByText(/^Save temporary address$/).click();

    cy.findByText(/^Continue$/).click();

    // select supplies
    cy.injectAxeThenAxeCheck();
    // cy.selectVaCheckbox('#1', true);
    cy.get('#1')
      .shadow()
      .find('input')
      .click({ force: true });
    cy.findByText(/^Continue$/).click();

    cy.findByText(/^Submit order$/).click();

    // confirmation
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 2,
      name: /^Success Alert Your order has been submitted$/,
    };
    cy.findByRole('heading', heading); // .should('have.focus'); // it _should_ have focus, but does not
  });
});
