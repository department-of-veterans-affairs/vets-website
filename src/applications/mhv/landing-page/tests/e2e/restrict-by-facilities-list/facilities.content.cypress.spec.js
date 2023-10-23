import { appName } from '../../../manifest.json';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(appName, () => {
  describe('Display content based on patient facilities', () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    });

    it('No health info for patients with no facilities', () => {
      LandingPage.visitPage({ facilities: [] });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();
      cy.findByRole('heading', {
        name: 'We cannot display your health information.',
      }).should.exist;
      cy.findByRole('heading', { name: 'Appointments' }).should('not.exist');
    });

    it('landing page is enabled for patients with facilities', () => {
      LandingPage.visitPage({
        facilities: [{ facilityId: '123', isCerner: false }],
      });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();
      cy.findByRole('heading', { name: 'Appointments' }).should.exist;
      cy.findByRole('heading', { name: 'Messages' }).should.exist;
      cy.findByRole('heading', { name: 'Medications' }).should.exist;
      cy.findByRole('heading', { name: 'Health records' }).should.exist;
      cy.findByRole('heading', { name: 'Payments' }).should.exist;
      cy.findByRole('heading', { name: 'Medical supplies and equipment' })
        .should.exist;
      cy.findByRole('heading', {
        name: 'We cannot display your health information.',
      }).should('not.exist');
    });
  });
});
