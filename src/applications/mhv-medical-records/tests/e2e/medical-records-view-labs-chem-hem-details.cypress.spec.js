import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import ChemHemDetailsPage from './pages/ChemHemDetailsPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';
import { formatDateMonthDayCommaYear } from '../../util/dateHelpers';

describe('Medical Records View Labs And Tests', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Labs And Tests Details', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    const record = labsAndTests.entry[1].resource;
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(3, labsAndTests.entry[1]);
    ChemHemDetailsPage.verifyLabName(
      record.contained[4].code.coding[1].display,
    );
    ChemHemDetailsPage.verifyLabDate(
      formatDateMonthDayCommaYear(
        record.contained[0].collection.collectedDateTime,
      ),
    );
    ChemHemDetailsPage.verifySampleTested(record.contained[0].type.text);
    ChemHemDetailsPage.verifyOrderedBy(
      `${record.contained[1].name[0].given[0]} ${record.contained[1].name[0].given[1]} ${record.contained[1].name[0].family}`,
    );
    ChemHemDetailsPage.verifyLabCollectingLocation(record.contained[3].name);
    // There might be a new line in this provider notes example.  we need to check later
    ChemHemDetailsPage.verifyProviderNotesSingle(
      record.extension[0].valueString,
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
