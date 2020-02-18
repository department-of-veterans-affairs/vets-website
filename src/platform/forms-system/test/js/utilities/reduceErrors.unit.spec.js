import { expect } from 'chai';

import { reduceErrors } from '../../../src/js/utilities/data/reduceErrors';

// Portions copied from form 996 & 526
const pageList = [
  {
    pageKey: 'introduction',
    path: '/introduction',
  },
  {
    title: 'Veteran information',
    path: '/veteran-information',
    uiSchema: {},
    schema: {
      type: 'object',
      properties: {},
    },
    chapterKey: 'veteranDetails',
    pageKey: 'veteranInformation',
  },
  {
    title: 'Contested issues',
    path: '/contested-issues',
    uiSchema: {
      'ui:title': ' ',
      contestedIssues: {
        'ui:title': ' ',
        'ui:description': '',
        'ui:field': 'StringField',
        'ui:options': {},
      },
      'view:contestedIssuesAlert': {},
      'view:disabilitiesExplanation': {
        'ui:description': '',
      },
    },
    schema: {},
    initialData: {
      primaryPhone: '1234556789',
      emailAddress: 'vet@vet.com',
    },
    chapterTitle: 'Contested issues',
    chapterKey: 'contestedIssues',
    pageKey: 'contestedIssues',
  },
  {
    title: 'Military service history',
    path: '/review-veteran-details/military-service-history',
    uiSchema: {
      serviceInformation: {
        servicePeriods: {
          'ui:title': '',
          'ui:description': '',
          'ui:options': {},
          items: {
            serviceBranch: {},
            dateRange: {},
            'ui:options': {},
          },
        },
      },
    },
    schema: {},
    chapterKey: 'veteranDetails',
    pageKey: 'militaryHistory',
  },
  {
    title: 'Retirement pay',
    path: '/retirement-pay',
    uiSchema: {
      'view:hasMilitaryRetiredPay': {
        'ui:title': '',
        'ui:widget': 'yesNo',
        'ui:options': {},
      },
      militaryRetiredPayBranch: {
        'ui:title': '',
        'ui:options': {},
      },
    },
    schema: {},
    chapterKey: 'veteranDetails',
    pageKey: 'retirementPay',
  },
  {
    title: 'Training pay',
    path: '/training-pay',
    uiSchema: {
      hasTrainingPay: {},
    },
    schema: {},
    chapterKey: 'veteranDetails',
    pageKey: 'trainingPay',
  },
  {
    title: 'New disabilities',
    path: '/new-disabilities',
    uiSchema: {
      'view:newDisabilities': {
        'ui:title': '',
        'ui:validations': [],
      },
      'view:noSelectedAlert': {},
    },
    schema: {},
    chapterTitle: 'Disabilities',
    chapterKey: 'disabilities',
    pageKey: 'newDisabilities',
  },
  {
    title: 'Prisoner of war (POW)',
    path: '/pow',
    uiSchema: {
      'ui:title': '',
      'view:powStatus': {},
      'view:isPow': {
        confinements: {},
        powDisabilities: {},
      },
    },
    schema: {},
    chapterTitle: 'Disabilities',
    chapterKey: 'disabilities',
    pageKey: 'prisonerOfWar',
  },
  {
    title: 'Veteran contact information',
    path: '/contact-information',
    uiSchema: {
      'ui:title': 'Contact information',
      phoneAndEmail: {
        'ui:title': 'Phone & email',
        primaryPhone: {},
        emailAddress: {},
      },
      mailingAddress: {
        'ui:title': 'Mailing address',
        country: {},
        addressLine1: {},
        addressLine2: {},
        addressLine3: {},
        city: {},
        state: {},
        zipCode: {},
      },
      'view:contactInfoDescription': {},
    },
    schema: {},
    chapterTitle: 'Additional information',
    chapterKey: 'additionalInformation',
    pageKey: 'contactInformation',
  },
  {
    title: 'Housing situation',
    path: '/housing-situation',
    uiSchema: {
      homelessOrAtRisk: {},
      'view:isHomeless': {
        'ui:options': {},
        homelessHousingSituation: {},
        otherHomelessHousing: {},
        needToLeaveHousing: {},
      },
      'view:isAtRisk': {
        'ui:options': {},
        atRiskHousingSituation: {},
        otherAtRiskHousing: {},
      },
      homelessnessContact: {
        name: {},
        phoneNumber: {},
      },
    },
    schema: {},
    chapterTitle: 'Additional information',
    chapterKey: 'additionalInformation',
    pageKey: 'homelessOrAtRisk',
  },
  {
    path: '/new-disabilities/follow-up/:index',
    showPagePerItem: true,
    arrayPath: 'newDisabilities',
    uiSchema: {
      'ui:title': 'Disability details',
      newDisabilities: {
        items: {
          cause: {
            'ui:title': {},
            'ui:widget': 'radio',
            'ui:options': {},
          },
          primaryDescription: {
            'ui:title': '',
            'ui:widget': 'textarea',
            'ui:options': {},
            'ui:validations': [],
          },
          'view:secondaryFollowUp': {
            'ui:options': {},
            causedByDisability: {
              'ui:title': '',
              'ui:options': {},
            },
            causedByDisabilityDescription: {},
          },
          'view:worsenedFollowUp': {
            'ui:options': {},
            worsenedDescription: {},
            worsenedEffects: {},
          },
          'view:vaFollowUp': {
            'ui:options': {},
            vaMistreatmentDescription: {},
            vaMistreatmentLocation: {},
            vaMistreatmentDate: {},
          },
        },
      },
    },
    schema: {},
    chapterTitle: 'Disabilities',
    chapterKey: 'disabilities',
    pageKey: 'newDisabilityFollowUp',
  },
];

