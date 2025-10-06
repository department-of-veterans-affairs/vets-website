// even though we have an /emergency_care route it never gets used
const emergencyCareData = [
  {
    id: '6ec8fea621c7f89b005113af0762c8e96ab7ffb93ea42de7407545dcefcc415d',
    type: 'provider',
    attributes: {
      accNewPatients: 'true',
      address: {
        street: '7 Medical Pkwy',
        city: 'Farmers Branch',
        state: 'TX',
        zip: '75234',
      },
      caresitePhone: '9722471000',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 32.91448,
      long: -96.8729,
      name: 'DALLAS MEDICAL CENTER LLC',
      phone: null,
      posCodes: null,
      prefContact: null,
      uniqueId: '1861690364',
    },
  },
  {
    id: 'd177566d94932c18a97fc5e441e792cae77544874012095f174886dd6b156400',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '1500 Red River St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
      },
      caresitePhone: '5123247000',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.27558,
      long: -97.733979,
      name: 'DELL SETON MEDICAL CENTER AT UT',
      phone: null,
      posCodes: null,
      prefContact: null,
      uniqueId: '1093810327',
    },
  },
];

const urgentCareData = [
  {
    id: 'ccp_5cae942081050162cd3917d91a04cc7a2ca303f05274d0a2c2bcdc6ae0255b07',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '1920 E Riverside Dr Ste A-110',
        city: 'Austin',
        state: 'TX',
        zip: '78741',
      },
      caresitePhone: '5123261600',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.242494,
      long: -97.728154,
      name: 'FastMed Urgent Care',
      phone: null,
      posCodes: '20',
      prefContact: null,
      specialty: [],
      uniqueId: '1346545209',
    },
  },
  {
    id: 'ccp_3740b047cfb32751691e2955df16fc3e61d63ed59f6dbe8aa50aa726ca84ca30',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '3311 N Lamar Blvd',
        city: 'Austin',
        state: 'TX',
        zip: '78705',
      },
      caresitePhone: '5129757791',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.302,
      long: -97.74471,
      name: 'FastMed Urgent Care',
      phone: null,
      posCodes: '20',
      prefContact: null,
      specialty: [],
      uniqueId: '1346545209',
    },
  },
  {
    id: 'ccp_222196a93173f5ea6cd64c16d5e986a48571a201848dddbc4e313a6185bb0774',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '2610 Lake Austin Blvd',
        city: 'Austin',
        state: 'TX',
        zip: '78703',
      },
      caresitePhone: '8663892727',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 30.28156,
      long: -97.77505,
      name: 'MinuteClinic',
      phone: null,
      posCodes: '17',
      prefContact: null,
      specialty: [],
      uniqueId: '1609076330',
    },
  },
];

const pharmacies = [
  {
    id: '2524dc6a54faf416ae16f61b51ab40741b4cb21324846a1a2c8f11002f3fbc24',
    type: 'provider',
    attributes: {
      accNewPatients: 'false',
      address: {
        street: '750 N VIRGINIA ST',
        city: 'RENO',
        state: 'NV',
        zip: '89501',
      },
      caresitePhone: '7753378703',
      email: null,
      fax: null,
      gender: 'NotSpecified',
      lat: 39.534779,
      long: -119.814921,
      name: 'WALGREENS',
      phone: null,
      posCodes: null,
      prefContact: null,
      trainings: [],
      uniqueId: '1437164407',
    },
  },
];

const specialtiesData = {
  data: [
    {
      id: '1223X2210X',
      type: 'specialty',
      attributes: {
        classification: 'Dentist',
        grouping: 'Dental Providers',
        name: 'Dentist - Orofacial Pain',
        specialization: 'Orofacial Pain',
        specialtyCode: '1223X2210X',
        specialtyDescription:
          "A dentist who assesses, diagnoses, and treats patients with complex chronic orofacial pain and dysfunction disorders, oromotor and jaw behavior disorders, and chronic head/neck pain.  The dentist has successfully completed an accredited postdoctoral orofacial pain residency training program for dentists of two or more years duration, in accord with the Commission on Dental Accreditation's Standards for Orofacial Pain Residency Programs, and/or meets the requirements for examination and board certification by the American Board of Orofacial Pain.",
      },
    },
    {
      id: '261QU0200X',
      type: 'specialty',
      attributes: {
        classification: 'Clinic/Center',
        grouping: 'Ambulatory Health Care Facilities',
        name: 'Clinic/Center - Urgent Care',
        specialization: 'Urgent Care',
        specialtyCode: '261QU0200X',
        specialtyDescription: 'Definition to come...',
      },
    },
    {
      id: '261QE0002X',
      type: 'specialty',
      attributes: {
        classification: 'Clinic/Center',
        grouping: 'Ambulatory Health Care Facilities',
        name: 'Clinic/Center - Emergency Care',
        specialization: 'Emergency Care',
        specialtyCode: '261QE0002X',
        specialtyDescription: 'Definition to come...',
      },
    },
    {
      id: '282N00000X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital',
        specialization: null,
        specialtyCode: '282N00000X',
        specialtyDescription:
          'An acute general hospital is an institution whose primary function is to provide inpatient diagnostic and therapeutic services for a variety of medical conditions, both surgical and non-surgical, to a wide population group. The hospital treats patients in an acute phase of illness or injury, characterized by a single episode or a fairly short duration, from which the patient returns to his or her normal or previous level of activity.',
      },
    },
    {
      id: '282NC0060X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital - Critical Access',
        specialization: 'Critical Access',
        specialtyCode: '282NC0060X',
        specialtyDescription: 'Definition to come.',
      },
    },
    {
      id: '282NR1301X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital - Rural',
        specialization: 'Rural',
        specialtyCode: '282NR1301X',
        specialtyDescription: 'Definition to come...',
      },
    },
    {
      id: '282NW0100X',
      type: 'specialty',
      attributes: {
        classification: 'General Acute Care Hospital',
        grouping: 'Hospitals',
        name: 'General Acute Care Hospital - Women',
        specialization: 'Women',
        specialtyCode: '282NW0100X',
        specialtyDescription: 'Definition to come...',
      },
    },
  ],
};

