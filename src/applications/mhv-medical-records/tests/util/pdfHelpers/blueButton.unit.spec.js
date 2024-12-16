import { expect } from 'chai';
import { generateBlueButtonData } from '../../../util/pdfHelpers/blueButton';
import { recordType, blueButtonRecordTypes } from '../../../util/constants';

describe('generateBlueButtonData', () => {
  it('should return an empty array when no records are provided', () => {
    const result = generateBlueButtonData({}, []);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(11);
  });

  it('should generate data for labs and tests', () => {
    const labsAndTests = [
      { name: 'Test 1', type: 'CHEM_HEM' },
      { name: 'Test 2', type: 'MICROBIOLOGY' },
    ];
    const result = generateBlueButtonData({ labsAndTests }, ['labTests']);
    expect(result).to.be.an('array').that.is.not.empty;
    const labsAndTestsSection = result.find(
      section => section.type === recordType.LABS_AND_TESTS,
    );
    expect(labsAndTestsSection).to.exist;
    expect(labsAndTestsSection.records).to.have.lengthOf(2);
  });

  it('should generate data for care summaries and notes', () => {
    const notes = [
      { name: 'Note 1', type: 'DISCHARGE_SUMMARY' },
      { name: 'Note 2', type: 'PHYSICIAN_PROCEDURE_NOTE' },
    ];
    const result = generateBlueButtonData({ notes }, ['careSummaries']);
    expect(result).to.be.an('array').that.is.not.empty;
    const notesSection = result.find(
      section => section.type === recordType.CARE_SUMMARIES_AND_NOTES,
    );
    expect(notesSection).to.exist;
    expect(notesSection.records).to.have.lengthOf(2);
  });

  it('should generate data for vaccines', () => {
    const vaccines = [{ name: 'Vaccine 1' }, { name: 'Vaccine 2' }];
    const result = generateBlueButtonData({ vaccines }, ['vaccines']);
    expect(result).to.be.an('array').that.is.not.empty;
    const vaccinesSection = result.find(
      section => section.type === recordType.VACCINES,
    );
    expect(vaccinesSection).to.exist;
    expect(vaccinesSection.records.results.items).to.have.lengthOf(2);
  });

  it('should generate data for allergies', () => {
    const allergies = [{ name: 'Allergy 1' }, { name: 'Allergy 2' }];
    const result = generateBlueButtonData({ allergies }, ['allergies']);
    expect(result).to.be.an('array').that.is.not.empty;
    const allergiesSection = result.find(
      section => section.type === recordType.ALLERGIES,
    );
    expect(allergiesSection).to.exist;
    expect(allergiesSection.records.results.items).to.have.lengthOf(2);
  });

  it('should generate data for health conditions', () => {
    const conditions = [{ name: 'Condition 1' }, { name: 'Condition 2' }];
    const result = generateBlueButtonData({ conditions }, ['conditions']);
    expect(result).to.be.an('array').that.is.not.empty;
    const conditionsSection = result.find(
      section => section.title === 'Health conditions',
    );
    expect(conditionsSection).to.exist;
    expect(conditionsSection.records).to.have.lengthOf(2);
  });

  it('should generate data for vitals', () => {
    const vitals = [{ name: 'Vital 1' }, { name: 'Vital 2' }];
    const result = generateBlueButtonData({ vitals }, ['vitals']);
    expect(result).to.be.an('array').that.is.not.empty;
    const vitalsSection = result.find(
      section => section.type === recordType.VITALS,
    );
    expect(vitalsSection).to.exist;
    expect(vitalsSection.records[0].results.items).to.have.lengthOf(2);
  });

  it('should generate data for medications', () => {
    const medications = [
      { prescriptionName: 'Medication 1' },
      { prescriptionName: 'Medication 2' },
    ];
    const result = generateBlueButtonData({ medications }, ['medications']);
    expect(result).to.be.an('array').that.is.not.empty;
    const medicationsSection = result.find(
      section => section.type === blueButtonRecordTypes.MEDICATIONS,
    );
    expect(medicationsSection).to.exist;
    expect(medicationsSection.records).to.have.lengthOf(2);
  });

  it('should generate data for appointments', () => {
    const appointments = [
      {
        isUpcoming: true,
        date: '2022-01-01',
        address: ['Facility 1'],
        detailsShared: { reason: 'check-up', otherDetails: '' },
      },
      {
        isUpcoming: false,
        date: '2021-01-01',
        address: ['Facility 2'],
        detailsShared: { reason: 'check-up', otherDetails: '' },
      },
    ];
    const result = generateBlueButtonData({ appointments }, ['appointments']);
    expect(result).to.be.an('array').that.is.not.empty;
    const appointmentsSection = result.find(
      section => section.type === blueButtonRecordTypes.APPOINTMENTS,
    );
    expect(appointmentsSection).to.exist;
    expect(appointmentsSection.records).to.have.lengthOf(2);
  });

  it('should generate data for demographics', () => {
    const demographics = [
      {
        facility: 'Facility 1',
        eligibility: { serviceConnectedPercentage: '50' },
        employment: { occupation: 'Engineer' },
        contactInfo: { homePhone: '5555551212' },
        permanentAddress: { street: '123 main st' },
        emergencyContact: {
          name: 'Jane Doe',
          address: { street: '123 main st' },
        },
        primaryNextOfKin: {
          name: 'John Doe',
          address: { street: '123 main st' },
        },
        civilGuardian: {
          name: 'Joe Doe',
          address: { street: '123 main st' },
        },
        vaGuardian: {
          name: 'Jim Doe',
          address: { street: '123 main st' },
        },
        activeInsurance: {
          company: 'Company 1',
        },
      },
    ];
    const result = generateBlueButtonData({ demographics }, ['demographics']);
    expect(result).to.be.an('array').that.is.not.empty;
    const demographicsSection = result.find(
      section => section.type === blueButtonRecordTypes.DEMOGRAPHICS,
    );
    expect(demographicsSection).to.exist;
    expect(demographicsSection.records).to.have.lengthOf(1);
  });

  it('should generate data for military service', () => {
    const militaryService = [{ branch: 'Army' }];
    const result = generateBlueButtonData({ militaryService }, [
      'militaryService',
    ]);
    expect(result).to.be.an('array').that.is.not.empty;
    const militaryServiceSection = result.find(
      section => section.type === blueButtonRecordTypes.MILITARY_SERVICE,
    );
    expect(militaryServiceSection).to.exist;
    expect(militaryServiceSection.records).to.have.lengthOf(1);
  });

  it('should generate data for account summary', () => {
    const accountSummary = {
      authenticationSummary: {
        source: 'Source 1',
        authenticationStatus: 'Status 1',
        authenticationDate: 'Date 1',
        authenticationFacilityName: 'Facility 1',
        authenticationFacilityID: '1',
      },
      vaTreatmentFacilities: [
        {
          facilityName: 'Facility 1',
          type: 'VAMC',
        },
      ],
    };
    const result = generateBlueButtonData({ accountSummary }, []);
    expect(result).to.be.an('array').that.is.not.empty;
    const accountSummarySection = result.find(
      section => section.type === blueButtonRecordTypes.ACCOUNT_SUMMARY,
    );
    expect(accountSummarySection).to.exist;
    expect(accountSummarySection.records).to.be.an('object');
  });
});
