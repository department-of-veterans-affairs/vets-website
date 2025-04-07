import { expect } from 'chai';

import { generateSelfEnteredData } from '../../../../util/pdfHelpers/sei';
import { selfEnteredTypes, seiVitalTypes } from '../../../../util/constants';

describe('generateSelfEnteredData', () => {
  it('should return an empty array when no data is provided', () => {
    const result = generateSelfEnteredData({});
    expect(result).to.be.an('array').that.is.empty;
  });

  it('should generate data for activity journal', () => {
    const data = {
      activityJournal: [
        {
          date: 'Jan 1, 2020',
          activities: [
            { activity: 'running', type: 'cardio', intensity: 'hard' },
          ],
        },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const activityJournalSection = result.find(
      section => section.type === selfEnteredTypes.ACTIVITY_JOURNAL,
    );
    expect(activityJournalSection).to.exist;
    expect(activityJournalSection.records).to.have.lengthOf(1);
    expect(activityJournalSection.records[0].details).to.have.lengthOf(2);
    expect(activityJournalSection.records[0].title).to.equal('Jan 1, 2020');
    expect(
      activityJournalSection.records[0].details[1].items[0].value,
    ).to.equal('cardio');
  });

  it('should generate data for allergies', () => {
    const data = {
      allergies: [
        { allergyName: 'Allergy 1', date: '2021-01-01', severity: 'Mild' },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const allergiesSection = result.find(
      section => section.type === selfEnteredTypes.ALLERGIES,
    );
    expect(allergiesSection).to.exist;
    expect(allergiesSection.records).to.have.lengthOf(1);
    expect(allergiesSection.records[0].details[0].items).to.have.lengthOf(5);
    expect(allergiesSection.records[0].title).to.equal('Allergy 1');
    expect(allergiesSection.records[0].details[0].items[1].value).to.equal(
      'Mild',
    );
  });

  it('should generate data for demographics', () => {
    const data = {
      demographics: {
        firstName: 'John',
        lastName: 'Doe',
        contactInfo: { homePhone: '5555551212' },
        relationshipToVA: ['Veteran'],
        address: { street: '123 main st' },
      },
      emergencyContacts: [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          relationship: 'Spouse',
          homePhone: '5555551212',
          workPhone: '5555551212',
          address: {},
        },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const demographicsSection = result.find(
      section => section.type === selfEnteredTypes.DEMOGRAPHICS,
    );
    expect(demographicsSection).to.exist;
    expect(demographicsSection.records)
      .to.be.an('array')
      .with.length(2);
    expect(demographicsSection.records[1].details[0].items[0].value).to.equal(
      'Jane',
    );
  });

  it('should generate data for family history', () => {
    const data = {
      familyHistory: [
        { relationship: 'Spouse', firstName: 'Jane', lastName: 'Doe' },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const familyHistorySection = result.find(
      section => section.type === selfEnteredTypes.FAMILY_HISTORY,
    );
    expect(familyHistorySection).to.exist;
    expect(familyHistorySection.records).to.have.lengthOf(1);
    expect(familyHistorySection.records[0].title).to.equal('Spouse');
    expect(familyHistorySection.records[0].details[0].items[0].value).to.equal(
      'Jane',
    );
    expect(familyHistorySection.records[0].details[0].items[1].value).to.equal(
      'Doe',
    );
  });

  it('should generate data for food journal', () => {
    const data = {
      foodJournal: [
        {
          breakfastItems: [
            { item: 'Bagel' },
            { item: 'Coffee' },
            { item: 'Egg' },
            { item: 'Orange Juice' },
          ],
          lunchItems: [{ item: 'Salad' }],
          dinnerItems: [{ item: 'Steak' }],
          snackItems: [{ item: 'Apple' }],
        },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const foodJournalSection = result.find(
      section => section.type === selfEnteredTypes.FOOD_JOURNAL,
    );
    expect(foodJournalSection).to.exist;
    expect(foodJournalSection.records).to.have.lengthOf(1);
    expect(foodJournalSection.records[0].details[1].items[0].value).to.equal(
      'Bagel',
    );
  });

  it('should generate data for health providers', () => {
    const data = {
      providers: [{ providerName: 'Provider 1' }],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const providersSection = result.find(
      section => section.type === selfEnteredTypes.HEALTH_PROVIDERS,
    );
    expect(providersSection).to.exist;
    expect(providersSection.records).to.have.lengthOf(1);
    expect(providersSection.records[0].title).to.equal('Provider 1');
  });

  it('should generate data for health insurance', () => {
    const data = {
      healthInsurance: [
        { healthInsuranceCompany: 'Insurance 1', idNumber: '123' },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const healthInsuranceSection = result.find(
      section => section.type === selfEnteredTypes.HEALTH_INSURANCE,
    );
    expect(healthInsuranceSection).to.exist;
    expect(healthInsuranceSection.records).to.have.lengthOf(1);
    expect(healthInsuranceSection.records[0].title).to.equal('Insurance 1');
    expect(
      healthInsuranceSection.records[0].details[0].items[0].value,
    ).to.equal('123');
  });

  it('should generate data for test entries', () => {
    const data = {
      testEntries: [{ testName: 'Test Entry 1', provider: 'Dr. Smith' }],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const testEntriesSection = result.find(
      section => section.type === selfEnteredTypes.TEST_ENTRIES,
    );
    expect(testEntriesSection).to.exist;
    expect(testEntriesSection.records).to.have.lengthOf(1);
    expect(testEntriesSection.records[0].title).to.equal('Test Entry 1');
    expect(testEntriesSection.records[0].details[0].items[2].value).to.equal(
      'Dr. Smith',
    );
  });

  it('should generate data for medical events', () => {
    const data = {
      medicalEvents: [
        { medicalEvent: 'Medical Event 1', startDate: '2021-01-01' },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const medicalEventsSection = result.find(
      section => section.type === selfEnteredTypes.MEDICAL_EVENTS,
    );
    expect(medicalEventsSection).to.exist;
    expect(medicalEventsSection.records).to.have.lengthOf(1);
    expect(medicalEventsSection.records[0].title).to.equal('Medical Event 1');
    expect(medicalEventsSection.records[0].details[0].items[0].value).to.equal(
      '2021-01-01',
    );
  });

  it('should generate data for medications', () => {
    const data = {
      medications: [{ drugName: 'Medication 1', prescriptionNumber: '123' }],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const medicationsSection = result.find(
      section => section.type === selfEnteredTypes.MEDICATIONS,
    );
    expect(medicationsSection).to.exist;
    expect(medicationsSection.records).to.have.lengthOf(1);
    expect(medicationsSection.records[0].title).to.equal('Medication 1');
    expect(medicationsSection.records[0].details[0].items[1].value).to.equal(
      '123',
    );
  });

  it('should generate data for military history', () => {
    const data = {
      militaryHistory: [
        { eventTitle: 'Military History 1', serviceBranch: 'Army' },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const militaryHistorySection = result.find(
      section => section.type === selfEnteredTypes.MILITARY_HISTORY,
    );
    expect(militaryHistorySection).to.exist;
    expect(militaryHistorySection.records).to.have.lengthOf(1);
    expect(militaryHistorySection.records[0].title).to.equal(
      'Military History 1',
    );
    expect(
      militaryHistorySection.records[0].details[0].items[1].value,
    ).to.equal('Army');
  });

  it('should generate data for treatment facilities', () => {
    const data = {
      treatmentFacilities: [
        { facilityName: 'Treatment Facility 1', phoneNumber: '5555551212' },
      ],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const treatmentFacilitiesSection = result.find(
      section => section.type === selfEnteredTypes.TREATMENT_FACILITIES,
    );
    expect(treatmentFacilitiesSection).to.exist;
    expect(treatmentFacilitiesSection.records).to.have.lengthOf(1);
    expect(treatmentFacilitiesSection.records[0].title).to.equal(
      'Treatment Facility 1',
    );
    expect(
      treatmentFacilitiesSection.records[0].details[0].items[2].value,
    ).to.equal('5555551212');
  });

  it('should generate data for vaccines', () => {
    const data = {
      vaccines: [{ vaccine: 'Vaccine 1', dateReceived: '2021-01-01' }],
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const vaccinesSection = result.find(
      section => section.type === selfEnteredTypes.VACCINES,
    );
    expect(vaccinesSection).to.exist;
    expect(vaccinesSection.records).to.have.lengthOf(1);
    expect(vaccinesSection.records[0].title).to.equal('Vaccine 1');
    expect(vaccinesSection.records[0].details[0].items[1].value).to.equal(
      '2021-01-01',
    );
  });

  it('should generate data for vitals', () => {
    const data = {
      vitals: {
        [seiVitalTypes.BLOOD_PRESSURE]: [
          {
            time: '2021-01-01',
            systolic: 120,
            diastolic: 80,
            comments: 'Good',
          },
        ],
        [seiVitalTypes.BLOOD_SUGAR]: [
          {
            time: '2021-01-01',
            method: 'Fasting',
            bloodSugarCount: 100,
          },
        ],
        [seiVitalTypes.BODY_TEMPERATURE]: [
          {
            time: '2021-01-01',
            temperature: '98.6',
            measure: 'F',
            method: 'Oral',
          },
        ],
        [seiVitalTypes.BODY_WEIGHT]: [
          {
            time: '2021-01-01',
            weight: '150',
            measure: 'lbs',
          },
        ],
        [seiVitalTypes.CHOLESTEROL]: [
          {
            time: '2021-01-01',
            totalCholesterol: '200',
            hdl: '50',
            ldl: '100',
            measure: 'lbs',
          },
        ],
        [seiVitalTypes.HEART_RATE]: [
          {
            time: '2021-01-01',
            heartRate: '60',
          },
        ],
        [seiVitalTypes.INR]: [
          {
            time: '2021-01-01',
            inrValue: '2.0',
            lowendTargetRange: '1.5',
            highendTargetRange: '2.5',
          },
        ],
        [seiVitalTypes.PAIN]: [
          {
            time: '2021-01-01',
            painLevel: '5',
          },
        ],
        [seiVitalTypes.PULSE_OXIMETRY]: [
          {
            time: '2021-01-01',
            oximeterReading: '98',
            respiratoryRate: '20',
            supplementalOxygenDevice: 'None',
          },
        ],
      },
    };
    const result = generateSelfEnteredData(data);
    expect(result).to.be.an('array').that.is.not.empty;
    const vitalsSection = result.find(
      section => section.type === selfEnteredTypes.VITALS,
    );
    expect(vitalsSection).to.exist;
    expect(vitalsSection.records).to.be.an('array');
    expect(vitalsSection.records[0].results.header).to.equal('Blood Pressure');
    const systolic = vitalsSection.records[0].results.items[0].items[1].value;
    expect(systolic).to.equal(120);
  });
});
