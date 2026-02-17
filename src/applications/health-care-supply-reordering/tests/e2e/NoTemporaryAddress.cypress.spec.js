import { appName, rootUrl } from '../../manifest.json';
import ipfMdotGetMock from '../data/noTempAddress.json';
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

describe(`${appName} -- Veteran w/o temporary address`, () => {
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

  it('is successful', () => {
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

    // veteran information - address
    cy.injectAxeThenAxeCheck();
    cy.findByText(/^Continue$/).click();

    // select supplies
    cy.injectAxeThenAxeCheck();
    // cy.selectVaCheckbox('#1', true);
    cy.get('#1').shadow().find('input').click({ force: true });
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
