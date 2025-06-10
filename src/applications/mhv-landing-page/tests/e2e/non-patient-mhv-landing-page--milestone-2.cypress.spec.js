import { appName } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import LandingPage from './pages/LandingPage';

/*
 * mhvMilestone2ChangesEnabled is enabled.
*/
describe(`${appName} -- non Patient landing page -- milestone-2`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    LandingPage.visitNonPatientPage({
      mhvAccountState: 'OK',
      edipi: '1234567890',
    });
  });

  it('displays an h1', () => {
    const heading = {
      level: 1,
      name: /^My HealtheVet$/,
    };
    cy.findByRole('heading', heading).should('have.focus');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the breadcrumbs', () => {
    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('va-breadcrumbs')
      .shadow()
      .findByRole('link', { name: /My HealtheVet/ });
    cy.injectAxeThenAxeCheck();
  });

  it('should not render the secondary navigation', () => {
    LandingPage.secondaryNav().should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

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
    cy.injectAxeThenAxeCheck();
  });

  it('should not render the HelpDesk Info heading', () => {
    const heading = {
      level: 2,
      name: /^Need help\?$/,
    };
    cy.findByRole('heading', heading).should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the Non-Patient Helpdesk heading', () => {
    const heading = {
      level: 2,
      name: /^We don’t have VA health records for you$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the VA health resources heading', () => {
    const heading = {
      level: 3,
      name: /^VA health resources$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the Non-Patient Download Data heading', () => {
    const heading = {
      level: 2,
      name: /^Download your data$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the SEI information download link', () => {
    cy.get('va-link')
      .contains('Download self-entered health information report (PDF)')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the DoD information download link', () => {
    cy.get('va-link')
      .contains('Download your DOD military service data (PDF)')
      .should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the hub section', () => {
    const healthBenefits = {
      level: 2,
      name: /^VA health benefits$/,
    };
    const moreResources = {
      level: 2,
      name: /^More resources$/,
    };
    const spotlight = {
      level: 2,
      name: /^In the spotlight$/,
    };
    cy.findByRole('heading', healthBenefits).should('be.visible');
    cy.findByRole('heading', moreResources).should('be.visible');
    cy.findByRole('heading', spotlight).should('be.visible');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the Subscribe heading', () => {
    const heading = {
      level: 2,
      name: /^Subscribe to the My HealtheVet newsletter$/,
    };
    cy.findByRole('heading', heading).should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
