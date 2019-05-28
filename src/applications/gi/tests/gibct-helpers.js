/* eslint camelcase: 0 */
/* eslint quote-props: 0 */
/* eslint quotes: 0 */

const Timeouts = require('../../../platform/testing/e2e/timeouts');

const mock = require('../../../platform/testing/e2e/mock-helpers');

// Selects DEA as benefit type, searches for schools in washington dc and clicks the expected result
function searchAsDEA(client, expectedResult) {
  client
    .waitForElementVisible('#giBillChapter', Timeouts.slow)
    .selectDropdown('giBillChapter', '35');

  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', 'washington dc');

  client
    .click('#search-button')
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');

  client
    .waitForElementVisible(expectedResult, Timeouts.normal)
    .click(expectedResult)
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main');
}

// Verify the expected DEA housing rate for the selected "Enrolled" option
function verifyDEA(client, enrolledOption, expectedDEA) {
  client
    .selectDropdown('enrolledOld', enrolledOption)
    .waitForElementVisible('.total-paid-to-you', Timeouts.normal)
    .assert.containsText('.total-paid-to-you', expectedDEA);
}

// Loops through all "Enrolled" options for an ojt facility and verifies the DEA housing rate
function verifyAllDEAojt(client) {
  for (let i = 2; i <= 30; i += 2) {
    client
      .waitForElementVisible('.total-paid-to-you', Timeouts.verySlow)
      .pause(500)
      .selectDropdown('working', i);
    const value = Math.round((i / 30) * 747);
    client.assert.containsText('.total-paid-to-you', `$${value}/mo`);
  }
}

const schools = {
  data: [
    {
      id: '1290',
      type: 'institutions',
      attributes: {
        name: 'AMTRAK-WASHINGTON DC',
        facility_code: '10F00509',
        type: 'OJT',
        city: 'WASHINGTON',
        state: 'DC',
        zip: '20002',
        country: 'USA',
        highest_degree: null,
        locale_type: null,
        student_count: 0,
        caution_flag: false,
        caution_flag_reason: null,
        created_at: '2017-03-22T17:05:04.440Z',
        updated_at: '2017-03-22T17:05:04.440Z',
        bah: 2301.0,
        tuition_in_state: null,
        tuition_out_of_state: null,
        books: null,
        student_veteran: false,
        yr: false,
        poe: false,
        eight_keys: false,
      },
      links: {
        self: 'https://staging-api.vets.gov/gids/v0/institutions/10F00509',
      },
    },
    {
      id: '930511',
      type: 'institutions',
      attributes: {
        name: 'AMERICAN UNIVERSITY',
        facilityCode: '31106109',
        type: 'PRIVATE',
        city: 'WASHINGTON',
        state: 'DC',
        zip: '20016',
        country: 'USA',
        highestDegree: 4,
        localeType: 'city',
        studentCount: 432,
        cautionFlag: null,
        cautionFlagReason: null,
        createdAt: '2019-01-30T21:52:37.000Z',
        updatedAt: '2019-01-30T21:52:37.000Z',
        address1: 'AU CENTRAL - ASBURY  BLDG 201R',
        address2: '4400 MASSACHUSETTS  AVE NW',
        address3: null,
        physicalCity: 'WASHINGTON',
        physicalState: 'DC',
        physicalCountry: 'USA',
        onlineOnly: false,
        distanceLearning: true,
        dodBah: 2367,
        physicalZip: '20016',
        bah: 2436,
        tuitionInState: 41833,
        tuitionOutOfState: 41833,
        books: 800,
        studentVeteran: true,
        yr: true,
        poe: true,
        eightKeys: true,
        stemOffered: true,
        independentStudy: false,
        priorityEnrollment: false,
        schoolClosing: false,
      },
      links: {
        self: 'https://staging-api.va.gov/v0/gi/institutions/31106109',
      },
    },
    {
      id: '908195',
      type: 'institutions',
      attributes: {
        name: 'DUBLIN CITY UNIVERSITY',
        facilityCode: '11002174',
        type: 'FOREIGN',
        city: 'DUBLIN DO9 Y5NO',
        state: null,
        zip: null,
        country: 'IRELAND',
        highestDegree: 4,
        localeType: null,
        studentCount: 1,
        cautionFlag: null,
        cautionFlagReason: null,
        createdAt: '2019-01-30T21:52:37.000Z',
        updatedAt: '2019-01-30T21:52:37.000Z',
        address1: 'INTERNATIONAL OFFICE',
        address2: 'GLASNEVIN',
        address3: null,
        physicalCity: 'GLASNEVIN, DUBLIN 9',
        physicalState: null,
        physicalCountry: 'IRELAND',
        onlineOnly: false,
        distanceLearning: false,
        dodBah: null,
        physicalZip: null,
        bah: null,
        tuitionInState: null,
        tuitionOutOfState: null,
        books: null,
        studentVeteran: null,
        yr: false,
        poe: false,
        eightKeys: null,
        stemOffered: false,
        independentStudy: false,
        priorityEnrollment: false,
        schoolClosing: false,
      },
      links: {
        self: 'https://staging-api.va.gov/v0/gi/institutions/11002174',
      },
    },
  ],
  links: {
    self:
      'https://staging-api.vets.gov/gids/v0/institutions?name=washington+dc&version=1',
    first:
      'https://staging-api.vets.gov/gids/v0/institutions?name=washington+dc&page=1&per_page=10&version=1',
    prev: null,
    next:
      'https://staging-api.vets.gov/gids/v0/institutions?name=washington+dc&page=2&per_page=10&version=1',
    last:
      'https://staging-api.vets.gov/gids/v0/institutions?name=washington+dc&page=2&per_page=10&version=1',
  },
  meta: {
    version: {
      number: 1,
      created_at: '2017-03-22T17:05:04.453Z',
      preview: false,
    },
    count: 12,
    facets: {
      category: {
        school: 5,
        employer: 7,
      },
      type: {
        'for profit': 3,
        ojt: 7,
        private: 1,
        public: 1,
      },
      state: {
        dc: 8,
        md: 3,
        va: 1,
      },
      country: [
        {
          name: 'USA',
          count: 12,
        },
      ],
      caution_flag: {
        false: 10,
        true: 2,
      },
      student_vet_group: {
        false: 11,
        true: 1,
      },
      yellow_ribbon_scholarship: {
        false: 8,
        true: 4,
      },
      principles_of_excellence: {
        false: 7,
        true: 5,
      },
      eight_keys_to_veteran_success: {
        false: 8,
        true: 4,
      },
    },
  },
};

