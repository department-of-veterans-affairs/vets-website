export const vaFacilitySearchResults = {
  data: [
    {
      id: 'vha_508GA',
      type: 'facility',
      attributes: {
        classification: 'VA Medical Center (VAMC)',
        distance: null,
        facilityType: 'va_health_facility',
        id: 'vha_508GA',
        lat: 33.70639702,
        long: -84.42929863,
        mobile: false,
        name: 'Fort McPherson VA Clinic',
        operationalHoursSpecialInstructions: [
          'More hours are available for some services. To learn more, call our main phone number.',
        ],
        uniqueId: '508GA',
        visn: '7',
        website:
          'https://www.va.gov/atlanta-health-care/locations/fort-mcpherson-va-clinic/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '30310-5110',
            city: 'Atlanta',
            state: 'GA',
            address1: '1701 Hardee Avenue, Southwest',
          },
        },
        phone: {
          fax: '404-327-4957',
          main: '404-230-5683',
          pharmacy: '404-321-6111 x207690',
          afterHours: '404-321-6111',
          patientAdvocate: '404-321-6111 x202264',
          mentalHealthClinic: '404-321-6111, ext. 121776',
          enrollmentCoordinator: '404-321-6111 x121272',
          healthConnect: '855-679-0214',
        },
      },
    },
    {
      id: 'vha_508',
      type: 'facility',
      attributes: {
        classification: 'VA Medical Center (VAMC)',
        distance: null,
        facilityType: 'va_health_facility',
        id: 'vha_508',
        lat: 33.801939,
        long: -84.3130305,
        mobile: false,
        name: 'Joseph Maxwell Cleland Atlanta VA Medical Center',
        operationalHoursSpecialInstructions: [
          'Normal business hours are Monday through Friday, 8:00 a.m. to 4:30 p.m.',
        ],
        uniqueId: '508',
        visn: '7',
        website:
          'https://www.va.gov/atlanta-health-care/locations/joseph-maxwell-cleland-atlanta-va-medical-center',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '30033-4004',
            city: 'Decatur',
            state: 'GA',
            address1: '1670 Clairmont Road',
          },
        },
        phone: {
          fax: '404-327-4957',
          main: '404-321-6111',
          pharmacy: '404-321-6111 x207690',
          afterHours: '404-321-6111',
          patientAdvocate: '877-728-5932 x202264',
          mentalHealthClinic: '404-321-6111, ext. 206026',
          enrollmentCoordinator: '404-321-6111 x121272',
          healthConnect: '855-679-0214',
        },
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 2,
    },
  },
  links: {
    self:
      'https://staging-api.va.gov/facilities_api/v2/va?bbox%5B%5D=-85.139854&bbox%5B%5D=33.0008&bbox%5B%5D=-83.639854&bbox%5B%5D=34.5008&mobile=false&page=1&per_page=10&radius=32&services%5B%5D=Gynecology&type=health',
    first:
      'https://staging-api.va.gov/facilities_api/v2/va?bbox%5B%5D=-85.139854&bbox%5B%5D=33.0008&bbox%5B%5D=-83.639854&bbox%5B%5D=34.5008&mobile=false&page=1&per_page=10&radius=32&services%5B%5D=Gynecology&type=health',
    prev: null,
    next: null,
    last:
      'https://staging-api.va.gov/facilities_api/v2/va?bbox%5B%5D=-85.139854&bbox%5B%5D=33.0008&bbox%5B%5D=-83.639854&bbox%5B%5D=34.5008&mobile=false&page=1&per_page=10&radius=32&services%5B%5D=Gynecology&type=health',
  },
};

