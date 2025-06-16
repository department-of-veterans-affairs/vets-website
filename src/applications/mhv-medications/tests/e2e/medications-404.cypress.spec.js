import { rootUrl } from '../../manifest.json';
import MedicationsSite from './med_site/MedicationsSite';

describe('Medications 404', () => {
  it('displays the MhvPageNotFound component for rootUrl/unknown', () => {
    const site = new MedicationsSite();
    site.login();
    cy.visit(`${rootUrl}/unknown`);
    cy.findByTestId('mhv-page-not-found');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
