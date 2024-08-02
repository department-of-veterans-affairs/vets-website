import moment from 'moment';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import ChemHemDetailsPage from './pages/ChemHemDetailsPage';
import labsAndTests from './fixtures/labsAndTests.json';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    LabsAndTestsListPage.goToLabsAndTests();
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(2, labsAndTests.entry[1]);
    ChemHemDetailsPage.verifyLabName(
      labsAndTests.entry[1].contained[4].code.text,
    );
    ChemHemDetailsPage.verifyLabDate(
      moment(
        labsAndTests.entry[1].contained[0].collection.collectedDateTime,
      ).format('MMMM D, YYYY'),
    );
    ChemHemDetailsPage.verifySampleTested(
      labsAndTests.entry[1].contained[0].type.text,
    );
    ChemHemDetailsPage.verifyOrderedBy(
      `${labsAndTests.entry[1].contained[1].name[0].family}, ${
        labsAndTests.entry[1].contained[1].name[0].given[0]
      } ${labsAndTests.entry[1].contained[1].name[0].given[1]}`,
    );
    ChemHemDetailsPage.verifyLabCollectingLocation(
      labsAndTests.entry[1].contained[3].name,
    );
    // There might be a new line in this provider notes example.  we need to check later
    ChemHemDetailsPage.verifyProviderNotesSingle(
      labsAndTests.entry[1].extension[0].valueString,
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