const singleSchool = {
  data: {
    id: '1290',
    type: 'institutions',
    attributes: {
      name: 'AMTRAK-WASHINGTON DC',
      facility_code: '10F00509',
      type: 'OJT',
      city: 'WASHINGTON',
      state: 'DC',
      zip: '20002',
      country: 'USA',
      bah: 2301.0,
      dodBah: 2100.0,
      cross: null,
      flight: false,
      correspondence: false,
      ope: null,
      ope6: null,
      highest_degree: null,
      locale_type: null,
      student_count: 0,
      undergrad_enrollment: null,
      yr: false,
      student_veteran: false,
      student_veteran_link: null,
      poe: false,
      eight_keys: false,
      dodmou: false,
      sec_702: null,
      vet_success_name: null,
      vet_success_email: null,
      credit_for_mil_training: null,
      vet_poc: null,
      student_vet_grp_ipeds: null,
      soc_member: null,
      retention_rate_veteran_ba: null,
      retention_all_students_ba: null,
      retention_rate_veteran_otb: null,
      retention_all_students_otb: null,
      persistance_rate_veteran_ba: null,
      persistance_rate_veteran_otb: null,
      graduation_rate_veteran: null,
      graduation_rate_all_students: null,
      transfer_out_rate_veteran: null,
      transfer_out_rate_all_students: null,
      salary_all_students: null,
      repayment_rate_all_students: null,
      avg_stu_loan_debt: null,
      calendar: null,
      tuition_in_state: null,
      tuition_out_of_state: null,
      books: null,
      online_all: null,
      p911_tuition_fees: 0.0,
      p911_recipients: 0,
      p911_yellow_ribbon: 0.0,
      p911_yr_recipients: 0,
      accredited: false,
      accreditation_type: null,
      accreditation_status: null,
      caution_flag: false,
      caution_flag_reason: null,
      complaints: {
        facility_code: 0,
        financial_by_fac_code: 0,
        quality_by_fac_code: 0,
        refund_by_fac_code: 0,
        marketing_by_fac_code: 0,
        accreditation_by_fac_code: 0,
        degree_requirements_by_fac_code: 0,
        student_loans_by_fac_code: 0,
        grades_by_fac_code: 0,
        credit_transfer_by_fac_code: 0,
        credit_job_by_fac_code: 0,
        job_by_fac_code: 0,
        transcript_by_fac_code: 0,
        other_by_fac_code: 0,
        main_campus_roll_up: 0,
        financial_by_ope_id_do_not_sum: 0,
        quality_by_ope_id_do_not_sum: 0,
        refund_by_ope_id_do_not_sum: 0,
        marketing_by_ope_id_do_not_sum: 0,
        accreditation_by_ope_id_do_not_sum: 0,
        degree_requirements_by_ope_id_do_not_sum: 0,
        student_loans_by_ope_id_do_not_sum: 0,
        grades_by_ope_id_do_not_sum: 0,
        credit_transfer_by_ope_id_do_not_sum: 0,
        jobs_by_ope_id_do_not_sum: 0,
        transcript_by_ope_id_do_not_sum: 0,
        other_by_ope_id_do_not_sum: 0,
      },
      yellowRibbonPrograms: [],
      created_at: '2017-03-22T17:05:04.440Z',
      updated_at: '2017-03-22T17:05:04.440Z',
    },
    links: {
      self: 'https://staging-api.vets.gov/gids/v0/institutions/10F00509',
    },
  },
  meta: {
    version: {
      number: 1,
      created_at: '2017-03-22T17:06:12.737Z',
      preview: false,
    },
  },
};

