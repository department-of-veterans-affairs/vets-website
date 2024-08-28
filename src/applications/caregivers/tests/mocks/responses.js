export const mockFacilitiesResponse = [
  {
    access: null,
    activeStatus: null,
    address: {
      physical: {
        zip: '43219-2219',
        city: 'Columbus',
        state: 'OH',
        address1: '2720 Airport Drive',
        address3: 'Suite 100',
      },
    },
    classification: 'Other Outpatient Services (OOS)',
    detailedServices: null,
    distance: 7.14,
    facilityType: 'va_health_facility',
    facilityTypePrefix: 'vha',
    feedback: null,
    hours: {
      monday: '800AM-430PM',
      tuesday: '800AM-430PM',
      wednesday: '800AM-430PM',
      thursday: '800AM-430PM',
      friday: '800AM-430PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    id: 'vha_757QC',
    lat: 39.996592,
    long: -82.93310921,
    mobile: false,
    name: 'Columbus VA Clinic',
    operatingStatus: {
      code: 'NORMAL',
    },
    operationalHoursSpecialInstructions: null,
    parent: {
      id: 'vha_757',
    },
    phone: {
      fax: '614-388-7565',
      main: '614-388-7650',
      pharmacy: '614-257-5230',
      afterHours: '888-838-6446',
      patientAdvocate: '614-257-5449',
      mentalHealthClinic: '614-257-5631',
      enrollmentCoordinator: '614-257-5628',
    },
    services: {
      link:
        'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757QC/services',
      lastUpdated: '2024-08-18',
    },
    type: 'va_facilities',
    uniqueId: '757QC',
    visn: '10',
    website:
      'https://www.va.gov/central-ohio-health-care/locations/columbus-va-clinic/',
  },
  {
    access: null,
    activeStatus: null,
    address: {
      physical: {
        zip: '43219-1834',
        city: 'Columbus',
        state: 'OH',
        address1: '420 North James Road',
        address3: '33',
      },
    },
    classification: 'Health Care Center (HCC)',
    detailedServices: null,
    distance: 8.44,
    facilityType: 'va_health_facility',
    facilityTypePrefix: 'vha',
    feedback: {
      health: {
        primaryCareUrgent: 0.800000011920929,
        primaryCareRoutine: 0.8700000047683716,
        specialtyCareUrgent: 0.7599999904632568,
        specialtyCareRoutine: 0.8399999737739563,
      },
      effectiveDate: '2024-02-08',
    },
    hours: {
      monday: '730AM-600PM',
      tuesday: '730AM-600PM',
      wednesday: '730AM-600PM',
      thursday: '730AM-600PM',
      friday: '730AM-600PM',
      saturday: '800AM-400PM',
      sunday: '800AM-400PM',
    },
    id: 'vha_757',
    lat: 39.98048191,
    long: -82.91230307,
    mobile: false,
    name: 'Chalmers P. Wylie Veterans Outpatient Clinic',
    operatingStatus: {
      code: 'NORMAL',
    },
    operationalHoursSpecialInstructions: [
      'Normal business hours are Monday through Friday, 8:00 a.m. to 4:30 p.m.',
    ],
    parent: {
      id: 'vha_757',
    },
    phone: {
      fax: '614-257-5460',
      main: '614-257-5200',
      pharmacy: '614-257-5230',
      afterHours: '614-257-5512',
      patientAdvocate: '614-257-5290',
      mentalHealthClinic: '614-257-5631',
      enrollmentCoordinator: '614-257-5628',
    },
    services: {
      health: [
        {
          name: 'Allergy, asthma and immunology',
          serviceId: 'allergy',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/allergy',
        },
        {
          name: 'Audiology and speech',
          serviceId: 'audiology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/audiology',
        },
        {
          name: 'Cardiology',
          serviceId: 'cardiology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/cardiology',
        },
        {
          name: 'CaregiverSupport',
          serviceId: 'caregiverSupport',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/caregiverSupport',
        },
        {
          name: 'COVID-19 vaccines',
          serviceId: 'covid19Vaccine',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/covid19Vaccine',
        },
        {
          name: 'Dental/oral surgery',
          serviceId: 'dental',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/dental',
        },
        {
          name: 'Dermatology',
          serviceId: 'dermatology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/dermatology',
        },
        {
          name: 'Diabetic care',
          serviceId: 'diabetic',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/diabetic',
        },
        {
          name: 'Endocrinology',
          serviceId: 'endocrinology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/endocrinology',
        },
        {
          name: 'Gastroenterology',
          serviceId: 'gastroenterology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/gastroenterology',
        },
        {
          name: 'Geriatrics',
          serviceId: 'geriatrics',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/geriatrics',
        },
        {
          name: 'Gynecology',
          serviceId: 'gynecology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/gynecology',
        },
        {
          name: 'Hematology/oncology',
          serviceId: 'hematology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/hematology',
        },
        {
          name: 'Homeless Veteran care',
          serviceId: 'homeless',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/homeless',
        },
        {
          name: 'Palliative and hospice care',
          serviceId: 'hospice',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/hospice',
        },
        {
          name: 'Laboratory and pathology',
          serviceId: 'laboratory',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/laboratory',
        },
        {
          name: 'LGBTQ+ Veteran care',
          serviceId: 'lgbtq',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/lgbtq',
        },
        {
          name: 'Minority Veteran care',
          serviceId: 'minorityCare',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/minorityCare',
        },
        {
          name: 'Nephrology',
          serviceId: 'nephrology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/nephrology',
        },
        {
          name: 'Neurology',
          serviceId: 'neurology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/neurology',
        },
        {
          name: 'Nutrition, food, and dietary care',
          serviceId: 'nutrition',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/nutrition',
        },
        {
          name: 'Ophthalmology',
          serviceId: 'ophthalmology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/ophthalmology',
        },
        {
          name: 'Optometry',
          serviceId: 'optometry',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/optometry',
        },
        {
          name: 'Orthopedics',
          serviceId: 'orthopedics',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/orthopedics',
        },
        {
          name: 'Otolaryngology',
          serviceId: 'otolaryngology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/otolaryngology',
        },
        {
          name: 'Pain management',
          serviceId: 'painManagement',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/painManagement',
        },
        {
          name: 'Patient advocates',
          serviceId: 'patientAdvocates',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/patientAdvocates',
        },
        {
          name: 'Pharmacy',
          serviceId: 'pharmacy',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/pharmacy',
        },
        {
          name: 'Physical medicine and rehabilitation',
          serviceId: 'physicalMedicine',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/physicalMedicine',
        },
        {
          name: 'Plastic and reconstructive surgery',
          serviceId: 'plasticSurgery',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/plasticSurgery',
        },
        {
          name: 'Podiatry',
          serviceId: 'podiatry',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/podiatry',
        },
        {
          name: 'Primary care',
          serviceId: 'primaryCare',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/primaryCare',
        },
        {
          name: 'Prosthetics and rehabilitation',
          serviceId: 'prosthetics',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/prosthetics',
        },
        {
          name: 'PTSD care',
          serviceId: 'ptsd',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/ptsd',
        },
        {
          name: 'Pulmonary medicine',
          serviceId: 'pulmonaryMedicine',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/pulmonaryMedicine',
        },
        {
          name: 'Radiology',
          serviceId: 'radiology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/radiology',
        },
        {
          name: 'Rheumatology',
          serviceId: 'rheumatology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/rheumatology',
        },
        {
          name: 'Smoking and tobacco cessation',
          serviceId: 'smoking',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/smoking',
        },
        {
          name: 'Social work',
          serviceId: 'socialWork',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/socialWork',
        },
        {
          name: 'Spinal cord injuries and disorders',
          serviceId: 'spinalInjury',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/spinalInjury',
        },
        {
          name: 'Suicide prevention',
          serviceId: 'suicidePrevention',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/suicidePrevention',
        },
        {
          name: 'Surgery',
          serviceId: 'surgery',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/surgery',
        },
        {
          name: 'Returning service member care',
          serviceId: 'transitionCounseling',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/transitionCounseling',
        },
        {
          name: 'Urgent care',
          serviceId: 'urgentCare',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/urgentCare',
        },
        {
          name: 'Urology',
          serviceId: 'urology',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/urology',
        },
        {
          name: 'Vascular surgery',
          serviceId: 'vascularSurgery',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/vascularSurgery',
        },
        {
          name: 'Blind and low vision rehabilitation',
          serviceId: 'vision',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/vision',
        },
        {
          name: 'MOVE! weight management',
          serviceId: 'weightManagement',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/weightManagement',
        },
        {
          name: 'Women Veteran care',
          serviceId: 'womensHealth',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/womensHealth',
        },
        {
          name: 'Wound care and ostomy',
          serviceId: 'wound',
          link:
            'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/wound',
        },
      ],
      link:
        'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services',
      lastUpdated: '2024-08-18',
    },
    type: 'va_facilities',
    uniqueId: '757',
    visn: '10',
    website:
      'https://www.va.gov/central-ohio-health-care/locations/chalmers-p-wylie-veterans-outpatient-clinic/',
  },
];

const fetchChildFacilityWithoutCaregiverSupport = {
  access: null,
  activeStatus: null,
  address: {
    physical: {
      address1: '2720 Airport Drive',
      address2: 'Suite 100',
      address3: 'Columbus, OH, 43219-2219',
    },
  },
  classification: 'Other Outpatient Services (OOS)',
  detailedServices: null,
  distance: 7.14,
  facilityType: 'va_health_facility',
  facilityTypePrefix: 'vha',
  feedback: null,
  hours: {
    monday: '800AM-430PM',
    tuesday: '800AM-430PM',
    wednesday: '800AM-430PM',
    thursday: '800AM-430PM',
    friday: '800AM-430PM',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  id: 'vha_757QC',
  lat: 39.996592,
  long: -82.93310921,
  mobile: false,
  name: 'Columbus VA Clinic',
  operatingStatus: {
    code: 'NORMAL',
  },
  operationalHoursSpecialInstructions: null,
  parent: {
    id: 'vha_757',
  },
  phone: {
    fax: '614-388-7565',
    main: '614-388-7650',
    pharmacy: '614-257-5230',
    afterHours: '888-838-6446',
    patientAdvocate: '614-257-5449',
    mentalHealthClinic: '614-257-5631',
    enrollmentCoordinator: '614-257-5628',
  },
  services: {
    link:
      'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757QC/services',
    lastUpdated: '2024-08-18',
  },
  type: 'va_facilities',
  uniqueId: '757QC',
  visn: '10',
  website:
    'https://www.va.gov/central-ohio-health-care/locations/columbus-va-clinic/',
};

const fetchChildFacilityWithCaregiverSupport = {
  ...fetchChildFacilityWithoutCaregiverSupport,
  services: {
    health: [
      {
        name: 'CaregiverSupport',
        serviceId: 'caregiverSupport',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/caregiverSupport',
      },
    ],
    link:
      'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757QC/services',
    lastUpdated: '2024-08-18',
  },
};

const fetchParentFacility = {
  access: null,
  activeStatus: null,
  address: {
    physical: {
      address1: '420 North James Road',
      address2: '33',
      address3: 'Columbus, OH, 43219-1834',
    },
  },
  classification: 'Health Care Center (HCC)',
  detailedServices: null,
  distance: 8.44,
  facilityType: 'va_health_facility',
  facilityTypePrefix: 'vha',
  feedback: {
    health: {
      primaryCareUrgent: 0.800000011920929,
      primaryCareRoutine: 0.8700000047683716,
      specialtyCareUrgent: 0.7599999904632568,
      specialtyCareRoutine: 0.8399999737739563,
    },
    effectiveDate: '2024-02-08',
  },
  hours: {
    monday: '730AM-600PM',
    tuesday: '730AM-600PM',
    wednesday: '730AM-600PM',
    thursday: '730AM-600PM',
    friday: '730AM-600PM',
    saturday: '800AM-400PM',
    sunday: '800AM-400PM',
  },
  id: 'vha_757',
  lat: 39.98048191,
  long: -82.91230307,
  mobile: false,
  name: 'Chalmers P. Wylie Veterans Outpatient Clinic',
  operatingStatus: {
    code: 'NORMAL',
  },
  operationalHoursSpecialInstructions: [
    'Normal business hours are Monday through Friday, 8:00 a.m. to 4:30 p.m.',
  ],
  parent: {
    id: 'vha_757',
  },
  phone: {
    fax: '614-257-5460',
    main: '614-257-5200',
    pharmacy: '614-257-5230',
    afterHours: '614-257-5512',
    patientAdvocate: '614-257-5290',
    mentalHealthClinic: '614-257-5631',
    enrollmentCoordinator: '614-257-5628',
  },
  services: {
    health: [
      {
        name: 'Allergy, asthma and immunology',
        serviceId: 'allergy',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/allergy',
      },
      {
        name: 'Audiology and speech',
        serviceId: 'audiology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/audiology',
      },
      {
        name: 'Cardiology',
        serviceId: 'cardiology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/cardiology',
      },
      {
        name: 'CaregiverSupport',
        serviceId: 'caregiverSupport',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/caregiverSupport',
      },
      {
        name: 'COVID-19 vaccines',
        serviceId: 'covid19Vaccine',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/covid19Vaccine',
      },
      {
        name: 'Dental/oral surgery',
        serviceId: 'dental',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/dental',
      },
      {
        name: 'Dermatology',
        serviceId: 'dermatology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/dermatology',
      },
      {
        name: 'Diabetic care',
        serviceId: 'diabetic',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/diabetic',
      },
      {
        name: 'Endocrinology',
        serviceId: 'endocrinology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/endocrinology',
      },
      {
        name: 'Gastroenterology',
        serviceId: 'gastroenterology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/gastroenterology',
      },
      {
        name: 'Geriatrics',
        serviceId: 'geriatrics',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/geriatrics',
      },
      {
        name: 'Gynecology',
        serviceId: 'gynecology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/gynecology',
      },
      {
        name: 'Hematology/oncology',
        serviceId: 'hematology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/hematology',
      },
      {
        name: 'Homeless Veteran care',
        serviceId: 'homeless',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/homeless',
      },
      {
        name: 'Palliative and hospice care',
        serviceId: 'hospice',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/hospice',
      },
      {
        name: 'Laboratory and pathology',
        serviceId: 'laboratory',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/laboratory',
      },
      {
        name: 'LGBTQ+ Veteran care',
        serviceId: 'lgbtq',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/lgbtq',
      },
      {
        name: 'Minority Veteran care',
        serviceId: 'minorityCare',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/minorityCare',
      },
      {
        name: 'Nephrology',
        serviceId: 'nephrology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/nephrology',
      },
      {
        name: 'Neurology',
        serviceId: 'neurology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/neurology',
      },
      {
        name: 'Nutrition, food, and dietary care',
        serviceId: 'nutrition',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/nutrition',
      },
      {
        name: 'Ophthalmology',
        serviceId: 'ophthalmology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/ophthalmology',
      },
      {
        name: 'Optometry',
        serviceId: 'optometry',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/optometry',
      },
      {
        name: 'Orthopedics',
        serviceId: 'orthopedics',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/orthopedics',
      },
      {
        name: 'Otolaryngology',
        serviceId: 'otolaryngology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/otolaryngology',
      },
      {
        name: 'Pain management',
        serviceId: 'painManagement',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/painManagement',
      },
      {
        name: 'Patient advocates',
        serviceId: 'patientAdvocates',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/patientAdvocates',
      },
      {
        name: 'Pharmacy',
        serviceId: 'pharmacy',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/pharmacy',
      },
      {
        name: 'Physical medicine and rehabilitation',
        serviceId: 'physicalMedicine',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/physicalMedicine',
      },
      {
        name: 'Plastic and reconstructive surgery',
        serviceId: 'plasticSurgery',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/plasticSurgery',
      },
      {
        name: 'Podiatry',
        serviceId: 'podiatry',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/podiatry',
      },
      {
        name: 'Primary care',
        serviceId: 'primaryCare',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/primaryCare',
      },
      {
        name: 'Prosthetics and rehabilitation',
        serviceId: 'prosthetics',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/prosthetics',
      },
      {
        name: 'PTSD care',
        serviceId: 'ptsd',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/ptsd',
      },
      {
        name: 'Pulmonary medicine',
        serviceId: 'pulmonaryMedicine',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/pulmonaryMedicine',
      },
      {
        name: 'Radiology',
        serviceId: 'radiology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/radiology',
      },
      {
        name: 'Rheumatology',
        serviceId: 'rheumatology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/rheumatology',
      },
      {
        name: 'Smoking and tobacco cessation',
        serviceId: 'smoking',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/smoking',
      },
      {
        name: 'Social work',
        serviceId: 'socialWork',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/socialWork',
      },
      {
        name: 'Spinal cord injuries and disorders',
        serviceId: 'spinalInjury',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/spinalInjury',
      },
      {
        name: 'Suicide prevention',
        serviceId: 'suicidePrevention',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/suicidePrevention',
      },
      {
        name: 'Surgery',
        serviceId: 'surgery',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/surgery',
      },
      {
        name: 'Returning service member care',
        serviceId: 'transitionCounseling',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/transitionCounseling',
      },
      {
        name: 'Urgent care',
        serviceId: 'urgentCare',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/urgentCare',
      },
      {
        name: 'Urology',
        serviceId: 'urology',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/urology',
      },
      {
        name: 'Vascular surgery',
        serviceId: 'vascularSurgery',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/vascularSurgery',
      },
      {
        name: 'Blind and low vision rehabilitation',
        serviceId: 'vision',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/vision',
      },
      {
        name: 'MOVE! weight management',
        serviceId: 'weightManagement',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/weightManagement',
      },
      {
        name: 'Women Veteran care',
        serviceId: 'womensHealth',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/womensHealth',
      },
      {
        name: 'Wound care and ostomy',
        serviceId: 'wound',
        link:
          'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services/wound',
      },
    ],
    link:
      'https://sandbox-api.va.gov/services/va_facilities/v1/facilities/vha_757/services',
    lastUpdated: '2024-08-18',
  },
  type: 'va_facilities',
  uniqueId: '757',
  visn: '10',
  website:
    'https://www.va.gov/central-ohio-health-care/locations/chalmers-p-wylie-veterans-outpatient-clinic/',
};

export const mockFetchChildFacilityResponse = [
  fetchChildFacilityWithoutCaregiverSupport,
];
export const mockFetchChildFacilityWithCaregiverSupportResponse = [
  fetchChildFacilityWithCaregiverSupport,
];
export const mockFetchParentFacilityResponse = [fetchParentFacility];

export const mockFetchFacilitiesResponse = [
  fetchChildFacilityWithoutCaregiverSupport,
  fetchParentFacility,
];
