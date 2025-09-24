import { expect } from 'chai';
import { getTxtContent } from '../../../util/txtHelpers/blueButton';

const data = {
  labsAndTests: [
    {
      name: 'Test 1',
      type: 'CHEM_HEM',
      sampleTested: 'sample',
      reason: 'blood test',
      clinicalHistory: 'Test clinical history',
      imagingLocation: 'Test location',
      imagingProvider: 'Test provider',
      sampleFrom: 'Test sample',
      orderedBy: 'Test ordered by',
      orderingLocation: 'Test ordering location',
      collectingLocation: 'Test collecting location',
      labLocation: 'Test lab location',
      date: '2022-01-01',
      comments: ['Test comments'],
      results: [
        'Test result 1',
        {
          name: 'Test result 2',
          result: 'Test result 2',
          standardRange: 'Test standard range',
          status: 'Test status',
          labComments: 'Test lab comments',
        },
      ],
    },
    {
      name: 'Test 2',
      type: 'CHEM_HEM',
      sampleTested: 'sample',
      reason: 'blood test',
      clinicalHistory: 'Test clinical history',
      imagingLocation: 'Test location',
      imagingProvider: 'Test provider',
      sampleFrom: 'Test sample',
      orderedBy: 'Test ordered by',
      orderingLocation: 'Test ordering location',
      collectingLocation: 'Test collecting location',
      labLocation: 'Test lab location',
      comments: ['Test comments'],
      results: 'Test result 2',
    },
    {
      name: 'Test 3',
      type: 'CHEM_HEM',
      sampleTested: 'sample',
      reason: 'blood test',
      clinicalHistory: 'Test clinical history',
      imagingLocation: 'Test location',
      imagingProvider: 'Test provider',
      sampleFrom: 'Test sample',
      orderedBy: 'Test ordered by',
      orderingLocation: 'Test ordering location',
      collectingLocation: 'Test collecting location',
      labLocation: 'Test lab location',
      comments: ['Test comments'],
      results: [
        {
          foo: 'bar',
        },
      ],
    },
    {
      name: 'Test 4',
      type: 'MICROBIOLOGY',
      date: '2022-01-02',
      orderedBy: 'Test ordered by',
    },
  ],
  notes: [
    { name: 'Note 1', type: 'DISCHARGE_SUMMARY' },
    { name: 'Note 2', type: 'PHYSICIAN_PROCEDURE_NOTE' },
  ],
  vaccines: [
    { name: 'Vaccine 1', notes: ['Test note'] },
    { name: 'Vaccine 2', notes: [] },
  ],
  allergies: [
    { name: 'Allergy 1', type: 'food', reaction: [] },
    { name: 'Allergy 2', type: 'medicine', reaction: [] },
  ],
  conditions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
  vitals: [
    { type: 'RESPIRATION', measurement: '42' },
    { type: 'PULSE' },
    { type: 'PULSE_OXIMETRY' },
    { type: 'PAIN' },
  ],
  medications: [
    { prescriptionName: 'Medication 1' },
    { prescriptionName: 'Medication 2' },
  ],
  appointments: [
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
  ],
  demographics: [
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
  ],
  militaryService: 'Branch: Army',
  accountSummary: {
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
  },
};

describe('getTxtContent', () => {
  const user = {
    userFullName: { first: 'John', last: 'Doe' },
    dob: '1974-04-06',
  };
  const dateRange = { fromDate: 'any', toDate: 'any' };
  const failedDomainsList = [];

  it('should handle data with all fields populated', () => {
    const result = getTxtContent(data, user, dateRange, failedDomainsList);
    expect(result).to.include('Date range: All time');
    expect(result).to.include('Lab and test results');
    expect(result).to.include('Test 1 on');
    expect(result).to.include('Care summaries and notes');
    expect(result).to.include('Note 1');
    expect(result).to.include('Vaccine 1');
    expect(result).to.include('Type of allergy: food');
    expect(result).to.include('SNOMED Clinical term: Condition 1');
    expect(result).to.include('Result: 42');
    expect(result).to.include('This is a list of prescriptions');
    expect(result).to.include('Title: Medication 1');
    expect(result).to.include('Appointments');
    expect(result).to.include('Where to attend: Facility 1');
    expect(result).to.include('Demographics');
    expect(result).to.include('VA Facility: Facility 1');
    expect(result).to.include('Title: DOD Military Service Information');
    expect(result).to.include('Branch: Army');
    expect(result).to.include('VA Treatment Facilities');
  });

  it('splits “Appointments” into Past and Upcoming in the records list', () => {
    const result = getTxtContent(data, user, dateRange, []);
    expect(result).to.include('Past appointments');
    expect(result).to.include('Upcoming appointments');
    // and make sure we no longer render a bullet for the old generic label
    expect(result).not.to.match(/• Appointments/);
  });

  it('shows empty-array sections under “Records not in this report”', () => {
    // e.g. simulate no labsAndTests
    const partialData = { ...data, labsAndTests: [] };
    const result = getTxtContent(partialData, user, dateRange, []);
    expect(result).to.include('Records not in this report');
    expect(result).to.include('• Lab and test results');
    // and still include at least one non-empty section
    expect(result).to.include('Lab and test results');
  });

  it("lists failedDomains under “Information we can't access right now”", () => {
    const failed = ['Vaccines', 'VA appointments'];
    const result = getTxtContent(data, user, dateRange, failed);
    expect(result).to.include("Information we can't access right now");
    expect(result).to.include('• Vaccines');
    // VA appointments should expand to both labels
    expect(result).to.include('• Past appointments');
    expect(result).to.include('• Upcoming appointments');
  });

  it('renders a specific date range when fromDate ≠ “any”', () => {
    const customDateRange = { fromDate: '2022-01-01', toDate: '2022-12-31' };
    const result = getTxtContent(data, user, customDateRange, []);
    expect(result).to.include('Date range: 2022-01-01 to 2022-12-31');
  });
});