export const urgentCareSearchResults = {
  data: [
    {
      id: 'c38bb92a28f0a5ed64b2263912f6ce1ff82ff74b3e77a218fb520addd842f5a3',
      type: 'provider',
      attributes: {
        accNewPatients: 'false',
        address: {
          street: '564 CHANNELSIDE DR',
          city: 'TAMPA',
          state: 'FL',
          zip: '33602-5620',
        },
        caresitePhone: '813-925-1903',
        email: null,
        fax: null,
        gender: 'NotSpecified',
        lat: 27.943986,
        long: -82.449313,
        name: 'FAST TRACK URGENT CARE CENTER',
        phone: null,
        posCodes: '20',
        prefContact: null,
        trainings: [],
        uniqueId: '1972129575',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 1,
    },
  },
  links: {
    self:
      'https://staging-api.va.gov/facilities_api/v2/ccp?latitude=27.947973&longitude=-82.4571&page=1&per_page=10&radius=34',
    first:
      'https://staging-api.va.gov/facilities_api/v2/ccp?latitude=27.947973&longitude=-82.4571&page=1&per_page=10&radius=34',
    prev: null,
    next: null,
    last:
      'https://staging-api.va.gov/facilities_api/v2/ccp?latitude=27.947973&longitude=-82.4571&page=1&per_page=10&radius=34',
  },
};

export const emergencyCareSearchResults = {
  data: [
    {
      id: '16565ede67ad79c277a9c187653d403132e3dfa8bbc21dad237ce0ee0cda9499',
      type: 'provider',
      attributes: {
        accNewPatients: 'false',
        address: {
          street: '600 GRESHAM DR',
          city: 'NORFOLK',
          state: 'VA',
          zip: '23507-1904',
        },
        caresitePhone: '757-388-3000',
        email: null,
        fax: null,
        gender: 'NotSpecified',
        lat: 36.862403,
        long: -76.303525,
        name: 'SENTARA NORFOLK GENERAL HOSPITAL',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [],
        uniqueId: '1437119310',
      },
    },
  ],
};

export const communityCareProviderSearchResults = {
  data: [
    {
      id: 'dd735135a22042580c4ae125011de795f8c066c2114106db11e7ed08d7ede179',
      type: 'provider',
      attributes: {
        accNewPatients: 'true',
        address: {
          street: '203 14th Ave E',
          city: 'Seattle',
          state: 'WA',
          zip: '98112',
        },
        caresitePhone: '2063813473',
        email: null,
        fax: null,
        gender: 'Male',
        lat: 47.620128,
        long: -122.314793,
        name: 'Pirak, Michael John',
        phone: null,
        posCodes: null,
        prefContact: null,
        trainings: [],
        uniqueId: '1710438262',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 1,
    },
  },
  links: {
    self:
      'https://api.va.gov/facilities_api/v2/ccp?latitude=45.78353&longitude=-108.50539&page=1&per_page=15&radius=49&specialties%5B%5D=111N00000X',
    first:
      'https://api.va.gov/facilities_api/v2/ccp?latitude=45.78353&longitude=-108.50539&page=1&per_page=15&radius=49&specialties%5B%5D=111N00000X',
    prev: null,
    next: null,
    last:
      'https://api.va.gov/facilities_api/v2/ccp?latitude=45.78353&longitude=-108.50539&page=1&per_page=15&radius=49&specialties%5B%5D=111N00000X',
  },
};

export const communityPharmacySearchResults = {
  data: [
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
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 1,
    },
  },
  links: {
    self:
      'https://api.va.gov/facilities_api/v2/ccp?latitude=39.52578&longitude=-119.81292&page=1&per_page=15&radius=102',
    first:
      'https://api.va.gov/facilities_api/v2/ccp?latitude=39.52578&longitude=-119.81292&page=1&per_page=15&radius=102',
    prev: null,
    next:
      'https://api.va.gov/facilities_api/v2/ccp?latitude=39.52578&longitude=-119.81292&page=2&per_page=15&radius=102',
    last:
      'https://api.va.gov/facilities_api/v2/ccp?latitude=39.52578&longitude=-119.81292&page=21&per_page=15&radius=102',
  },
};

export const vbaSearchResults = {
  data: [
    {
      id: 'vba_351',
      type: 'facility',
      attributes: {
        classification: 'Regional Benefit Office',
        distance: null,
        facilityType: 'va_benefits_facility',
        id: 'vba_351',
        lat: 35.76489696,
        long: -95.41360924,
        mobile: null,
        name: 'Muskogee VA Regional Benefit Office',
        operationalHoursSpecialInstructions: null,
        uniqueId: '351',
        visn: null,
        website: 'https://www.benefits.va.gov/muskogee/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '74401',
            city: 'Muskogee',
            state: 'OK',
            address1: '125 South Main Street',
          },
        },
        phone: {
          main: '800-827-1000',
        },
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 1,
    },
  },
  links: {
    self:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-97.38939500000001&bbox%5B%5D=34.75286&bbox%5B%5D=-94.589395&bbox%5B%5D=37.552859999999995&page=1&per_page=10&radius=28&type=benefits',
    first:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-97.38939500000001&bbox%5B%5D=34.75286&bbox%5B%5D=-94.589395&bbox%5B%5D=37.552859999999995&page=1&per_page=10&radius=28&type=benefits',
    prev: null,
    next: null,
    last:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-97.38939500000001&bbox%5B%5D=34.75286&bbox%5B%5D=-94.589395&bbox%5B%5D=37.552859999999995&page=1&per_page=10&radius=28&type=benefits',
  },
};