const secondSchool = {
  data: {
    id: '930511',
    type: 'institutions',
    attributes: {
      name: 'AMERICAN UNIVERSITY',
      facility_code: '31106109',
      type: 'private',
      city: 'WASHINGTON',
      state: 'DC',
      zip: '20016',
      country: 'USA',
      bah: 2436.0,
      dodBah: 2367.0,
      cross: null,
      flight: false,
      correspondence: false,
      ope: null,
      ope6: null,
      highest_degree: null,
      locale_type: null,
      student_count: 0,
      undergrad_enrollment: null,
      yr: true,
      student_veteran: true,
      student_veteran_link: 'http://www.auvets.com/',
      poe: true,
      eight_keys: true,
      dodmou: true,
      sec_702: null,
      vet_success_name: null,
      vet_success_email: null,
      credit_for_mil_training: false,
      vet_poc: true,
      student_vet_grp_ipeds: true,
      soc_member: true,
      retention_rate_veteran_ba: 0.727,
      retention_all_students_ba: 0.8866,
      retention_rate_veteran_otb: 1,
      retention_all_students_otb: null,
      persistance_rate_veteran_ba: 0.909,
      persistance_rate_veteran_otb: 1,
      graduation_rate_veteran: null,
      graduation_rate_all_students: 0.808623233,
      transfer_out_rate_veteran: null,
      transfer_out_rate_all_students: null,
      salary_all_students: 55900,
      repayment_rate_all_students: 0.801015228,
      avg_stu_loan_debt: 252.354704,
      calendar: 'semesters',
      tuition_in_state: 41833,
      tuition_out_of_state: 41833,
      books: 800,
      online_all: true,
      p911_tuition_fees: 2886336.8,
      p911_recipients: 239,
      p911_yellow_ribbon: 949926.29,
      p911_yr_recipients: 132,
      accredited: true,
      accreditation_type: 'regional',
      accreditation_status: null,
      caution_flag: null,
      caution_flag_reason: null,
      complaints: {
        facility_code: 3,
        financial_by_fac_code: 2,
        quality_by_fac_code: 1,
        refund_by_fac_code: 0,
        marketing_by_fac_code: 0,
        accreditation_by_fac_code: 0,
        degree_requirements_by_fac_code: 1,
        student_loans_by_fac_code: 0,
        grades_by_fac_code: 0,
        credit_transfer_by_fac_code: 1,
        credit_job_by_fac_code: null,
        job_by_fac_code: 0,
        transcript_by_fac_code: 0,
        other_by_fac_code: 0,
        main_campus_roll_up: 3,
        financial_by_ope_id_do_not_sum: 2,
        quality_by_ope_id_do_not_sum: 1,
        refund_by_ope_id_do_not_sum: 0,
        marketing_by_ope_id_do_not_sum: 0,
        accreditation_by_ope_id_do_not_sum: 0,
        degree_requirements_by_ope_id_do_not_sum: 1,
        student_loans_by_ope_id_do_not_sum: 0,
        grades_by_ope_id_do_not_sum: 0,
        credit_transfer_by_ope_id_do_not_sum: 1,
        jobs_by_ope_id_do_not_sum: 0,
        transcript_by_ope_id_do_not_sum: 0,
        other_by_ope_id_do_not_sum: 0,
      },
      yellowRibbonPrograms: [],
      created_at: '2019-01-30T21:52:37.000Z',
      updated_at: '2019-01-30T21:52:37.000Z',
    },
    links: {
      self: 'https://staging-api.va.gov/gids/v0/institutions/31106109',
    },
  },
  meta: {
    version: {
      number: 1,
      created_at: '2019-01-30T21:53:24.222Z',
      preview: false,
    },
  },
};

