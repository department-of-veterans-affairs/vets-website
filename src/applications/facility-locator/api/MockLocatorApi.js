// This file mocks a web API by working with the hard-coded data at the bottom.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
import compact from 'lodash/compact';
import { LocationType } from '../constants';
import { ccLocatorEnabled } from '../config';

// Immitate network delay
const delay = 0;

/* eslint-disable no-use-before-define */
class MockLocatorApi {
  /**
   * Sends the fetch request to vets-api to query which locations exist within the
   * given bounding box's area and optionally cenetered on the given address.
   *
   * Allows for filtering on location types and services provided.
   *
   * @param {string=} address The address associated with the bounding box's center
   * @param {number[]} bounds Array defining the bounding box of the search area
   * @param {string} locationType What kind of location? (i.e. facilityType or Provider)
   * @param {string} serviceType What services should the location provide?
   * @param {number} page Which page of results to start with?
   * @returns {Promise} Promise object
   */
  // eslint-disable-next-line prettier/prettier
  static searchWithBounds(address = null, bounds, locationType, serviceType, page) {
    const filterableLocations = ['health', 'benefits', 'cc_provider'];
    const params = compact([
      address ? `address=${address}` : null,
      ...bounds.map(c => `bbox[]=${c}`),
      locationType ? `type=${locationType}` : null,
      filterableLocations.includes(locationType) && serviceType
        ? `services[]=${serviceType}`
        : null,
      `page=${page}`,
    ]).join('&');

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (params && params !== '') {
          if (params.fail) {
            reject('Random failure due to fail flag being set');
          }

          let locations = {};
          // Feature Flag
          if (ccLocatorEnabled()) {
            locations = { ...facilityData };
          } else {
            const nonProviders = facilityData.data.filter(
              // eslint-disable-next-line prettier/prettier
              loc => loc.type !== LocationType.CC_PROVIDER
            );
            locations = { ...facilityData, data: nonProviders };
          }
          resolve(locations);
        } else {
          reject('Invalid URL or query sent to API!');
        }
      }, delay);
    });
  }

  static fetchVAFacility(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id && (typeof id === 'number' || typeof id === 'string')) {
          const location = facilityData.data.filter(data => data.id === id);
          if (location && location.length > 0) {
            resolve({ data: location[0] });
          } else {
            reject(`Facility with given ID '${id}' not found!`);
          }
        } else {
          reject('No facility ID or invalid ID specified!');
        }
      }, delay);
    });
  }

  static fetchProviderDetail(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id && typeof id === 'string') {
          const location = facilityData.data.filter(data => data.id === id);
          if (location && location.length > 0) {
            resolve({ data: location[0] });
          } else {
            reject(`Facility with given ID '${id}' not found!`);
          }
        } else {
          reject('No facility ID or invalid ID specified!');
        }
      }, delay);
    });
  }

  static getProviderSvcs(shouldFail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!shouldFail) {
          resolve(providerServices);
        } else {
          reject('Fail condition set, likely for testing reasons.');
        }
      }, delay);
    });
  }
}