export const cemeterySearchResults = {
  data: [
    {
      id: 'nca_899',
      type: 'facility',
      attributes: {
        classification: 'National Cemetery',
        distance: null,
        facilityType: 'va_cemetery',
        id: 'nca_899',
        lat: 21.3139152,
        long: -157.8424786,
        mobile: null,
        name: 'National Memorial Cemetery of the Pacific',
        operationalHoursSpecialInstructions: null,
        uniqueId: '899',
        visn: null,
        website: 'https://www.cem.va.gov/cems/nchp/NMCP.asp',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          mailing: {
            zip: '96813-1729',
            city: 'Honolulu',
            state: 'HI',
            address1: '2177 Puowaina Dr',
          },
          physical: {
            zip: '96813-1729',
            city: 'Honolulu',
            state: 'HI',
            address1: '2177 Puowaina Dr',
          },
        },
        phone: {
          fax: '808-532-3756',
          main: '808-532-3720',
        },
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 1,
    },
  },
  links: {
    self:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-158.61154&bbox%5B%5D=20.558498&bbox%5B%5D=-157.11154&bbox%5B%5D=22.058498&page=1&per_page=10&radius=26&type=cemetery',
    first:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-158.61154&bbox%5B%5D=20.558498&bbox%5B%5D=-157.11154&bbox%5B%5D=22.058498&page=1&per_page=10&radius=26&type=cemetery',
    prev: null,
    next: null,
    last:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-158.61154&bbox%5B%5D=20.558498&bbox%5B%5D=-157.11154&bbox%5B%5D=22.058498&page=1&per_page=10&radius=26&type=cemetery',
  },
};

export const vetCenterSearchResults = {
  data: [
    {
      id: 'vc_0420V',
      type: 'facility',
      attributes: {
        classification: null,
        distance: null,
        facilityType: 'vet_center',
        id: 'vc_0420V',
        lat: 42.01940261,
        long: -87.69978349,
        mobile: false,
        name: 'Evanston Vet Center',
        operationalHoursSpecialInstructions: [
          'More hours are available for some services. To learn more, call our main phone number.',
          'If you need to talk to someone or get advice right away, call the Vet Center anytime at 1-877-WAR-VETS (1-877-927-8387).',
        ],
        uniqueId: '0420V',
        visn: '12',
        website: 'https://www.va.gov/evanston-vet-center/',
        tmpCovidOnlineScheduling: null,
        access: {
          health: [],
          effectiveDate: '',
        },
        address: {
          physical: {
            zip: '60202',
            city: 'Evanston',
            state: 'IL',
            address1: '1901 Howard Street',
          },
        },
        phone: {
          fax: '224-610-8959',
          main: '847-332-1019',
        },
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 1,
    },
  },
  links: {
    self:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-88.38236&bbox%5B%5D=41.131954&bbox%5B%5D=-86.88236&bbox%5B%5D=42.631954&mobile=false&page=1&per_page=10&radius=34&type=vet_center',
    first:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-88.38236&bbox%5B%5D=41.131954&bbox%5B%5D=-86.88236&bbox%5B%5D=42.631954&mobile=false&page=1&per_page=10&radius=34&type=vet_center',
    prev: null,
    next: null,
    last:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-88.38236&bbox%5B%5D=41.131954&bbox%5B%5D=-86.88236&bbox%5B%5D=42.631954&mobile=false&page=1&per_page=10&radius=34&type=vet_center',
  },
};

export const noResults = {
  data: [],
  meta: {
    pagination: {
      currentPage: 1,
      prevPage: null,
      nextPage: null,
      totalPages: 1,
      totalEntries: 0,
    },
  },
  links: {
    self:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-135.15826&bbox%5B%5D=57.55035&bbox%5B%5D=-133.65826&bbox%5B%5D=59.05035&page=1&per_page=10&radius=153&type=cemetery',
    first:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-135.15826&bbox%5B%5D=57.55035&bbox%5B%5D=-133.65826&bbox%5B%5D=59.05035&page=1&per_page=10&radius=153&type=cemetery',
    prev: null,
    next: null,
    last:
      'https://api.va.gov/facilities_api/v2/va?bbox%5B%5D=-135.15826&bbox%5B%5D=57.55035&bbox%5B%5D=-133.65826&bbox%5B%5D=59.05035&page=1&per_page=10&radius=153&type=cemetery',
  },
};