const foreignSchool = {
  data: {
    id: '908195',
    type: 'institutions',
    attributes: {
      name: 'DUBLIN CITY UNIVERSITY',
      facility_code: '11002174',
      type: 'FOREIGN',
      city: 'DUBLIN DO9 Y5NO',
      state: null,
      zip: null,
      country: 'IRELAND',
      bah: 1681.0,
      dodBah: 1650.0,
      cross: null,
      flight: false,
      correspondence: false,
      ope: null,
      ope6: null,
      highest_degree: null,
      locale_type: null,
      student_count: 0,
      undergrad_enrollment: null,
      yr: false,
      student_veteran: false,
      student_veteran_link: null,
      poe: false,
      eight_keys: false,
      dodmou: false,
      sec_702: null,
      vet_success_name: null,
      vet_success_email: null,
      credit_for_mil_training: null,
      vet_poc: null,
      student_vet_grp_ipeds: null,
      soc_member: null,
      retention_rate_veteran_ba: null,
      retention_all_students_ba: null,
      retention_rate_veteran_otb: null,
      retention_all_students_otb: null,
      persistance_rate_veteran_ba: null,
      persistance_rate_veteran_otb: null,
      graduation_rate_veteran: null,
      graduation_rate_all_students: null,
      transfer_out_rate_veteran: null,
      transfer_out_rate_all_students: null,
      salary_all_students: null,
      repayment_rate_all_students: null,
      avg_stu_loan_debt: null,
      calendar: null,
      tuition_in_state: null,
      tuition_out_of_state: null,
      books: null,
      online_all: null,
      p911_tuition_fees: 0.0,
      p911_recipients: 0,
      p911_yellow_ribbon: 0.0,
      p911_yr_recipients: 0,
      accredited: false,
      accreditation_type: null,
      accreditation_status: null,
      caution_flag: false,
      caution_flag_reason: null,
      complaints: {
        facility_code: 0,
        financial_by_fac_code: 0,
        quality_by_fac_code: 0,
        refund_by_fac_code: 0,
        marketing_by_fac_code: 0,
        accreditation_by_fac_code: 0,
        degree_requirements_by_fac_code: 0,
        student_loans_by_fac_code: 0,
        grades_by_fac_code: 0,
        credit_transfer_by_fac_code: 0,
        credit_job_by_fac_code: 0,
        job_by_fac_code: 0,
        transcript_by_fac_code: 0,
        other_by_fac_code: 0,
        main_campus_roll_up: 0,
        financial_by_ope_id_do_not_sum: 0,
        quality_by_ope_id_do_not_sum: 0,
        refund_by_ope_id_do_not_sum: 0,
        marketing_by_ope_id_do_not_sum: 0,
        accreditation_by_ope_id_do_not_sum: 0,
        degree_requirements_by_ope_id_do_not_sum: 0,
        student_loans_by_ope_id_do_not_sum: 0,
        grades_by_ope_id_do_not_sum: 0,
        credit_transfer_by_ope_id_do_not_sum: 0,
        jobs_by_ope_id_do_not_sum: 0,
        transcript_by_ope_id_do_not_sum: 0,
        other_by_ope_id_do_not_sum: 0,
      },
      yellowRibbonPrograms: [],
      created_at: '2019-01-30T21:52:37.000Z',
      updated_at: '2019-01-30T21:52:37.000Z',
    },
    links: {
      self: 'https://staging-api.va.gov/gids/v0/institutions/11002174',
    },
  },
  meta: {
    version: {
      number: 1,
      created_at: '2019-01-30T21:53:24.222Z',
      preview: false,
    },
  },
};

