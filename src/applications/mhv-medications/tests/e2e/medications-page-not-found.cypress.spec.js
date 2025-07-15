import { rootUrl } from '../../manifest.json';
import MedicationsSite from './med_site/MedicationsSite';

const paths = [
  `${rootUrl}/undefined`,
  `${rootUrl}/refill/no-page-here`,
  `${rootUrl}/prescription/asdf-1234/not-found`,
  `${rootUrl}/prescription/asdf-1234/documentation/not-defined`,
];

describe('Medications -- page not found', () => {
  const site = new MedicationsSite();

  beforeEach(() => {
    site.login();
  });

  paths.forEach(path => {
    it(`renders the MhvPageNotFound component for ${path}`, () => {
      cy.visit(path);
      cy.findByTestId('mhv-page-not-found');
      cy.injectAxeThenAxeCheck();
    });
  });
});
