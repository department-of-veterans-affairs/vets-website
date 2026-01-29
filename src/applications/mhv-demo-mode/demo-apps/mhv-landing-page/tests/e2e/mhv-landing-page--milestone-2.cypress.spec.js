import { appName, rootUrl } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import user from '../fixtures/user.json';

describe(`${appName} -- pre-milestone-2`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    cy.login(user);
    cy.visit(rootUrl);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the pre-milestone-2 HeaderLayout', () => {
    cy.findByTestId('mhv-header-layout--milestone-2').should('not.exist');
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});

describe(`${appName} -- milestone-2`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit(rootUrl);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders', () => {
    cy.findByTestId('mhv-header-layout--milestone-2');
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