const calculatorConstants = {
  data: [
    {
      id: '45',
      type: 'calculator_constants',
      attributes: {
        name: 'AVEGRADRATE',
        value: 42.3,
      },
    },
    {
      id: '47',
      type: 'calculator_constants',
      attributes: {
        name: 'AVEREPAYMENTRATE',
        value: 67.9,
      },
    },
    {
      id: '44',
      type: 'calculator_constants',
      attributes: {
        name: 'AVERETENTIONRATE',
        value: 47.99,
      },
    },
    {
      id: '46',
      type: 'calculator_constants',
      attributes: {
        name: 'AVESALARY',
        value: 33400,
      },
    },
    {
      id: '24',
      type: 'calculator_constants',
      attributes: {
        name: 'AVGVABAH',
        value: 1681,
      },
    },
    {
      id: '25',
      type: 'calculator_constants',
      attributes: {
        name: 'BSCAP',
        value: 1000,
      },
    },
    {
      id: '26',
      type: 'calculator_constants',
      attributes: {
        name: 'BSOJTMONTH',
        value: 83,
      },
    },
    {
      id: '28',
      type: 'calculator_constants',
      attributes: {
        name: 'CORRESPONDTFCAP',
        value: 11076.86,
      },
    },
    {
      id: '32',
      type: 'calculator_constants',
      attributes: {
        name: 'DEARATE',
        value: 1024,
      },
    },
    {
      id: '33',
      type: 'calculator_constants',
      attributes: {
        name: 'DEARATEFULLTIME',
        value: 1224,
      },
    },
    {
      id: '36',
      type: 'calculator_constants',
      attributes: {
        name: 'DEARATEOJT',
        value: 747,
      },
    },
    {
      id: '35',
      type: 'calculator_constants',
      attributes: {
        name: 'DEARATEONEHALF',
        value: 710,
      },
    },
    {
      id: '34',
      type: 'calculator_constants',
      attributes: {
        name: 'DEARATETHREEQUARTERS',
        value: 967,
      },
    },
    {
      id: '61',
      type: 'calculator_constants',
      attributes: {
        name: 'DEARATEUPTOONEHALF',
        value: 710,
      },
    },
    {
      id: '62',
      type: 'calculator_constants',
      attributes: {
        name: 'DEARATEUPTOONEQUARTER',
        value: 306,
      },
    },
    {
      id: '27',
      type: 'calculator_constants',
      attributes: {
        name: 'FLTTFCAP',
        value: 13031.61,
      },
    },
    {
      id: '30',
      type: 'calculator_constants',
      attributes: {
        name: 'MGIB2YRRATE',
        value: 1509,
      },
    },
    {
      id: '29',
      type: 'calculator_constants',
      attributes: {
        name: 'MGIB3YRRATE',
        value: 1857,
      },
    },
    {
      id: '31',
      type: 'calculator_constants',
      attributes: {
        name: 'SRRATE',
        value: 369,
      },
    },
    {
      id: '23',
      type: 'calculator_constants',
      attributes: {
        name: 'TFCAP',
        value: 22805.34,
      },
    },
    {
      id: '37',
      type: 'calculator_constants',
      attributes: {
        name: 'VRE0DEPRATE',
        value: 605.44,
      },
    },
    {
      id: '41',
      type: 'calculator_constants',
      attributes: {
        name: 'VRE0DEPRATEOJT',
        value: 529.36,
      },
    },
    {
      id: '38',
      type: 'calculator_constants',
      attributes: {
        name: 'VRE1DEPRATE',
        value: 751,
      },
    },
    {
      id: '42',
      type: 'calculator_constants',
      attributes: {
        name: 'VRE1DEPRATEOJT',
        value: 640.15,
      },
    },
    {
      id: '39',
      type: 'calculator_constants',
      attributes: {
        name: 'VRE2DEPRATE',
        value: 885,
      },
    },
    {
      id: '40',
      type: 'calculator_constants',
      attributes: {
        name: 'VREINCRATE',
        value: 64.5,
      },
    },
    {
      id: '43',
      type: 'calculator_constants',
      attributes: {
        name: 'VREINCRATEOJT',
        value: 737.77,
      },
    },
    {
      id: '55',
      type: 'calculator_constants',
      attributes: {
        name: 'AVGDODBAH',
        value: 1600,
      },
    },
  ],
  links: {
    self: 'http://localhost:3000/v0/calculator/constants',
  },
  meta: {
    version: {
      number: 1,
      created_at: '2019-04-22T15:48:57.598Z',
      preview: false,
    },
  },
};

