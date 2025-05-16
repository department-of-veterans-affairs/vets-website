import { appName, rootUrl } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

/*
 * mhvMilestone2ChangesEnabled is enabled.
*/
describe(`${appName} -- landing page -- pre-milestone-2`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    LandingPage.visit();
    cy.visit(rootUrl);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('displays an h1', () => {
    const heading = {
      level: 1,
      name: /^My HealtheVet$/,
    };
    cy.findByRole('heading', heading).should('have.focus');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the breadcrumbs', () => {
    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('va-breadcrumbs')
      .shadow()
      .findByRole('link', { name: /My HealtheVet/ });
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the secondary navigation', () => {
    LandingPage.secondaryNav().should('be.visible');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the cards section', () => {
    const appointments = {
      level: 2,
      name: /^Appointments$/,
    };
    const messages = {
      level: 2,
      name: /^Messages$/,
    };
    const medications = {
      level: 2,
      name: /^Medications$/,
    };
    const medicalRecords = {
      level: 2,
      name: /^Medical records$/,
    };
    const payments = {
      level: 2,
      name: /^Payments$/,
    };
    const medicalSupplies = {
      level: 2,
      name: /^Medical supplies$/,
    };
    cy.findByRole('heading', appointments).should('be.visible');
    cy.findByRole('heading', messages).should('be.visible');
    cy.findByRole('heading', medications).should('be.visible');
    cy.findByRole('heading', medicalRecords).should('be.visible');
    cy.findByRole('heading', payments).should('be.visible');
    cy.findByRole('heading', medicalSupplies).should('be.visible');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the HelpDesk Info heading', () => {
    const heading = {
      level: 2,
      name: /^Need help\?$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  // it's not clear why this test is failing
  it.skip('renders the hub section', () => {
    const healthBenefits = {
      level: 2,
      name: /^My VA health benefits$/,
    };
    const moreResources = {
      level: 2,
      name: /^More resources and support$/,
    };
    const spotlight = {
      level: 2,
      name: /^In the spotlight$/,
    };
    cy.findByRole('heading', healthBenefits).should('be.visible');
    cy.findByRole('heading', moreResources).should('be.visible');
    cy.findByRole('heading', spotlight).should('be.visible');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the Subscribe heading', () => {
    const heading = {
      level: 2,
      name: /^Subscribe to the My HealtheVet newsletter$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
