/* eslint camelcase: 0 */
/* eslint quote-props: 0 */
/* eslint quotes: 0 */

const mock = require('../../../platform/testing/e2e/mock-helpers');

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
    path: '/v0/gi/calculator_constants',
    verb: 'get',
    value: calculatorConstants,
  });

  mock(null, {
    path: '/v0/gi/institutions/autocomplete',
    verb: 'get',
    value: autocomplete,
  });
}

module.exports = {
  calculatorConstants,
  schools,
  initApplicationMock,
};