const providers = {
  // Dentist
  '1223X2210X': [
    {
      id: 'ab1152a9353aacc5fa99cdda2fad92e68f53132ed23c86bdf4d18656af1ac323',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '5920 W William Cannon Dr Ste 6-210',
          city: 'Austin',
          state: 'TX',
          zip: '78749',
        },
        caresitePhone: '5122154350',
        email: null,
        fax: null,
        gender: 'Male',
        lat: 30.230597,
        long: -97.859772,
        name: 'Kerr, Max Olen',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [],
        uniqueId: '1609075092',
      },
    },
  ],
  // emergency
  '261QE0002X': emergencyCareData,
  // Podiatry
  '213E00000X': [
    {
      id: 'a',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '401 N 17TH ST STE 311',
          city: 'ALLENTOWN',
          state: 'PA',
          zip: '18104-5051',
        },
        caresitePhone: '610-969-4470',
        email: null,
        fax: null,
        gender: 'Male',
        lat: 40.60274,
        long: -75.494775,
        name: 'BRIGIDO, STEPHEN',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [],
        uniqueId: '1407853336',
      },
    },
    {
      id: 'b',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '401 N 17TH ST STE 105',
          city: 'ALLENTOWN',
          state: 'PA',
          zip: '18104-5049',
        },
        caresitePhone: '610-969-4470',
        email: null,
        fax: null,
        gender: 'Male',
        lat: 40.60274,
        long: -75.494775,
        name: 'OFRICHTER, WILLIAM',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [
          {
            courseName: 'Opioid Safety Initiative (OSI)',
            courseCode: '1086479',
            courseCompletionDate: '2/11/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
        ],
        uniqueId: '1689649824',
      },
    },
    {
      id: 'c',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '401 N 17TH ST STE 311',
          city: 'ALLENTOWN',
          state: 'PA',
          zip: '18104-5051',
        },
        caresitePhone: '610-969-4470',
        email: null,
        fax: null,
        gender: 'Female',
        lat: 40.60274,
        long: -75.494775,
        name: 'BAKER, LORA',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [
          {
            courseName: 'A Perspective for Veteran Care',
            courseCode: '1085488',
            courseCompletionDate: '2/5/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
          {
            courseName: 'Opioid Safety Initiative (OSI)',
            courseCode: '1073710',
            courseCompletionDate: '2/4/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
          {
            courseName: 'Opioid Safety Initiative (OSI)',
            courseCode: '1086479',
            courseCompletionDate: '2/4/2020 12:00:00 AM',
            courseExpirationDate: null,
            courseStatus: 'Active',
          },
        ],
        uniqueId: '1235114331',
      },
    },
  ],
  // Urgent care
  '261QU0200X': urgentCareData,
};

// Create API routes
// providerType == nodata means no results e.g. data: []
function initApplicationMock(
  providerType = 'nodata',
  nameProviderMock = 'mockProviders',
) {
  cy.intercept(
    'GET',
    '/facilities_api/v2/ccp/specialties*',
    specialtiesData,
  ).as('mockServices');

  cy.intercept('GET', '/facilities_api/v2/ccp/pharmacy*', {
    data: pharmacies,
    meta: {
      pagination: {
        currentPage: 1,
        prevPage: null,
        nextPage: 2,
        totalPages: 166,
        totalEntries: 2487,
      },
    },
    links: {
      self:
        'https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=15&radius=42',
      first:
        'https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=15&radius=42',
      prev: null,
      next:
        'https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=2&per_page=15&radius=42',
      last:
        'https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=166&per_page=15&radius=42',
    },
  }).as('mockPharmacies');

  cy.intercept('GET', `/facilities_api/v2/ccp/urgent_care*`, {
    data: urgentCareData,
    meta: {
      pagination: {
        currentPage: 1,
        prevPage: null,
        nextPage: null,
        totalPages: 1,
        totalEntries: 10,
      },
    },
    links: {
      self:
        'https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=10&radius=42',
      first:
        'https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=10&radius=42',
      prev: null,
      next: null,
      last:
        'https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=10&radius=42',
    },
  }).as('mockUrgentCare');

  const providersData =
    providerType && providers[providerType]?.length
      ? providers[providerType]
      : [];

  cy.intercept(
    'GET',
    `/facilities_api/v2/ccp/provider?*specialties[]=${providerType}*`,
    {
      data: providersData,
      meta: {
        pagination: {
          currentPage: 1,
          prevPage: null,
          nextPage: null,
          totalPages: 1,
          totalEntries: providersData.length,
        },
      },
      links: {
        self: `https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=15&radius=42&specialties%5B%5D=${providerType}`,
        first: `https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=15&radius=42&specialties%5B%5D=${providerType}`,
        prev: null,
        next: null,
        last: `https://api.va.gov/facilities_api/v2/ccp?latitude=40.712749&longitude=-74.005994&page=1&per_page=15&radius=42&specialties%5B%5D=${providerType}`,
      },
    },
  ).as(nameProviderMock);
}

module.exports = {
  initApplicationMock,
};
