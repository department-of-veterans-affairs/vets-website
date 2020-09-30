const form = {
  submission: {
    status: 'serverError',
    errorMessage: false,
    id: false,
    timestamp: false,
    hasAttemptedSubmit: false,
  },
  formId: '10-10CG',
  loadedData: {
    formData: {},
    metadata: {},
  },
  reviewPageView: {
    openChapters: [],
    viewedPages: {},
  },
  trackingPrefix: 'caregivers-10-10cg-',
  data: null,
  pages: {
    veteranInfoOne: {
      uiSchema: {
        'ui:description': {
          key: null,
          ref: null,
          props: {
            children: [
              null,
              {
                type: 'p',
                key: null,
                ref: null,
                props: {
                  className: 'vads-u-margin-top--2',
                  children: 'Please complete all the following information.',
                },
                _owner: null,
                _store: {},
              },
            ],
          },
          _owner: null,
          _store: {},
        },
        veteranFullName: {
          first: {
            'ui:title': 'Veteran’s  first name',
            'ui:errorMessages': {
              required: 'Please enter Veteran’s  first name',
            },
          },
          last: {
            'ui:title': 'Veteran’s  last name',
            'ui:errorMessages': {
              required: 'Please enter Veteran’s  last name',
            },
          },
          middle: {
            'ui:title': 'Veteran’s  middle name',
          },
        },
        veteranSsnOrTin: {
          'ui:title':
            'Veteran’s  Social Security number or tax identification number',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
          'ui:validations': [null, {}],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid Social Security or tax identification number',
            required:
              'Please enter a Social Security or tax identification number',
          },
          'ui:description': {
            type: 'div',
            key: null,
            ref: null,
            props: {
              className: 'vads-u-margin-y--1p5',
              children: {
                key: null,
                ref: null,
                props: {
                  triggerText: 'Why is this required?',
                  children:
                    'We need the Veteran’s Social Security number or tax identification number to process the application when it’s submitted online, but it’s not a requirement to apply for the program.',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        veteranDateOfBirth: {
          'ui:title': 'Veteran’s  date of birth',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
        veteranGender: {
          'ui:title': 'Veteran’s  sex',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              F: 'Female',
              M: 'Male',
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['veteranDateOfBirth', 'veteranFullName', 'veteranSsnOrTin'],
        properties: {
          veteranFullName: {
            type: 'object',
            additionalProperties: false,
            required: ['first', 'last'],
            properties: {
              first: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
              middle: {
                type: 'string',
              },
              last: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
            },
          },
          veteranSsnOrTin: {
            type: 'string',
            pattern: '^[0-9]{9}$',
          },
          veteranDateOfBirth: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
          veteranGender: {
            type: 'string',
            enum: ['F', 'M'],
          },
        },
      },
      editMode: false,
    },
    veteranInfoTwo: {
      uiSchema: {
        'ui:description': {
          key: null,
          ref: null,
          props: {
            children: [
              {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  className: 'vads-u-font-size--h4',
                  children: 'Contact information',
                },
                _owner: null,
                _store: {},
              },
              {
                type: 'p',
                key: null,
                ref: null,
                props: {
                  className: 'vads-u-margin-top--2',
                  children: 'Please complete all the following information.',
                },
                _owner: null,
                _store: {},
              },
            ],
          },
          _owner: null,
          _store: {},
        },
        veteranAddress: {
          'ui:title': ' ',
          'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
          street: {
            'ui:title': 'Veteran’s  current street address',
            'ui:errorMessages': {
              required: 'Please enter a street address',
            },
          },
          street2: {
            'ui:title': 'Line 2',
          },
          city: {
            'ui:title': 'City',
            'ui:errorMessages': {
              required: 'Please enter a city',
            },
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              labels: {
                AL: 'Alabama',
                AK: 'Alaska',
                AS: 'American Samoa',
                AZ: 'Arizona',
                AR: 'Arkansas',
                AA: 'Armed Forces Americas (AA)',
                AE: 'Armed Forces Europe (AE)',
                AP: 'Armed Forces Pacific (AP)',
                CA: 'California',
                CO: 'Colorado',
                CT: 'Connecticut',
                DE: 'Delaware',
                DC: 'District Of Columbia',
                FM: 'Federated States Of Micronesia',
                FL: 'Florida',
                GA: 'Georgia',
                GU: 'Guam',
                HI: 'Hawaii',
                ID: 'Idaho',
                IL: 'Illinois',
                IN: 'Indiana',
                IA: 'Iowa',
                KS: 'Kansas',
                KY: 'Kentucky',
                LA: 'Louisiana',
                ME: 'Maine',
                MH: 'Marshall Islands',
                MD: 'Maryland',
                MA: 'Massachusetts',
                MI: 'Michigan',
                MN: 'Minnesota',
                MS: 'Mississippi',
                MO: 'Missouri',
                MT: 'Montana',
                NE: 'Nebraska',
                NV: 'Nevada',
                NH: 'New Hampshire',
                NJ: 'New Jersey',
                NM: 'New Mexico',
                NY: 'New York',
                NC: 'North Carolina',
                ND: 'North Dakota',
                MP: 'Northern Mariana Islands',
                OH: 'Ohio',
                OK: 'Oklahoma',
                OR: 'Oregon',
                PW: 'Palau',
                PA: 'Pennsylvania',
                PR: 'Puerto Rico',
                RI: 'Rhode Island',
                SC: 'South Carolina',
                SD: 'South Dakota',
                TN: 'Tennessee',
                TX: 'Texas',
                UT: 'Utah',
                VT: 'Vermont',
                VI: 'Virgin Islands',
                VA: 'Virginia',
                WA: 'Washington',
                WV: 'West Virginia',
                WI: 'Wisconsin',
                WY: 'Wyoming',
              },
            },
            'ui:errorMessages': {
              required: 'Please enter a state',
            },
          },
          postalCode: {
            'ui:title': 'Postal code',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:errorMessages': {
              required: 'Please enter a postal code',
              pattern:
                'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
            },
          },
        },
        veteranPrimaryPhoneNumber: {
          'ui:title':
            'Veteran’s  primary telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        veteranAlternativePhoneNumber: {
          'ui:title':
            'Veteran’s  alternate telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        veteranEmail: {
          'ui:title': 'Veteran’s  email address',
          'ui:errorMessages': {
            pattern: 'Please enter an email address using this format: X@X.com',
            required: 'Please enter an email address',
          },
          'ui:options': {
            inputType: 'email',
          },
        },
        'view:veteranEmail': {
          'ui:title': 'Re-enter Veteran’s  email address',
          'ui:widget': 'email',
          'ui:validations': [{}],
        },
      },
      schema: {
        type: 'object',
        required: [
          'veteranAddress',
          'veteranPrimaryPhoneNumber',
          'view:veteranEmail',
        ],
        properties: {
          veteranAddress: {
            type: 'object',
            additionalProperties: false,
            required: ['street', 'city', 'state', 'postalCode'],
            properties: {
              street: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              street2: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              city: {
                type: 'string',
                minLength: 1,
                maxLength: 51,
              },
              state: {
                type: 'string',
                enum: [
                  'AL',
                  'AK',
                  'AS',
                  'AZ',
                  'AR',
                  'AA',
                  'AE',
                  'AP',
                  'CA',
                  'CO',
                  'CT',
                  'DE',
                  'DC',
                  'FM',
                  'FL',
                  'GA',
                  'GU',
                  'HI',
                  'ID',
                  'IL',
                  'IN',
                  'IA',
                  'KS',
                  'KY',
                  'LA',
                  'ME',
                  'MH',
                  'MD',
                  'MA',
                  'MI',
                  'MN',
                  'MS',
                  'MO',
                  'MT',
                  'NE',
                  'NV',
                  'NH',
                  'NJ',
                  'NM',
                  'NY',
                  'NC',
                  'ND',
                  'MP',
                  'OH',
                  'OK',
                  'OR',
                  'PW',
                  'PA',
                  'PR',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UT',
                  'VT',
                  'VI',
                  'VA',
                  'WA',
                  'WV',
                  'WI',
                  'WY',
                ],
              },
              postalCode: {
                type: 'string',
                pattern: '^(\\d{5})(?:[-](\\d{4}))?$',
              },
            },
          },
          veteranPrimaryPhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          veteranAlternativePhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          veteranEmail: {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
          'view:veteranEmail': {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
        },
      },
      editMode: false,
    },
    veteranInfoThree: {
      uiSchema: {
        veteranLastTreatmentFacility: {
          'ui:title': ' ',
          'ui:order': ['name', 'type'],
          name: {
            'ui:title': {
              type: 'div',
              key: null,
              ref: null,
              props: {
                children: [
                  {
                    type: 'h3',
                    key: null,
                    ref: null,
                    props: {
                      className: 'vads-u-font-size--h4',
                      children: 'Recent medical care',
                    },
                    _owner: null,
                    _store: {},
                  },
                  {
                    type: 'p',
                    key: null,
                    ref: null,
                    props: {
                      children: [
                        'Please enter the name of the medical facility where the Veteran',
                        {
                          type: 'strong',
                          key: null,
                          ref: null,
                          props: {
                            className: 'vads-u-margin-left--0p5',
                            children: 'last received medical treatment.',
                          },
                          _owner: null,
                          _store: {},
                        },
                      ],
                    },
                    _owner: null,
                    _store: {},
                  },
                  {
                    type: 'p',
                    key: null,
                    ref: null,
                    props: {
                      children: 'Name of medical facility',
                    },
                    _owner: null,
                    _store: {},
                  },
                ],
              },
              _owner: null,
              _store: {},
            },
          },
          type: {
            'ui:title': 'Was this a hospital or clinic?',
            'ui:options': {
              labels: {
                hospital: 'Hospital',
                clinic: 'Clinic',
              },
            },
          },
        },
        veteranPreferredFacility: {
          'ui:description': {
            type: 'section',
            key: null,
            ref: null,
            props: {
              children: [
                {
                  type: 'h3',
                  key: null,
                  ref: null,
                  props: {
                    className: 'vads-u-font-size--h4',
                    children: 'VA health care services',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    children: [
                      'Please select the VA medical center or clinic where the',
                      {
                        type: 'strong',
                        key: null,
                        ref: null,
                        props: {
                          className: 'vads-u-margin-left--0p5',
                          children:
                            'Veteran receives or plans to receive health care services.',
                        },
                        _owner: null,
                        _store: {},
                      },
                    ],
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    children:
                      'A Caregiver Support Coordinator at this VA medical center will review your application.',
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          veteranFacilityState: {
            'ui:title': 'State',
            'ui:options': {
              labels: {
                AL: 'Alabama',
                AK: 'Alaska',
                AS: 'American Samoa',
                AZ: 'Arizona',
                AR: 'Arkansas',
                AA: 'Armed Forces Americas (AA)',
                AE: 'Armed Forces Europe (AE)',
                AP: 'Armed Forces Pacific (AP)',
                CA: 'California',
                CO: 'Colorado',
                CT: 'Connecticut',
                DE: 'Delaware',
                DC: 'District Of Columbia',
                FM: 'Federated States Of Micronesia',
                FL: 'Florida',
                GA: 'Georgia',
                GU: 'Guam',
                HI: 'Hawaii',
                ID: 'Idaho',
                IL: 'Illinois',
                IN: 'Indiana',
                IA: 'Iowa',
                KS: 'Kansas',
                KY: 'Kentucky',
                LA: 'Louisiana',
                ME: 'Maine',
                MH: 'Marshall Islands',
                MD: 'Maryland',
                MA: 'Massachusetts',
                MI: 'Michigan',
                MN: 'Minnesota',
                MS: 'Mississippi',
                MO: 'Missouri',
                MT: 'Montana',
                NE: 'Nebraska',
                NV: 'Nevada',
                NH: 'New Hampshire',
                NJ: 'New Jersey',
                NM: 'New Mexico',
                NY: 'New York',
                NC: 'North Carolina',
                ND: 'North Dakota',
                MP: 'Northern Mariana Islands',
                OH: 'Ohio',
                OK: 'Oklahoma',
                OR: 'Oregon',
                PW: 'Palau',
                PA: 'Pennsylvania',
                PR: 'Puerto Rico',
                RI: 'Rhode Island',
                SC: 'South Carolina',
                SD: 'South Dakota',
                TN: 'Tennessee',
                TX: 'Texas',
                UT: 'Utah',
                VT: 'Vermont',
                VI: 'Virgin Islands',
                VA: 'Virginia',
                WA: 'Washington',
                WV: 'West Virginia',
                WI: 'Wisconsin',
                WY: 'Wyoming',
              },
            },
          },
          plannedClinic: {
            'ui:title': 'VA medical center',
            'ui:options': {
              labels: {
                '402': 'Togus VA Medical Center',
                '405': 'White River Junction VA Medical Center',
                '436': 'Fort Harrison VA Medical Center',
                '437': 'FARGO VA HCS',
                '438': 'SIOUX FALLS VA HCS',
                '442': 'Cheyenne VA Medical Center',
                '459':
                  'Spark M. Matsunaga Department of Veterans Affairs Medical Center',
                '460': 'Wilmington VA Medical Center',
                '463': 'Anchorage VA Medical Center',
                '501':
                  'Raymond G. Murphy Department of Veterans Affairs Medical Center',
                '502': 'Alexandria VA Medical Center',
                '503':
                  "James E. Van Zandt Veterans' Administration Medical Center",
                '504': 'AMARILLO HCS',
                '506': 'Ann Arbor VA Medical Center',
                '508': 'Atlanta VA Medical Center',
                '509': 'AUGUSTA VAMC',
                '512': 'VA MARYLAND HEALTH CARE SYS',
                '515': 'Battle Creek VA Medical Center',
                '516':
                  'C.W. Bill Young Department of Veterans Affairs Medical Center',
                '517': 'Beckley VA Medical Center',
                '518': "Edith Nourse Rogers Memorial Veterans' Hospital",
                '519':
                  "George H. O'Brien, Jr., Department of Veterans Affairs Medical Center",
                '520': 'Biloxi VA Medical Center',
                '521': 'Birmingham VA Medical Center',
                '523': 'Jamaica Plain VA Medical Center',
                '526':
                  'James J. Peters Department of Veterans Affairs Medical Center',
                '528': 'Buffalo VA Medical Center',
                '529': 'Abie Abraham VA Clinic',
                '531': 'Boise VA Medical Center',
                '534':
                  'Ralph H. Johnson Department of Veterans Affairs Medical Center',
                '537':
                  'Jesse Brown Department of Veterans Affairs Medical Center',
                '538': 'Chillicothe VA Medical Center',
                '539': 'Cincinnati VA Medical Center',
                '540':
                  "Louis A. Johnson Veterans' Administration Medical Center",
                '541': 'CLEVELAND VAMC',
                '542': 'Coatesville VA Medical Center',
                '544':
                  'Wm. Jennings Bryan Dorn Department of Veterans Affairs Medical Center',
                '546':
                  'Bruce W. Carter Department of Veterans Affairs Medical Center',
                '548': 'West Palm Beach VA Medical Center',
                '549': 'Dallas VA Medical Center',
                '550': 'Danville VA Medical Center',
                '552': 'Dayton VA Medical Center',
                '553':
                  'John D. Dingell Department of Veterans Affairs Medical Center',
                '554': 'Rocky Mountain Regional VA Medical Center',
                '556': 'Captain James A. Lovell Federal Health Care Center',
                '557': 'DUBLIN',
                '558': 'Durham VA Medical Center',
                '561': 'East Orange VA Medical Center',
                '562': 'Erie VA Medical Center',
                '564': 'Fayetteville VA Medical Center',
                '565': 'Fayetteville VA Medical Center',
                '568': 'Fort Meade VA Medical Center',
                '570': 'Fresno VA Medical Center',
                '573':
                  'Malcom Randall Department of Veterans Affairs Medical Center',
                '575': 'Grand Junction VA Medical Center',
                '578': 'Edward Hines Junior Hospital',
                '580':
                  'Michael E. DeBakey Department of Veterans Affairs Medical Center',
                '581': 'Hershel "Woody" Williams VA Medical Center',
                '583':
                  "Richard L. Roudebush Veterans' Administration Medical Center",
                '585':
                  'Oscar G. Johnson Department of Veterans Affairs Medical Facility',
                '586':
                  'G.V. (Sonny) Montgomery Department of Veterans Affairs Medical Center',
                '589': 'Kansas City VA Medical Center',
                '590': 'Hampton VA Medical Center',
                '593': 'SOUTHERN NEVADA HCS',
                '595': 'Lebanon VA Medical Center',
                '596': 'Franklin R. Sousley Campus',
                '598': "John L. McClellan Memorial Veterans' Hospital",
                '600': 'VA LONG BEACH HEALTHCARE SYSTEM',
                '603':
                  'Robley Rex Department of Veterans Affairs Medical Center',
                '605': 'LOMA LINDA HCS',
                '607': "William S. Middleton Memorial Veterans' Hospital",
                '608': 'Manchester VA Medical Center',
                '610': 'Marion VA Medical Center',
                '613': 'Martinsburg VA Medical Center',
                '614': 'Memphis VA Medical Center',
                '618': 'MINNEAPOLIS VA HCS',
                '619': 'Central Alabama VA Medical Center-Montgomery',
                '620': 'Franklin Delano Roosevelt Hospital',
                '621':
                  'James H. Quillen Department of Veterans Affairs Medical Center',
                '623':
                  'Jack C. Montgomery Department of Veterans Affairs Medical Center',
                '626': 'TENNESSEE VALLEY HCS',
                '629': 'New Orleans VA Medical Center',
                '630': 'Manhattan VA Medical Center',
                '631': 'VA CNTRL WSTRN MASSCHUSETS HCS',
                '632': 'Northport VA Medical Center',
                '635': 'Oklahoma City VA Medical Center',
                '636': 'Omaha VA Medical Center',
                '637':
                  'Charles George Department of Veterans Affairs Medical Center',
                '640': 'Palo Alto VA Medical Center',
                '642':
                  'Corporal Michael J. Crescenz Department of Veterans Affairs Medical Center',
                '644': "Carl T. Hayden Veterans' Administration Medical Center",
                '646': 'Pittsburgh VA Medical Center-University Drive',
                '648': 'Portland VA Medical Center',
                '649':
                  'Bob Stump Department of Veterans Affairs Medical Center',
                '650': 'Providence VA Medical Center',
                '652': 'Hunter Holmes McGuire Hospital',
                '653': 'Roseburg VA Medical Center',
                '654':
                  "Ioannis A. Lougaris Veterans' Administration Medical Center",
                '655':
                  'Aleda E. Lutz Department of Veterans Affairs Medical Center',
                '656': 'ST. CLOUD VA HEALTH CARE SYSTEM',
                '657': 'VA St. Louis Health Care System',
                '658': 'Salem VA Medical Center',
                '659':
                  'W.G. (Bill) Hefner Salisbury Department of Veterans Affairs Medical Center',
                '660':
                  'George E. Wahlen Department of Veterans Affairs Medical Center',
                '662': 'San Francisco VA Medical Center',
                '663': 'Seattle VA Medical Center',
                '664': 'VA SAN DIEGO HEALTHCARE SYSTEM (664)',
                '666': 'Sheridan VA Medical Center',
                '667': "Overton Brooks Veterans' Administration Medical Center",
                '668':
                  'Mann-Grandstaff Department of Veterans Affairs Medical Center',
                '671': "Audie L. Murphy Memorial Veterans' Hospital",
                '672': 'San Juan VA Medical Center',
                '673': "James A. Haley Veterans' Hospital",
                '674': "Olin E. Teague Veterans' Center",
                '675': 'Orlando VA Medical Center',
                '676': 'Tomah VA Medical Center',
                '678': 'Tucson VA Medical Center',
                '679': 'Tuscaloosa VA Medical Center',
                '687': 'Jonathan M. Wainwright Memorial VA Medical Center',
                '688': 'Washington VA Medical Center',
                '689': 'West Haven VA Medical Center',
                '691': 'West Los Angeles VA Medical Center',
                '692': 'White City VA Medical Center',
                '693': 'Wilkes-Barre VA Medical Center',
                '695':
                  "Clement J. Zablocki Veterans' Administration Medical Center",
                '740': 'Harlingen VA Clinic',
                '756': 'EL PASO HCS',
                '757': 'Chalmers P. Wylie Veterans Outpatient Clinic',
                '568A4': 'Hot Springs VA Medical Center',
                '589A6':
                  'Dwight D. Eisenhower Department of Veterans Affairs Medical Center',
                '589A5':
                  "Colmery-O'Neil Veterans' Administration Medical Center",
                '589A7':
                  'Robert J. Dole Department of Veterans Affairs Medical and Regional Office Center',
                '612A4': 'Sacramento VA Medical Center',
                '657A5': 'Marion VA Medical Center',
                '589A4': "Harry S. Truman Memorial Veterans' Hospital",
                '657A4':
                  "John J. Pershing Veterans' Administration Medical Center",
                '528A5': 'Canandaigua VA Medical Center',
                '528A6': 'Bath VA Medical Center',
                '528A7': 'Syracuse VA Medical Center',
                '528A8':
                  'Samuel S. Stratton Department of Veterans Affairs Medical Center',
                '636A6': 'Des Moines VA Medical Center',
                '636A8': 'IOWA CITY HCS',
              },
            },
          },
        },
        'view:preferredFacilityInfo': {
          'ui:title': ' ',
        },
      },
      schema: {
        type: 'object',
        properties: {
          veteranLastTreatmentFacility: {
            type: 'object',
            additionalProperties: false,
            required: [],
            properties: {
              name: {
                type: 'string',
              },
              type: {
                type: 'string',
                enum: ['hospital', 'clinic'],
              },
            },
          },
          veteranPreferredFacility: {
            type: 'object',
            required: ['veteranFacilityState', 'plannedClinic'],
            properties: {
              veteranFacilityState: {
                type: 'string',
                enum: [
                  'AL',
                  'AK',
                  'AZ',
                  'AR',
                  'CA',
                  'CO',
                  'CT',
                  'DE',
                  'DC',
                  'FL',
                  'GA',
                  'HI',
                  'ID',
                  'IL',
                  'IN',
                  'IA',
                  'KS',
                  'KY',
                  'LA',
                  'ME',
                  'MD',
                  'MA',
                  'MI',
                  'MN',
                  'MS',
                  'MO',
                  'MT',
                  'NE',
                  'NV',
                  'NH',
                  'NJ',
                  'NM',
                  'NY',
                  'NC',
                  'ND',
                  'OH',
                  'OK',
                  'OR',
                  'PA',
                  'PR',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UT',
                  'VT',
                  'VA',
                  'WA',
                  'WV',
                  'WI',
                  'WY',
                ],
              },
              plannedClinic: {
                type: 'string',
                enum: ['689'],
              },
            },
          },
          'view:preferredFacilityInfo': {
            type: 'string',
          },
        },
      },
      editMode: false,
    },
    primaryCaregiverInfoOne: {
      uiSchema: {
        primaryFullName: {
          first: {
            'ui:title': 'Primary Family Caregiver’s  first name',
            'ui:errorMessages': {
              required: 'Please enter Primary Family Caregiver’s  first name',
            },
          },
          last: {
            'ui:title': 'Primary Family Caregiver’s  last name',
            'ui:errorMessages': {
              required: 'Please enter Primary Family Caregiver’s  last name',
            },
          },
          middle: {
            'ui:title': 'Primary Family Caregiver’s  middle name',
          },
        },
        primarySsnOrTin: {
          'ui:title':
            'Primary Family Caregiver’s  Social Security number or tax identification number',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
          'ui:validations': [null, {}],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid Social Security or tax identification number',
            required:
              'Please enter a Social Security or tax identification number',
          },
          'ui:description': false,
        },
        primaryDateOfBirth: {
          'ui:title': 'Primary Family Caregiver’s  date of birth',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
        primaryGender: {
          'ui:title': 'Primary Family Caregiver’s  sex',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              F: 'Female',
              M: 'Male',
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['primaryFullName', 'primaryDateOfBirth'],
        properties: {
          primaryFullName: {
            type: 'object',
            additionalProperties: false,
            required: ['first', 'last'],
            properties: {
              first: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
              middle: {
                type: 'string',
              },
              last: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
            },
          },
          primarySsnOrTin: {
            type: 'string',
            pattern: '^[0-9]{9}$',
          },
          primaryDateOfBirth: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
          primaryGender: {
            type: 'string',
            enum: ['F', 'M'],
          },
        },
      },
      editMode: false,
    },
    primaryCaregiverInfoTwo: {
      uiSchema: {
        primaryAddress: {
          'ui:title': ' ',
          'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
          street: {
            'ui:title': 'Primary Family Caregiver’s  current street address',
            'ui:errorMessages': {
              required: 'Please enter a street address',
            },
          },
          street2: {
            'ui:title': 'Line 2',
          },
          city: {
            'ui:title': 'City',
            'ui:errorMessages': {
              required: 'Please enter a city',
            },
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              labels: {
                AL: 'Alabama',
                AK: 'Alaska',
                AS: 'American Samoa',
                AZ: 'Arizona',
                AR: 'Arkansas',
                AA: 'Armed Forces Americas (AA)',
                AE: 'Armed Forces Europe (AE)',
                AP: 'Armed Forces Pacific (AP)',
                CA: 'California',
                CO: 'Colorado',
                CT: 'Connecticut',
                DE: 'Delaware',
                DC: 'District Of Columbia',
                FM: 'Federated States Of Micronesia',
                FL: 'Florida',
                GA: 'Georgia',
                GU: 'Guam',
                HI: 'Hawaii',
                ID: 'Idaho',
                IL: 'Illinois',
                IN: 'Indiana',
                IA: 'Iowa',
                KS: 'Kansas',
                KY: 'Kentucky',
                LA: 'Louisiana',
                ME: 'Maine',
                MH: 'Marshall Islands',
                MD: 'Maryland',
                MA: 'Massachusetts',
                MI: 'Michigan',
                MN: 'Minnesota',
                MS: 'Mississippi',
                MO: 'Missouri',
                MT: 'Montana',
                NE: 'Nebraska',
                NV: 'Nevada',
                NH: 'New Hampshire',
                NJ: 'New Jersey',
                NM: 'New Mexico',
                NY: 'New York',
                NC: 'North Carolina',
                ND: 'North Dakota',
                MP: 'Northern Mariana Islands',
                OH: 'Ohio',
                OK: 'Oklahoma',
                OR: 'Oregon',
                PW: 'Palau',
                PA: 'Pennsylvania',
                PR: 'Puerto Rico',
                RI: 'Rhode Island',
                SC: 'South Carolina',
                SD: 'South Dakota',
                TN: 'Tennessee',
                TX: 'Texas',
                UT: 'Utah',
                VT: 'Vermont',
                VI: 'Virgin Islands',
                VA: 'Virginia',
                WA: 'Washington',
                WV: 'West Virginia',
                WI: 'Wisconsin',
                WY: 'Wyoming',
              },
            },
            'ui:errorMessages': {
              required: 'Please enter a state',
            },
          },
          postalCode: {
            'ui:title': 'Postal code',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:errorMessages': {
              required: 'Please enter a postal code',
              pattern:
                'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
            },
          },
        },
        primaryPrimaryPhoneNumber: {
          'ui:title':
            'Primary Family Caregiver’s  primary telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        primaryAlternativePhoneNumber: {
          'ui:title':
            'Primary Family Caregiver’s  alternate telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        primaryEmail: {
          'ui:title': 'Primary Family Caregiver’s  email address',
          'ui:errorMessages': {
            pattern: 'Please enter an email address using this format: X@X.com',
            required: 'Please enter an email address',
          },
          'ui:options': {
            inputType: 'email',
          },
        },
        'view:primaryEmail': {
          'ui:title': 'Re-enter Primary Family Caregiver’s  email address',
          'ui:widget': 'email',
          'ui:validations': [{}],
        },
        primaryVetRelationship: {
          'ui:title':
            'What is the Primary Family Caregiver’s  relationship to the Veteran?',
        },
      },
      schema: {
        type: 'object',
        required: [
          'primaryAddress',
          'primaryPrimaryPhoneNumber',
          'primaryVetRelationship',
          'view:primaryEmail',
        ],
        properties: {
          primaryAddress: {
            type: 'object',
            additionalProperties: false,
            required: ['street', 'city', 'state', 'postalCode'],
            properties: {
              street: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              street2: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              city: {
                type: 'string',
                minLength: 1,
                maxLength: 51,
              },
              state: {
                type: 'string',
                enum: [
                  'AL',
                  'AK',
                  'AS',
                  'AZ',
                  'AR',
                  'AA',
                  'AE',
                  'AP',
                  'CA',
                  'CO',
                  'CT',
                  'DE',
                  'DC',
                  'FM',
                  'FL',
                  'GA',
                  'GU',
                  'HI',
                  'ID',
                  'IL',
                  'IN',
                  'IA',
                  'KS',
                  'KY',
                  'LA',
                  'ME',
                  'MH',
                  'MD',
                  'MA',
                  'MI',
                  'MN',
                  'MS',
                  'MO',
                  'MT',
                  'NE',
                  'NV',
                  'NH',
                  'NJ',
                  'NM',
                  'NY',
                  'NC',
                  'ND',
                  'MP',
                  'OH',
                  'OK',
                  'OR',
                  'PW',
                  'PA',
                  'PR',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UT',
                  'VT',
                  'VI',
                  'VA',
                  'WA',
                  'WV',
                  'WI',
                  'WY',
                ],
              },
              postalCode: {
                type: 'string',
                pattern: '^(\\d{5})(?:[-](\\d{4}))?$',
              },
            },
          },
          primaryPrimaryPhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          primaryAlternativePhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          primaryEmail: {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
          'view:primaryEmail': {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
          primaryVetRelationship: {
            type: 'string',
            enum: [
              'Spouse',
              'Father',
              'Mother',
              'Son',
              'Daughter',
              'Brother',
              'Sister',
              'Significant Other',
              'Relative - Other',
              'Friend/Neighbor',
              'Grandchild',
            ],
          },
        },
      },
      editMode: false,
    },
    primaryCaregiverInfoThree: {
      uiSchema: {
        'ui:description': {
          key: null,
          ref: null,
          props: {
            children: {
              type: 'h3',
              key: null,
              ref: null,
              props: {
                className: 'vads-u-font-size--h4',
                children: 'Health care coverage',
              },
              _owner: null,
              _store: {},
            },
          },
          _owner: null,
          _store: {},
        },
        primaryHasHealthInsurance: {
          'ui:title':
            'Does the Primary Family Caregiver applicant have health care coverage, such as Medicaid, Medicare, CHAMPVA, Tricare, or private insurance?',
          'ui:widget': 'yesNo',
        },
      },
      schema: {
        type: 'object',
        required: ['primaryHasHealthInsurance'],
        properties: {
          primaryHasHealthInsurance: {
            type: 'boolean',
          },
        },
      },
      editMode: false,
    },
    secondaryCaregiverOneIntro: {
      uiSchema: {
        'view:hasSecondaryCaregiverOne': {
          'ui:title': 'Would you like to add a Secondary Family Caregiver?',
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: [
                null,
                false,
                {
                  key: null,
                  ref: null,
                  props: {},
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          'ui:widget': 'yesNo',
        },
      },
      schema: {
        type: 'object',
        properties: {
          'view:hasSecondaryCaregiverOne': {
            type: 'boolean',
          },
        },
      },
      editMode: false,
    },
    secondaryCaregiverOne: {
      uiSchema: {
        'ui:description': {
          key: null,
          ref: null,
          props: {
            children: [
              null,
              {
                type: 'p',
                key: null,
                ref: null,
                props: {
                  className: 'vads-u-margin-top--2',
                  children:
                    'Please complete the following information about the Secondary Family Caregiver.',
                },
                _owner: null,
                _store: {},
              },
              null,
            ],
          },
          _owner: null,
          _store: {},
        },
        secondaryOneFullName: {
          first: {
            'ui:title': 'Secondary Family Caregiver’s  first name',
            'ui:errorMessages': {
              required: 'Please enter Secondary Family Caregiver’s  first name',
            },
          },
          last: {
            'ui:title': 'Secondary Family Caregiver’s  last name',
            'ui:errorMessages': {
              required: 'Please enter Secondary Family Caregiver’s  last name',
            },
          },
          middle: {
            'ui:title': 'Secondary Family Caregiver’s  middle name',
          },
        },
        secondaryOneSsnOrTin: {
          'ui:title':
            'Secondary Family Caregiver’s  Social Security number or tax identification number',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
          'ui:validations': [null, {}],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid Social Security or tax identification number',
            required:
              'Please enter a Social Security or tax identification number',
          },
          'ui:description': false,
        },
        secondaryOneDateOfBirth: {
          'ui:title': 'Secondary Family Caregiver’s  date of birth',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
        secondaryOneGender: {
          'ui:title': 'Secondary Family Caregiver’s  sex',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              F: 'Female',
              M: 'Male',
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['secondaryOneFullName', 'secondaryOneDateOfBirth'],
        properties: {
          secondaryOneFullName: {
            type: 'object',
            additionalProperties: false,
            required: ['first', 'last'],
            properties: {
              first: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
              middle: {
                type: 'string',
              },
              last: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
            },
          },
          secondaryOneSsnOrTin: {
            type: 'string',
            pattern: '^[0-9]{9}$',
          },
          secondaryOneDateOfBirth: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
          secondaryOneGender: {
            type: 'string',
            enum: ['F', 'M'],
          },
        },
      },
      editMode: false,
    },
    secondaryCaregiverOneThree: {
      uiSchema: {
        'ui:description': {
          key: null,
          ref: null,
          props: {
            children: [
              {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  className: 'vads-u-font-size--h4',
                  children: 'Contact information',
                },
                _owner: null,
                _store: {},
              },
              null,
              null,
            ],
          },
          _owner: null,
          _store: {},
        },
        secondaryOneAddress: {
          'ui:title': ' ',
          'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
          street: {
            'ui:title': 'Secondary Family Caregiver’s  current street address',
            'ui:errorMessages': {
              required: 'Please enter a street address',
            },
          },
          street2: {
            'ui:title': 'Line 2',
          },
          city: {
            'ui:title': 'City',
            'ui:errorMessages': {
              required: 'Please enter a city',
            },
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              labels: {
                AL: 'Alabama',
                AK: 'Alaska',
                AS: 'American Samoa',
                AZ: 'Arizona',
                AR: 'Arkansas',
                AA: 'Armed Forces Americas (AA)',
                AE: 'Armed Forces Europe (AE)',
                AP: 'Armed Forces Pacific (AP)',
                CA: 'California',
                CO: 'Colorado',
                CT: 'Connecticut',
                DE: 'Delaware',
                DC: 'District Of Columbia',
                FM: 'Federated States Of Micronesia',
                FL: 'Florida',
                GA: 'Georgia',
                GU: 'Guam',
                HI: 'Hawaii',
                ID: 'Idaho',
                IL: 'Illinois',
                IN: 'Indiana',
                IA: 'Iowa',
                KS: 'Kansas',
                KY: 'Kentucky',
                LA: 'Louisiana',
                ME: 'Maine',
                MH: 'Marshall Islands',
                MD: 'Maryland',
                MA: 'Massachusetts',
                MI: 'Michigan',
                MN: 'Minnesota',
                MS: 'Mississippi',
                MO: 'Missouri',
                MT: 'Montana',
                NE: 'Nebraska',
                NV: 'Nevada',
                NH: 'New Hampshire',
                NJ: 'New Jersey',
                NM: 'New Mexico',
                NY: 'New York',
                NC: 'North Carolina',
                ND: 'North Dakota',
                MP: 'Northern Mariana Islands',
                OH: 'Ohio',
                OK: 'Oklahoma',
                OR: 'Oregon',
                PW: 'Palau',
                PA: 'Pennsylvania',
                PR: 'Puerto Rico',
                RI: 'Rhode Island',
                SC: 'South Carolina',
                SD: 'South Dakota',
                TN: 'Tennessee',
                TX: 'Texas',
                UT: 'Utah',
                VT: 'Vermont',
                VI: 'Virgin Islands',
                VA: 'Virginia',
                WA: 'Washington',
                WV: 'West Virginia',
                WI: 'Wisconsin',
                WY: 'Wyoming',
              },
            },
            'ui:errorMessages': {
              required: 'Please enter a state',
            },
          },
          postalCode: {
            'ui:title': 'Postal code',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:errorMessages': {
              required: 'Please enter a postal code',
              pattern:
                'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
            },
          },
        },
        secondaryOnePrimaryPhoneNumber: {
          'ui:title':
            'Secondary Family Caregiver’s  primary telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        secondaryOneAlternativePhoneNumber: {
          'ui:title':
            'Secondary Family Caregiver’s  alternate telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        secondaryOneEmail: {
          'ui:title': 'Secondary Family Caregiver’s  email address',
          'ui:errorMessages': {
            pattern: 'Please enter an email address using this format: X@X.com',
            required: 'Please enter an email address',
          },
          'ui:options': {
            inputType: 'email',
          },
        },
        'view:secondaryOneEmail': {
          'ui:title': 'Re-enter Secondary Family Caregiver’s  email address',
          'ui:widget': 'email',
          'ui:validations': [{}],
        },
        secondaryOneVetRelationship: {
          'ui:title':
            'What is the Secondary Family Caregiver’s  relationship to the Veteran?',
        },
        'view:hasSecondaryCaregiverTwo': {
          'ui:title': ' ',
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: [
                {
                  type: 'strong',
                  key: null,
                  ref: null,
                  props: {
                    children:
                      'You can add up to 2 Secondary Family Caregivers.',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    children:
                      'Would you like to add another Secondary Family Caregiver?',
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          'ui:widget': 'yesNo',
        },
      },
      schema: {
        type: 'object',
        required: [
          'secondaryOneAddress',
          'secondaryOneVetRelationship',
          'secondaryOnePrimaryPhoneNumber',
        ],
        properties: {
          secondaryOneAddress: {
            type: 'object',
            additionalProperties: false,
            required: ['street', 'city', 'state', 'postalCode'],
            properties: {
              street: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              street2: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              city: {
                type: 'string',
                minLength: 1,
                maxLength: 51,
              },
              state: {
                type: 'string',
                enum: [
                  'AL',
                  'AK',
                  'AS',
                  'AZ',
                  'AR',
                  'AA',
                  'AE',
                  'AP',
                  'CA',
                  'CO',
                  'CT',
                  'DE',
                  'DC',
                  'FM',
                  'FL',
                  'GA',
                  'GU',
                  'HI',
                  'ID',
                  'IL',
                  'IN',
                  'IA',
                  'KS',
                  'KY',
                  'LA',
                  'ME',
                  'MH',
                  'MD',
                  'MA',
                  'MI',
                  'MN',
                  'MS',
                  'MO',
                  'MT',
                  'NE',
                  'NV',
                  'NH',
                  'NJ',
                  'NM',
                  'NY',
                  'NC',
                  'ND',
                  'MP',
                  'OH',
                  'OK',
                  'OR',
                  'PW',
                  'PA',
                  'PR',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UT',
                  'VT',
                  'VI',
                  'VA',
                  'WA',
                  'WV',
                  'WI',
                  'WY',
                ],
              },
              postalCode: {
                type: 'string',
                pattern: '^(\\d{5})(?:[-](\\d{4}))?$',
              },
            },
          },
          secondaryOnePrimaryPhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          secondaryOneAlternativePhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          secondaryOneEmail: {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
          'view:secondaryOneEmail': {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
          secondaryOneVetRelationship: {
            type: 'string',
            enum: [
              'Spouse',
              'Father',
              'Mother',
              'Son',
              'Daughter',
              'Brother',
              'Sister',
              'Significant Other',
              'Relative - Other',
              'Friend/Neighbor',
              'Grandchild',
            ],
          },
          'view:hasSecondaryCaregiverTwo': {
            type: 'boolean',
          },
        },
      },
      editMode: false,
    },
    secondaryCaregiverTwo: {
      uiSchema: {
        secondaryTwoFullName: {
          first: {
            'ui:title': 'Secondary Family Caregiver’s (2)  first name',
            'ui:errorMessages': {
              required:
                'Please enter Secondary Family Caregiver’s (2)  first name',
            },
          },
          last: {
            'ui:title': 'Secondary Family Caregiver’s (2)  last name',
            'ui:errorMessages': {
              required:
                'Please enter Secondary Family Caregiver’s (2)  last name',
            },
          },
          middle: {
            'ui:title': 'Secondary Family Caregiver’s (2)  middle name',
          },
        },
        secondaryTwoSsnOrTin: {
          'ui:title':
            'Secondary Family Caregiver’s (2)  Social Security number or tax identification number',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
          'ui:validations': [null, {}],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid Social Security or tax identification number',
            required:
              'Please enter a Social Security or tax identification number',
          },
          'ui:description': false,
        },
        secondaryTwoDateOfBirth: {
          'ui:title': 'Secondary Family Caregiver’s (2)  date of birth',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
        secondaryTwoGender: {
          'ui:title': 'Secondary Family Caregiver’s (2)  sex',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              F: 'Female',
              M: 'Male',
            },
          },
        },
        secondaryTwoAddress: {
          'ui:title': ' ',
          'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
          street: {
            'ui:title':
              'Secondary Family Caregiver’s (2)  current street address',
            'ui:errorMessages': {
              required: 'Please enter a street address',
            },
          },
          street2: {
            'ui:title': 'Line 2',
          },
          city: {
            'ui:title': 'City',
            'ui:errorMessages': {
              required: 'Please enter a city',
            },
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              labels: {
                AL: 'Alabama',
                AK: 'Alaska',
                AS: 'American Samoa',
                AZ: 'Arizona',
                AR: 'Arkansas',
                AA: 'Armed Forces Americas (AA)',
                AE: 'Armed Forces Europe (AE)',
                AP: 'Armed Forces Pacific (AP)',
                CA: 'California',
                CO: 'Colorado',
                CT: 'Connecticut',
                DE: 'Delaware',
                DC: 'District Of Columbia',
                FM: 'Federated States Of Micronesia',
                FL: 'Florida',
                GA: 'Georgia',
                GU: 'Guam',
                HI: 'Hawaii',
                ID: 'Idaho',
                IL: 'Illinois',
                IN: 'Indiana',
                IA: 'Iowa',
                KS: 'Kansas',
                KY: 'Kentucky',
                LA: 'Louisiana',
                ME: 'Maine',
                MH: 'Marshall Islands',
                MD: 'Maryland',
                MA: 'Massachusetts',
                MI: 'Michigan',
                MN: 'Minnesota',
                MS: 'Mississippi',
                MO: 'Missouri',
                MT: 'Montana',
                NE: 'Nebraska',
                NV: 'Nevada',
                NH: 'New Hampshire',
                NJ: 'New Jersey',
                NM: 'New Mexico',
                NY: 'New York',
                NC: 'North Carolina',
                ND: 'North Dakota',
                MP: 'Northern Mariana Islands',
                OH: 'Ohio',
                OK: 'Oklahoma',
                OR: 'Oregon',
                PW: 'Palau',
                PA: 'Pennsylvania',
                PR: 'Puerto Rico',
                RI: 'Rhode Island',
                SC: 'South Carolina',
                SD: 'South Dakota',
                TN: 'Tennessee',
                TX: 'Texas',
                UT: 'Utah',
                VT: 'Vermont',
                VI: 'Virgin Islands',
                VA: 'Virginia',
                WA: 'Washington',
                WV: 'West Virginia',
                WI: 'Wisconsin',
                WY: 'Wyoming',
              },
            },
            'ui:errorMessages': {
              required: 'Please enter a state',
            },
          },
          postalCode: {
            'ui:title': 'Postal code',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:errorMessages': {
              required: 'Please enter a postal code',
              pattern:
                'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['secondaryTwoFullName', 'secondaryTwoDateOfBirth'],
        properties: {
          secondaryTwoFullName: {
            type: 'object',
            additionalProperties: false,
            required: ['first', 'last'],
            properties: {
              first: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
              middle: {
                type: 'string',
              },
              last: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
            },
          },
          secondaryTwoSsnOrTin: {
            type: 'string',
            pattern: '^[0-9]{9}$',
          },
          secondaryTwoDateOfBirth: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
          secondaryTwoGender: {
            type: 'string',
            enum: ['F', 'M'],
          },
        },
      },
      editMode: false,
    },
    secondaryCaregiverTwoTwo: {
      uiSchema: {
        'ui:description': {
          key: null,
          ref: null,
          props: {
            children: [
              {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  className: 'vads-u-font-size--h4',
                  children: 'Contact information',
                },
                _owner: null,
                _store: {},
              },
              null,
              null,
            ],
          },
          _owner: null,
          _store: {},
        },
        secondaryTwoAddress: {
          'ui:title': ' ',
          'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
          street: {
            'ui:title':
              'Secondary Family Caregiver’s (2)  current street address',
            'ui:errorMessages': {
              required: 'Please enter a street address',
            },
          },
          street2: {
            'ui:title': 'Line 2',
          },
          city: {
            'ui:title': 'City',
            'ui:errorMessages': {
              required: 'Please enter a city',
            },
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              labels: {
                AL: 'Alabama',
                AK: 'Alaska',
                AS: 'American Samoa',
                AZ: 'Arizona',
                AR: 'Arkansas',
                AA: 'Armed Forces Americas (AA)',
                AE: 'Armed Forces Europe (AE)',
                AP: 'Armed Forces Pacific (AP)',
                CA: 'California',
                CO: 'Colorado',
                CT: 'Connecticut',
                DE: 'Delaware',
                DC: 'District Of Columbia',
                FM: 'Federated States Of Micronesia',
                FL: 'Florida',
                GA: 'Georgia',
                GU: 'Guam',
                HI: 'Hawaii',
                ID: 'Idaho',
                IL: 'Illinois',
                IN: 'Indiana',
                IA: 'Iowa',
                KS: 'Kansas',
                KY: 'Kentucky',
                LA: 'Louisiana',
                ME: 'Maine',
                MH: 'Marshall Islands',
                MD: 'Maryland',
                MA: 'Massachusetts',
                MI: 'Michigan',
                MN: 'Minnesota',
                MS: 'Mississippi',
                MO: 'Missouri',
                MT: 'Montana',
                NE: 'Nebraska',
                NV: 'Nevada',
                NH: 'New Hampshire',
                NJ: 'New Jersey',
                NM: 'New Mexico',
                NY: 'New York',
                NC: 'North Carolina',
                ND: 'North Dakota',
                MP: 'Northern Mariana Islands',
                OH: 'Ohio',
                OK: 'Oklahoma',
                OR: 'Oregon',
                PW: 'Palau',
                PA: 'Pennsylvania',
                PR: 'Puerto Rico',
                RI: 'Rhode Island',
                SC: 'South Carolina',
                SD: 'South Dakota',
                TN: 'Tennessee',
                TX: 'Texas',
                UT: 'Utah',
                VT: 'Vermont',
                VI: 'Virgin Islands',
                VA: 'Virginia',
                WA: 'Washington',
                WV: 'West Virginia',
                WI: 'Wisconsin',
                WY: 'Wyoming',
              },
            },
            'ui:errorMessages': {
              required: 'Please enter a state',
            },
          },
          postalCode: {
            'ui:title': 'Postal code',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:errorMessages': {
              required: 'Please enter a postal code',
              pattern:
                'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
            },
          },
        },
        secondaryTwoPrimaryPhoneNumber: {
          'ui:title':
            'Secondary Family Caregiver’s (2)  primary telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        secondaryTwoAlternativePhoneNumber: {
          'ui:title':
            'Secondary Family Caregiver’s (2)  alternate telephone number (including area code)',
          'ui:errorMessages': {
            pattern:
              'Please enter a 10-digit phone number (with or without dashes)',
            minLength:
              'Please enter a 10-digit phone number (with or without dashes)',
            required: 'Please enter a phone number',
          },
          'ui:options': {
            widgetClassNames: 'va-input-medium-large',
          },
        },
        secondaryTwoEmail: {
          'ui:title': 'Secondary Family Caregiver’s (2)  email address',
          'ui:errorMessages': {
            pattern: 'Please enter an email address using this format: X@X.com',
            required: 'Please enter an email address',
          },
          'ui:options': {
            inputType: 'email',
          },
        },
        'view:secondaryTwoEmail': {
          'ui:title':
            'Re-enter Secondary Family Caregiver’s (2)  email address',
          'ui:widget': 'email',
          'ui:validations': [{}],
        },
        secondaryTwoVetRelationship: {
          'ui:title':
            'What is the Secondary Family Caregiver’s (2)  relationship to the Veteran?',
        },
      },
      schema: {
        type: 'object',
        required: [
          'secondaryTwoAddress',
          'secondaryTwoPrimaryPhoneNumber',
          'secondaryTwoVetRelationship',
        ],
        properties: {
          secondaryTwoAddress: {
            type: 'object',
            additionalProperties: false,
            required: ['street', 'city', 'state', 'postalCode'],
            properties: {
              street: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              street2: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
              },
              city: {
                type: 'string',
                minLength: 1,
                maxLength: 51,
              },
              state: {
                type: 'string',
                enum: [
                  'AL',
                  'AK',
                  'AS',
                  'AZ',
                  'AR',
                  'AA',
                  'AE',
                  'AP',
                  'CA',
                  'CO',
                  'CT',
                  'DE',
                  'DC',
                  'FM',
                  'FL',
                  'GA',
                  'GU',
                  'HI',
                  'ID',
                  'IL',
                  'IN',
                  'IA',
                  'KS',
                  'KY',
                  'LA',
                  'ME',
                  'MH',
                  'MD',
                  'MA',
                  'MI',
                  'MN',
                  'MS',
                  'MO',
                  'MT',
                  'NE',
                  'NV',
                  'NH',
                  'NJ',
                  'NM',
                  'NY',
                  'NC',
                  'ND',
                  'MP',
                  'OH',
                  'OK',
                  'OR',
                  'PW',
                  'PA',
                  'PR',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UT',
                  'VT',
                  'VI',
                  'VA',
                  'WA',
                  'WV',
                  'WI',
                  'WY',
                ],
              },
              postalCode: {
                type: 'string',
                pattern: '^(\\d{5})(?:[-](\\d{4}))?$',
              },
            },
          },
          secondaryTwoPrimaryPhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          secondaryTwoAlternativePhoneNumber: {
            type: 'string',
            minLength: 10,
          },
          secondaryTwoEmail: {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
          'view:secondaryTwoEmail': {
            type: 'string',
            maxLength: 256,
            format: 'email',
          },
          secondaryTwoVetRelationship: {
            type: 'string',
            enum: [
              'Spouse',
              'Father',
              'Mother',
              'Son',
              'Daughter',
              'Brother',
              'Sister',
              'Significant Other',
              'Relative - Other',
              'Friend/Neighbor',
              'Grandchild',
            ],
          },
        },
      },
      editMode: false,
    },
  },
  initialData: {
    veteranFullName: {},
    veteranAddress: {},
    veteranLastTreatmentFacility: {},
    veteranPreferredFacility: {},
    primaryFullName: {},
    primaryAddress: {},
    secondaryOneFullName: {},
    secondaryOneAddress: {},
    secondaryTwoFullName: {},
    secondaryTwoAddress: {},
  },
  savedStatus: 'not-attempted',
  autoSavedStatus: 'not-attempted',
  loadedStatus: 'not-attempted',
  version: 0,
  lastSavedDate: null,
  expirationDate: null,
  prefillStatus: 'not-attempted',
  isStartingOver: false,
};

export const formWithReplacedData = newData => {
  return {
    ...form,
    data: {
      ...newData,
    },
  };
};
