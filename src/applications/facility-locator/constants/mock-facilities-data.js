import data from '../constants/mock-facility-data.json';

export const facilityData = (facility, service) => {
  if (facility === 'cc_pharmacy') {
    return {
      data: [
        {
          id: 'ccp_1013055938', // cc_pharmacy
          type: 'cc_provider',
          attributes: {
            // eslint-disable-next-line camelcase
            unique_id: '1013055938',
            name: 'WALGREENS',
            address: {
              street: '400 E FM 2410 RD',
              city: 'HARKER HEIGHTS',
              state: 'TX',
              zip: '76548',
            },
            email: 'THRIDPARTYOPS@WALGREENS.COM',
            phone: null,
            fax: null,
            lat: 31.067725,
            long: -97.668028,
            // eslint-disable-next-line camelcase
            pref_contact: null,
            // eslint-disable-next-line camelcase
            acc_new_patients: 'false',
            gender: 'NotSpecified',
            specialty: [
              {
                name: 'Pharmacy - Community/Retail Pharmacy',
                desc:
                  'A pharmacy where pharmacists store, prepare, and dispense medicinal preparations and/or prescriptions for a local patient population in accordance with federal and state law; counsel patients and caregivers (sometimes independent of the dispensing process); administer vaccinations; and provide other professional services associated with pharmaceutical care such as health screenings, consultative services with other health care providers, collaborative practice, disease state management, and education classes.',
              },
            ],
            // eslint-disable-next-line camelcase
            caresite_phone: '2546803499',
          },
        },
      ],
      links: {
        self:
          'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1',
        first:
          'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
        prev: null,
        next: null,
        last:
          'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
      },
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 20,
          totalPages: 5,
          totalEntries: 16,
        },
      },
    };
  }
  if (facility === 'urgent_care') {
    if (!service || service === 'UrgentCare') {
      return {
        data: [
          {
            id: 'vha_691',
            type: 'va_facilities',
            attributes: {
              uniqueId: '691',
              name: 'West Los Angeles VA Medical Center',
              facilityType: 'va_health_facility',
              classification: 'VA Medical Center (VAMC)',
              website: 'https://www.losangeles.va.gov/locations/directions.asp',
              lat: 34.05239096,
              long: -118.45844544,
              address: {
                mailing: {},
                physical: {
                  zip: '90073-1003',
                  city: 'Los Angeles',
                  state: 'CA',
                  address1: '11301 Wilshire Boulevard',
                  address2: '',
                  address3: null,
                },
              },
              phone: {
                fax: '310-268-3494',
                main: '310-478-3711',
                pharmacy: '800-952-4852',
                afterHours: '877-252-4866',
                patientAdvocate: '310-268-3068',
                mentalHealthClinic: '310-268-4449',
                enrollmentCoordinator: '310-268-3609',
              },
              hours: {
                friday: '24/7',
                monday: '24/7',
                sunday: '24/7',
                tuesday: '24/7',
                saturday: '24/7',
                thursday: '24/7',
                wednesday: '24/7',
              },
              services: {
                other: [],
                health: [
                  {
                    sl1: ['EmergencyCare'],
                    sl2: [],
                  },
                  {
                    sl1: ['UrgentCare'],
                    sl2: [],
                  },
                  {
                    sl1: ['PrimaryCare'],
                    sl2: [],
                  },
                  {
                    sl1: ['MentalHealthCare'],
                    sl2: [],
                  },
                  {
                    sl1: ['WomensHealth'],
                    sl2: [],
                  },
                  {
                    sl1: ['Audiology'],
                    sl2: [],
                  },
                  {
                    sl1: ['Cardiology'],
                    sl2: [],
                  },
                  {
                    sl1: ['Dermatology'],
                    sl2: [],
                  },
                  {
                    sl1: ['Gastroenterology'],
                    sl2: [],
                  },
                  {
                    sl1: ['Gynecology'],
                    sl2: [],
                  },
                  {
                    sl1: ['Ophthalmology'],
                    sl2: [],
                  },
                  {
                    sl1: ['Optometry'],
                    sl2: [],
                  },
                  {
                    sl1: ['Orthopedics'],
                    sl2: [],
                  },
                  {
                    sl1: ['Urology'],
                    sl2: [],
                  },
                  {
                    sl1: ['SpecialtyCare'],
                    sl2: [],
                  },
                  {
                    sl1: ['DentalServices'],
                    sl2: [],
                  },
                ],
                lastUpdated: '2020-01-20',
              },
              feedback: {
                health: {
                  effectiveDate: '2019-06-20',
                  primaryCareUrgent: 0.84,
                  primaryCareRoutine: 0.79,
                  specialtyCareUrgent: 0.6,
                  specialtyCareRoutine: 0.75,
                },
              },
              access: {
                health: {
                  urology: {
                    new: 25.765957,
                    established: 6.095522,
                  },
                  audiology: {
                    new: 23.063063,
                    established: 6.842342,
                  },
                  optometry: {
                    new: 40.518987,
                    established: 13.071428,
                  },
                  cardiology: {
                    new: 17.716981,
                    established: 7.841836,
                  },
                  gynecology: {
                    new: 11.181818,
                    established: 4.231707,
                  },
                  dermatology: {
                    new: 57.438356,
                    established: 14.54427,
                  },
                  orthopedics: {
                    new: 27.222222,
                    established: 6.847533,
                  },
                  primaryCare: {
                    new: 20.470085,
                    established: 3.440604,
                  },
                  ophthalmology: {
                    new: 28.0,
                    established: 7.562666,
                  },
                  womensHealth: {
                    new: 11.181818,
                    established: 4.28395,
                  },
                  effectiveDate: '2020-01-20',
                  specialtyCare: {
                    new: 25.544444,
                    established: 8.770971,
                  },
                  gastroenterology: {
                    new: 15.875,
                    established: 9.051724,
                  },
                  mentalHealthCare: {
                    new: 14.810344,
                    established: 4.663859,
                  },
                },
              },
            },
          },
        ],
        links: {
          self:
            'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1',
          first:
            'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
          prev: null,
          next: null,
          last:
            'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
        },
        meta: {
          pagination: {
            currentPage: 1,
            perPage: 20,
            totalPages: 5,
            totalEntries: 16,
          },
        },
      };
    }
    if (service === 'NonVAUrgentCare') {
      return {
        data: [
          {
            id: 'ccp_1790275410', // cc_urgent_care
            type: 'cc_provider',
            attributes: {
              // eslint-disable-next-line camelcase
              unique_id: '1790275410',
              name: 'American Current Care of Arizona PA',
              address: {
                street: '2000 W Anderson Ln',
                city: 'Austin',
                state: 'TX',
                zip: '78757',
              },
              email: null,
              phone: null,
              fax: null,
              lat: 30.354658,
              long: -97.726606,
              // eslint-disable-next-line camelcase
              pref_contact: null,
              // eslint-disable-next-line camelcase
              acc_new_patients: 'false',
              gender: 'NotSpecified',
              specialty: [],
              // eslint-disable-next-line camelcase
              caresite_phone: '8669446046',
            },
          },
        ],
        links: {
          self:
            'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1',
          first:
            'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
          prev: null,
          next: null,
          last:
            'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
        },
        meta: {
          pagination: {
            currentPage: 1,
            perPage: 20,
            totalPages: 5,
            totalEntries: 16,
          },
        },
      };
    }
  }
  return data;
};
