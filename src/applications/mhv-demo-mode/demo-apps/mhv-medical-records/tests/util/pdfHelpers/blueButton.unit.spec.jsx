import { expect } from 'chai';
import { generateBlueButtonData } from '../../../util/pdfHelpers/blueButton';
import {
  NONE_RECORDED,
  recordType,
  blueButtonRecordTypes,
  labTypes,
  loincCodes,
  medicationTypes,
  vitalTypes,
} from '../../../util/constants';

describe('generateBlueButtonData', () => {
  const labsAndTests = [
    {
      name: 'Test 1',
      type: labTypes.CHEM_HEM,
      results: [{ name: 'Test result 1', result: 'Test result 1' }],
    },
    {
      name: 'Test 2',
      type: labTypes.MICROBIOLOGY,
      results: [
        {
          name: 'Test result 2',
          result: 'Test result 2',
          labType: 'Test lab type',
        },
      ],
    },
    {
      name: 'Test 3',
      type: labTypes.PATHOLOGY,
      results: [{ name: 'Test result 3', result: 'Test result 3' }],
    },
    {
      name: 'Test 4',
      type: labTypes.CHEM_HEM,
      results: [{ name: 'Test result 4', result: 'Test result 4' }],
    },
    {
      name: 'Test 5',
      type: labTypes.RADIOLOGY,
      results: [{ name: 'Test result 5', result: 'Test result 5' }],
    },
  ];

  it('should return an empty array when no records are provided', () => {
    const result = generateBlueButtonData({}, []);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(11);
  });

  it('should generate data for labs and tests', () => {
    const result = generateBlueButtonData({ labsAndTests }, ['labTests']);
    expect(result).to.be.an('array').that.is.not.empty;
    const labsAndTestsSection = result.find(
      section => section.type === recordType.LABS_AND_TESTS,
    );
    expect(labsAndTestsSection).to.exist;
    expect(labsAndTestsSection.subtitles[0]).to.equal(
      'Most lab and test results are available 36 hours after the lab confirms them. Pathology results may take 14 days or longer to confirm.',
    );
    expect(labsAndTestsSection.subtitles).to.have.lengthOf(4);
    expect(labsAndTestsSection.records).to.have.lengthOf(5);
    expect(labsAndTestsSection.records[0].title).to.equal('Test 1');
    expect(
      labsAndTestsSection.records[0].results.items[0].items[0].value,
    ).to.equal('Test result 1');
  });

  it('should generate data for labs and tests: subtitles based on holdTimeMessagingUpdate being true', () => {
    const result = generateBlueButtonData({ labsAndTests }, ['labTests'], true);
    const labsAndTestsSection = result.find(
      section => section.type === recordType.LABS_AND_TESTS,
    );
    expect(labsAndTestsSection.subtitles[0]).to.equal(
      `Your test results are available here as soon as they're ready. You may have access to your results before your care team reviews them.`,
    );
    expect(labsAndTestsSection.subtitles[1]).to.equal(
      'Please give your care team some time to review your results. Test results can be complex. Your team can help you understand what the results mean for your overall health.',
    );
    expect(labsAndTestsSection.subtitles[2]).to.equal(
      'If you do review results on your own, remember that many factors can affect what they mean for you. If you have concerns, contact your care team.',
    );
    expect(labsAndTestsSection.subtitles).to.have.lengthOf(6);
  });

  it('should generate data for care summaries and notes', () => {
    const notes = [
      { name: 'Note 1', type: loincCodes.DISCHARGE_SUMMARY },
      { name: 'Note 2', type: loincCodes.PHYSICIAN_PROCEDURE_NOTE },
      { name: 'Note 2', type: loincCodes.CONSULT_RESULT },
    ];
    const result = generateBlueButtonData({ notes }, ['careSummaries']);
    expect(result).to.be.an('array').that.is.not.empty;
    const notesSection = result.find(
      section => section.type === recordType.CARE_SUMMARIES_AND_NOTES,
    );
    expect(notesSection).to.exist;
    expect(notesSection.records).to.have.lengthOf(3);
    expect(notesSection.records[0].title).to.equal('Note 1');
  });

  it('should generate data for vaccines', () => {
    const vaccines = [
      { name: 'Vaccine 1', date: '2021-01-01' },
      { name: 'Vaccine 2', date: '2021-01-01' },
    ];
    const result = generateBlueButtonData({ vaccines }, ['vaccines']);
    expect(result).to.be.an('array').that.is.not.empty;
    const vaccinesSection = result.find(
      section => section.type === recordType.VACCINES,
    );
    expect(vaccinesSection).to.exist;
    expect(vaccinesSection.records.results.items).to.have.lengthOf(2);
    expect(vaccinesSection.records.results.items[0].items[0].value).to.equal(
      '2021-01-01',
    );
  });

  it('should generate data for allergies', () => {
    const allergies = [
      { name: 'Allergy 1', reaction: ['hives'] },
      { name: 'Allergy 2', reaction: ['hives'], isOracleHealthData: true },
    ];
    const result = generateBlueButtonData({ allergies }, ['allergies']);
    expect(result).to.be.an('array').that.is.not.empty;
    const allergiesSection = result.find(
      section => section.type === recordType.ALLERGIES,
    );
    expect(allergiesSection).to.exist;
    expect(allergiesSection.records.results.items).to.have.lengthOf(2);
    expect(allergiesSection.records.results.items[0].header).to.equal(
      'Allergy 1',
    );
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
    expect(conditionsSection.records[0].title).to.equal('Condition 1');
  });

  it('should generate data for vitals', () => {
    const vitals = [
      {
        name: 'Vital 1',
        type: vitalTypes.HEIGHT,
        date: '2021-01-01',
        measurement: '72',
        location: 'Test location',
        notes: 'Test notes',
      },
      {
        name: 'Vital 2',
        type: vitalTypes.PAIN_SEVERITY,
        date: '2021-01-01',
        measurement: '5',
        location: 'Pittsburgh VAMC',
      },
    ];
    const result = generateBlueButtonData({ vitals }, ['vitals']);
    expect(result).to.be.an('array').that.is.not.empty;
    const vitalsSection = result.find(
      section => section.type === recordType.VITALS,
    );
    expect(vitalsSection).to.exist;
    expect(vitalsSection.records).to.have.lengthOf(2);
    expect(vitalsSection.records[0].results.items[0].header).to.equal(
      '2021-01-01',
    );
    expect(vitalsSection.records[0].results.items[0].items[0].value).to.equal(
      '72',
    );
  });

  it('should generate data for medications', () => {
    const medications = [
      {
        prescriptionName: 'Medication 1',
        status: 'Active',
        type: medicationTypes.VA,
      },
      {
        prescriptionName: 'Medication 2',
        status: 'Inactive',
        type: medicationTypes.VA,
      },
    ];
    const result = generateBlueButtonData({ medications }, ['medications']);
    expect(result).to.be.an('array').that.is.not.empty;
    const medicationsSection = result.find(
      section => section.type === blueButtonRecordTypes.MEDICATIONS,
    );
    expect(medicationsSection).to.exist;
    expect(medicationsSection.records).to.have.lengthOf(2);
    expect(medicationsSection.records[0].title).to.equal('Medication 1');
    expect(medicationsSection.records[0].details[0].items[1].value).to.equal(
      'Active',
    );
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
    const result = generateBlueButtonData({ appointments }, [
      'upcomingAppts',
      'pastAppts',
    ]);
    expect(result).to.be.an('array').that.is.not.empty;
    const appointmentsSection = result.find(
      section => section.type === blueButtonRecordTypes.APPOINTMENTS,
    );
    expect(appointmentsSection).to.exist;
    expect(appointmentsSection.records).to.have.lengthOf(2);
    expect(appointmentsSection.records[0].title).to.equal(
      'Upcoming appointments',
    );
    expect(appointmentsSection.records[0].results.items[0].header).to.equal(
      '2022-01-01',
    );
  });

  it('should generate data for demographics', () => {
    const demographics = [
      {
        facility: 'Facility 1',
        eligibility: {
          serviceConnectedPercentage: NONE_RECORDED,
          meansTestStatus: NONE_RECORDED,
          primaryEligibilityCode: NONE_RECORDED,
        },
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
    expect(demographicsSection.records[0].title).to.equal(
      'VA facility: Facility 1',
    );
    expect(
      demographicsSection.records[0].results.items[1].items[0].value,
    ).to.equal('123 main st');
  });

  it('should generate data for military service', () => {
    const militaryService = 'Army';
    const result = generateBlueButtonData({ militaryService }, [
      'militaryService',
    ]);
    expect(result).to.be.an('array').that.is.not.empty;
    const militaryServiceSection = result.find(
      section => section.type === blueButtonRecordTypes.MILITARY_SERVICE,
    );
    expect(militaryServiceSection).to.exist;
    expect(militaryServiceSection.records).to.have.lengthOf(1);
    expect(militaryServiceSection.records[0].details.items[0].value).to.equal(
      'Army',
    );
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
    expect(accountSummarySection.records.details.items[0].value).to.equal(
      'Source 1',
    );
    expect(accountSummarySection.records.results.items[0].header).to.equal(
      'Facility 1',
    );
  });

  it('should include allergies if medications is present', () => {
    const input = {
      allergies: [
        { name: 'Allergy 1', reaction: ['hives'] },
        { name: 'Allergy 2', reaction: ['hives'], isOracleHealthData: true },
      ],
      medications: [{ prescriptionName: 'Medication 1' }],
    };

    const recordFilter = ['medications'];
    const result = generateBlueButtonData(input, recordFilter);
    const allergiesSection = result.find(
      section => section.type === recordType.ALLERGIES,
    );

    expect(allergiesSection).to.exist;
    expect(allergiesSection.selected).to.be.true;
    expect(allergiesSection.records.results.items).to.have.lengthOf(2);
    expect(allergiesSection.records.results.items[0].header).to.equal(
      'Allergy 1',
    );
  });

  it('should not include allergies if neither allergies nor medications are present', () => {
    const input = {
      labsAndTests: [],
      notes: [],
      vaccines: [],
      allergies: [],
      conditions: [],
      vitals: [],
      medications: [],
      appointments: [],
      demographics: [],
      militaryService: [],
      accountSummary: null,
    };

    const recordFilter = [];
    const result = generateBlueButtonData(input, recordFilter);
    const allergiesSection = result.find(
      section => section.type === recordType.ALLERGIES,
    );

    expect(allergiesSection).to.exist;
    expect(allergiesSection.selected).to.be.false;
    expect(allergiesSection.records.length).to.eq(0);
  });

  it('should not include allergies if medications is selected but empty', () => {
    const input = { allergies: [{ name: 'Allergy 1', reaction: ['hives'] }] };

    const recordFilter = ['medications'];
    const result = generateBlueButtonData(input, recordFilter);
    const allergiesSection = result.find(
      section => section.type === recordType.ALLERGIES,
    );

    expect(allergiesSection).to.exist;
    expect(allergiesSection.selected).to.be.false;
    expect(allergiesSection.records.results.items).to.have.lengthOf(1);
  });
});
