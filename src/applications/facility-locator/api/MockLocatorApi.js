// This file mocks a web API by working with the hard-coded data at the bottom.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.

/* eslint-disable indent */
/* eslint-disable array-bracket-spacing */
/* eslint-disable space-in-parens */
/* eslint-disable no-use-before-define */

// Immitate network delay
const delay = 0;

class MockLocatorApi {

  static searchWithBounds(params) {
    return new Promise( (resolve, reject) => {
      if (params) {
        const paramsList = urlParamStringToObj(params);

        if (paramsList.fail) {
          reject('Random failure due to fail flag being set');
        }

        setTimeout( () => {
          resolve(facilityData);
        }, delay);
      } else {
        reject('Invalid URL or query sent to API!');
      }
    });
  }

  static fetchVAFacility(id) {
    return new Promise( (resolve, reject) => {

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
    });
  }
}

const urlParamStringToObj = (urlParams) => {
  return urlParams.split('&').map(
    p => {
      const [ key, value ] = p.split('=');
      return { [key]: value };
  });
};

export const facilityData = {
  data: [
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
        'long': -118.23874096,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: null,
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012-3328'
          },
          mailing: { }
        },
        phone: {
          main: '213-253-5000 x',
          fax: '213-253-5510 x',
          afterHours: '877-252-4866 x',
          patientAdvocate: '213-253-2677 x24111',
          enrollmentCoordinator: '213-253-2677 x24033',
          pharmacy: '800-952-4852 x',
          mentalHealthClinic: '310-268-4449'
        },
        hours: {
          monday: '700AM-530PM',
          tuesday: '700AM-530PM',
          wednesday: '700AM-530PM',
          thursday: '700AM-530PM',
          friday: '700AM-530PM',
          saturday: '-',
          sunday: '-'
        },
        services: {
          lastUpdated: '2017-07-24',
          health: [
            {
              sl1: [
                'DentalServices'
              ],
              sl2: []
            },
            {
              sl1: [
                'MentalHealthCare'
              ],
              sl2: []
            },
            {
              sl1: [
                'PrimaryCare'
              ],
              sl2: []
            }
          ]
        },
        feedback: {
          health: {
            primaryCareUrgent: '0.78',
            primaryCareRoutine: '0.77',
            effectiveDate: '2017-03-24'
          }
        },
        access: {
          health: {
            primaryCare: {
              'new': 15,
              established: 3
            },
            mentalHealth: {
              'new': 12,
              established: 2
            },
            womensHealth: {
              'new': null,
              established: 9
            },
            audiology: {
              'new': 48,
              established: 0
            },
            gastroenterology: {
              'new': 7,
              established: null
            },
            opthalmology: {
              'new': 9,
              established: 6
            },
            optometry: {
              'new': 14,
              established: 5
            },
            urologyClinic: {
              'new': 23,
              established: 3
            },
            effectiveDate: '2017-08-14'
          }
        }
      }
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
        'long': -118.2387403,
        address: {
          physical: {
            address1: '351 East Temple Street',
            address2: 'Room A-444',
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90012'
          },
          mailing: { }
        },
        phone: {
          main: '213-253-2677 Ext 24759',
          fax: ''
        },
        hours: {
          monday: '8:00AM-2:30PM',
          tuesday: '8:00AM-2:30PM',
          wednesday: '8:00AM-2:30PM',
          thursday: '8:00AM-2:30PM',
          friday: 'By Appointment Only',
          saturday: 'Closed',
          sunday: 'Closed'
        },
        services: {
          benefits: {
            other: '',
            standard: []
          }
        },
        feedback: { },
        access: { }
      }
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
        'long': -118.2917626,
        address: {
          physical: {
            address1: '855 North Vermont',
            address2: '',
            address3: null,
            city: 'Los Angeles',
            state: 'CA',
            zip: '90029'
          },
          mailing: { }
        },
        phone: {
          main: '323-953-4000 Ext 1253',
          fax: ''
        },
        hours: {
          monday: 'Closed',
          tuesday: 'Closed',
          wednesday: '9:00AM-4:00PM',
          thursday: 'Closed',
          friday: 'Closed',
          saturday: 'Closed',
          sunday: 'Closed'
        },
        services: {
          benefits: {
            other: '',
            standard: []
          }
        },
        feedback: { },
        access: { }
      }
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
        'long': -77.3112389299999,
        address: {
          mailing: {},
          physical: {
            zip: '22033',
            city: 'Fairfax',
            state: 'VA',
            address1: '4400 University Drive',
            address2: 'MS N 3A4',
            address3: null
          }
        },
        phone: {
          fax: null,
          main: '703-993-4464'
        },
        hours: {
          friday: '7:30AM-5:00PM',
          monday: '7:30AM-5:00PM',
          sunday: 'Closed',
          tuesday: '7:30AM-5:00PM',
          saturday: 'Closed',
          thursday: '7:30AM-5:00PM',
          wednesday: '7:30AM-5:00PM'
        },
        services: {
          benefits: {
            other: null,
            standard: []
          }
        },
        feedback: {},
        access: {}
      }
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
        'long': -77.52753613,
        address: {
          mailing: {
            zip: '22701',
            city: 'Culpeper',
            state: 'VA',
            address1: '305 U.S. Ave',
            address2: null,
            address3: null
          },
          physical: {
            zip: '22075',
            city: 'Leesburg',
            state: 'VA',
            address1: 'Route 7',
            address2: null,
            address3: null
          }
        },
        phone: {
          fax: '540-825-6684',
          main: '540-825-0027'
        },
        hours: {
          friday: 'Sunrise - Sunset',
          monday: 'Sunrise - Sunset',
          sunday: 'Sunrise - Sunset',
          tuesday: 'Sunrise - Sunset',
          saturday: 'Sunrise - Sunset',
          thursday: 'Sunrise - Sunset',
          wednesday: 'Sunrise - Sunset'
        },
        services: {},
        feedback: {},
        access: {}
      }
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
        'long': -77.357505649,
        address: {
          mailing: {
            zip: '22172',
            city: 'Triangle',
            state: 'VA',
            address1: 'P.O. Box 10',
            address2: null,
            address3: null
          },
          physical: {
            zip: '22172',
            city: 'Triangle',
            state: 'VA',
            address1: '18424 Joplin Rd (Route 619)',
            address2: null,
            address3: null
          }
        },
        phone: {
          fax: '703-221-2185',
          main: '703-221-2183'
        },
        hours: {
          friday: 'Sunrise - Sunset',
          monday: 'Sunrise - Sunset',
          sunday: 'Sunrise - Sunset',
          tuesday: 'Sunrise - Sunset',
          saturday: 'Sunrise - Sunset',
          thursday: 'Sunrise - Sunset',
          wednesday: 'Sunrise - Sunset'
        },
        services: {},
        feedback: {},
        access: {}
      }
    },
    {
      id: 'vba_314z',
      type: 'va_facilities',
      attributes: {
        uniqueId: '314z',
        name: 'VetSuccess on Campus at Northern Virginia Community College (Alexandria Campus)',
        facilityType: 'va_benefits_facility',
        classification: 'Vetsuccess On Campus',
        website: 'NULL',
        lat: 38.8386962600001,
        'long': -77.1117420699999,
        address: {
          mailing: {},
          physical: {
            zip: '22311',
            city: 'Alexandria',
            state: 'VA',
            address1: '3001 North Beauregard St',
            address2: 'Bisdorf Building, Room 194',
            address3: null
          }
        },
        phone: {
          fax: '703-575-4706',
          main: '703-323-3893'
        },
        hours: {
          friday: '8:00AM-3:30PM',
          monday: '8:00AM-3:30PM',
          sunday: 'Closed',
          tuesday: '8:00AM-3:30PM',
          saturday: 'Closed',
          thursday: '8:00AM-3:30PM',
          wednesday: '8:00AM-3:30PM'
        },
        services: {
          benefits: {
            other: null,
            standard: []
          }
        },
        feedback: {},
        access: {}
      }
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
        'long': -77.11909822,
        address: {
          mailing: {},
          physical: {
            zip: '22310',
            city: 'Alexandria',
            state: 'VA',
            address1: '6940 South Kings Highway',
            address2: 'Suite 204',
            address3: null
          }
        },
        phone: {
          main: '703-360-8633 x'
        },
        hours: {
          friday: '800AM-430PM',
          monday: '800AM-730PM',
          sunday: '-',
          tuesday: '800AM-330PM',
          saturday: '-',
          thursday: '800AM-730PM',
          wednesday: '800AM-730PM'
        },
        services: {},
        feedback: {},
        access: {}
      }
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
        'long': -77.14011033,
        address: {
          mailing: {},
          physical: {
            zip: '22060-5285',
            city: 'Fort Belvoir',
            state: 'VA',
            address1: '9300 Dewitt Loop',
            address2: null,
            address3: null
          }
        },
        phone: {
          fax: '571-231-2408 x',
          main: '571-231-2408 x',
          pharmacy: '202-745-8235 x',
          afterHours: '202-745-8247 x',
          patientAdvocate: '202-745-8588 x',
          mentalHealthClinic: '571-231-2408',
          enrollmentCoordinator: '202-745-8000 x6333'
        },
        hours: {
          friday: '730AM-400PM',
          monday: '730AM-400PM',
          sunday: '-',
          tuesday: '730AM-400PM',
          saturday: '-',
          thursday: '730AM-400PM',
          wednesday: '730AM-400PM'
        },
        services: {
          health: [
            {
              sl1: [
                'MentalHealthCare'
              ],
              sl2: []
            },
            {
              sl1: [
                'PrimaryCare'
              ],
              sl2: []
            },
            {
              sl1: [
                'EmergencyCare'
              ],
              sl2: []
            },
            {
              sl1: [
                'WomensHealth'
              ],
              sl2: []
            },
            {
              sl1: [
                'Audiology'
              ],
              sl2: []
            },
            {
              sl1: [
                'Dermatology'
              ],
              sl2: []
            },
            {
              sl1: [
                'Gynecology'
              ],
              sl2: []
            }
          ],
          lastUpdated: '2018-08-18'
        },
        feedback: {
          health: {
            effectiveDate: '2018-05-22',
            primaryCareUrgent: '0.74',
            primaryCareRoutine: '0.83'
          }
        },
        access: {
          health: {
            audiology: {
              'new': 69.0,
              established: 13.0
            },
            gynecology: {
              'new': null,
              established: 6.0
            },
            dermatology: {
              'new': null,
              established: 0.0
            },
            primaryCare: {
              'new': 55.0,
              established: 3.0
            },
            mentalHealth: {
              'new': 34.0,
              established: 1.0
            },
            womensHealth: {
              'new': null,
              established: 6.0
            },
            effectiveDate: '2018-08-13'
          }
        }
      }
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
        'long': -77.13806455,
        address: {
          mailing: {},
          physical: {
            zip: '22060',
            city: 'Fort Belvoir',
            state: 'VA',
            address1: '9501 Farrell Road',
            address2: '808N Suite NS-104',
            address3: null
          }
        },
        phone: {
          fax: '703-805-8089',
          main: '703-805-0548'
        },
        hours: {
          friday: 'Closed',
          monday: '8:00AM-4:00PM',
          sunday: 'Closed',
          tuesday: '8:00AM-4:00PM',
          saturday: 'Closed',
          thursday: '8:00AM-4:00PM',
          wednesday: '8:00AM-4:00PM'
        },
        services: {
          benefits: {
            other: 'Accepts and date stamps claims ',
            standard: []
          }
        },
        feedback: {},
        access: {}
      }
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
        'long': -77.13654307,
        address: {
          mailing: {},
          physical: {
            zip: '22060',
            city: 'Fort Belvoir',
            state: 'VA',
            address1: '808 Farrell Road',
            address2: 'Room NS 104',
            address3: null
          }
        },
        phone: {
          fax: '215-991-1442',
          main: '301-400-2463'
        },
        hours: {
          friday: '7:00AM-3:30PM',
          monday: '7:00AM-3:30PM',
          sunday: 'Closed',
          tuesday: '7:00AM-3:30PM',
          saturday: 'Closed',
          thursday: '7:00AM-3:30PM',
          wednesday: '7:00AM-3:30PM'
        },
        services: {
          benefits: {
            other: null,
            standard: []
          }
        },
        feedback: {},
        access: {}
      }
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
        'long': -77.09709272,
        address: {
          mailing: {},
          physical: {
            zip: '20889',
            city: 'Bethesda',
            state: 'MD',
            address1: '8901 Rockville Pike',
            address2: 'Bldg 11 Room 226',
            address3: null
          }
        },
        phone: {
          fax: null,
          main: '301-400-2465'
        },
        hours: {
          friday: 'Closed',
          monday: '8:00AM-4:00PM',
          sunday: 'Closed',
          tuesday: '8:00AM-4:00PM',
          saturday: 'Closed',
          thursday: '8:00AM-4:00PM',
          wednesday: '8:00AM-4:00PM'
        },
        services: {
          benefits: {
            other: 'Accepts and date stamps claims ',
            standard: [
              'IntegratedDisabilityEvaluationSystemAssistance',
              'PreDischargeClaimAssistance'
            ]
          }
        },
        feedback: {},
        access: {}
      }
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
        'long': -77.3051058199999,
        address: {
          mailing: {},
          physical: {
            zip: '22134',
            city: 'Quantico',
            state: 'VA',
            address1: '3025 John Quick Road',
            address2: null,
            address3: null
          }
        },
        phone: {
          fax: '703-432-1869',
          main: '703-432-1814'
        },
        hours: {
          friday: '7:00AM-3:30PM',
          monday: '7:00AM-3:30PM',
          sunday: 'Closed',
          tuesday: '7:00AM-3:30PM',
          saturday: 'Closed',
          thursday: '7:00AM-3:30PM',
          wednesday: '7:00AM-3:30PM'
        },
        services: {
          benefits: {
            other: null,
            standard: []
          }
        },
        feedback: {},
        access: {}
      }
    },
    {
      id: 'ccp_1',
      type: 'cc_provider',
      attributes: {
        uniqueId: '1',
        name: 'Smith, Jones MD',
        orgName: 'Jones Family Medicine',
        specialty: [{
          name: 'Family Medicine',
          desc: '...stuff...'
        }],
        address: {
          street: '820 Chesapeake Street, Southeast',
          appt: '',
          city: 'Washington',
          state: 'DC',
          zip: '20032-3428',
          full: '820 Chesapeake Street, Southeast, Washington, DC 20032-3428'
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
        'long': -76.99237091
      }
    },
    {
      id: 'ccp_2',
      type: 'cc_provider',
      attributes: {
        uniqueId: '2',
        name: 'Franklin Street Dentist',
        orgName: '',
        specialty: [{
          name: 'Dentistry',
          desc: '...stuff...'
        },
        {
          name: 'Orthodontist',
          desc: 'Braces and schtuff...'
        }],
        address: {
          street: '1500 Franklin Street Northeast',
          appt: '',
          city: 'Washington',
          state: 'DC',
          zip: '20018-2000',
          full: '1500 Franklin Street Northeast, Washington, DC 20018-2000'
        },
        email: 'franklin@dentist.med',
        phone: '202-636-7660',
        schedPhone: '202-745-8000',
        fax: '202-636-7661',
        website: 'http://example.com',
        prefContact: 'phone',
        accNewPatients: true,
        gender: 'Male',
        distance: 5.15, // in miles
        network: 'TriWest',
        lat: 38.925828,
        'long': -76.9835070199999
      }
    },
    {
      id: 'ccp_3',
      type: 'cc_provider',
      attributes: {
        uniqueId: '3',
        name: 'University of Maryland Clinic',
        orgName: '',
        specialty: [{
          name: 'Vaccines',
          desc: '...shots...'
        },
        {
          name: 'Check-ups',
          desc: 'Physicals and whatnot...'
        }],
        address: {
          street: '3511 University Blvd. East',
          appt: '',
          city: 'Adelphi',
          state: 'DC',
          zip: '20783',
          full: '3511 University Blvd. East, Adelphi, MD 20783'
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
        'long': -76.95675965
      }
    }
  ],
  links: {
    self: 'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1',
    first: 'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20',
    prev: null,
    next: null,
    last: 'http://www.example.com/v0/facilities/va?bbox%5B%5D=-118.53149414062501&bbox%5B%5D=33.91487347147951&bbox%5B%5D=-118.07762145996095&bbox%5B%5D=34.199308935560154&page=1&per_page=20'
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 20,
      totalPages: 1,
      totalEntries: 16
    }
  }
};

export default MockLocatorApi;
