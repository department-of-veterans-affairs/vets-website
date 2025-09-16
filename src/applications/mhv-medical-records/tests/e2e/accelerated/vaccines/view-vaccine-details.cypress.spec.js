import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vaccines from '../pages/Vaccines';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vaccinesData from '../fixtures/vaccines/sample-lighthouse.json';
import vaccineDetailData from '../fixtures/vaccines/vaccine-detail.json';

describe('Medical Records View Vaccine Details', () => {
  const site = new MedicalRecordsSite();
  const vaccineId = vaccineDetailData.data.id;

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVaccines: true,
    });
  });

  it('Visits Vaccine Details Page', () => {
    // Set up intercepts for both list and detail views
    Vaccines.setIntercepts({ vaccinesData });
    Vaccines.setDetailIntercepts({ vaccineDetailData, vaccineId });

    site.loadPage();
    Vaccines.goToVaccinesPage();

    // Click on the first vaccine to view details
    Vaccines.clickVaccineDetailsLink(0);

    // Verify vaccine details are displayed correctly
    const vaccineData = vaccineDetailData.data.attributes;

    Vaccines.verifyVaccineName(vaccineData.groupName);
    Vaccines.verifyVaccineLocation(vaccineData.location);
    Vaccines.verifyVaccineManufacturer(vaccineData.manufacturer);
    Vaccines.verifyVaccineReaction(vaccineData.reaction);
    Vaccines.verifyVaccineNotes(vaccineData.note);
    Vaccines.verifyVaccineShortDescription(vaccineData.shortDescription);

    // Verify date is formatted correctly
    cy.get('[data-testid="header-time"]').should(
      'contain',
      'December 18, 2020',
    );

    // Accessibility check
    cy.injectAxeThenAxeCheck();
  });

  it('Navigates back to vaccines list from details page', () => {
    Vaccines.setIntercepts({ vaccinesData });
    Vaccines.setDetailIntercepts({ vaccineDetailData, vaccineId });

    site.loadPage();
    Vaccines.goToVaccinesPage();
    Vaccines.clickVaccineDetailsLink(0);
    // Verify vaccine details are displayed correctly
    const vaccineData = vaccineDetailData.data.attributes;

    Vaccines.verifyVaccineName(vaccineData.groupName);

    // Navigate back to list
    cy.get('[data-testid="mr-breadcrumbs"] > a').click();

    // Verify we're back on the vaccines list page
    cy.url().should('include', '/vaccines');
    cy.findAllByTestId('record-list-item').should('be.visible');

    // Accessibility check
    cy.injectAxeThenAxeCheck();
  });
});
