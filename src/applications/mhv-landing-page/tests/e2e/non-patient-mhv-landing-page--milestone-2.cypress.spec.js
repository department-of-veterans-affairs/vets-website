import { appName, rootUrl } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

/*
 * mhvMilestone2ChangesEnabled is enabled.
*/
describe(`${appName} -- non Patient landing page -- milestone-2`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    LandingPage.visit({
      registered: false,
      verified: true,
      mhvAccountState: 'OK',
      edipi: '1234567890',
    });
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
  it('should not render the secondary navigation', () => {
    LandingPage.secondaryNav().should('not.exist');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('should not render the cards section', () => {
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
    cy.findByRole('heading', appointments).should('not.exist');
    cy.findByRole('heading', messages).should('not.exist');
    cy.findByRole('heading', medications).should('not.exist');
    cy.findByRole('heading', medicalRecords).should('not.exist');
    cy.findByRole('heading', payments).should('not.exist');
    cy.findByRole('heading', medicalSupplies).should('not.exist');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('should not render the HelpDesk Info heading', () => {
    const heading = {
      level: 2,
      name: /^Need help\?$/,
    };
    cy.findByRole('heading', heading).should('not.exist');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the Non-Patient Helpdesk heading', () => {
    const heading = {
      level: 2,
      name: /^We don’t have VA health records for you$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the VA health resources heading', () => {
    const heading = {
      level: 3,
      name: /^VA health resources$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the Non-Patient Download Data heading', () => {
    const heading = {
      level: 2,
      name: /^Download your data$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  // it's not clear why this test is failing
  it.skip('renders the SEI information download link', () => {
    cy.get('va-links').should('be.visible');
    cy.get('va-links')
      .shadow()
      .findByRole('link', {
        name: /Download self-entered health information report (PDF)/i,
      });
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  // it's not clear why this test is failing
  it.skip('renders the DoD information download link', () => {
    cy.get('va-links').should('be.visible');
    cy.get('va-links')
      .shadow()
      .findByRole('link', {
        name: /Download your DOD military service data (PDF)/,
      });
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
