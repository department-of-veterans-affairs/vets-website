// This file to be moved to vets-json-schema repo before form hits production

// This needs to be imported from lodash/fp because that's what we use in the
// vets-json-schema repo
import _ from 'lodash/fp';
import { countries, states } from 'platform/forms/address';

const documentTypes526 = [
  { value: 'L015', label: 'Buddy/Lay Statement' },
  { value: 'L018', label: 'Civilian Police Reports' },
  { value: 'L029', label: 'Copy of a DD214' },
  { value: 'L702', label: 'Disability Benefits Questionnaire (DBQ)' },
  { value: 'L703', label: 'Goldmann Perimetry Chart/Field Of Vision Chart' },
  { value: 'L034', label: 'Military Personnel Record' },
  { value: 'L478', label: 'Medical Treatment Records - Furnished by SSA' },
  { value: 'L048', label: 'Medical Treatment Record - Government Facility' },
  {
    value: 'L049',
    label: 'Medical Treatment Record - Non-Government Facility',
  },
  { value: 'L023', label: 'Other Correspondence' },
  { value: 'L070', label: 'Photographs' },
  { value: 'L450', label: 'STR - Dental - Photocopy' },
  { value: 'L451', label: 'STR - Medical - Photocopy' },
  {
    value: 'L222',
    label:
      'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance',
  },
  {
    value: 'L228',
    label: 'VA Form 21-0781 - Statement in Support of Claim for PTSD',
  },
  {
    value: 'L229',
    label:
      'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault',
  },
  {
    value: 'L102',
    label:
      'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance',
  },
  {
    value: 'L107',
    label: 'VA Form 21-4142 - Authorization To Disclose Information',
  },
  {
    value: 'L827',
    label:
      'VA Form 21-4142a - General Release for Medical Provider Information',
  },
  {
    value: 'L115',
    label:
      'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability',
  },
  {
    value: 'L117',
    label:
      'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904',
  },
  {
    value: 'L159',
    label:
      'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant',
  },
  {
    value: 'L133',
    label: 'VA Form 21-674 - Request for Approval of School Attendance',
  },
  {
    value: 'L139',
    label: 'VA Form 21-686c - Declaration of Status of Dependents',
  },
  {
    value: 'L149',
    label:
      'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability',
  },
];

const serviceBranches = [
  'Air Force',
  'Army',
  'Coast Guard',
  'Marine Corps',
  'National Oceanic and Atmospheric Administration',
  'Navy',
  'Public Health Service',
];

const baseAddressDef = {
  type: 'object',
  required: ['country', 'city', 'addressLine1'],
  properties: {
    country: {
      type: 'string',
      enum: countries.map(country => country.value),
      enumNames: countries.map(country => country.label),
      default: 'USA',
    },
    addressLine1: {
      type: 'string',
      maxLength: 20,
      pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
    },
    addressLine2: {
      type: 'string',
      maxLength: 20,
      pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
    },
    addressLine3: {
      type: 'string',
      maxLength: 20,
      pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
    },
    city: {
      type: 'string',
      maxLength: 30,
      pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
    },
    state: {
      type: 'string',
      enum: states.USA.map(state => state.value),
      enumNames: states.USA.map(state => state.label),
    },
    zipCode: {
      type: 'string',
      pattern: '^\\d{5}(?:([-\\s]?)\\d{4})?$',
    },
  },
};

