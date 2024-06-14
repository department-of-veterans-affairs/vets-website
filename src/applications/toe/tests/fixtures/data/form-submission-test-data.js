export const submissionForm = {
  submission: {
    status: false,
    errorMessage: false,
    id: false,
    timestamp: false,
    hasAttemptedSubmit: false,
  },
  formId: '22-1990EMEB',
  loadedData: {
    formData: {
      'view:subHeadings': {},
      'view:userFullName': {
        userFullName: {
          first: 'Hector',
          last: 'Allen',
        },
      },
      dateOfBirth: '1932-02-05',
      'view:dateOfBirthUnder18Alert': {},
      'view:listOfSponsors': {},
      'view:additionalInfo': {},
      'view:enterYourSponsorsInformationHeading': {},
      'view:noSponsorWarning': {},
      'view:sponsorNotOnFileWarning': {},
      'view:yourSponsorsInformationHeading': {},
      sponsorFullName: {},
      'view:firstSponsorAdditionalInfo': {},
      'view:phoneNumbers': {
        mobilePhoneNumber: {},
        phoneNumber: {},
      },
      email: {
        email: 'vets.gov.user+0@gmail.com',
        confirmEmail: 'vets.gov.user+0@gmail.com',
      },
      'view:mailingAddress': {
        livesOnMilitaryBaseInfo: {},
        address: {
          country: 'USA',
        },
      },
      'view:contactMethodIntro': {},
      'view:receiveTextMessages': {},
      'view:noMobilePhoneAlert': {},
      bankAccount: {},
      'view:directDepositLearnMore': {},
      relativeFullName: {
        first: 'Hector',
        last: 'Allen',
      },
      relativeSocialSecurityNumber: '796126859',
      relativeAddress: {
        street: 'FAIRLAKE CIRCLE',
        city: 'FAIRFAX',
        state: 'VA',
        country: 'USA',
        postalCode: '20110',
      },
      formId: '',
    },
    metadata: {
      version: 0,
      prefill: true,
      returnUrl: '/applicant-information',
    },
  },
  reviewPageView: {
    viewedPages: {},
  },
  trackingPrefix: 'toe-',
  formErrors: {},
  data: {
    bankAccount: {
      accountType: 'checking',
      routingNumber: '124003116',
      accountNumber: '333333',
    },
    parentGuardianSponsor: 'John Hancock',
    firstSponsor: '9001001080',
    highSchoolDiploma: 'Yes',
    highSchoolDiplomaDate: '2000-01-02',
    'view:directDepositLearnMore': {},
    'view:contactMethodIntro': {},
    contactMethod: 'Email',
    'view:receiveTextMessages': {
      receiveTextMessages: 'Yes, send me text message notifications',
    },
    'view:subHeadings': {},
    'view:mailingAddress': {
      livesOnMilitaryBaseInfo: {},
      address: {
        street: '4000 Wilson Blvd',
        street2: 'street2',
        city: 'ARLINGTON',
        country: 'USA',
        state: 'VA',
        postalCode: '22203',
      },
    },
    'view:phoneNumbers': {
      mobilePhoneNumber: {
        phone: '5125554586',
      },
      phoneNumber: {
        phone: '5125554585',
      },
    },
    email: {
      email: 'vets.gov.user+0@gmail.com',
      confirmEmail: 'vets.gov.user+0@gmail.com',
    },
    'view:enterYourSponsorsInformationHeading': {},
    'view:noSponsorWarning': {},
    relationshipToServiceMember: 'Spouse',
    'view:yourSponsorsInformationHeading': {},
    sponsorFullName: {
      first: 'Marga',
      middle: 'E',
      last: 'Spencer',
      suffix: 'Jr.',
    },
    sponsorDateOfBirth: '1990-02-03',
    'view:userFullName': {
      userFullName: {
        first: 'Hector',
        middle: 'M',
        last: 'Allen',
        suffix: 'Sr.',
      },
    },
    dateOfBirth: '1932-02-05',
    'view:listOfSponsors': {},
    'view:additionalInfo': {},
    'view:firstSponsorAdditionalInfo': {},
    relativeFullName: {
      first: 'Hector',
      last: 'Allen',
    },
    relativeSocialSecurityNumber: '796126859',
    relativeAddress: {
      street: 'FAIRLAKE CIRCLE',
      city: 'FAIRFAX',
      state: 'VA',
      country: 'USA',
      postalCode: '20110',
    },
    formId: '',
  },
  pages: {
    applicantInformation: {
      uiSchema: {
        'view:subHeadings': {
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
                    children: 'Review your personal information',
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
                      'We have this personal information on file for you. If you notice any errors, please correct them now. Any updates you make will change the information for your education benefits only.',
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
                      {
                        type: 'strong',
                        key: null,
                        ref: null,
                        props: {
                          children: 'Note:',
                        },
                        _owner: null,
                        _store: {},
                      },
                      ' If you want to update your personal information for other VA benefits,',
                      ' ',
                      {
                        type: 'a',
                        key: null,
                        ref: null,
                        props: {
                          href: '/profile',
                          children: 'update your information on your profile',
                        },
                        _owner: null,
                        _store: {},
                      },
                      '.',
                    ],
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
        'view:userFullName': {
          userFullName: {
            first: {
              'ui:title': 'Your first name',
              'ui:autocomplete': 'given-name',
              'ui:errorMessages': {
                required: 'Please enter a first name',
              },
              'ui:validations': [null],
            },
            last: {
              'ui:title': 'Your last name',
              'ui:autocomplete': 'family-name',
              'ui:errorMessages': {
                required: 'Please enter a last name',
              },
              'ui:validations': [null],
            },
            middle: {
              'ui:title': 'Your middle name',
              'ui:autocomplete': 'additional-name',
            },
            suffix: {
              'ui:title': 'Suffix',
              'ui:autocomplete': 'honorific-suffix',
              'ui:options': {
                widgetClassNames: 'form-select-medium',
              },
            },
          },
        },
        dateOfBirth: {
          'ui:title': 'Your date of birth',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
        'view:dateOfBirthUnder18Alert': {
          'ui:description': {
            type: 'va-alert',
            key: null,
            ref: null,
            props: {
              'background-only': true,
              'close-btn-aria-label': 'Close notification',
              'show-icon': true,
              status: 'warning',
              visible: true,
              children: {
                key: null,
                ref: null,
                props: {
                  children:
                    'Since you’re under 18 years old, a parent or guardian will have to sign this application when you submit it.',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
          'ui:options': {},
        },
        parentGuardianSponsor: {
          'ui:title': 'Parent / Guardian signature',
          'ui:options': {},
          'ui:validations': [null],
          'ui:errorMessages': {
            required: 'Please enter a parent/guardian signature',
          },
        },
      },
      schema: {
        type: 'object',
        required: ['dateOfBirth'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          'view:userFullName': {
            type: 'object',
            properties: {
              userFullName: {
                type: 'object',
                properties: {
                  first: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 30,
                  },
                  middle: {
                    type: 'string',
                    maxLength: 30,
                  },
                  last: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 30,
                  },
                  suffix: {
                    type: 'string',
                    enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
                  },
                },
                required: ['first', 'last'],
              },
            },
          },
          dateOfBirth: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
          'view:dateOfBirthUnder18Alert': {
            type: 'object',
            properties: {},
            'ui:hidden': true,
          },
          parentGuardianSponsor: {
            type: 'string',
            'ui:hidden': true,
          },
        },
      },
      editMode: false,
    },
    sponsorSelection: {
      uiSchema: {
        'view:listOfSponsors': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: [
                {
                  key: null,
                  ref: null,
                  props: {},
                  _owner: null,
                  _store: {},
                },
                {
                  type: {
                    compare: null,
                  },
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
        },
        selectedSponsors: {
          'ui:options': {
            keepInPageOnReview: true,
          },
          items: {
            'ui:title': 'sponsor items',
          },
        },
        'view:additionalInfo': {
          'ui:description': {
            type: 'va-additional-info',
            key: null,
            ref: null,
            props: {
              trigger: 'Which sponsor should I choose?',
              class: 'vads-u-margin-bottom--4',
              children: {
                type: 'p',
                key: null,
                ref: null,
                props: {
                  className: 'vads-u-margin-y--0',
                  children:
                    'You will only receive a decision for the sponsor(s) you select. VA will review your eligibility for each selection. For any sponsors you do not select, you may impact your ability to use those benefits in the future. You can reapply for those sponsors using this application.',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          'view:listOfSponsors': {
            type: 'object',
            properties: {},
          },
          selectedSponsors: {
            type: 'array',
            minItems: 1,
            items: [],
            additionalItems: {
              type: 'string',
            },
          },
          'view:additionalInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
    sponsorInformation: {
      uiSchema: {
        'view:enterYourSponsorsInformationHeading': {
          'ui:description': {
            type: 'h3',
            key: null,
            ref: null,
            props: {
              className: 'vads-u-margin-bottom--3',
              children: 'Enter your sponsor’s information',
            },
            _owner: null,
            _store: {},
          },
        },
        'view:noSponsorWarning': {
          'ui:description': {
            type: 'va-alert',
            key: null,
            ref: null,
            props: {
              class: 'vads-u-margin-bottom--5',
              'close-btn-aria-label': 'Close notification',
              status: 'warning',
              visible: true,
              children: [
                {
                  type: 'h3',
                  key: null,
                  ref: null,
                  props: {
                    slot: 'headline',
                    children: 'We don’t have any sponsor information on file',
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
                      'If you think this is incorrect, reach out to your sponsor so they can',
                      ' ',
                      {
                        type: 'a',
                        key: null,
                        ref: null,
                        props: {
                          href: 'https://milconnect.dmdc.osd.mil/milconnect/',
                          children:
                            'update this information on the DoD milConnect website',
                        },
                        _owner: null,
                        _store: {},
                      },
                      '.',
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
                      'You may still continue this application and enter your sponsor’s information manually.',
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          'ui:options': {},
        },
        'view:sponsorNotOnFileWarning': {
          'ui:description': {
            type: 'va-alert',
            key: null,
            ref: null,
            props: {
              class: 'vads-u-margin-bottom--5',
              'close-btn-aria-label': 'Close notification',
              status: 'warning',
              visible: true,
              children: [
                {
                  type: 'h3',
                  key: null,
                  ref: null,
                  props: {
                    slot: 'headline',
                    children: 'Your selected sponsor isn’t on file',
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
                      'If you think this is incorrect, reach out to your sponsor so they can',
                      ' ',
                      {
                        type: 'a',
                        key: null,
                        ref: null,
                        props: {
                          href: 'https://milconnect.dmdc.osd.mil/milconnect/',
                          children:
                            'update this information on the DoD milConnect website',
                        },
                        _owner: null,
                        _store: {},
                      },
                      '.',
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
                      'You may still continue this application and enter your sponsor’s information manually.',
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          'ui:options': {},
        },
        relationshipToServiceMember: {
          'ui:title':
            'What’s your relationship to the Veteran or service member whose benefit has been transferred to you?',
          'ui:widget': 'radio',
        },
        'view:yourSponsorsInformationHeading': {
          'ui:description': {
            type: 'h4',
            key: null,
            ref: null,
            props: {
              children: 'Your sponsor’s information',
            },
            _owner: null,
            _store: {},
          },
        },
        sponsorFullName: {
          first: {
            'ui:title': 'First name',
            'ui:autocomplete': 'given-name',
            'ui:errorMessages': {
              required: 'Please enter a first name',
            },
            'ui:validations': [null],
          },
          last: {
            'ui:title': 'Last name',
            'ui:autocomplete': 'family-name',
            'ui:errorMessages': {
              required: 'Please enter a last name',
            },
            'ui:validations': [null],
          },
          middle: {
            'ui:title': 'Middle name',
            'ui:autocomplete': 'additional-name',
          },
          suffix: {
            'ui:title': 'Suffix',
            'ui:autocomplete': 'honorific-suffix',
            'ui:options': {
              widgetClassNames: 'form-select-medium',
            },
          },
        },
        sponsorDateOfBirth: {
          'ui:title': 'Date of birth',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
      },
      schema: {
        type: 'object',
        required: ['relationshipToServiceMember', 'sponsorDateOfBirth'],
        properties: {
          'view:enterYourSponsorsInformationHeading': {
            type: 'object',
            properties: {},
          },
          'view:noSponsorWarning': {
            type: 'object',
            properties: {},
          },
          'view:sponsorNotOnFileWarning': {
            type: 'object',
            properties: {},
            'ui:hidden': true,
          },
          relationshipToServiceMember: {
            type: 'string',
            enum: ['Spouse', 'Child'],
          },
          'view:yourSponsorsInformationHeading': {
            type: 'object',
            properties: {},
          },
          sponsorFullName: {
            type: 'object',
            properties: {
              first: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
              middle: {
                type: 'string',
                maxLength: 30,
              },
              last: {
                type: 'string',
                minLength: 1,
                maxLength: 30,
              },
              suffix: {
                type: 'string',
                enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
              },
            },
            required: ['first', 'last'],
          },
          sponsorDateOfBirth: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
        },
      },
      editMode: false,
    },
    firstSponsorSelection: {
      CustomPageReview: {
        compare: null,
      },
      uiSchema: {
        'view:subHeadings': {
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
                    children: 'Choose your first sponsor',
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
                      'You can only use one sponsor’s benefits at a time. Because you selected more than one sponsor, you must choose which benefits to use first.',
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
        firstSponsor: {
          'ui:title': 'Which sponsor’s benefits would you like to use first?',
          'ui:widget': {
            compare: null,
          },
          'ui:errorMessages': {
            required: 'Please select a sponsor',
          },
        },
        'view:firstSponsorAdditionalInfo': {
          'ui:description': {
            type: 'va-additional-info',
            key: null,
            ref: null,
            props: {
              trigger: 'Which sponsor should I use first?',
              class: 'vads-u-margin-bottom--4',
              children: [
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    className: 'vads-u-margin-top--0',
                    children:
                      'Though unlikely, you may need to consider differences in the amount of benefits each sponsor offers and when they expire. Benefits from other sponsors can be used after your first sponsor’s benefits expire.',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    className: 'vads-u-margin-bottom--0',
                    children:
                      'If you choose “I’m not sure,” or if there are additional things to consider regarding your sponsors, a VA representative will reach out to help you decide.',
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
      },
      schema: {
        type: 'object',
        required: ['firstSponsor'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          firstSponsor: {
            type: 'string',
          },
          'view:firstSponsorAdditionalInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
    highSchool: {
      uiSchema: {
        'view:subHeadings': {
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
                    children: 'Verify your high school education',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'va-alert',
                  key: null,
                  ref: null,
                  props: {
                    'close-btn-aria-label': 'Close notification',
                    status: 'info',
                    visible: true,
                    children: [
                      {
                        type: 'h3',
                        key: null,
                        ref: null,
                        props: {
                          slot: 'headline',
                          children: 'We need additional information',
                        },
                        _owner: null,
                        _store: {},
                      },
                      {
                        type: 'div',
                        key: null,
                        ref: null,
                        props: {
                          children:
                            'Since you indicated that you are the child of your sponsor, please include information about your high school education.',
                        },
                        _owner: null,
                        _store: {},
                      },
                    ],
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
        highSchoolDiploma: {
          'ui:title':
            'Did you earn a high school diploma or equivalency certificate?',
          'ui:widget': 'radio',
        },
      },
      schema: {
        type: 'object',
        required: ['highSchoolDiploma'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          highSchoolDiploma: {
            type: 'string',
            enum: ['Yes', 'No'],
          },
        },
      },
      editMode: false,
    },
    highSchoolGraduationDate: {
      uiSchema: {
        'view:subHeadings': {
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
                    children: 'Verify your high school education',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'va-alert',
                  key: null,
                  ref: null,
                  props: {
                    'close-btn-aria-label': 'Close notification',
                    status: 'info',
                    visible: true,
                    children: [
                      {
                        type: 'h3',
                        key: null,
                        ref: null,
                        props: {
                          slot: 'headline',
                          children: 'We need additional information',
                        },
                        _owner: null,
                        _store: {},
                      },
                      {
                        type: 'div',
                        key: null,
                        ref: null,
                        props: {
                          children:
                            'Since you indicated that you are the child of your sponsor, please include information about your high school education.',
                        },
                        _owner: null,
                        _store: {},
                      },
                    ],
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
        highSchoolDiplomaDate: {
          'ui:title':
            'When did you earn your high school diploma or equivalency certificate?',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
      },
      schema: {
        type: 'object',
        required: ['highSchoolDiplomaDate'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          highSchoolDiplomaDate: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
        },
      },
      editMode: false,
    },
    contactInformation: {
      uiSchema: {
        'view:subHeadings': {
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
                    children: 'Review your phone numbers and email address',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'div',
                  key: null,
                  ref: null,
                  props: {
                    className: 'meb-list-label',
                    children: {
                      type: 'strong',
                      key: null,
                      ref: null,
                      props: {
                        children: 'We’ll use this information to:',
                      },
                      _owner: null,
                      _store: {},
                    },
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'ul',
                  key: null,
                  ref: null,
                  props: {
                    children: [
                      {
                        type: 'li',
                        key: null,
                        ref: null,
                        props: {
                          children:
                            'Contact you if we have questions about your application',
                        },
                        _owner: null,
                        _store: {},
                      },
                      {
                        type: 'li',
                        key: null,
                        ref: null,
                        props: {
                          children:
                            'Tell you important information about your benefits',
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
                      'We have this contact information on file for you. If you notice any errors, please correct them now. Any updates you make will change the information for your education benefits only.',
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
                      {
                        type: 'strong',
                        key: null,
                        ref: null,
                        props: {
                          children: 'Note:',
                        },
                        _owner: null,
                        _store: {},
                      },
                      ' If you want to make changes to your contact information for other VA benefits,',
                      ' ',
                      {
                        key: null,
                        ref: null,
                        props: {
                          text: 'update your information on your profile',
                        },
                        _owner: null,
                        _store: {},
                      },
                      '.',
                    ],
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
        'view:phoneNumbers': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: [
                {
                  type: 'h4',
                  key: null,
                  ref: null,
                  props: {
                    className:
                      'form-review-panel-page-header vads-u-font-size--h5 toe-review-page-only',
                    children: 'Phone numbers and email addresss',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    className: 'toe-review-page-only',
                    children:
                      'If you’d like to update your phone numbers and email address, please edit the form fields below.',
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          mobilePhoneNumber: {
            'ui:options': {
              hideLabelText: true,
              showFieldLabel: false,
            },
            phone: {
              'ui:title': 'Mobile phone number',
              'ui:autocomplete': 'tel',
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
              'ui:validations': [null],
            },
            isInternational: {
              'ui:title': 'This mobile phone number is international.',
              'ui:options': {},
            },
          },
          phoneNumber: {
            'ui:options': {
              hideLabelText: true,
              showFieldLabel: false,
            },
            phone: {
              'ui:title': 'Home phone number',
              'ui:autocomplete': 'tel',
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
              'ui:validations': [null],
            },
            isInternational: {
              'ui:title': 'This home phone number is international.',
              'ui:options': {},
            },
          },
        },
        email: {
          'ui:options': {
            hideLabelText: true,
            showFieldLabel: false,
          },
          email: {
            'ui:title': 'Email address',
            'ui:errorMessages': {
              pattern:
                'Please enter an email address using this format: X@X.com',
              required: 'Please enter an email address',
            },
            'ui:autocomplete': 'email',
            'ui:options': {
              inputType: 'email',
            },
            'ui:validations': [null],
          },
          confirmEmail: {
            'ui:title': 'Confirm email address',
            'ui:errorMessages': {
              pattern:
                'Please enter an email address using this format: X@X.com',
              required: 'Please enter an email address',
            },
            'ui:autocomplete': 'email',
            'ui:options': {
              inputType: 'email',
              hideOnReview: true,
            },
          },
          'ui:validations': [null],
        },
      },
      schema: {
        type: 'object',
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          'view:phoneNumbers': {
            type: 'object',
            properties: {
              mobilePhoneNumber: {
                type: 'object',
                properties: {
                  phone: {
                    type: 'string',
                    pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
                  },
                  isInternational: {
                    type: 'boolean',
                  },
                },
              },
              phoneNumber: {
                type: 'object',
                properties: {
                  phone: {
                    type: 'string',
                    pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
                  },
                  isInternational: {
                    type: 'boolean',
                  },
                },
              },
            },
          },
          email: {
            type: 'object',
            required: ['email', 'confirmEmail'],
            properties: {
              email: {
                type: 'string',
                maxLength: 256,
                format: 'email',
              },
              confirmEmail: {
                type: 'string',
                maxLength: 256,
                format: 'email',
              },
            },
          },
        },
      },
      editMode: false,
    },
    mailingAddress: {
      uiSchema: {
        'view:subHeadings': {
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
                    children: 'Review your mailing address',
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
                      'We’ll send any important information about your application to this address.',
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
                      'We have this mailing address on file for you. If you notice any errors, please correct them now. Any updates you make will change the information for your education benefits only.',
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
                      {
                        type: 'strong',
                        key: null,
                        ref: null,
                        props: {
                          children: 'Note:',
                        },
                        _owner: null,
                        _store: {},
                      },
                      ' If you want to make changes to your contact information for other VA benefits,',
                      ' ',
                      {
                        key: null,
                        ref: null,
                        props: {
                          text: 'update your information on your profile',
                        },
                        _owner: null,
                        _store: {},
                      },
                      '.',
                    ],
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
        'view:mailingAddress': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: [
                {
                  type: 'h4',
                  key: null,
                  ref: null,
                  props: {
                    className:
                      'form-review-panel-page-header vads-u-font-size--h5 toe-review-page-only',
                    children: 'Mailing address',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    className: 'toe-review-page-only',
                    children:
                      'If you’d like to update your mailing address, please edit the form fields below.',
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          livesOnMilitaryBase: {
            'ui:title': {
              type: 'span',
              key: null,
              ref: null,
              props: {
                id: 'LiveOnMilitaryBaseTooltip',
                children:
                  'I live on a United States military base outside of the country',
              },
              _owner: null,
              _store: {},
            },
          },
          livesOnMilitaryBaseInfo: {
            'ui:description': {
              type: 'va-additional-info',
              key: null,
              ref: null,
              props: {
                trigger: 'Learn more about military base addresses',
                class: 'vads-u-margin-top--4',
                children: {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    children:
                      'U.S. military bases are considered a domestic address and a part of the United States.',
                  },
                  _owner: null,
                  _store: {},
                },
              },
              _owner: null,
              _store: {},
            },
          },
          address: {
            'ui:title': '',
            'ui:validations': [null, null, null, null, null],
            'ui:options': {},
            'ui:order': [
              'country',
              'street',
              'street2',
              'city',
              'state',
              'postalCode',
            ],
            country: {
              'ui:title': 'Country',
              'ui:disabled': false,
              'ui:options': {},
            },
            street: {
              'ui:title': 'Street address',
              'ui:errorMessages': {
                required: 'Please enter your full street address',
              },
              'ui:validations': [null],
            },
            street2: {
              'ui:title': 'Street address line 2',
              'ui:autocomplete': 'address-line2',
            },
            street3: {
              'ui:title': 'Street address line 3',
              'ui:autocomplete': 'address-line3',
            },
            city: {
              'ui:errorMessages': {
                required: 'Please enter a valid city',
              },
              'ui:validations': [null],
              'ui:options': {},
            },
            state: {
              'ui:autocomplete': 'address-level1',
              'ui:errorMessages': {
                required: 'Please enter a state',
              },
            },
            postalCode: {
              'ui:errorMessages': {
                required: 'Zip code must be 5 digits',
              },
              'ui:options': {},
            },
          },
          'ui:options': {
            hideLabelText: true,
            showFieldLabel: false,
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          'view:mailingAddress': {
            type: 'object',
            properties: {
              livesOnMilitaryBase: {
                type: 'boolean',
              },
              livesOnMilitaryBaseInfo: {
                type: 'object',
                properties: {},
              },
              address: {
                type: 'object',
                required: ['street', 'city', 'country', 'state', 'postalCode'],
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
                    title: 'City',
                  },
                  country: {
                    default: 'USA',
                    type: 'string',
                    enum: [
                      'USA',
                      'AFG',
                      'ALB',
                      'DZA',
                      'AND',
                      'AGO',
                      'AIA',
                      'ATA',
                      'ATG',
                      'ARG',
                      'ARM',
                      'ABW',
                      'AUS',
                      'AUT',
                      'AZE',
                      'BHS',
                      'BHR',
                      'BGD',
                      'BRB',
                      'BLR',
                      'BEL',
                      'BLZ',
                      'BEN',
                      'BMU',
                      'BTN',
                      'BOL',
                      'BIH',
                      'BWA',
                      'BVT',
                      'BRA',
                      'IOT',
                      'BRN',
                      'BGR',
                      'BFA',
                      'BDI',
                      'KHM',
                      'CMR',
                      'CAN',
                      'CPV',
                      'CYM',
                      'CAF',
                      'TCD',
                      'CHL',
                      'CHN',
                      'CXR',
                      'CCK',
                      'COL',
                      'COM',
                      'COG',
                      'COD',
                      'COK',
                      'CRI',
                      'CIV',
                      'HRV',
                      'CUB',
                      'CYP',
                      'CZE',
                      'DNK',
                      'DJI',
                      'DMA',
                      'DOM',
                      'ECU',
                      'EGY',
                      'SLV',
                      'GNQ',
                      'ERI',
                      'EST',
                      'ETH',
                      'FLK',
                      'FRO',
                      'FJI',
                      'FIN',
                      'FRA',
                      'GUF',
                      'PYF',
                      'ATF',
                      'GAB',
                      'GMB',
                      'GEO',
                      'DEU',
                      'GHA',
                      'GIB',
                      'GRC',
                      'GRL',
                      'GRD',
                      'GLP',
                      'GTM',
                      'GIN',
                      'GNB',
                      'GUY',
                      'HTI',
                      'HMD',
                      'HND',
                      'HKG',
                      'HUN',
                      'ISL',
                      'IND',
                      'IDN',
                      'IRN',
                      'IRQ',
                      'IRL',
                      'ISR',
                      'ITA',
                      'JAM',
                      'JPN',
                      'JOR',
                      'KAZ',
                      'KEN',
                      'KIR',
                      'PRK',
                      'KOR',
                      'KWT',
                      'KGZ',
                      'LAO',
                      'LVA',
                      'LBN',
                      'LSO',
                      'LBR',
                      'LBY',
                      'LIE',
                      'LTU',
                      'LUX',
                      'MAC',
                      'MKD',
                      'MDG',
                      'MWI',
                      'MYS',
                      'MDV',
                      'MLI',
                      'MLT',
                      'MTQ',
                      'MRT',
                      'MUS',
                      'MYT',
                      'MEX',
                      'FSM',
                      'MDA',
                      'MCO',
                      'MNG',
                      'MSR',
                      'MAR',
                      'MOZ',
                      'MMR',
                      'NAM',
                      'NRU',
                      'NPL',
                      'ANT',
                      'NLD',
                      'NCL',
                      'NZL',
                      'NIC',
                      'NER',
                      'NGA',
                      'NIU',
                      'NFK',
                      'NOR',
                      'OMN',
                      'PAK',
                      'PAN',
                      'PNG',
                      'PRY',
                      'PER',
                      'PHL',
                      'PCN',
                      'POL',
                      'PRT',
                      'QAT',
                      'REU',
                      'ROU',
                      'RUS',
                      'RWA',
                      'SHN',
                      'KNA',
                      'LCA',
                      'SPM',
                      'VCT',
                      'SMR',
                      'STP',
                      'SAU',
                      'SEN',
                      'SCG',
                      'SYC',
                      'SLE',
                      'SGP',
                      'SVK',
                      'SVN',
                      'SLB',
                      'SOM',
                      'ZAF',
                      'SGS',
                      'ESP',
                      'LKA',
                      'SDN',
                      'SUR',
                      'SWZ',
                      'SWE',
                      'CHE',
                      'SYR',
                      'TWN',
                      'TJK',
                      'TZA',
                      'THA',
                      'TLS',
                      'TGO',
                      'TKL',
                      'TON',
                      'TTO',
                      'TUN',
                      'TUR',
                      'TKM',
                      'TCA',
                      'TUV',
                      'UGA',
                      'UKR',
                      'ARE',
                      'GBR',
                      'URY',
                      'UZB',
                      'VUT',
                      'VAT',
                      'VEN',
                      'VNM',
                      'VGB',
                      'WLF',
                      'ESH',
                      'YEM',
                      'ZMB',
                      'ZWE',
                    ],
                    enumNames: [
                      'United States',
                      'Afghanistan',
                      'Albania',
                      'Algeria',
                      'Andorra',
                      'Angola',
                      'Anguilla',
                      'Antarctica',
                      'Antigua',
                      'Argentina',
                      'Armenia',
                      'Aruba',
                      'Australia',
                      'Austria',
                      'Azerbaijan',
                      'Bahamas',
                      'Bahrain',
                      'Bangladesh',
                      'Barbados',
                      'Belarus',
                      'Belgium',
                      'Belize',
                      'Benin',
                      'Bermuda',
                      'Bhutan',
                      'Bolivia',
                      'Bosnia',
                      'Botswana',
                      'Bouvet Island',
                      'Brazil',
                      'British Indian Ocean Territories',
                      'Brunei Darussalam',
                      'Bulgaria',
                      'Burkina Faso',
                      'Burundi',
                      'Cambodia',
                      'Cameroon',
                      'Canada',
                      'Cape Verde',
                      'Cayman',
                      'Central African Republic',
                      'Chad',
                      'Chile',
                      'China',
                      'Christmas Island',
                      'Cocos Islands',
                      'Colombia',
                      'Comoros',
                      'Congo',
                      'Democratic Republic of the Congo',
                      'Cook Islands',
                      'Costa Rica',
                      'Ivory Coast',
                      'Croatia',
                      'Cuba',
                      'Cyprus',
                      'Czech Republic',
                      'Denmark',
                      'Djibouti',
                      'Dominica',
                      'Dominican Republic',
                      'Ecuador',
                      'Egypt',
                      'El Salvador',
                      'Equatorial Guinea',
                      'Eritrea',
                      'Estonia',
                      'Ethiopia',
                      'Falkland Islands',
                      'Faroe Islands',
                      'Fiji',
                      'Finland',
                      'France',
                      'French Guiana',
                      'French Polynesia',
                      'French Southern Territories',
                      'Gabon',
                      'Gambia',
                      'Georgia',
                      'Germany',
                      'Ghana',
                      'Gibraltar',
                      'Greece',
                      'Greenland',
                      'Grenada',
                      'Guadeloupe',
                      'Guatemala',
                      'Guinea',
                      'Guinea-Bissau',
                      'Guyana',
                      'Haiti',
                      'Heard Island',
                      'Honduras',
                      'Hong Kong',
                      'Hungary',
                      'Iceland',
                      'India',
                      'Indonesia',
                      'Iran',
                      'Iraq',
                      'Ireland',
                      'Israel',
                      'Italy',
                      'Jamaica',
                      'Japan',
                      'Jordan',
                      'Kazakhstan',
                      'Kenya',
                      'Kiribati',
                      'North Korea',
                      'South Korea',
                      'Kuwait',
                      'Kyrgyzstan',
                      'Laos',
                      'Latvia',
                      'Lebanon',
                      'Lesotho',
                      'Liberia',
                      'Libya',
                      'Liechtenstein',
                      'Lithuania',
                      'Luxembourg',
                      'Macao',
                      'Macedonia',
                      'Madagascar',
                      'Malawi',
                      'Malaysia',
                      'Maldives',
                      'Mali',
                      'Malta',
                      'Martinique',
                      'Mauritania',
                      'Mauritius',
                      'Mayotte',
                      'Mexico',
                      'Micronesia',
                      'Moldova',
                      'Monaco',
                      'Mongolia',
                      'Montserrat',
                      'Morocco',
                      'Mozambique',
                      'Myanmar',
                      'Namibia',
                      'Nauru',
                      'Nepal',
                      'Netherlands Antilles',
                      'Netherlands',
                      'New Caledonia',
                      'New Zealand',
                      'Nicaragua',
                      'Niger',
                      'Nigeria',
                      'Niue',
                      'Norfolk',
                      'Norway',
                      'Oman',
                      'Pakistan',
                      'Panama',
                      'Papua New Guinea',
                      'Paraguay',
                      'Peru',
                      'Philippines',
                      'Pitcairn',
                      'Poland',
                      'Portugal',
                      'Qatar',
                      'Reunion',
                      'Romania',
                      'Russia',
                      'Rwanda',
                      'Saint Helena',
                      'Saint Kitts and Nevis',
                      'Saint Lucia',
                      'Saint Pierre and Miquelon',
                      'Saint Vincent and the Grenadines',
                      'San Marino',
                      'Sao Tome and Principe',
                      'Saudi Arabia',
                      'Senegal',
                      'Serbia',
                      'Seychelles',
                      'Sierra Leone',
                      'Singapore',
                      'Slovakia',
                      'Slovenia',
                      'Solomon Islands',
                      'Somalia',
                      'South Africa',
                      'South Georgia and the South Sandwich Islands',
                      'Spain',
                      'Sri Lanka',
                      'Sudan',
                      'Suriname',
                      'Swaziland',
                      'Sweden',
                      'Switzerland',
                      'Syrian Arab Republic',
                      'Taiwan',
                      'Tajikistan',
                      'Tanzania',
                      'Thailand',
                      'Timor-Leste',
                      'Togo',
                      'Tokelau',
                      'Tonga',
                      'Trinidad and Tobago',
                      'Tunisia',
                      'Turkey',
                      'Turkmenistan',
                      'Turks and Caicos Islands',
                      'Tuvalu',
                      'Uganda',
                      'Ukraine',
                      'United Arab Emirates',
                      'United Kingdom',
                      'Uruguay',
                      'Uzbekistan',
                      'Vanuatu',
                      'Vatican',
                      'Venezuela',
                      'Vietnam',
                      'British Virgin Islands',
                      'Wallis and Futuna',
                      'Western Sahara',
                      'Yemen',
                      'Zambia',
                      'Zimbabwe',
                    ],
                  },
                  state: {
                    title: 'State',
                    type: 'string',
                    maxLength: 51,
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
                    enumNames: [
                      'Alabama',
                      'Alaska',
                      'American Samoa',
                      'Arizona',
                      'Arkansas',
                      'Armed Forces Americas (AA)',
                      'Armed Forces Europe (AE)',
                      'Armed Forces Pacific (AP)',
                      'California',
                      'Colorado',
                      'Connecticut',
                      'Delaware',
                      'District Of Columbia',
                      'Federated States Of Micronesia',
                      'Florida',
                      'Georgia',
                      'Guam',
                      'Hawaii',
                      'Idaho',
                      'Illinois',
                      'Indiana',
                      'Iowa',
                      'Kansas',
                      'Kentucky',
                      'Louisiana',
                      'Maine',
                      'Marshall Islands',
                      'Maryland',
                      'Massachusetts',
                      'Michigan',
                      'Minnesota',
                      'Mississippi',
                      'Missouri',
                      'Montana',
                      'Nebraska',
                      'Nevada',
                      'New Hampshire',
                      'New Jersey',
                      'New Mexico',
                      'New York',
                      'North Carolina',
                      'North Dakota',
                      'Northern Mariana Islands',
                      'Ohio',
                      'Oklahoma',
                      'Oregon',
                      'Palau',
                      'Pennsylvania',
                      'Puerto Rico',
                      'Rhode Island',
                      'South Carolina',
                      'South Dakota',
                      'Tennessee',
                      'Texas',
                      'Utah',
                      'Vermont',
                      'Virgin Islands',
                      'Virginia',
                      'Washington',
                      'West Virginia',
                      'Wisconsin',
                      'Wyoming',
                    ],
                  },
                  postalCode: {
                    title: 'Zip code',
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    preferredContactMethod: {
      uiSchema: {
        'view:contactMethodIntro': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  className: 'toe-form-page-only',
                  children:
                    'Choose your contact method for follow-up questions',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        contactMethod: {
          'ui:title':
            'How should we contact you if we have questions about your application?',
          'ui:widget': 'radio',
          'ui:errorMessages': {
            required: 'Please select at least one way we can contact you.',
          },
          'ui:options': {},
        },
        'view:receiveTextMessages': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'div',
                key: null,
                ref: null,
                props: {
                  className: 'toe-form-page-only',
                  children: [
                    {
                      type: 'h3',
                      key: null,
                      ref: null,
                      props: {
                        children: 'Choose how you want to get notifications',
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
                          'We recommend that you opt in to text message notifications about your benefits. These notifications can prompt you to verify your enrollment so you’ll receive your education payments. You can verify your monthly enrollment easily this way.',
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'va-alert',
                      key: null,
                      ref: null,
                      props: {
                        status: 'info',
                        children: {
                          key: null,
                          ref: null,
                          props: {
                            children: [
                              'If you choose to get text message notifications from VA’s GI Bill program, message and data rates may apply. Two messages per month. At this time, we can only send text messages to U.S. mobile phone numbers. Text STOP to opt out or HELP for help.',
                              ' ',
                              {
                                type: 'a',
                                key: null,
                                ref: null,
                                props: {
                                  href:
                                    'https://benefits.va.gov/gibill/isaksonroe/verification_of_enrollment.asp',
                                  rel: 'noopener noreferrer',
                                  target: '_blank',
                                  children: 'View Terms and Conditions',
                                },
                                _owner: null,
                                _store: {},
                              },
                              ' ',
                              'and',
                              ' ',
                              {
                                type: 'a',
                                key: null,
                                ref: null,
                                props: {
                                  href: '/privacy-policy',
                                  rel: 'noopener noreferrer',
                                  target: '_blank',
                                  children: 'Privacy Policy',
                                },
                                _owner: null,
                                _store: {},
                              },
                              '.',
                            ],
                          },
                          _owner: null,
                          _store: {},
                        },
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
            _owner: null,
            _store: {},
          },
          receiveTextMessages: {
            'ui:title':
              'Would you like to receive text message notifications about your education benefits?',
            'ui:widget': 'radio',
            'ui:validations': [null],
            'ui:options': {
              widgetProps: {
                Yes: {
                  'data-info': 'yes',
                },
                No: {
                  'data-info': 'no',
                },
              },
              selectedProps: {
                Yes: {
                  'aria-describedby': 'yes',
                },
                No: {
                  'aria-describedby': 'no',
                },
              },
            },
          },
        },
        'view:noMobilePhoneAlert': {
          'ui:description': {
            type: 'va-alert',
            key: null,
            ref: null,
            props: {
              status: 'warning',
              children: {
                key: null,
                ref: null,
                props: {
                  children:
                    'You can’t choose to get text message notifications because we don’t have a mobile phone number on file for you.',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
          'ui:options': {},
        },
        'view:internationalTextMessageAlert': {
          'ui:description': {
            type: 'va-alert',
            key: null,
            ref: null,
            props: {
              status: 'warning',
              children: {
                key: null,
                ref: null,
                props: {
                  children:
                    'You can’t choose to get text notifications because you have an international mobile phone number. At this time, we can send text messages about your education benefits only to U.S. mobile phone numbers.',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
          'ui:options': {},
        },
      },
      schema: {
        type: 'object',
        properties: {
          'view:contactMethodIntro': {
            type: 'object',
            properties: {},
          },
          contactMethod: {
            type: 'string',
            enum: ['Email', 'Home Phone', 'Mobile Phone', 'Mail'],
          },
          'view:receiveTextMessages': {
            type: 'object',
            required: ['receiveTextMessages'],
            properties: {
              receiveTextMessages: {
                type: 'string',
                enum: [
                  'Yes, send me text message notifications',
                  'No, just send me email notifications',
                ],
              },
            },
          },
          'view:noMobilePhoneAlert': {
            type: 'object',
            properties: {},
            'ui:hidden': true,
          },
          'view:internationalTextMessageAlert': {
            type: 'object',
            properties: {},
            'ui:hidden': true,
          },
        },
        required: ['contactMethod'],
      },
      editMode: false,
    },
    directDeposit: {
      uiSchema: {
        'ui:description': {
          type: 'p',
          key: null,
          ref: null,
          props: {
            className: 'vads-u-margin-bottom--4',
            children: [
              {
                type: 'strong',
                key: null,
                ref: null,
                props: {
                  children: 'Note',
                },
                _owner: null,
                _store: {},
              },
              ': We make payments only through direct deposit, also called electronic funds transfer (EFT).',
            ],
          },
          _owner: null,
          _store: {},
        },
        bankAccount: {
          'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
          accountType: {
            'ui:title': 'Account type',
            'ui:widget': 'radio',
            'ui:options': {
              labels: {
                checking: 'Checking',
                savings: 'Savings',
              },
            },
            'ui:errorMessages': {
              required: 'Please select an account type',
            },
          },
          accountNumber: {
            'ui:title': 'Bank account number',
            'ui:errorMessages': {
              required: 'Please enter a bank account number',
            },
            'ui:validations': [null],
          },
          routingNumber: {
            'ui:title': 'Bank routing number',
            'ui:validations': [null],
            'ui:errorMessages': {
              pattern: 'Please enter a valid nine digit routing number',
              required: 'Please enter a routing number',
            },
          },
        },
        'view:directDepositLearnMore': {
          'ui:description': {
            type: 'va-additional-info',
            key: null,
            ref: null,
            props: {
              trigger: 'Where can I find these numbers?',
              children: [
                {
                  type: 'img',
                  key: 'check-image-src',
                  ref: null,
                  props: {
                    src:
                      'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/img/check-sample.png',
                    alt:
                      'Example of a check showing where the account and routing numbers are',
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
                      'The bank routing number is the first 9 digits on the bottom left corner of a printed check. Your account number is the second set of numbers on the bottom of a printed check, just to the right of the bank routing number.',
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
      },
      schema: {
        type: 'object',
        properties: {
          bankAccount: {
            type: 'object',
            required: ['accountType', 'accountNumber', 'routingNumber'],
            properties: {
              accountType: {
                type: 'string',
                enum: ['checking', 'savings'],
              },
              routingNumber: {
                type: 'string',
                pattern: '^\\d{9}$',
              },
              accountNumber: {
                type: 'string',
              },
            },
          },
          'view:directDepositLearnMore': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
  },
  initialData: {
    'view:subHeadings': {},
    'view:userFullName': {
      userFullName: {},
    },
    'view:dateOfBirthUnder18Alert': {},
    'view:listOfSponsors': {},
    'view:additionalInfo': {},
    'view:enterYourSponsorsInformationHeading': {},
    'view:noSponsorWarning': {},
    'view:sponsorNotOnFileWarning': {},
    'view:yourSponsorsInformationHeading': {},
    sponsorFullName: {},
    'view:firstSponsorAdditionalInfo': {},
    'view:phoneNumbers': {
      mobilePhoneNumber: {},
      phoneNumber: {},
    },
    email: {},
    'view:mailingAddress': {
      livesOnMilitaryBaseInfo: {},
      address: {
        country: 'USA',
      },
    },
    'view:contactMethodIntro': {},
    'view:receiveTextMessages': {},
    'view:noMobilePhoneAlert': {},
    bankAccount: {},
    'view:directDepositLearnMore': {},
  },
  savedStatus: 'not-attempted',
  autoSavedStatus: 'success',
  loadedStatus: 'not-attempted',
  version: 0,
  lastSavedDate: 1664993527580,
  expirationDate: 1670177527,
  prefillStatus: 'success',
  isStartingOver: true,
  inProgressFormId: '41',
};