const rawErrors = [
  {},
  {
    contestedIssues: {
      __errors: ['Please select a contested issue'],
    },
  },
  {
    'view:hasAlternateName': {
      __errors: [],
    },
    alternateNames: {
      __errors: [],
    },
    uiSchema: {
      primaryPhone: {}, // ignored since it's not the correct instance
    },
  },
  {
    property: 'instance',
    message: 'requires property "view:hasMilitaryRetiredPay"',
    schema: {},
    name: 'required',
    argument: 'view:hasMilitaryRetiredPay',
    stack: 'instance requires property "view:hasMilitaryRetiredPay"',
  },
  {
    property: 'instance',
    message: 'requires property "hasTrainingPay"',
    schema: {},
    name: 'required',
    argument: 'hasTrainingPay',
    stack: 'instance requires property "hasTrainingPay"',
  },
  {},
  {
    property: 'instance',
    message: 'requires property "view:newDisabilities"',
    schema: {},
    name: 'required',
    argument: 'view:newDisabilities',
    stack: 'instance requires property "view:newDisabilities"',
  },
  {
    property: 'instance',
    message: 'requires property "view:powStatus"',
    schema: {},
    name: 'required',
    argument: 'view:powStatus',
    stack: 'instance requires property "view:powStatus"',
  },
  {
    property: 'instance.phoneAndEmail',
    message: 'requires property "primaryPhone"',
    schema: {},
    name: 'required',
    argument: 'primaryPhone',
    stack: 'instance.phoneAndEmail requires property "primaryPhone"',
  },
  {
    property: 'instance.phoneAndEmail',
    message: 'requires property "emailAddress"',
    schema: {},
    name: 'required',
    argument: 'emailAddress',
    stack: 'instance.phoneAndEmail requires property "emailAddress"',
  },
  {
    property: 'instance.mailingAddress',
    message: 'requires property "city"',
    schema: {},
    name: 'required',
    argument: 'city',
    stack: 'instance.mailingAddress requires property "city"',
  },
  {
    property: 'instance.mailingAddress',
    message: 'requires property "addressLine1"',
    schema: {},
    name: 'required',
    argument: 'addressLine1',
    stack: 'instance.mailingAddress requires property "addressLine1"',
  },
  {
    'view:bankAccount': {
      __errors: [],
      bankAccountType: {
        __errors: [],
      },
      bankAccountNumber: {
        __errors: [],
      },
      bankRoutingNumber: {
        __errors: [],
      },
      bankName: {
        __errors: [],
      },
    },
  },
  {
    property: 'instance',
    message: 'requires property "homelessOrAtRisk"',
    schema: {},
    name: 'required',
    argument: 'homelessOrAtRisk',
    stack: 'instance requires property "homelessOrAtRisk"',
  },
  {
    isTerminallyIll: {
      __errors: [],
    },
    'view:terminallyIllInfo': {
      __errors: [],
    },
  },
  {
    property: 'instance.newDisabilities[0]',
    message: 'requires property "cause"',
    schema: {},
    name: 'required',
    argument: 'cause',
    stack: 'instance.newDisabilities[0] requires property "cause"',
  },
];

const result = [
  {
    name: 'contestedIssues',
    message: 'Please select a contested issue',
    chapterKey: 'contestedIssues',
    pageKey: 'contestedIssues',
    index: null,
  },
  {
    name: 'view:hasMilitaryRetiredPay',
    message: 'Has military retired pay',
    chapterKey: 'veteranDetails',
    pageKey: 'retirementPay',
    index: null,
  },
  {
    name: 'hasTrainingPay',
    message: 'Has training pay',
    chapterKey: 'veteranDetails',
    pageKey: 'trainingPay',
    index: null,
  },
  {
    name: 'view:newDisabilities',
    message: 'New disabilities',
    chapterKey: 'disabilities',
    pageKey: 'newDisabilities',
    index: null,
  },
  {
    name: 'view:powStatus',
    message: 'POW  status',
    chapterKey: 'disabilities',
    pageKey: 'prisonerOfWar',
    index: null,
  },
  {
    name: 'primaryPhone',
    message: 'Phone and email primary phone',
    chapterKey: 'additionalInformation',
    pageKey: 'contactInformation',
    index: null,
  },
  {
    name: 'emailAddress',
    message: 'Phone and email email address',
    chapterKey: 'additionalInformation',
    pageKey: 'contactInformation',
    index: null,
  },
  {
    name: 'city',
    message: 'Mailing address city',
    chapterKey: 'additionalInformation',
    pageKey: 'contactInformation',
    index: null,
  },
  {
    name: 'addressLine1',
    message: 'Mailing address address line 1',
    chapterKey: 'additionalInformation',
    pageKey: 'contactInformation',
    index: null,
  },
  {
    name: 'homelessOrAtRisk',
    message: 'Homeless or at risk',
    chapterKey: 'additionalInformation',
    pageKey: 'homelessOrAtRisk',
    index: null,
  },
  {
    name: 'cause',
    message: 'First new disabilities cause',
    chapterKey: 'disabilities',
    pageKey: 'newDisabilityFollowUp',
    index: '0',
  },
];

describe('Process form validation errors', () => {
  it('should process the JSON schema form errors into', () => {
    expect(reduceErrors(rawErrors, pageList)).to.eql(result);
  });
});
