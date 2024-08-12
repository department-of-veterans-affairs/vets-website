import React from 'react';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';

import ProfilePageHeader from '../../containers/ProfilePageHeader';

const TEST_RATINGS = {
  id: 562,
  institutionId: 30036386,
  q1Avg: '4.0',
  q1Count: 5,
  q2Avg: '3.0',
  q2Count: 5,
  q3Avg: '2.0',
  q3Count: 5,
  q4Avg: '2.8',
  q4Count: 5,
  q5Avg: '2.0',
  q5Count: 5,
  q7Avg: '3.0',
  q7Count: 5,
  q8Avg: '3.0',
  q8Count: 5,
  q9Avg: '3.0',
  q9Count: 5,
  q10Avg: '4.0',
  q10Count: 5,
  q11Avg: '3.2',
  q11Count: 5,
  q12Avg: '4.0',
  q12Count: 5,
  q13Avg: '3.0',
  q13Count: 5,
  q14Avg: '3.8',
  q14Count: 5,
  q15Avg: null,
  q15Count: null,
  q16Avg: null,
  q16Count: null,
  q17Avg: null,
  q17Count: null,
  q18Avg: null,
  q18Count: null,
  q19Avg: null,
  q19Count: null,
  q20Avg: null,
  q20Count: null,
  m1Avg: '2.8',
  m2Avg: '3.3',
  m3Avg: '3.6',
  m4Avg: '3.4',
  m5Avg: null,
  m6Avg: null,
  m7Avg: null,
  overallAvg: '3.1',
  institutionRatingCount: 5,
};

