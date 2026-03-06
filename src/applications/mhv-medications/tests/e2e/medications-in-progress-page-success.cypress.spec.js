import MedicationsSite from './med_site/MedicationsSite';
import MedicationsInProgressPage from './pages/MedicationsInProgressPage';
import mockToggles from './fixtures/toggles-response.json';
import inProgressPrescriptions from './fixtures/in-progress-prescriptions.json';

const setupIntercepts = (toggleNames = []) => {
  const toggles = JSON.parse(JSON.stringify(mockToggles));
  toggleNames.forEach(name => {
    const flag = toggles.data.features.find(f => f.name === name);
    if (flag) flag.value = true;
  });
  cy.intercept('GET', '/v0/feature_toggles?*', toggles).as('featureToggles');
};

/**
 * Deep-clone fixture and set a recent completeDateTime on the shipped
 * medication so it falls within the window for shipped medications.
 */
const withRecentShippingDate = fixture => {
  const clone = JSON.parse(JSON.stringify(fixture));
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 3);
  const recentDateStr = recentDate.toISOString();
  const shippedRx = clone.data.find(
    rx =>
      rx.attributes.dispStatus === 'Active' &&
      rx.attributes.trackingList?.length > 0,
  );
  shippedRx.attributes.trackingList[0].completeDateTime = recentDateStr;
  shippedRx.attributes.trackingList[0].dateLoaded = recentDateStr;
  return clone;
};

describe('In-progress medications page - successful data load', () => {
  it('displays medications in each process step (v1 endpoint)', () => {
    const site = new MedicationsSite();
    site.login();
    setupIntercepts(['mhv_medications_management_improvements']);

    const fixture = withRecentShippingDate(inProgressPrescriptions);
    const inProgressPage = new MedicationsInProgressPage();
    inProgressPage.visitPage('v1', fixture);
    cy.wait('@prescriptions');

    inProgressPage.verifyHeading();
    inProgressPage.verifyProcessListSteps();

    inProgressPage.verifySubmittedPrescription(
      inProgressPrescriptions.data[0].attributes.prescriptionName,
    );

    inProgressPage.verifyInProgressPrescription(
      inProgressPrescriptions.data[1].attributes.prescriptionName,
    );

    inProgressPage.verifyShippedPrescription(
      inProgressPrescriptions.data[2].attributes.prescriptionName,
    );

    inProgressPage.verifySubmittedPrescription(
      inProgressPrescriptions.data[3].attributes.prescriptionName,
    );

    inProgressPage.verifyInProgressPrescription(
      inProgressPrescriptions.data[4].attributes.prescriptionName,
    );

    inProgressPage.verifyPrescriptionNotInList(
      inProgressPrescriptions.data[5].attributes.prescriptionName,
    );

    inProgressPage.verifyPrescriptionNotInList(
      inProgressPrescriptions.data[6].attributes.prescriptionName,
    );

    inProgressPage.verifyNeedHelpSection();
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays medications in each process step (v2 endpoint)', () => {
    const site = new MedicationsSite();
    site.login();
    setupIntercepts([
      'mhv_medications_management_improvements',
      'mhv_medications_cerner_pilot',
    ]);

    const fixture = withRecentShippingDate(inProgressPrescriptions);
    const inProgressPage = new MedicationsInProgressPage();
    inProgressPage.visitPage('v2', fixture);
    cy.wait('@prescriptions');

    inProgressPage.verifyHeading();
    inProgressPage.verifyProcessListSteps();

    inProgressPage.verifySubmittedPrescription(
      inProgressPrescriptions.data[0].attributes.prescriptionName,
    );

    inProgressPage.verifyInProgressPrescription(
      inProgressPrescriptions.data[1].attributes.prescriptionName,
    );

    inProgressPage.verifyShippedPrescription(
      inProgressPrescriptions.data[2].attributes.prescriptionName,
    );

    inProgressPage.verifySubmittedPrescription(
      inProgressPrescriptions.data[3].attributes.prescriptionName,
    );

    inProgressPage.verifyInProgressPrescription(
      inProgressPrescriptions.data[4].attributes.prescriptionName,
    );

    inProgressPage.verifyPrescriptionNotInList(
      inProgressPrescriptions.data[5].attributes.prescriptionName,
    );

    inProgressPage.verifyPrescriptionNotInList(
      inProgressPrescriptions.data[6].attributes.prescriptionName,
    );

    inProgressPage.verifyNeedHelpSection();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
