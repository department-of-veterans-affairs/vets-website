import MedicationsSite from './med_site/MedicationsSite';
import mockRxPageOne from './fixtures/prescriptions.json';
import mockRxPageTwo from './fixtures/presciptions-page-2.json';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    cy.visit('my-health/medications');
    site.login();
    const threadLength = 10;
    mockRxPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    mockRxPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPAgeSize = threadLength;
    });
    cy.get('[href="/my-health/medications/prescriptions"]').click();
    site.loadVAPaginationPrescriptions(1, mockRxPageOne, 10);
    site.loadVAPaginationNextPrescriptions(2, mockRxPageTwo);
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
