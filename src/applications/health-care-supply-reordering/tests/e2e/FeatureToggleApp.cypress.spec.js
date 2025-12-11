import { appName, rootUrl } from '../../manifest.json';
import ipfMdotGetMock from '../data/happyPath.json';
import featureToggleEnabled from '../data/featureToggleEnabled.json';
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

describe(`${appName} -- feature toggol enabled`, () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggleEnabled);
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

  it.skip('redirects to mhv supply reordering app', () => {
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 1,
      name: /^Medical supplies$/,
    };
    cy.location('pathname').should(
      'eq',
      '/my-health/order-medical-supplies/introduction',
    );
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should.exist;
    cy.findByRole('heading', heading).should('have.focus');
  });
});