const TEST_INSTITUTION = {
  name: "AUSTIN'S BEAUTY COLLEGE INC",
  facilityCode: '25008642',
  type: 'FOR PROFIT',
  city: 'CLARKSVILLE',
  state: 'TN',
  zip: '37040',
  country: 'USA',
  bah: 1707,
  cross: '219851',
  flight: false,
  correspondence: false,
  ope: '04142000',
  ope6: '41420',
  schoolSystemName: null,
  schoolSystemCode: -2,
  alias: "Austin's Beauty College",
  highestDegree: 'Certificate',
  localeType: 'city',
  address1: 'PO BOX 1121',
  lowerType: 'ojt',
  address2: null,
  address3: null,
  studentCount: 28,
  undergradEnrollment: 120,
  yr: false,
  studentVeteran: null,
  studentVeteranLink: null,
  poe: true,
  eightKeys: null,
  stemOffered: false,
  dodmou: null,
  sec702: null,
  vetSuccessName: null,
  vetSuccessEmail: null,
  creditForMilTraining: false,
  vetPoc: true,
  studentVetGrpIpeds: false,
  socMember: true,
  retentionRateVeteranBa: null,
  retentionAllStudentsBa: null,
  retentionRateVeteranOtb: null,
  retentionAllStudentsOtb: 1,
  persistanceRateVeteranBa: null,
  persistanceRateVeteranOtb: null,
  graduationRateVeteran: 0,
  graduationRateAllStudents: 0.9286,
  transferOutRateVeteran: null,
  transferOutRateAllStudents: null,
  salaryAllStudents: null,
  repaymentRateAllStudents: null,
  avgStuLoanDebt: 7917,
  calendar: 'nontraditional',
  tuitionInState: 14425,
  tuitionOutOfState: 14425,
  books: 1570,
  onlineAll: true,
  p911TuitionFees: 159814.5,
  p911Recipients: 12,
  p911YellowRibbon: 0,
  p911YrRecipients: 0,
  accredited: true,
  accreditationType: 'hybrid',
  accreditationStatus: null,
  cautionFlag: null,
  cautionFlagReason: null,
  cautionFlags: [],
  complaints: {
    facilityCode: 4,
    financialByFacCode: 0,
    qualityByFacCode: 3,
    refundByFacCode: 0,
    marketingByFacCode: 1,
    accreditationByFacCode: 0,
    degreeRequirementsByFacCode: 0,
    studentLoansByFacCode: 0,
    gradesByFacCode: 0,
    creditTransferByFacCode: 0,
    creditJobByFacCode: null,
    jobByFacCode: 0,
    transcriptByFacCode: 0,
    otherByFacCode: 0,
    mainCampusRollUp: 4,
    financialByOpeIdDoNotSum: 0,
    qualityByOpeIdDoNotSum: 3,
    refundByOpeIdDoNotSum: 0,
    marketingByOpeIdDoNotSum: 1,
    accreditationByOpeIdDoNotSum: 0,
    degreeRequirementsByOpeIdDoNotSum: 0,
    studentLoansByOpeIdDoNotSum: 0,
    gradesByOpeIdDoNotSum: 0,
    creditTransferByOpeIdDoNotSum: 0,
    jobsByOpeIdDoNotSum: 0,
    transcriptByOpeIdDoNotSum: 0,
    otherByOpeIdDoNotSum: 0,
  },
  schoolClosing: false,
  schoolClosingOn: null,
  schoolClosingMessage: null,
  yellowRibbonPrograms: [],
  independentStudy: false,
  priorityEnrollment: false,
  createdAt: '2023-10-24T11:54:37.000Z',
  updatedAt: '2023-10-24T11:54:37.000Z',
  physicalAddress1: '585A S RIVERSIDE DR',
  physicalAddress2: null,
  physicalAddress3: null,
  physicalCity: 'CLARKSVILLE',
  physicalState: 'TN',
  physicalCountry: 'USA',
  onlineOnly: false,
  distanceLearning: false,
  dodBah: 1596,
  physicalZip: '37040',
  parentFacilityCodeId: null,
  campusType: 'Y',
  vetTecProvider: false,
  preferredProvider: false,
  stemIndicator: false,
  facilityMap: {
    main: {
      institution: {
        id: 30071883,
        version: {
          number: 422,
          createdAt: '2023-10-24T11:54:22.986Z',
          preview: false,
        },
        institutionTypeName: 'FOR PROFIT',
        facilityCode: '25008642',
        institution: "AUSTIN'S BEAUTY COLLEGE INC",
        city: 'CLARKSVILLE',
        state: 'TN',
        zip: '37040',
        country: 'USA',
        flight: false,
        correspondence: false,
        bah: 1707,
        cross: '219851',
        ope: '04142000',
        ope6: '41420',
        insturl: 'www.austinbeautycollege.com/',
        vetTuitionPolicyUrl: 'www.austinbeautycollege.com/',
        predDegreeAwarded: 1,
        locale: 12,
        gibill: 28,
        undergradEnrollment: 120,
        yr: false,
        studentVeteran: null,
        studentVeteranLink: null,
        poe: true,
        eightKeys: null,
        dodmou: null,
        sec702: null,
        vetsuccessName: null,
        vetsuccessEmail: null,
        creditForMilTraining: false,
        vetPoc: true,
        studentVetGrpIpeds: false,
        socMember: true,
        vaHighestDegreeOffered: 'NCD',
        retentionRateVeteranBa: null,
        retentionAllStudentsBa: null,
        retentionRateVeteranOtb: null,
        retentionAllStudentsOtb: 1,
        persistanceRateVeteranBa: null,
        persistanceRateVeteranOtb: null,
        graduationRateVeteran: 0,
        graduationRateAllStudents: 0.9286,
        transferOutRateVeteran: null,
        transferOutRateAllStudents: null,
        salaryAllStudents: null,
        repaymentRateAllStudents: null,
        avgStuLoanDebt: 7917,
        calendar: 'nontraditional',
        tuitionInState: 14425,
        tuitionOutOfState: 14425,
        books: 1570,
        onlineAll: true,
        p911TuitionFees: 159814.5,
        p911Recipients: 12,
        p911YellowRibbon: 0,
        p911YrRecipients: 0,
        accredited: true,
        accreditationType: 'hybrid',
        accreditationStatus: null,
        cautionFlag: null,
        cautionFlagReason: null,
        complaintsFacilityCode: 4,
        complaintsFinancialByFacCode: 0,
        complaintsQualityByFacCode: 3,
        complaintsRefundByFacCode: 0,
        complaintsMarketingByFacCode: 1,
        complaintsAccreditationByFacCode: 0,
        complaintsDegreeRequirementsByFacCode: 0,
        complaintsStudentLoansByFacCode: 0,
        complaintsGradesByFacCode: 0,
        complaintsCreditTransferByFacCode: 0,
        complaintsCreditJobByFacCode: null,
        complaintsJobByFacCode: 0,
        complaintsTranscriptByFacCode: 0,
        complaintsOtherByFacCode: 0,
        complaintsMainCampusRollUp: 4,
        complaintsFinancialByOpeIdDoNotSum: 0,
        complaintsQualityByOpeIdDoNotSum: 3,
        complaintsRefundByOpeIdDoNotSum: 0,
        complaintsMarketingByOpeIdDoNotSum: 1,
        complaintsAccreditationByOpeIdDoNotSum: 0,
        complaintsDegreeRequirementsByOpeIdDoNotSum: 0,
        complaintsStudentLoansByOpeIdDoNotSum: 0,
        complaintsGradesByOpeIdDoNotSum: 0,
        complaintsCreditTransferByOpeIdDoNotSum: 0,
        complaintsJobsByOpeIdDoNotSum: 0,
        complaintsTranscriptByOpeIdDoNotSum: 0,
        complaintsOtherByOpeIdDoNotSum: 0,
        createdAt: '2023-10-24T11:54:37.000Z',
        updatedAt: '2023-10-24T11:54:37.000Z',
        f1sysnam: null,
        f1syscod: -2,
        ialias: "Austin's Beauty College",
        approvalStatus: null,
        schoolClosing: false,
        schoolClosingOn: null,
        schoolClosingMessage: null,
        stemOffered: false,
        priorityEnrollment: false,
        onlineOnly: false,
        independentStudy: false,
        distanceLearning: false,
        address1: 'PO BOX 1121',
        address2: null,
        address3: null,
        physicalAddress1: '585A S RIVERSIDE DR',
        physicalAddress2: null,
        physicalAddress3: null,
        physicalCity: 'CLARKSVILLE',
        physicalState: 'TN',
        physicalZip: '37040',
        physicalCountry: 'USA',
        dodBah: 1596,
        approved: true,
        vetTecProvider: false,
        closure109: null,
        preferredProvider: false,
        stemIndicator: false,
        campusType: 'Y',
        parentFacilityCodeId: null,
        versionId: 520,
        compliesWithSec103: null,
        solelyRequiresCoe: null,
        requiresCoeAndCriteria: null,
        countOfCautionFlags: 0,
        section103Message: 'No',
        pooStatus: 'APRVD',
        hbcu: 0,
        hcm2: 0,
        menonly: 0,
        pctfloan: 0.7015,
        relaffil: null,
        womenonly: 0,
        institutionSearch: "AUSTIN'S BEAUTY",
        ratingCount: 0,
        ratingAverage: null,
        latitude: 36.5277607,
        longitude: -87.3588703,
        employerProvider: false,
        schoolProvider: true,
        vrrap: null,
        inStateTuitionInformation: null,
        badAddress: false,
        highSchool: null,
        chiefOfficer: null,
        ownershipName: null,
        hsi: 0,
        nanti: 0,
        annhi: 0,
        aanapii: 0,
        pbi: 0,
        tribal: 0,
        ungeocodable: false,
        distance: null,
      },
      branches: [],
      extensions: [],
    },
  },
  programs: [],
  versionedSchoolCertifyingOfficials: [
    {
      id: 18318530,
      facilityCode: '25008642',
      institutionName: "AUSTIN'S BEAUTY COLLEGE INC",
      priority: 'Primary',
      firstName: 'LORIE',
      lastName: 'GIBBS',
      title: 'DIRECTOR OF OPERATIONS',
      phoneAreaCode: '931',
      phoneNumber: '542-4464',
      phoneExtension: null,
      email: 'LGIBBS@AUSTINBEAUTYCOLLEGE.COM',
      version: null,
      institutionId: 30071883,
    },
  ],
  countOfCautionFlags: 0,
  section103Message: 'No',
  hbcu: 0,
  hcm2: 0,
  menonly: 0,
  pctfloan: 0.7015,
  relaffil: null,
  womenonly: 0,
  hsi: 0,
  nanti: 0,
  annhi: 0,
  aanapii: 0,
  pbi: 0,
  tribal: 0,
  institutionRating: null,
  ratingAverage: null,
  ratingCount: 0,
  inStateTuitionInformation: null,
  vrrap: null,
  ownershipName: null,
  website: 'http://www.austinbeautycollege.com/',
  scorecard:
    'https://collegescorecard.ed.gov/school/?219851-austin-s-beauty-college-inc',
  vetWebsiteLink: 'http://www.austinbeautycollege.com/',
  self: 'https://staging-platform-api.va.gov/gids/v0/institutions/25008642',
};

