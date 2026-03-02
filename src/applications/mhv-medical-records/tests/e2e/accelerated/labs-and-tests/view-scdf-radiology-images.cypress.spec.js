import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import labsAndTestData from '../fixtures/labsAndTests/uhd-with-radiology.json';
import imagingStudiesData from '../fixtures/labsAndTests/imaging-studies.json';
import thumbnailsData from '../fixtures/labsAndTests/imaging-thumbnails.json';
import dicomData from '../fixtures/labsAndTests/imaging-dicom.json';

describe('Medical Records - SCDF Radiology Images List', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2025, 0, 25); // January 25, 2025

  beforeEach(() => {
    cy.clock(mockDate, ['Date']);
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingLabsAndTests: true,
      isAcceleratingImagingStudies: true,
    });
    LabsAndTests.setIntercepts({ labsAndTestData });
    LabsAndTests.setImagingIntercepts({
      imagingStudiesData,
      thumbnailsData,
      dicomData,
    });
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('navigates to the images page and displays the thumbnail gallery', () => {
    site.loadPage();
    LabsAndTests.goToLabAndTestPage();

    cy.wait('@labs-and-test-list');
    cy.wait('@imagingStudies');

    LabsAndTests.selectRadiologyRecord({
      labName: 'CT HEAD W/O CONTRAST',
    });

    cy.wait('@imagingThumbnails');

    LabsAndTests.clickViewAllImages();

    LabsAndTests.verifyImagesPageHeading({
      name: 'CT HEAD W/O CONTRAST',
    });

    LabsAndTests.verifyImageGalleryCount({ count: 3 });

    cy.injectAxeThenAxeCheck();
  });

  it('shows the DICOM download link on the images page', () => {
    site.loadPage();
    LabsAndTests.goToLabAndTestPage();

    cy.wait('@labs-and-test-list');
    cy.wait('@imagingStudies');

    LabsAndTests.selectRadiologyRecord({
      labName: 'CT HEAD W/O CONTRAST',
    });

    cy.wait('@imagingThumbnails');

    LabsAndTests.clickViewAllImages();

    cy.wait('@imagingDicom');

    LabsAndTests.verifyDicomDownloadLink();

    cy.injectAxeThenAxeCheck();
  });
});