export const facilityData = {
  data: [
    {
      id: 'nca_s1130',
      type: 'va_facilities',
      attributes: {
        uniqueId: 's1130',
        name: 'Washington State Veterans Cemetery Medical Lake',
        facilityType: 'va_cemetery',
        classification: 'State Cemetery',
        website: 'http://www.dva.wa.gov/cemetery',
        lat: 47.5862341059396,
        long: -117.713961630042,
        address: {
          physical: {
            address1: '21702 W Espanola Rd',
            address2: null,
            address3: null,
            city: 'Medical Lake',
            state: 'WA',
            zip: '99022',
          },
          mailing: {},
        },
        phone: {
          main: '509-299-6280',
          fax: '',
        },
        hours: {
          monday: 'Sunrise - Sunset',
          tuesday: 'Sunrise - Sunset',
          wednesday: 'Sunrise - Sunset',
          thursday: 'Sunrise - Sunset',
          friday: 'Sunrise - Sunset',
          saturday: 'Sunrise - Sunset',
          sunday: 'Sunrise - Sunset',
        },
        services: {
          benefits: {
            other: '',
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vha_438GE',
      type: 'va_facilities',
      attributes: {
        uniqueId: '438GE',
        name: 'Wagner VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Other Outpatient Services (OOS)',
        website: 'http://www.siouxfalls.va.gov/locations/wagner.asp',
        lat: 43.0818390000001,
        long: -98.297446,
        address: {
          mailing: {},
          physical: {
            zip: '57380-9369',
            city: 'Wagner',
            state: 'SD',
            address1: '400 West South Dakota Highway 46',
            address2: null,
            address3: null,
          },
        },
        phone: {
          fax: '605-384-2345 x',
          main: '605-384-2340 x',
          pharmacy: '800-316-8387 x',
          afterHours: '605-336-3230 x',
          patientAdvocate: '605-336-3230 x6688',
          mentalHealthClinic: '',
          enrollmentCoordinator: '605-373-4196 x',
        },
        hours: {
          monday: '800AM-430PM',
          tuesday: '800AM-430PM',
          wednesday: '800AM-1200PM',
          thursday: '800AM-430PM',
          friday: '800AM-430PM',
          saturday: '-',
          sunday: '-',
        },
        services: {
          other: ['Online Scheduling'],
          health: [
            {
              sl1: ['PrimaryCare'],
              sl2: [],
            },
            {
              sl1: ['Audiology'],
              sl2: [],
            },
            {
              sl1: ['Orthopedics'],
              sl2: [],
            },
          ],
          lastUpdated: '2019-02-12',
        },
        feedback: {
          health: {
            effectiveDate: '2018-05-22',
            primaryCareRoutine: 0.94,
          },
        },
        access: {
          health: {
            audiology: {
              new: null,
              established: 0,
            },
            orthopedics: {
              new: null,
              established: 0,
            },
            primaryCare: {
              new: 20,
              established: 7,
            },
            mentalHealth: {
              new: null,
              established: 5,
            },
            effectiveDate: '2019-02-04',
          },
        },
      },
    },
    {
      id: 'vha_691GE',
      type: 'va_facilities',
      attributes: {
        uniqueId: '691GE',
        name: 'Los Angeles VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        website: null,
        lat: 34.05171284,
        long: -118.23874096,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: null,
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012-3328',
          },
          mailing: {},
        },
        phone: {
          main: '213-253-5000 x',
          fax: '213-253-5510 x',
          afterHours: '877-252-4866 x',
          patientAdvocate: '213-253-2677 x24111',
          enrollmentCoordinator: '213-253-2677 x24033',
          pharmacy: '800-952-4852 x',
          mentalHealthClinic: '310-268-4449',
        },
        hours: {
          monday: '700AM-530PM',
          tuesday: '700AM-530PM',
          wednesday: '700AM-530PM',
          thursday: '700AM-530PM',
          friday: '700AM-530PM',
          saturday: '-',
          sunday: '-',
        },
        services: {
          lastUpdated: '2017-07-24',
          health: [
            {
              sl1: ['DentalServices'],
              sl2: [],
            },
            {
              sl1: ['MentalHealthCare'],
              sl2: [],
            },
            {
              sl1: ['PrimaryCare'],
              sl2: [],
            },
          ],
        },
        feedback: {
          health: {
            primaryCareUrgent: '0.78',
            primaryCareRoutine: '0.77',
            effectiveDate: '2017-03-24',
          },
        },
        access: {
          health: {
            primaryCare: {
              new: 15,
              established: 3,
            },
            mentalHealth: {
              new: 12,
              established: 2,
            },
            womensHealth: {
              new: null,
              established: 9,
            },
            audiology: {
              new: 48,
              established: 0,
            },
            gastroenterology: {
              new: 7,
              established: null,
            },
            opthalmology: {
              new: 9,
              established: 6,
            },
            optometry: {
              new: 14,
              established: 5,
            },
            urologyClinic: {
              new: 23,
              established: 3,
            },
            effectiveDate: '2017-08-14',
          },
        },
      },
    },
    {
      id: 'vba_343o',
      type: 'va_facilities',
      attributes: {
        uniqueId: '343o',
        name: 'Los Angeles Ambulatory Care Center',
        facilityType: 'va_benefits_facility',
        classification: 'OUTBASED',
        website: null,
        lat: 34.05171315,
        long: -118.2387403,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: 'Room A-444',
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012',
          },
          mailing: {},
        },
        phone: {
          main: '213-253-2677 Ext 24759',
          fax: '',
        },
        hours: {
          monday: '8:00AM-2:30PM',
          tuesday: '8:00AM-2:30PM',
          wednesday: '8:00AM-2:30PM',
          thursday: '8:00AM-2:30PM',
          friday: 'By Appointment Only',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          benefits: {
            other: '',
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vba_343z',
      type: 'va_facilities',
      attributes: {
        uniqueId: '343z',
        name: 'VetSuccess on Campus at Los Angeles City College',
        facilityType: 'va_benefits_facility',
        classification: 'VETSUCCESS ON CAMPUS',
        website: null,
        lat: 34.08751109,
        long: -118.2917626,
        address: {
          physical: {
            address1: '855 North Vermont',
            address2: '',
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90029',
          },
          mailing: {},
        },
        phone: {
          main: '323-953-4000 Ext 1253',
          fax: '',
        },
        hours: {
          monday: 'Closed',
          tuesday: 'Closed',
          wednesday: '9:00AM-4:00PM',
          thursday: 'Closed',
          friday: 'Closed',
          saturday: 'Closed',
          sunday: 'Closed',
        },
        services: {
          benefits: {
            other: '',
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vba_314y',
      type: 'va_facilities',
      attributes: {
        uniqueId: '314y',
        name: 'VetSuccess on Campus at George Mason University',
        facilityType: 'va_benefits_facility',
        classification: 'Vetsuccess On Campus',
        website: 'NULL',
        lat: 38.8350585100001,
        long: -77.3112389299999,
        address: {
          mailing: {},
          physical: {
            zip: '22033',
            city: 'Fairfax',
            state: 'VA',
            address1: '4400 University Drive',
            address2: 'MS N 3A4',
            address3: null,
          },
        },
        phone: {
          fax: null,
          main: '703-993-4464',
        },
        hours: {
          friday: '7:30AM-5:00PM',
          monday: '7:30AM-5:00PM',
          sunday: 'Closed',
          tuesday: '7:30AM-5:00PM',
          saturday: 'Closed',
          thursday: '7:30AM-5:00PM',
          wednesday: '7:30AM-5:00PM',
        },
        services: {
          benefits: {
            other: null,
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'nca_827',
      type: 'va_facilities',
      attributes: {
        uniqueId: '827',
        name: 'Balls Bluff National Cemetery',
        facilityType: 'va_cemetery',
        classification: 'National Cemetery',
        website: 'https://www.cem.va.gov/cems/nchp/ballsbluff.asp',
        lat: 39.1318417350001,
        long: -77.52753613,
        address: {
          mailing: {
            zip: '22701',
            city: 'Culpeper',
            state: 'VA',
            address1: '305 U.S. Ave',
            address2: null,
            address3: null,
          },
          physical: {
            zip: '22075',
            city: 'Leesburg',
            state: 'VA',
            address1: 'Route 7',
            address2: null,
            address3: null,
          },
        },
        phone: {
          fax: '540-825-6684',
          main: '540-825-0027',
        },
        hours: {
          friday: 'Sunrise - Sunset',
          monday: 'Sunrise - Sunset',
          sunday: 'Sunrise - Sunset',
          tuesday: 'Sunrise - Sunset',
          saturday: 'Sunrise - Sunset',
          thursday: 'Sunrise - Sunset',
          wednesday: 'Sunrise - Sunset',
        },
        services: {},
        feedback: {},
        access: {},
      },
    },
    {
      id: 'nca_872',
      type: 'va_facilities',
      attributes: {
        uniqueId: '872',
        name: 'Quantico National Cemetery',
        facilityType: 'va_cemetery',
        classification: 'National Cemetery',
        website: 'https://www.cem.va.gov/cems/nchp/quantico.asp',
        lat: 38.552491403,
        long: -77.357505649,
        address: {
          mailing: {
            zip: '22172',
            city: 'Triangle',
            state: 'VA',
            address1: 'P.O. Box 10',
            address2: null,
            address3: null,
          },
          physical: {
            zip: '22172',
            city: 'Triangle',
            state: 'VA',
            address1: '18424 Joplin Rd (Route 619)',
            address2: null,
            address3: null,
          },
        },
        phone: {
          fax: '703-221-2185',
          main: '703-221-2183',
        },
        hours: {
          friday: 'Sunrise - Sunset',
          monday: 'Sunrise - Sunset',
          sunday: 'Sunrise - Sunset',
          tuesday: 'Sunrise - Sunset',
          saturday: 'Sunrise - Sunset',
          thursday: 'Sunrise - Sunset',
          wednesday: 'Sunrise - Sunset',
        },
        services: {},
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vba_314z',
      type: 'va_facilities',
      attributes: {
        uniqueId: '314z',
        name:
          'VetSuccess on Campus at Northern Virginia Community College (Alexandria Campus)',
        facilityType: 'va_benefits_facility',
        classification: 'Vetsuccess On Campus',
        website: 'NULL',
        lat: 38.8386962600001,
        long: -77.1117420699999,
        address: {
          mailing: {},
          physical: {
            zip: '22311',
            city: 'Alexandria',
            state: 'VA',
            address1: '3001 North Beauregard St',
            address2: 'Bisdorf Building, Room 194',
            address3: null,
          },
        },
        phone: {
          fax: '703-575-4706',
          main: '703-323-3893',
        },
        hours: {
          friday: '8:00AM-3:30PM',
          monday: '8:00AM-3:30PM',
          sunday: 'Closed',
          tuesday: '8:00AM-3:30PM',
          saturday: 'Closed',
          thursday: '8:00AM-3:30PM',
          wednesday: '8:00AM-3:30PM',
        },
        services: {
          benefits: {
            other: null,
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vc_0228V',
      type: 'va_facilities',
      attributes: {
        uniqueId: '0228V',
        name: 'Alexandria Vet Center',
        facilityType: 'vet_center',
        classification: null,
        website: null,
        lat: 38.7678970200001,
        long: -77.11909822,
        address: {
          mailing: {},
          physical: {
            zip: '22310',
            city: 'Alexandria',
            state: 'VA',
            address1: '6940 South Kings Highway',
            address2: 'Suite 204',
            address3: null,
          },
        },
        phone: {
          main: '703-360-8633 x',
        },
        hours: {
          friday: '800AM-430PM',
          monday: '800AM-730PM',
          sunday: '-',
          tuesday: '800AM-330PM',
          saturday: '-',
          thursday: '800AM-730PM',
          wednesday: '800AM-730PM',
        },
        services: {},
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vha_688GA',
      type: 'va_facilities',
      attributes: {
        uniqueId: '688GA',
        name: 'Fort Belvoir VA Clinic',
        facilityType: 'va_health_facility',
        classification: 'Multi-Specialty CBOC',
        website: null,
        lat: 38.7048241100001,
        long: -77.14011033,
        address: {
          mailing: {},
          physical: {
            zip: '22060-5285',
            city: 'Fort Belvoir',
            state: 'VA',
            address1: '9300 Dewitt Loop',
            address2: null,
            address3: null,
          },
        },
        phone: {
          fax: '571-231-2408 x',
          main: '571-231-2408 x',
          pharmacy: '202-745-8235 x',
          afterHours: '202-745-8247 x',
          patientAdvocate: '202-745-8588 x',
          mentalHealthClinic: '571-231-2408',
          enrollmentCoordinator: '202-745-8000 x6333',
        },
        hours: {
          friday: '730AM-400PM',
          monday: '730AM-400PM',
          sunday: '-',
          tuesday: '730AM-400PM',
          saturday: '-',
          thursday: '730AM-400PM',
          wednesday: '730AM-400PM',
        },
        services: {
          health: [
            {
              sl1: ['MentalHealthCare'],
              sl2: [],
            },
            {
              sl1: ['PrimaryCare'],
              sl2: [],
            },
            {
              sl1: ['EmergencyCare'],
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
              sl1: ['Dermatology'],
              sl2: [],
            },
            {
              sl1: ['Gynecology'],
              sl2: [],
            },
          ],
          lastUpdated: '2018-08-18',
        },
        feedback: {
          health: {
            effectiveDate: '2018-05-22',
            primaryCareUrgent: '0.74',
            primaryCareRoutine: '0.83',
          },
        },
        access: {
          health: {
            audiology: {
              new: 69.0,
              established: 13.0,
            },
            gynecology: {
              new: null,
              established: 6.0,
            },
            dermatology: {
              new: null,
              established: 0.0,
            },
            primaryCare: {
              new: 55.0,
              established: 3.0,
            },
            mentalHealth: {
              new: 34.0,
              established: 1.0,
            },
            womensHealth: {
              new: null,
              established: 6.0,
            },
            effectiveDate: '2018-08-13',
          },
        },
      },
    },
    {
      id: 'vba_314u',
      type: 'va_facilities',
      attributes: {
        uniqueId: '314u',
        name: 'Fort Belvoir Pre-Discharge Claims Intake Site',
        facilityType: 'va_benefits_facility',
        classification: null,
        website: 'NULL',
        lat: 38.7011308300001,
        long: -77.13806455,
        address: {
          mailing: {},
          physical: {
            zip: '22060',
            city: 'Fort Belvoir',
            state: 'VA',
            address1: '9501 Farrell Road',
            address2: '808N Suite NS-104',
            address3: null,
          },
        },
        phone: {
          fax: '703-805-8089',
          main: '703-805-0548',
        },
        hours: {
          friday: 'Closed',
          monday: '8:00AM-4:00PM',
          sunday: 'Closed',
          tuesday: '8:00AM-4:00PM',
          saturday: 'Closed',
          thursday: '8:00AM-4:00PM',
          wednesday: '8:00AM-4:00PM',
        },
        services: {
          benefits: {
            other: 'Accepts and date stamps claims ',
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vba_314w',
      type: 'va_facilities',
      attributes: {
        uniqueId: '314w',
        name: 'Fort Belvoir Outbased Office',
        facilityType: 'va_benefits_facility',
        classification: 'Outbased',
        website: 'NULL',
        lat: 38.6924387600001,
        long: -77.13654307,
        address: {
          mailing: {},
          physical: {
            zip: '22060',
            city: 'Fort Belvoir',
            state: 'VA',
            address1: '808 Farrell Road',
            address2: 'Room NS 104',
            address3: null,
          },
        },
        phone: {
          fax: '215-991-1442',
          main: '301-400-2463',
        },
        hours: {
          friday: '7:00AM-3:30PM',
          monday: '7:00AM-3:30PM',
          sunday: 'Closed',
          tuesday: '7:00AM-3:30PM',
          saturday: 'Closed',
          thursday: '7:00AM-3:30PM',
          wednesday: '7:00AM-3:30PM',
        },
        services: {
          benefits: {
            other: null,
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vba_372d',
      type: 'va_facilities',
      attributes: {
        uniqueId: '372d',
        name: 'Walter Reed National Military Medical Center',
        facilityType: 'va_benefits_facility',
        classification: 'Outbased',
        website: 'NULL',
        lat: 39.0025918100001,
        long: -77.09709272,
        address: {
          mailing: {},
          physical: {
            zip: '20889',
            city: 'Bethesda',
            state: 'MD',
            address1: '8901 Rockville Pike',
            address2: 'Bldg 11 Room 226',
            address3: null,
          },
        },
        phone: {
          fax: null,
          main: '301-400-2465',
        },
        hours: {
          friday: 'Closed',
          monday: '8:00AM-4:00PM',
          sunday: 'Closed',
          tuesday: '8:00AM-4:00PM',
          saturday: 'Closed',
          thursday: '8:00AM-4:00PM',
          wednesday: '8:00AM-4:00PM',
        },
        services: {
          benefits: {
            other: 'Accepts and date stamps claims ',
            standard: [
              'IntegratedDisabilityEvaluationSystemAssistance',
              'PreDischargeClaimAssistance',
            ],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'vba_314x',
      type: 'va_facilities',
      attributes: {
        uniqueId: '314x',
        name: 'Quantico Marine Base Pre-Discharge Claims Intake Site',
        facilityType: 'va_benefits_facility',
        classification: null,
        website: 'NULL',
        lat: 38.5185351600001,
        long: -77.3051058199999,
        address: {
          mailing: {},
          physical: {
            zip: '22134',
            city: 'Quantico',
            state: 'VA',
            address1: '3025 John Quick Road',
            address2: null,
            address3: null,
          },
        },
        phone: {
          fax: '703-432-1869',
          main: '703-432-1814',
        },
        hours: {
          friday: '7:00AM-3:30PM',
          monday: '7:00AM-3:30PM',
          sunday: 'Closed',
          tuesday: '7:00AM-3:30PM',
          saturday: 'Closed',
          thursday: '7:00AM-3:30PM',
          wednesday: '7:00AM-3:30PM',
        },
        services: {
          benefits: {
            other: null,
            standard: [],
          },
        },
        feedback: {},
        access: {},
      },
    },
    {
      id: 'ccp_1',
      type: 'cc_provider',
      attributes: {
        uniqueId: '1',
        name: 'Smith, Jones MD',
        orgName: 'Jones Family Medicine',
        specialty: [
          {
            name: 'Family Medicine',
            desc:
              'Family Medicine is the medical specialty which is concerned with the total health care of the individual and the family. It is the specialty in breadth which integrates the biological, clinical, and behavioral sciences. The scope of family medicine is not limited by age, sex, organ system, or disease entity.',
          },
        ],
        address: {
          street: '820 Chesapeake Street, Southeast',
          appt: '',
          city: 'Washington',
          state: 'DC',
          zip: '20032-3428',
          full: '820 Chesapeake Street, Southeast, Washington, DC 20032-3428',
        },
        email: 'jones.smith@docs.gov',
        phone: '202-745-8685',
        schedPhone: '202-745-8000',
        fax: '202-562-8789',
        website: 'http://example.com',
        prefContact: 'phone',
        accNewPatients: true,
        gender: 'Female',
        distance: 0.5, // in miles
        network: 'TriWest',
        lat: 38.8292075900001,
        long: -76.99237091,
      },
    },
    {
      id: 'ccp_2',
      type: 'cc_provider',
      attributes: {
        uniqueId: '2',
        name: 'Franklin Street Dentist',
        orgName: null,
        specialty: [
          {
            name: 'Dentistry',
            desc:
              "A dentist is a person qualified by a doctorate in dental surgery (D.D.S.) or dental medicine (D.M.D.), licensed by the state to practice dentistry, and practicing within the scope of that license.  There is no difference between the two degrees: dentists who have a DMD or DDS have the same education.  Universities have the prerogative to determine what degree is awarded.  Both degrees use the same curriculum requirements set by the American Dental Association's Commission on Dental Accreditation.  Generally, three or more years of undergraduate education plus four years of dental school is required to graduate and become a general dentist.  State licensing boards accept either degree as equivalent, and both degrees allow licensed individuals to practice the same scope of general dentistry.  Additional post-graduate training is required to become a dental specialist.",
          },
          {
            name: 'Orthodontist',
            desc:
              'That area of dentistry concerned with the supervision, guidance and correction of the growing or mature dentofacial structures, including those conditions that require movement of teeth or correction of malrelationships and malformations of their related structures and the adjustment of relationships between and among teeth and facial bones by the application of forces and/or the stimulation and redirection of functional forces within the craniofacial complex.  Major responsibilities of orthodontic practice include the diagnosis, prevention, interception and treatment of all forms of malocclusion of the teeth and associated alterations in their surrounding structures; the design, application and control of functional and corrective appliances; and the guidance of the dentition and its supporting structures to attain and maintain optimum occlusal relations in physiologic and esthetic harmony among facial and cranial structures.',
          },
        ],
        address: {
          street: '1500 Franklin Street Northeast',
          appt: '',
          city: 'Washington',
          state: 'DC',
          zip: '20018-2000',
          full: '1500 Franklin Street Northeast, Washington, DC 20018-2000',
        },
        email: 'franklin@dentist.med',
        phone: '202-636-7660',
        fax: '202-636-7661',
        website: 'http://example.com',
        prefContact: 'phone',
        accNewPatients: true,
        gender: 'Male',
        distance: 5.15, // in miles
        network: 'TriWest',
        lat: 38.925828,
        long: -76.9835070199999,
      },
    },
    {
      id: 'ccp_3',
      type: 'cc_provider',
      attributes: {
        uniqueId: '3',
        name: 'University of Maryland Clinic',
        specialty: [
          {
            name: 'Vaccines',
            desc: '...shots...',
          },
          {
            name: 'Check-ups',
            desc: 'Physicals and whatnot...',
          },
        ],
        address: {
          street: '3511 University Blvd. East',
          appt: '',
          city: 'Adelphi',
          state: 'DC',
          zip: '20783',
          full: '3511 University Blvd. East, Adelphi, MD 20783',
        },
        email: 'clinic@uom.edu',
        phone: '240-684-2555',
        schedPhone: '866-606-8198',
        fax: '240-684-2301',
        website: 'http://example.com',
        prefContact: 'phone',
        accNewPatients: true,
        gender: 'Male',
        distance: 5.15, // in miles
        network: 'TriWest',
        lat: 38.9857684400001,
        long: -76.95675965,
      },
    },
    {
      id: 'ccp_4',
      type: 'cc_provider',
      attributes: {
        uniqueId: '4',
        name: 'University of Broken Data',
        specialty: [
          {
            name: 'Bad Data',
            desc: '...b0rk...',
          },
          {
            name: 'Eyyy Lmao',
            desc: 'LUL  IceCold...',
          },
        ],
        address: {},
        email: 'b0rkb0rk@br0k.edu',
        phone: '240-123-0199',
        schedPhone: '866-606-8198',
        fax: '240-123-0198',
        website: 'http://b0rk.org',
        prefContact: 'phone',
        accNewPatients: true,
        gender: 'Male',
        distance: 3.65, // in miles
        network: 'LHASNRM',
        lat: 38.9857684400001,
        long: -76.95675965,
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
      totalPages: 1,
      totalEntries: 16,
    },
  },
};

export const providerServices = [
  {
    specialtyCode: '103TW0100X',
    name: 'Psychologist - Women ',
    grouping: 'Behavioral Health & Social Service Providers',
    classification: 'Psychologist',
    specialization: 'Women',
    specialtyDescription: null,
  },
  {
    specialtyCode: '104100000X',
    name: 'Social Worker   ',
    grouping: 'Behavioral Health & Social Service Providers',
    classification: 'Social Worker',
    specialization: null,
    specialtyDescription:
      'A social worker is a person who is qualified by a Social Work degree, and licensed, certified or registered by the state as a social worker to practice within the scope of that license.  A social worker provides assistance and counseling to clients and their families who are dealing with social, emotional and environmental problems. Social work services may be rendered to individuals, families, groups, and the public.',
  },
  {
    specialtyCode: '1041C0700X',
    name: 'Social Worker - Clinical ',
    grouping: 'Behavioral Health & Social Service Providers',
    classification: 'Social Worker',
    specialization: 'Clinical',
    specialtyDescription:
      'A social worker who holds a master’s or doctoral degree in social work from an accredited school of social work in addition to at least two years of post-master’s supervised experience in a clinical setting. The social worker must be licensed, certified, or registered at the clinical level in the jurisdiction of practice. A clinical social worker provides direct services, including interventions focused on interpersonal interactions, intrapsychic dynamics, and life management issues. Clinical social work services are based on bio-psychosocial perspectives. Services consist of assessment, diagnosis, treatment (including psychotherapy and counseling), client-centered advocacy, consultation, evaluation, and prevention of mental illness, emotional, or behavioral disturbances.',
  },
  {
    specialtyCode: '1041S0200X',
    name: 'Social Worker - School ',
    grouping: 'Behavioral Health & Social Service Providers',
    classification: 'Social Worker',
    specialization: 'School',
    specialtyDescription: 'Definition to come...',
  },
  {
    specialtyCode: '106E00000X',
    name: 'Assistant Behavior Analyst   ',
    grouping: 'Behavioral Health & Social Service Providers',
    classification: 'Assistant Behavior Analyst',
    specialization: null,
    specialtyDescription:
      'An assistant behavior analyst is qualified by Behavior Analyst Certification Board certification and/or a state-issued license or credential in behavior analysis to practice under the supervision of an appropriately credentialed professional behavior analyst. An assistant behavior analyst delivers services consistent with the dimensions of applied behavior analysis and supervision requirements defined in state laws or regulations and/or national certification standards. Common services may include, but are not limited to, conducting behavioral assessments, analyzing data, writing behavior-analytic treatment plans, training and supervising others in implementation of components of treatment plans, and direct implementation of treatment plans.',
  },
  {
    specialtyCode: '106H00000X',
    name: 'Marriage & Family Therapist   ',
    grouping: 'Behavioral Health & Social Service Providers',
    classification: 'Marriage & Family Therapist',
    specialization: null,
    specialtyDescription:
      "A marriage and family therapist is a person with a master's degree in marriage and family therapy, or a master's or doctoral degree in a related mental health field with substantially equivalent coursework in marriage and family therapy, who receives supervised clinical experience, or a person who meets the state requirements to practice as a marriage and family therapist.  A marriage and family therapist treats mental and emotional disorders within the context of marriage and family systems.   A marriage and family therapist provides mental health and counseling services to individuals, couples, families, and groups.",
  },
  {
    specialtyCode: '106S00000X',
    name: 'Behavior Technician   ',
    grouping: 'Behavioral Health & Social Service Providers',
    classification: 'Behavior Technician',
    specialization: null,
    specialtyDescription:
      'The behavior technician is a paraprofessional who practices under the close, ongoing supervision of a behavior analyst or assistant behavior analyst certified by the Behavior Analyst Certification Board and/or credentialed by a state (such as through licensure). The behavior technician is primarily responsible for the implementation of components of behavior-analytic treatment plans developed by the supervisor. That may include collecting data on treatment targets and conducting certain types of behavioral assessments (e.g., stimulus preference assessments). The behavior technician does not design treatment or assessment plans or procedures but provides services as assigned by the supervisor responsible for his or her work.',
  },
  {
    specialtyCode: '111N00000X',
    name: 'Chiropractor   ',
    grouping: 'Chiropractic Providers',
    classification: 'Chiropractor',
    specialization: null,
    specialtyDescription:
      'A provider qualified by a Doctor of Chiropractic (D.C.), licensed by the State and who practices chiropractic medicine -that discipline within the healing arts which deals with the nervous system and its relationship to the spinal column and its interrelationship with other body systems.',
  },
  {
    specialtyCode: '111NI0013X',
    name: 'Chiropractor - Independent Medical Examiner ',
    grouping: 'Chiropractic Providers',
    classification: 'Chiropractor',
    specialization: 'Independent Medical Examiner',
    specialtyDescription:
      'A special evaluator not involved with the medical care of the individual examinee that impartially evaluates the care being provided by other practitioners to clarify clinical, disability, liability or other case issues.',
  },
  {
    specialtyCode: '111NI0900X',
    name: 'Chiropractor - Internist ',
    grouping: 'Chiropractic Providers',
    classification: 'Chiropractor',
    specialization: 'Internist',
    specialtyDescription:
      'The chiropractic internist may serve as a primary care physician or may see patients referred from other providers for evaluation and co-management. Evaluation is focused on the early detection of functional, nutritional, and pathological disorders. A chiropractic internist utilizes the diagnostic instruments necessary for proper examination. In cases where laboratory examination is necessary, a chiropractic internist utilizes a recognized reference laboratory facility. A chiropractic internist may manage his or her own cases or may refer to another specialist when prudent to do so. The chiropractic internist utilizes documented natural therapies, therapeutic lifestyle changes, patient education and other resources to promote patient health and avoidance of disease.',
  },
  {
    specialtyCode: '111NN0400X',
    name: 'Chiropractor - Neurology ',
    grouping: 'Chiropractic Providers',
    classification: 'Chiropractor',
    specialization: 'Neurology',
    specialtyDescription:
      'Chiropractic Neurology is defined as the field of functional neurology that engages the internal - and external environment of the individual in a structured and targeted approach to affect positive changes in the nervous system and consequently the physiology and behavior of an individual. Chiropractic Neurologists are board-certified specialists in non-drug, non-surgical care for those with neurologically based health problems. There are many conditions people suffer from that are in this broad category: learning and attention disorders, headaches, vertigo, pain syndromes, developmental disorders, nerve injury, spinal cord injury, head injury or stroke, movement disorders, and many other conditions.',
  },
  {
    specialtyCode: '111NN1001X',
    name: 'Chiropractor - Nutrition ',
    grouping: 'Chiropractic Providers',
    classification: 'Chiropractor',
    specialization: 'Nutrition',
    specialtyDescription:
      "Chiropractic Nutrition is that specialty within the chiropractic profession that deals with the overall factors that affect the patient's ability to maintain the manipulative correction and thus sustain better neurological integrity. The Chiropractic Nutrition Specialist will perform extensive research on the patient's previous health history, ethnicity, and any family history related to what the patient is being treated for. Patients fill out questionnaires concerning dietary and sleep patterns and previous or present symptomology. A nutrition examination would be performed to assess areas such as absorption rates, adrenal function, kidney health, lung health etc. The patient is often instructed on how to check the pH of their saliva and urine, test for the presence of Candida Albicans, etc., at home. Outside laboratory testing includes blood, urine, hair analysis, food allergy testing etc. The patient’s prescription and over the counter medications are recorded and analyzed.",
  },
  {
    specialtyCode: '133NN1002X',
    name: 'Nutritionist - Nutrition, Education ',
    grouping: 'Dietary & Nutritional Service Providers',
    classification: 'Nutritionist',
    specialization: 'Nutrition, Education',
    specialtyDescription: 'Definition to come...',
  },
  {
    specialtyCode: '133V00000X',
    name: 'Dietitian, Registered   ',
    grouping: 'Dietary & Nutritional Service Providers',
    classification: 'Dietitian, Registered',
    specialization: null,
    specialtyDescription:
      'A registered dietician (RD) is a food and nutrition expert who has successfully completed a minimum of a bachelor’s degree at a US regionally accredited university or college and course work approved by The American Dietetic Association (ADA); an ADA-accredited or approved, supervised practice program, typically 6 to 12 months in length; a national examination administered by the Commission on Dietetic Registration; and continuing professional educational requirements to maintain registration.',
  },
  {
    specialtyCode: '133VN1004X',
    name: 'Dietitian, Registered - Nutrition, Pediatric ',
    grouping: 'Dietary & Nutritional Service Providers',
    classification: 'Dietitian, Registered',
    specialization: 'Nutrition, Pediatric',
    specialtyDescription: 'Definition to come...',
  },
  {
    specialtyCode: '136A00000X',
    name: 'Dietetic Technician, Registered   ',
    grouping: 'Dietary & Nutritional Service Providers',
    classification: 'Dietetic Technician, Registered',
    specialization: null,
    specialtyDescription:
      'A person trained in food and nutrition who is an integral part of health care and foodservice management teams. A dietetic technician, registered (DTR) has successfully completed at least a two-year associate’s degree at a US regionally accredited college or university; a dietetic technician program approved by The American Dietetic Association, including 450 hours of supervised practice experience; a national examination administered by the Commission on Dietetic Registration; and continuing professional educational requirements to maintain registration.',
  },
  {
    specialtyCode: '146D00000X',
    name: 'Personal Emergency Response Attendant   ',
    grouping: 'Emergency Medical Service Providers',
    classification: 'Personal Emergency Response Attendant',
    specialization: null,
    specialtyDescription:
      'Individuals that are specially trained to assist patients living at home with urgent/emergent situations.  These individuals must be able to perform CPR and basic first aid and have sufficient counseling skills to allay fears and assist in working through processes necessary to resolve the crisis.  Functions may include transportation to various facilities and businesses, contacting agencies to initiate remediation service or providing reassurance.',
  },
  {
    specialtyCode: '146L00000X',
    name: 'Emergency Medical Technician, Paramedic   ',
    grouping: 'Emergency Medical Service Providers',
    classification: 'Emergency Medical Technician, Paramedic',
    specialization: null,
    specialtyDescription:
      'An EMT, Paramedic is an individual trained and certified to perform advanced life support (ALS) in medical emergencies based on individual state boards.',
  },
  {
    specialtyCode: '146M00000X',
    name: 'Emergency Medical Technician, Intermediate   ',
    grouping: 'Emergency Medical Service Providers',
    classification: 'Emergency Medical Technician, Intermediate',
    specialization: null,
    specialtyDescription:
      'An Intermediate EMT is an individual trained and certified to perform intermediate life support treatment in medical emergencies based on individual state boards.',
  },
  {
    specialtyCode: '146N00000X',
    name: 'Emergency Medical Technician, Basic   ',
    grouping: 'Emergency Medical Service Providers',
    classification: 'Emergency Medical Technician, Basic',
    specialization: null,
    specialtyDescription:
      'A Basic EMT is an individual trained and certified to perform basic life support treatment in medical emergencies based on individual state boards.',
  },
  {
    specialtyCode: '152W00000X',
    name: 'Optometrist   ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Optometrist',
    specialization: null,
    specialtyDescription:
      'Doctors of optometry (ODs) are the primary health care professionals for the eye.  Optometrists examine, diagnose, treat, and manage diseases, injuries, and disorders of the visual system, the eye, and associated structures as well as identify related systemic conditions affecting the eye.  An optometrist has completed pre-professional undergraduate education in a college or university and four years of professional education at a college of optometry, leading to the doctor of optometry (O.D.) degree.  Some optometrists complete an optional residency in a specific area of practice.  Optometrists are eye health care professionals state-licensed to diagnose and treat diseases and disorders of the eye and visual system. ',
  },
  {
    specialtyCode: '152WC0802X',
    name: 'Optometrist - Corneal and Contact Management ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Optometrist',
    specialization: 'Corneal and Contact Management',
    specialtyDescription:
      'The professional activities performed by an Optometrist related to the fitting of contact lenses to an eye, ongoing evaluation of the cornea’s ability to sustain successful contact lens wear, and treatment of any external eye or corneal condition which can affect contact lens wear.',
  },
  {
    specialtyCode: '152WL0500X',
    name: 'Optometrist - Low Vision Rehabilitation ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Optometrist',
    specialization: 'Low Vision Rehabilitation',
    specialtyDescription:
      'Optometrists who specialize in low-vision care having training to assess visual function, prescribe low-vision devices, develop treatment plans, and recommend other vision rehabilitation services.',
  },
  {
    specialtyCode: '152WP0200X',
    name: 'Optometrist - Pediatrics ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Optometrist',
    specialization: 'Pediatrics',
    specialtyDescription:
      'Optometrists who work in Pediatrics are concerned with the prevention, development, diagnosis, and treatment of visual problems in children.',
  },
  {
    specialtyCode: '152WS0006X',
    name: 'Optometrist - Sports Vision ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Optometrist',
    specialization: 'Sports Vision',
    specialtyDescription:
      'An optometrist who offers services designed to care for unique vision care needs of athletes, which may include one of more of the following services:  corrective vision care unique to a specific sporting environment; protective eyewear for the prevention of sports-related injuries; vision enhancement – which may include vision therapy and techniques to improve visual skills specific to the athlete’s sport.',
  },
  {
    specialtyCode: '152WV0400X',
    name: 'Optometrist - Vision Therapy ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Optometrist',
    specialization: 'Vision Therapy',
    specialtyDescription:
      'Optometrists who specialize in vision therapy as a treatment process used to improve vision function. It includes a broad range of developmental and rehabilitative treatment programs individually prescribed to remediate specific sensory, motor and/or visual perceptual dysfunctions.',
  },
  {
    specialtyCode: '152WX0102X',
    name: 'Optometrist - Occupational Vision ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Optometrist',
    specialization: 'Occupational Vision',
    specialtyDescription:
      'Optometrists who work in Occupational Vision, the branch of environmental optometry, consider all aspects of the relationship between work and vision, visual performances, eye safety, and health.',
  },
  {
    specialtyCode: '156F00000X',
    name: 'Technician/Technologist   ',
    grouping: 'Eye and Vision Services Providers',
    classification: 'Technician/Technologist',
    specialization: null,
    specialtyDescription:
      'A broad category grouping different kinds of technologists and technicians. See individual definitions.',
  },
  {
    specialtyCode: '172M00000X',
    name: 'Mechanotherapist   ',
    grouping: 'Other Service Providers',
    classification: 'Mechanotherapist',
    specialization: null,
    specialtyDescription:
      'A practitioner of mechanotherapy examines patients by verbal inquiry, examination of the musculoskeletal system by hand, and visual inspection and observation.  In the treatment of patients, mechanotherapists employ the techniques of advised or supervised exercise; electrical neuromuscular stimulation; massage or manipulation; or air, water, heat, cold, sound, or infrared ray therapy.',
  },
  {
    specialtyCode: '172P00000X',
    name: 'Naprapath   ',
    grouping: 'Other Service Providers',
    classification: 'Naprapath',
    specialization: null,
    specialtyDescription:
      'Naprapathy means a branch of medicine that focuses on the evaluation and treatment of neuron-muscular conditions.  Doctors of naprapathy are connective tissue specialists.  Education and training are defined through individual states’ licensing/certification requirements.',
  },
  {
    specialtyCode: '172V00000X',
    name: 'Community Health Worker   ',
    grouping: 'Other Service Providers',
    classification: 'Community Health Worker',
    specialization: null,
    specialtyDescription:
      'Community health workers (CHW) are lay members of communities who work either for pay or as volunteers in association with the local health care system in both urban and rural environments and usually share ethnicity, language, socioeconomic status and life experiences with the community members they serve. They have been identified by many titles such as community health advisors, lay health advocates, "promotores(as), outreach educators, community health representatives, peer health promoters, and peer health educators. CHWs offer interpretation and translation services, provide culturally appropriate health education and information, assist people in receiving the care they need, give informal counseling and guidance on health behaviors, advocate for individual and community health needs, and provide some direct services such as first aid and blood pressure screening.  Some examples of these practitioners are Community Health Aides or Practitioners established under 25 USC §1616 (l) under HHS, Indian Health Service, Public Health Service.',
  },
  {
    specialtyCode: '209800000X',
    name: 'Legal Medicine   ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Legal Medicine',
    specialization: null,
    specialtyDescription:
      'Legal Medicine is a special field of medicine that focuses on various aspects of medicine and law. Historically, the practice of legal medicine made contributions to medicine as a scientific instrument to solve criminal perplexities. Since World War II, the domain of legal medicine has broadened to include not only aspects of medical science to solve legal and criminal problems but aspects of law as it applies to medicine. Legal Medicine continues to grow as medicolegal issues like medical malpractice and liability, government regulation of health care, issues of tort reform, and moral and ethical complexities presented by technological advances become increasingly prominent. Many medical schools have implemented courses which supply medicolegal instruction for medical students, and many law schools now offer medicolegal courses. Also, dual degree programs in law and medicine have been created to assist physicians to bridge the gap between medicine and the law.',
  },
  {
    specialtyCode: '173C00000X',
    name: 'Reflexologist   ',
    grouping: 'Other Service Providers',
    classification: 'Reflexologist',
    specialization: null,
    specialtyDescription:
      'Reflexologists perform a non-invasive complementary modality involving thumb and finger techniques to apply alternating pressure to the reflexes within the reflex maps of the body located on the feet, hands, and outer ears. Reflexologists apply pressure to specific areas (feet, hands, and ears) to promote a response from an area far removed from the tissue stimulated via the nervous system and acupuncture meridians. Reflexologists are recommended to complete a minimum of 200 hours of education, typically including anatomy & physiology, Reflexology theory, body systems, zones, meridians & relaxation response, ethics, business standards, and supervised practicum.',
  },
  {
    specialtyCode: '173F00000X',
    name: 'Sleep Specialist, PhD   ',
    grouping: 'Other Service Providers',
    classification: 'Sleep Specialist, PhD',
    specialization: null,
    specialtyDescription:
      'Sleep medicine is a clinical specialty with a focus on clinical problems that require accurate diagnosis and treatment. The knowledge base of sleep medicine is derived from many disciplines including neuroanatomy, neurophysiology, respiratory physiology, pharmacology, psychology, psychiatry, neurology, general internal medicine, pulmonary medicine, and pediatrics as well as others.',
  },
  {
    specialtyCode: '207Q00000X',
    name: 'Family Medicine   ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: null,
    specialtyDescription:
      'Family Medicine is the medical specialty which is concerned with the total health care of the individual and the family. It is the specialty in breadth which integrates the biological, clinical, and behavioral sciences. The scope of family medicine is not limited by age, sex, organ system, or disease entity.',
  },
  {
    specialtyCode: '207QA0000X',
    name: 'Family Medicine - Adolescent Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Adolescent Medicine',
    specialtyDescription:
      'A family medicine physician with multidisciplinary training in the unique physical, psychological and social characteristics of adolescents and their health care problems and needs.',
  },
  {
    specialtyCode: '207QA0401X',
    name: 'Family Medicine - Addiction Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Addiction Medicine',
    specialtyDescription:
      'A family medicine physician who specializes in the diagnosis and treatment of addictions.',
  },
  {
    specialtyCode: '207QA0505X',
    name: 'Family Medicine - Adult Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Adult Medicine',
    specialtyDescription: 'Definition to come.',
  },
  {
    specialtyCode: '207QB0002X',
    name: 'Family Medicine - Obesity Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Obesity Medicine',
    specialtyDescription:
      'A physician who specializes in the treatment of obesity demonstrates competency in and a thorough understanding of the treatment of obesity and the genetic, biologic, environmental, social, and behavioral factors that contribute to obesity. The obesity medicine physician employs therapeutic interventions including diet, physical activity, behavioral change, and pharmacotherapy. The obesity medicine physician utilizes a comprehensive approach, and may include additional resources such as dietitians, exercise physiologists, mental health professionals and bariatric surgeons as indicated to achieve optimal results. Additionally, the obesity medicine physician maintains competency in providing pre- peri- and post-surgical care of bariatric surgery patients, promotes the prevention of obesity, and advocates for those who suffer from obesity.',
  },
  {
    specialtyCode: '207QG0300X',
    name: 'Family Medicine - Geriatric Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Geriatric Medicine',
    specialtyDescription:
      "A family medicine physician with special knowledge of the aging process and special skills in the diagnostic, therapeutic, preventive and rehabilitative aspects of illness in the elderly. This specialist cares for geriatric patients in the patient's home, the office, long-term care settings such as nursing homes, and the hospital.",
  },
  {
    specialtyCode: '207QH0002X',
    name: 'Family Medicine - Hospice and Palliative Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Hospice and Palliative Medicine',
    specialtyDescription:
      'A family medicine physician with special knowledge and skills to prevent and relieve the suffering experienced by patients with life-limiting illnesses. This specialist works with an interdisciplinary hospice or palliative care team to maximize quality of life while addressing physical, psychological, social and spiritual needs of both patient and family throughout the course of the disease, through the dying process, and beyond for the family.  This specialist has expertise in the assessment of patients with advanced disease; the relief of distressing symptoms; the coordination of interdisciplinary patient and family-centered care in diverse venues; the use of specialized care systems including hospice; the management of the imminently dying patient; and legal and ethical decision making in end-of-life care.',
  },
  {
    specialtyCode: '207QS0010X',
    name: 'Family Medicine - Sports Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Sports Medicine',
    specialtyDescription:
      'A family medicine physician that is trained to be responsible for continuous care in the field of sports medicine, not only for the enhancement of health and fitness, but also for the prevention of injury and illness. A sports medicine physician must have knowledge and experience in the promotion of wellness and the prevention of injury. Knowledge about special areas of medicine such as exercise physiology, biomechanics, nutrition, psychology, physical rehabilitation, epidemiology, physical evaluation, injuries (treatment and prevention and referral practice) and the role of exercise in promoting a healthy lifestyle are essential to the practice of sports medicine. The sports medicine physician requires special education to provide the knowledge to improve the health care of the individual engaged in physical exercise (sports) whether as an individual or in team participation.',
  },
  {
    specialtyCode: '207QS1201X',
    name: 'Family Medicine - Sleep Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Family Medicine',
    specialization: 'Sleep Medicine',
    specialtyDescription:
      'A Family Medicine Physician who practices Sleep Medicine is certified in the subspecialty of sleep medicine and specializes in the clinical assessment, physiologic testing, diagnosis, management and prevention of sleep and circadian rhythm disorders. Sleep specialists treat patients of any age and use multidisciplinary approaches. Disorders managed by sleep specialists include, but are not limited to, sleep related breathing disorders, insomnia, hypersomnias, circadian rhythm sleep disorders, parasomnias and sleep related movement disorders.',
  },
  {
    specialtyCode: '207R00000X',
    name: 'Internal Medicine   ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Internal Medicine',
    specialization: null,
    specialtyDescription:
      'A physician who provides long-term, comprehensive care in the office and the hospital, managing both common and complex illness of adolescents, adults and the elderly. Internists are trained in the diagnosis and treatment of cancer, infections and diseases affecting the heart, blood, kidneys, joints and digestive, respiratory and vascular systems. They are also trained in the essentials of primary care internal medicine, which incorporates an understanding of disease prevention, wellness, substance abuse, mental health and effective treatment of common problems of the eyes, ears, skin, nervous system and reproductive organs.',
  },
  {
    specialtyCode: '207RA0000X',
    name: 'Internal Medicine - Adolescent Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Internal Medicine',
    specialization: 'Adolescent Medicine',
    specialtyDescription:
      'An internist who specializes in adolescent medicine is a multi-disciplinary healthcare specialist trained in the unique physical, psychological and social characteristics of adolescents, their healthcare problems and needs.',
  },
  {
    specialtyCode: '207RA0001X',
    name:
      'Internal Medicine - Advanced Heart Failure and Transplant Cardiology ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Internal Medicine',
    specialization: 'Advanced Heart Failure and Transplant Cardiology',
    specialtyDescription:
      'Specialists in Advanced Heart Failure and Transplant Cardiology would participate in the inpatient and outpatient management of patients with advanced heart failure across the spectrum from consideration for high-risk cardiac surgery, cardiac transplantation, or mechanical circulatory support, to pre-and post-operative evaluation and management of patients with cardiac transplants and mechanical support devices, and end-of-life care for patients with end-stage heart failure.',
  },
  {
    specialtyCode: '207RA0201X',
    name: 'Internal Medicine - Allergy & Immunology ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Internal Medicine',
    specialization: 'Allergy & Immunology',
    specialtyDescription:
      'An internist doctor of osteopathy that specializes in the treatment of allergy and immunologic disorders.  A doctor of osteopathy that is board eligible/certified by the American Osteopathic Board of Internal Medicine can obtain a Certificate of Special Qualifications in the field of Allergy & Immunology.',
  },
  {
    specialtyCode: '207RA0401X',
    name: 'Internal Medicine - Addiction Medicine ',
    grouping: 'Allopathic & Osteopathic Physicians',
    classification: 'Internal Medicine',
    specialization: 'Addiction Medicine',
    specialtyDescription:
      'An internist doctor of osteopathy that specializes in the treatment of addiction disorders.  A doctor of osteopathy that is board eligible/certified by the American Osteopathic Board of Internal Medicine can obtain a Certificate of Added Qualifications in the field of Addiction Medicine.',
  },
];

export default MockLocatorApi;