describe('<ProfilePageHeader>', () => {
  beforeEach(() => {
    global.window.buildType = true;
  });
  afterEach(() => {
    global.window.buildType = false;
  });

  it('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <ProfilePageHeader institution={TEST_INSTITUTION} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('should click on compare checkbox for Austins Beauty College', async () => {
    const screen = renderWithStoreAndRouter(
      <ProfilePageHeader institution={TEST_INSTITUTION} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );

    const compareCheckBox = screen.getByRole('checkbox', {
      name: "Compare AUSTIN'S BEAUTY COLLEGE INC undefined",
    });
    fireEvent.click(compareCheckBox);

    await waitFor(() => {
      expect(compareCheckBox).to.have.property('checked', true);
    });
  });

  it('should click on compare checkbox for Austins Beauty College then unclick it', async () => {
    const screen = renderWithStoreAndRouter(
      <ProfilePageHeader institution={TEST_INSTITUTION} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );

    const compareCheckBox = screen.getByRole('checkbox', {
      name: "Compare AUSTIN'S BEAUTY COLLEGE INC undefined",
    });
    fireEvent.click(compareCheckBox);
    fireEvent.click(compareCheckBox);

    await waitFor(() => {
      expect(compareCheckBox).to.have.property('checked', false);
    });
  });

  it('should show OJT text', async () => {
    const OJT_TEST_INSTITUTION = { ...TEST_INSTITUTION, type: 'OJT' };

    const screen = renderWithStoreAndRouter(
      <ProfilePageHeader institution={OJT_TEST_INSTITUTION} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const OJTText = screen.getByText(/On-the-job training/i);

    await waitFor(() => {
      expect(document.body.contains(OJTText)).to.be.true;
    });
  });

  it('should have institution rating', async () => {
    const RAITINGS_TEST_INSTITUTION = {
      ...TEST_INSTITUTION,
      institutionRating: TEST_RATINGS,
    };

    const screen = renderWithStoreAndRouter(
      <ProfilePageHeader institution={RAITINGS_TEST_INSTITUTION} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const raitingsText = screen.getByText(/See 5 ratings by Veterans/i);

    await waitFor(() => {
      expect(document.body.contains(raitingsText)).to.be.true;
    });
  });

  // test for vettec preferredProvider and if the institution has a program number
  it('should render institution as a vettec preferredProvider', async () => {
    const VETTEC_TEST_INSTITUTION = {
      ...TEST_INSTITUTION,
      programs: [{ phoneAreaCode: 405, phoneNumber: 1231231 }],
      preferredProvider: true,
    };

    const screen = renderWithStoreAndRouter(
      <ProfilePageHeader institution={VETTEC_TEST_INSTITUTION} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const vettecText = screen.getByText(/Preferred Provider/i);

    await waitFor(() => {
      expect(document.body.contains(vettecText)).to.be.true;
    });
  });
  it('should render a div with class usa-grid vads-u-padding-y--1p5 vads-u-padding-x--2', async () => {
    const VETTEC_TEST_INSTITUTION = {
      ...TEST_INSTITUTION,
      programs: [
        {
          phoneAreaCode: 405,
          phoneNumber: 1231231,
          providerWebsite: 'https://www.google.com',
        },
      ],
      vetTecProvider: true,
      cautionFlags: [
        { title: 'Test caution flag', description: 'Test caution flag' },
      ],
    };

    const screen = renderWithStoreAndRouter(
      <ProfilePageHeader institution={VETTEC_TEST_INSTITUTION} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const vettecText = screen.getByText('https://www.google.com');

    await waitFor(() => {
      expect(document.body.contains(vettecText)).to.be.true;
    });
  });
});