const vaTreatmentCenterAddressDef = (addressSchema => {
  const { type, properties } = addressSchema;
  return Object.assign(
    {},
    {
      type,
      required: ['country'],
      properties: _.pick(['country', 'city', 'state'], properties),
    },
  );
})(baseAddressDef);

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'APPLICATION FOR DISABILITY BENEFITS',
  type: 'object',
  definitions: {
    phone: {
      type: 'string',
      pattern: '^\\d{10}$',
    },
    date: {
      pattern:
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
      type: 'string',
    },
    email: {
      type: 'string',
      minLength: 6,
      maxLength: 80,
      pattern:
        '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
    },
    address: baseAddressDef,
    vaTreatmentCenterAddress: vaTreatmentCenterAddressDef,
    dateRangeAllRequired: {
      type: 'object',
      properties: {
        from: {
          $ref: '#/definitions/date',
        },
        to: {
          $ref: '#/definitions/date',
        },
      },
      required: ['from', 'to'],
    },
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
        },
        last: {
          type: 'string',
        },
        middle: {
          type: 'string',
        },
      },
    },
    dateRangeFromRequired: {
      type: 'object',
      properties: {
        from: {
          $ref: '#/definitions/date',
        },
        to: {
          $ref: '#/definitions/date',
        },
      },
      required: ['from'],
    },
    dateRange: {
      type: 'object',
      properties: {
        from: {
          $ref: '#/definitions/date',
        },
        to: {
          $ref: '#/definitions/date',
        },
      },
    },
    form4142: {
      type: 'object',
      properties: {
        limitedConsent: {
          type: 'string',
        },
        providerFacility: {
          type: 'array',
          minItems: 1,
          maxItems: 100,
          items: {
            type: 'object',
            required: [
              'providerFacilityName',
              'treatmentDateRange',
              'providerFacilityAddress',
            ],
            properties: {
              providerFacilityName: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
              },
              treatmentDateRange: {
                type: 'array',
                items: {
                  $ref: '#/definitions/dateRangeAllRequired',
                },
              },
              /*
               * Back end expects the following structure:
               * "providerFacilityAddress": {
               *  "street": "123 Main Street",
               *   "street2": "1B",
               *   "city": "Baltimore",
               *   "state": "MD",
               *   "country": "USA",
               *   "postalCode": "21200-1111"
               *  }
               */
              providerFacilityAddress: {
                type: 'object',
                required: ['street', 'city', 'country', 'state', 'postalCode'],
                properties: {
                  street: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20,
                  },
                  street2: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20,
                  },
                  city: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 30,
                  },
                  postalCode: {
                    type: 'string',
                    pattern: '^\\d{5}(?:([-\\s]?)\\d{4})?$',
                  },
                  country: {
                    type: 'string',
                    enum: baseAddressDef.properties.country.enum,
                    default: 'USA',
                  },
                  state: {
                    type: 'string',
                    enum: baseAddressDef.properties.state.enum,
                    enumNames: baseAddressDef.properties.state.enumNames,
                  },
                },
              },
            },
          },
        },
      },
    },
    specialIssues: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'ALS',
          'HEPC',
          'POW',
          'PTSD/1',
          'PTSD/2',
          'PTSD/3',
          'PTSD/4',
          'MST',
        ],
      },
    },
    unitAssigned: {
      type: 'string',
      maxLength: 100,
    },
    unitAssignedDates: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
        },
        to: {
          type: 'string',
        },
      },
    },
    ptsdIncident: {
      type: 'object',
      properties: {
        date: { $ref: '#/definitions/date' },
        description: { type: 'string' },
        unitAssigned: { $ref: '#/definitions/unitAssigned' },
        unitAssignedDates: { $ref: '#/definitions/unitAssignedDates' },
      },
    },
    secondaryPtsdIncident: {
      type: 'object',
      properties: {
        sources: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              address: {
                type: 'object',
                required: [],
                properties: {
                  ..._.omit(['addressLine3'], baseAddressDef.properties),
                  country: {
                    default: 'USA',
                    type: 'string',
                    enum: countries.map(country => country.value),
                    enumNames: countries.map(country => country.label),
                  },
                  state: {
                    title: 'State',
                    type: 'string',
                    maxLength: 51,
                  },
                },
              },
            },
          },
        },
        date: { $ref: '#/definitions/date' },
        description: { type: 'string' },
        unitAssigned: { $ref: '#/definitions/unitAssigned' },
        unitAssignedDates: { $ref: '#/definitions/unitAssignedDates' },
      },
    },
  },
  properties: {
    alternateNames: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['first', 'last'],
        properties: {
          first: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$",
          },
          middle: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$",
          },
          last: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$",
          },
        },
      },
    },
    serviceInformation: {
      type: 'object',
      required: ['servicePeriods'],
      properties: {
        servicePeriods: {
          type: 'array',
          minItems: 1,
          maxItems: 100,
          items: {
            type: 'object',
            required: ['serviceBranch', 'dateRange'],
            properties: {
              serviceBranch: {
                type: 'string',
                enum: [
                  'Air Force',
                  'Air Force Reserve',
                  'Air National Guard',
                  'Army',
                  'Army National Guard',
                  'Army Reserve',
                  'Coast Guard',
                  'Coast Guard Reserve',
                  'Marine Corps',
                  'Marine Corps Reserve',
                  'NOAA',
                  'Navy',
                  'Navy Reserve',
                  'Public Health Service',
                ],
              },
              dateRange: {
                $ref: '#/definitions/dateRangeAllRequired',
              },
            },
          },
        },
        separationLocation: {
          type: 'object',
          required: ['separationLocationCode', 'separationLocationName'],
          properties: {
            separationLocationCode: {
              type: 'string',
            },
            separationLocationName: {
              type: 'string',
              maxLength: 256,
              pattern: "([a-zA-Z0-9/-'.#,*()&][a-zA-Z0-9/-'.#,*()& ]?)*$",
            },
          },
        },
        reservesNationalGuardService: {
          type: 'object',
          required: ['unitName', 'obligationTermOfServiceDateRange'],
          properties: {
            unitName: {
              type: 'string',
              maxLength: 256,
              pattern: "^([a-zA-Z0-9\\-'.#][a-zA-Z0-9\\-'.# ]?)*$",
            },
            obligationTermOfServiceDateRange: {
              $ref: '#/definitions/dateRangeAllRequired',
            },
            receivingTrainingPay: {
              type: 'boolean',
            },
            title10Activation: {
              type: 'object',
              properties: {
                title10ActivationDate: {
                  $ref: '#/definitions/date',
                },
                anticipatedSeparationDate: {
                  $ref: '#/definitions/date',
                },
              },
            },
          },
        },
      },
    },
    servedInCombatZonePost911: {
      type: 'boolean',
    },
    confinements: {
      type: 'array',
      minItems: 1,
      items: {
        $ref: '#/definitions/dateRangeAllRequired',
      },
    },
    militaryRetiredPayBranch: {
      type: 'string',
      enum: serviceBranches,
    },
    waiveRetirementPay: {
      type: 'boolean',
    },
    separationPayDate: {
      type: 'string',
    },
    separationPayBranch: {
      type: 'string',
      enum: serviceBranches,
    },
    hasTrainingPay: {
      type: 'boolean',
    },
    waiveTrainingPay: {
      type: 'boolean',
    },
    ratedDisabilities: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['name', 'disabilityActionType'],
        properties: {
          name: {
            type: 'string',
          },
          disabilityActionType: {
            type: 'string',
            enum: ['NONE', 'NEW', 'SECONDARY', 'INCREASE', 'REOPEN'],
          },
          specialIssues: {
            $ref: '#/definitions/specialIssues',
          },
          ratedDisabilityId: {
            type: 'string',
          },
          diagnosticCode: {
            type: 'number',
          },
          classificationCode: {
            type: 'string',
          },
          secondaryDisabilities: {
            type: 'array',
            maxItems: 100,
            items: {
              type: 'object',
              required: ['name', 'disabilityActionType'],
              properties: {
                name: {
                  type: 'string',
                },
                disabilityActionType: {
                  type: 'string',
                  enum: ['NONE', 'NEW', 'SECONDARY', 'INCREASE', 'REOPEN'],
                },
                specialIssues: {
                  $ref: '#/definitions/specialIssues',
                },
                ratedDisabilityId: {
                  type: 'string',
                },
                diagnosticCode: {
                  type: 'number',
                },
                classificationCode: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    newDisabilities: {
      type: 'array',
      items: {
        type: 'object',
        required: ['condition', 'cause'],
        properties: {
          condition: {
            type: 'string',
          },
          cause: {
            type: 'string',
            enum: ['NEW', 'SECONDARY', 'WORSENED', 'VA'],
          },
          primaryDescription: {
            type: 'string',
          },
          causedByDisability: {
            type: 'string',
          },
          causedByDisabilityDescription: {
            type: 'string',
          },
          specialIssues: {
            $ref: '#/definitions/specialIssues',
          },
          worsenedDescription: {
            type: 'string',
          },
          worsenedEffects: {
            type: 'string',
          },
          VAMistreatmentDescription: {
            type: 'string',
          },
          VAMistreatmentLocation: {
            type: 'string',
          },
          VAMistreatmentDate: {
            type: 'string',
          },
        },
      },
    },
    mailingAddress: {
      $ref: '#/definitions/address',
    },
    // Forwarding address differs from mailing address in a few key ways:
    // 1. Address lines 1-3 are max 35 chars instead of 20
    // 2. The UI is such that requiring fields must be done in the UI schema
    // 3. There are effectiveStartDate and effectiveEndDate properties that
    //    specify the date at which the forwarding address should start to be
    //    used
    forwardingAddress: _.set(
      'properties.effectiveDate',
      {
        $ref: '#/definitions/dateRange',
      },
      _.omit(
        'required',
        _.merge(baseAddressDef, {
          properties: {
            addressLine1: {
              maxLength: 35,
            },
            addressLine2: {
              maxLength: 35,
            },
            addressLine3: {
              maxLength: 35,
            },
          },
        }),
      ),
    ),
    phoneAndEmail: {
      type: 'object',
      required: ['primaryPhone', 'emailAddress'],
      properties: {
        primaryPhone: {
          $ref: '#/definitions/phone',
        },
        emailAddress: {
          $ref: '#/definitions/email',
        },
      },
    },
    homelessOrAtRisk: {
      type: 'string',
      enum: ['no', 'homeless', 'atRisk'],
    },
    homelessHousingSituation: {
      type: 'string',
      enum: ['shelter', 'notShelter', 'anotherPerson', 'other'],
    },
    otherHomelessHousing: {
      type: 'string',
    },
    needToLeaveHousing: {
      type: 'boolean',
    },
    atRiskHousingSituation: {
      type: 'string',
      enum: ['losingHousing', 'leavingShelter', 'other'],
    },
    otherAtRiskHousing: {
      type: 'string',
    },
    homelessnessContact: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          pattern: "([a-zA-Z0-9-/']+( ?))*$",
        },
        phoneNumber: {
          $ref: '#/definitions/phone',
        },
      },
    },
    vaTreatmentFacilities: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['treatmentCenterName', 'treatedDisabilityNames'],
        properties: {
          treatmentCenterName: {
            type: 'string',
            maxLength: 100,
            pattern: "^([a-zA-Z0-9\\-'.#]([a-zA-Z0-9\\-'.# ])?)+$",
          },
          treatmentDateRange: {
            $ref: '#/definitions/dateRangeFromRequired',
          },
          treatmentCenterAddress: {
            $ref: '#/definitions/vaTreatmentCenterAddress',
          },
          treatedDisabilityNames: {
            type: 'array',
            minItems: 1,
            maxItems: 100,
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    attachments: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'attachmentId'],
        properties: {
          name: {
            type: 'string',
          },
          confirmationCode: {
            type: 'string',
          },
          attachmentId: {
            type: 'string',
            enum: documentTypes526.map(doc => doc.value),
            enumNames: documentTypes526.map(doc => doc.label),
          },
        },
      },
    },
    bankAccountType: {
      type: 'string',
      enum: ['Checking', 'Savings'],
    },
    bankAccountNumber: {
      type: 'string',
      minLength: 4,
      maxLength: 17,
    },
    bankRoutingNumber: {
      type: 'string',
      pattern: '^\\d{9}$',
    },
    bankName: {
      type: 'string',
      maxLength: 35,
    },
    isVAEmployee: {
      type: 'boolean',
    },
    standardClaim: {
      type: 'boolean',
      default: false,
    },
    mentalChanges: {
      type: 'object',
      properties: {
        depression: {
          type: 'boolean',
        },
        obsessive: {
          type: 'boolean',
        },
        prescription: {
          type: 'boolean',
        },
        substance: {
          type: 'boolean',
        },
        hypervigilance: {
          type: 'boolean',
        },
        agoraphobia: {
          type: 'boolean',
        },
        fear: {
          type: 'boolean',
        },
        other: {
          type: 'boolean',
        },
        otherExplanation: {
          type: 'string',
        },
        noneApply: {
          type: 'boolean',
        },
      },
    },
    hospitalizationHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hospitalizationDateRange: {
            $ref: '#/definitions/dateRange',
          },
          hospitalName: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          hospitalAddress: {
            type: 'object',
            properties: _.omit(
              ['addressLine3', 'country'],
              baseAddressDef.properties,
            ),
          },
        },
      },
    },
    ptsdIncidents: {
      type: 'array',
      items: { $ref: '#/definitions/ptsdIncident' },
    },
    secondaryPtsdIncidents: {
      type: 'array',
      items: { $ref: '#/definitions/secondaryPtsdIncident' },
    },
    privateMedicalRecordAttachments: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'attachmentId'],
        properties: {
          name: {
            type: 'string',
          },
          confirmationCode: {
            type: 'string',
          },
          attachmentId: {
            type: 'string',
            enum: ['L107', 'L023', 'L023'],
            enumNames: [
              'VA 21-4142 Authorization for Release of Information',
              'Multiple Documents',
              'Other',
            ],
          },
        },
      },
    },
    completedFormAttachments: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'attachmentId'],
        properties: {
          name: {
            type: 'string',
          },
          confirmationCode: {
            type: 'string',
          },
          attachmentId: {
            type: 'string',
          },
        },
      },
    },
    secondaryAttachment: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'attachmentId'],
        properties: {
          name: {
            type: 'string',
          },
          confirmationCode: {
            type: 'string',
          },
          attachmentId: {
            type: 'string',
            enum: [
              'L228',
              'L229',
              'L018',
              'L034',
              'L049',
              'L029',
              'L023',
              'L015',
              'L451',
              'L048',
              'L478',
              'L015',
              'L827',
              'L702',
              'L070',
              'L023',
            ],
            enumNames: [
              'VA 21-0781, Statement in Support of Claim for PTSD',
              'VA 21-0781a, Statement in Support of Claim for PTSD Secondary to Personal Assault',
              'Civilian Police Reports',
              'Military Personnel Record',
              'Medical Treatment Record - Non-Government Facility',
              'Certificate of Release or Discharge From Active Duty (e.g. DD 214, NOAA 56-16, PHS 1867)',
              'Other',
              'Personal Journal or Diary',
              'STR - Medical - Photocopy',
              'Medical Treatment Record - Government Facility',
              'Medical Treatment Records - Furnished by SSA',
              'Buddy/Lay Statement',
              'VA 21-4142 Authorization for Release of Information',
              'Disability Benefits Questionnaire (DBQ) - Veteran Provided',
              'Medical Records',
              'Multiple Documents',
            ],
          },
        },
      },
    },
  },
};

export default schema;
