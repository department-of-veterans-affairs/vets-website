import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import PathologyDetailsPage from './pages/PathologyDetailsPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';
import { formatDateMonthDayCommaYear } from '../../util/dateHelpers';
// import pathology from './fixtures/labs-and-tests/pathology.json';

describe('Medical Records View Labs And Tests', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Labs And Tests Details', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    const record = labsAndTests.entry[8].resource;
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[8]);
    PathologyDetailsPage.verifyLabName(record.code.text);
    PathologyDetailsPage.verifyLabDate(
      formatDateMonthDayCommaYear(
        record.contained[0].collection.collectedDateTime,
      ),
    );
    // record.contained[0].collection.bodySite.text,
    // pertains to "site or sample tested" IF IT EXISTS
    PathologyDetailsPage.verifySampleTested(record.contained[0].type.text); // sample from field: (record.contained[0].type.text);
    PathologyDetailsPage.verifyLabLocation('None recorded');
    PathologyDetailsPage.verifyReport('None recorded');
    PathologyDetailsPage.verifyDateCompleted(
      formatDateMonthDayCommaYear(record.effectiveDateTime),
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