const autocomplete = {
  data: [],
  links: {
    self:
      'http://internal-dsva-vetsgov-stag-gids-elb-657904045.us-gov-west-1.elb.amazonaws.com:3004/gids/v0/institutions/autocomplete',
  },
  meta: {
    version: {
      number: 1,
      created_at: '2017-03-22T17:06:12.737Z',
      preview: false,
    },
    term: null,
  },
};

const zipRate1 = {
  data: {
    id: '7618',
    type: 'zipcode_rates',
    attributes: {
      zip_code: '20002',
      mha_code: 'DC053',
      mha_name: 'WASHINGTON, DC METRO AREA',
      mha_rate: 2262.0,
      mha_rate_grandfathered: 2312.0,
    },
  },
};
const zipRate2 = {
  id: '7631',
  type: 'zipcode_rates',
  attributes: {
    zip_code: '20016',
    mha_code: 'DC053',
    mha_name: 'WASHINGTON, DC METRO AREA',
    mha_rate: 2262.0,
    mha_rate_grandfathered: null,
  },
};

const zipRate3 = {
  id: null,
  type: null,
  attributes: {
    zip_code: null,
    mha_code: null,
    mha_name: null,
    mha_rate: null,
    mha_rate_grandfathered: null,
  },
};

// Create API routes
function initApplicationMock() {
  mock(null, {
    path: '/v0/gi/institutions/search',
    verb: 'get',
    value: schools,
  });

  mock(null, {
    path: '/v0/gi/institutions/10F00509',
    verb: 'get',
    value: singleSchool,
  });

  mock(null, {
    path: '/v0/gi/institutions/31106109',
    verb: 'get',
    value: secondSchool,
  });

  mock(null, {
    path: '/v0/gi/institutions/11002174',
    verb: 'get',
    value: foreignSchool,
  });

  mock(null, {
    path: '/v0/gi/calculator_constants',
    verb: 'get',
    value: calculatorConstants,
  });

  mock(null, {
    path: '/v0/gi/institutions/autocomplete',
    verb: 'get',
    value: autocomplete,
  });

  mock(null, {
    path: '/v0/gi/zipcode_rates/20002',
    verb: 'get',
    value: zipRate1,
  });

  mock(null, {
    path: '/v0/gi/zipcode_rates/20016',
    verb: 'get',
    value: zipRate2,
  });

  mock(null, {
    path: null,
    verb: 'get',
    value: zipRate3,
  });
}

const calculatorConstantsList = [];

function formatNumber(value) {
  const str = (+value).toString();
  return `${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
}

function formatCurrency(value) {
  return `$${formatNumber(Math.round(+value))}`;
}

calculatorConstants.data.forEach(c => {
  calculatorConstantsList[c.attributes.name] = c.attributes.value;
});

module.exports = {
  calculatorConstants,
  schools,
  initApplicationMock,
  verifyDEA,
  verifyAllDEAojt,
  searchAsDEA,
  formatCurrency,
  calculatorConstantsList,
};
