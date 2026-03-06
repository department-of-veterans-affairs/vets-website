import manifest from '../../manifest.json';
import features from '../fixtures/features';
import avsData from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';
import { mockAvsErrors } from '../../mocks/data';

const avsId = '9A7AF40B2BC2471EA116891839113252';
const testUrl = `${manifest.rootUrl}/${avsId}`;
const mhvPageNotFoundHeading = 'Page not found';
const mhvUnauthorizedHeading = 'We can’t give you access to this page';

const getAvsApiResponse = apiStatus => {
  if (apiStatus === 200) return avsData;
  if (apiStatus === 400) return mockAvsErrors.badRequest;
  if (apiStatus === 401) return mockAvsErrors.unauthorized;
  if (apiStatus === 404) return mockAvsErrors.notFound;
  return {};
};

const setup = ({
  featureToggleDelay = 0,
  avsDelay = 0,
  avsEnabled = true,
  apiStatus = 200,
  login = true,
}) => {
  cy.intercept('/v0/feature_toggles*', features(avsEnabled)).as('features');
  cy.intercept('GET', '/v0/feature_toggles*', {
    statusCode: 200,
    delay: featureToggleDelay,
    body: features(avsEnabled),
  });
  cy.intercept('GET', `/avs/v0/avs/*`, {
    statusCode: apiStatus,
    delay: avsDelay,
    body: getAvsApiResponse(apiStatus),
  });

  if (login) {
    cy.login();
  }
};

describe('After-visit Summary - Happy Path', () => {
  beforeEach(() => {
    setup({});
  });

  it('is accessible', () => {
    cy.visit(testUrl);
    cy.get('h1').contains('After-visit summary');
    cy.injectAxeThenAxeCheck();
  });

  // Add container behavior tests.

  it('only the top accordion is open by default', () => {
    cy.visit(testUrl);
    cy.get('h1').contains('After-visit summary');
    cy.get("[header='Your appointment on January 1, 2023'][open='true']")
      .get('.avs-accordion-item')
      .contains('You were diagnosed with')
      .should('be.visible');
    cy.get("[header='Your treatment plan from this appointment']")
      .shadow()
      .find('button[aria-expanded=false]')
      .should('exist');
    cy.get("[header='Your health information as of this appointment']")
      .shadow()
      .find('button[aria-expanded=false]')
      .should('exist');
    cy.get("[header='More information']")
      .shadow()
      .find('button[aria-expanded=false]')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('lower accordions can be expanded', () => {
    cy.visit(testUrl);
    cy.get('h1').contains('After-visit summary');

    cy.contains('Consultations').should('not.be.visible');
    cy.get("[header='Your treatment plan from this appointment']")
      .shadow()
      .find('button')
      .click({ force: true });
    cy.contains('Consultations').should('be.visible');

    cy.contains('Primary care team').should('not.be.visible');
    cy.get("[header='Your health information as of this appointment']")
      .shadow()
      .find('button')
      .click({ force: true });
    cy.contains('Primary care team').should('be.visible');

    cy.contains('More help and information').should('not.be.visible');
    cy.get("[header='More information']")
      .shadow()
      .find('button')
      .click({ force: true });
    cy.contains('More help and information').should('be.visible');

    cy.injectAxeThenAxeCheck();
  });

  it('root URL is redirected to summaries & notes', () => {
    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'match',
      /\/my-health\/medical-records\/summaries-and-notes\/$/,
    );
  });

  it('child paths past an ID get page not found', () => {
    cy.visit(`${testUrl}/path1`);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: mhvPageNotFoundHeading }).should.exist;

    cy.visit(`${testUrl}/path1/path2`);
    cy.findByRole('heading', { name: mhvPageNotFoundHeading }).should.exist;
  });
});

describe('After-visit Summary - Feature Toggles', () => {
  it('Loading indicator is displayed while feature toggles are loading', () => {
    setup({ featureToggleDelay: 10000 });
    cy.visit(testUrl);
    // find test id avs-loading-indicator
    cy.get('[data-testid="avs-loading-indicator"]').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('Users are redirected to the homepage if the feature toggle is not enabled', () => {
    setup({ avsEnabled: false });
    cy.visit(testUrl);
    cy.injectAxeThenAxeCheck();
    cy.url().should('match', /\/$/);
  });
});

describe('After-visit Summary - Authentication', () => {
  it('Users are redirected to login if they are not authenticated', () => {
    setup({ login: false });
    cy.visit(testUrl);
    cy.injectAxeThenAxeCheck();
    const urlPattern = `\\/\\?next=%2Fmy-health%2Fmedical-records%2Fsummaries-and-notes%2Fvisit-summary%2F${avsId}(&oauth=true)?$`;
    cy.url().should('match', new RegExp(urlPattern));
  });
});

describe('After-visit Summary - API', () => {
  it('Loading indicator is displayed while AVS data is loading', () => {
    setup({ avsDelay: 10000 });
    cy.visit(testUrl);
    // find test id avs-loading-indicator
    cy.get('[data-testid="avs-loading-indicator"]').should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('Error is shown on API failure', () => {
    setup({ apiStatus: 500 });
    cy.visit(testUrl);
    cy.get('body').contains(
      'We can’t access your after-visit summary right now',
    );
    cy.injectAxeThenAxeCheck();
  });

  it('MhvPageNotFound page is render on API failure 400 bad_request', () => {
    setup({ apiStatus: 400 });
    cy.visit(testUrl);
    cy.get('body').contains(mhvPageNotFoundHeading);
    cy.injectAxeThenAxeCheck();
  });

  it('MhvUnauthorized page is render on API failure 401 unauthorized', () => {
    setup({ apiStatus: 401 });
    cy.visit(testUrl);
    cy.get('body').contains(mhvUnauthorizedHeading);
    cy.injectAxeThenAxeCheck();
  });

  it('MhvPageNotFound is render on API failure 404 not_found', () => {
    setup({ apiStatus: 404 });
    cy.visit(testUrl);
    cy.get('body').contains(mhvPageNotFoundHeading);
    cy.injectAxeThenAxeCheck();
  });
});
