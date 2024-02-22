import { notFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import { rootUrl } from '../../manifest.json';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login();
    // cy.visit('my-health/about-medications/');
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('Visit unsupported URL and get a page not found', () => {
    const site = new MedicationsSite();
    site.login();

    cy.visit(`${rootUrl}/dummy/dummy`);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: notFoundHeading }).should.exist;
  });
});
