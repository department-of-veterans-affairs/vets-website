export const submissionForm = {
  submission: {
    status: false,
    errorMessage: false,
    id: false,
    timestamp: false,
    hasAttemptedSubmit: false,
  },
  formId: '22-5490',
  loadedData: {
    formData: {},
    metadata: {},
  },
  reviewPageView: {
    openChapters: {},
    viewedPages: {},
  },
  trackingPrefix: 'edu-22-5490-',
  formErrors: {},
  data: {
    relativeDateOfBirth: '1932-02-05',
    claimantFullName: {
      first: 'Hector',
      middle: 'M',
      last: 'Allen',
      suffix: 'Sr.',
    },
    'view:directDeposit': {
      bankAccount: {
        accountNumber: '123123123',
        accountType: 'checking',
        routingNumber: '123123124',
      },
    },
    'view:learnMore': {},
    contactMethod: 'Email',
    'view:subHeadings': {},
    notificationMethod: 'no',
    mailingAddressInput: {
      livesOnMilitaryBaseInfo: {},
      address: {
        street: '4000 Wilson Blvd',
        street2: '#1',
        city: 'ARLINGTON',
        country: 'USA',
        state: 'VA',
        postalCode: '22203',
      },
    },
    'view:EmailAndphoneNumbers': {},
    mobilePhone: {
      phone: '5125554586',
    },
    homePhone: {
      phone: '5125554585',
    },
    email: 'test@test.com',
    'view:confirmDuplicateData': {},
    felonyOrWarrant: 'no',
    remarriageDate: '2020-01-01',
    remarriageStatus: 'yes',
    marriageDate: '2015-01-01',
    marriageStatus: 'divorced',
    'view:personalInformation': {},
    highSchoolDiploma: 'yes',
    graduationDate: '2010-01-02',
    'view:subHeading': {},
    'view:fry': {},
    'view:dea': {},
    'view:benefitInfo': {},
    chosenBenefit: 'dea',
    relationShipToMember: 'spouse',
    relativeSocialSecurityNumber: '321321321',
    fullName: {
      first: 'test',
      middle: 't',
      last: 'testerson',
    },
    dateOfBirth: '1990-01-01',
    ssn: '123123123',
    duplicatePhone: [
      {
        value: '',
        dupe: '',
      },
    ],
  },
  pages: {
    applicantInformation: {
      uiSchema: {
        relationShipToMember: {
          'ui:title':
            "What's your relationship to the Veteran or service member whose benefits you'd like to use?",
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              spouse: 'Spouse',
              child: 'Child',
            },
          },
        },
        fullName: {
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
            'ui:validations': [null],
          },
          suffix: {
            'ui:title': 'Suffix',
            'ui:autocomplete': 'honorific-suffix',
            'ui:options': {
              widgetClassNames: 'form-select-medium',
            },
          },
          'ui:title': 'Veteran or service member information',
        },
        dateOfBirth: {
          'ui:title': 'Date of birth',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
        },
        ssn: {
          'ui:title': 'Social Security number',
          'ui:options': {
            widgetClassNames: 'usa-input-medium masked-ssn',
          },
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern:
              'Please enter a valid 9 digit Social Security number (dashes allowed)',
            required: 'Please enter a Social Security number',
          },
        },
      },
      schema: {
        type: 'object',
        required: ['relationShipToMember', 'fullName', 'ssn', 'dateOfBirth'],
        properties: {
          relationShipToMember: {
            type: 'string',
            enum: ['spouse', 'child'],
          },
          fullName: {
            type: 'object',
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
              suffix: {
                type: 'string',
                enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
              },
            },
            required: ['first', 'last'],
          },
          dateOfBirth: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
          ssn: {
            type: 'string',
            pattern: '^[0-9]{9}$',
          },
        },
      },
      editMode: false,
    },
    benefitSelection: {
      uiSchema: {
        'view:subHeading': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
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
                        children: 'Choose the benefit you’d like to apply for:',
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
                          ' If you are eligible for both the Fry Scholarship and Survivors’ and Dependents’ Educational Assistance benefits, you’ll need to choose which one to use. Once you make this choice, you can’t switch to the other program.',
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
            _owner: null,
            _store: {},
          },
        },
        'view:fry': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'div',
                key: null,
                ref: null,
                props: {
                  className: 'usa-alert background-color-only',
                  children: [
                    {
                      type: 'h5',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0',
                        children: 'CHAPTER 33',
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'h4',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2',
                        children: 'Fry Scholarship',
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'h4',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2',
                        children:
                          'Receive up to 36 months of benefits, including:',
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'ul',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3',
                        children: [
                          {
                            type: 'li',
                            key: null,
                            ref: null,
                            props: {
                              children: [
                                {
                                  type: 'va-icon',
                                  key: null,
                                  ref: null,
                                  props: {
                                    size: 4,
                                    icon: 'school',
                                    className: 'fry-dea-benefit-selection-icon',
                                    'aria-hidden': 'true',
                                  },
                                  _owner: null,
                                  _store: {},
                                },
                                ' ',
                                'Tuition & fees',
                              ],
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'li',
                            key: null,
                            ref: null,
                            props: {
                              children: [
                                {
                                  type: 'va-icon',
                                  key: null,
                                  ref: null,
                                  props: {
                                    size: 4,
                                    icon: 'home',
                                    className: 'fry-dea-benefit-selection-icon',
                                    'aria-hidden': 'true',
                                  },
                                  _owner: null,
                                  _store: {},
                                },
                                ' ',
                                'Money for housing',
                              ],
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'li',
                            key: null,
                            ref: null,
                            props: {
                              children: [
                                {
                                  type: 'va-icon',
                                  key: null,
                                  ref: null,
                                  props: {
                                    size: 4,
                                    icon: 'local_library',
                                    className: 'fry-dea-benefit-selection-icon',
                                    'aria-hidden': 'true',
                                  },
                                  _owner: null,
                                  _store: {},
                                },
                                ' ',
                                'Money for books & supplies',
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
                    {
                      type: 'a',
                      key: null,
                      ref: null,
                      props: {
                        href:
                          'https://www.va.gov/education/survivor-dependent-benefits/fry-scholarship/',
                        target: '_blank',
                        rel: 'noreferrer',
                        children:
                          'Learn more about the Fry Scholarship education benefit',
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
        },
        'view:dea': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'div',
                key: null,
                ref: null,
                props: {
                  className: 'usa-alert background-color-only',
                  children: [
                    {
                      type: 'h5',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0',
                        children: 'DEA, CHAPTER 35',
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'h4',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2',
                        children:
                          "Survivors' and Dependents' Educational Assistance",
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'h4',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2',
                        children:
                          'Receive up to 36 months of benefits, including:',
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'ul',
                      key: null,
                      ref: null,
                      props: {
                        className:
                          'fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3',
                        children: {
                          type: 'li',
                          key: null,
                          ref: null,
                          props: {
                            children: [
                              {
                                type: 'va-icon',
                                key: null,
                                ref: null,
                                props: {
                                  size: 4,
                                  icon: 'attach_money',
                                  className: 'fry-dea-benefit-selection-icon',
                                  'aria-hidden': 'true',
                                },
                                _owner: null,
                                _store: {},
                              },
                              ' ',
                              'Monthly stipened',
                            ],
                          },
                          _owner: null,
                          _store: {},
                        },
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'a',
                      key: null,
                      ref: null,
                      props: {
                        href:
                          'https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/',
                        target: '_blank',
                        rel: 'noreferrer',
                        children: 'Learn more about DEA education benefit',
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
        },
        'view:benefitInfo': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: [
                {
                  type: 'span',
                  key: null,
                  ref: null,
                  props: {
                    className:
                      'fry-dea-labels_label--main vads-u-padding-left--1',
                    children:
                      'Which education benefit would you like to apply for?',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'br',
                  key: null,
                  ref: null,
                  props: {},
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'br',
                  key: null,
                  ref: null,
                  props: {},
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'span',
                  key: null,
                  ref: null,
                  props: {
                    className:
                      'fry-dea-labels_label--secondary fry-dea-input-message fry-dea-review-view-hidden vads-u-background-color--primary-alt-lightest vads-u-padding--1 vads-u-margin-top--1',
                    children: [
                      {
                        type: 'va-icon',
                        key: null,
                        ref: null,
                        props: {
                          size: 3,
                          icon: 'info',
                          className: 'vads-u-margin-right--1',
                          'aria-hidden': 'true',
                        },
                        _owner: null,
                        _store: {},
                      },
                      ' ',
                      {
                        type: 'span',
                        key: null,
                        ref: null,
                        props: {
                          className: 'sr-only',
                          children: 'Informational Note:',
                        },
                        _owner: null,
                        _store: {},
                      },
                      ' If you’re the child of a veteran or service member who died in the line of duty before August 1, 2011 you can use both Fry Scholarship and DEA and get up to 81 months of benefits. You’ll need to apply separately and use one program at a time.',
                    ],
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'br',
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
        chosenBenefit: {
          'ui:title': 'Select one benefit',
          'ui:errorMessages': {
            required: 'Please select an education benefit',
          },
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              fry: 'Fry Scholarship (Chapter 33)',
              dea:
                'Survivors’ and Dependents’ Educational Assistance (DEA, Chapter 35)',
            },
            widgetProps: {
              fry: {
                'data-info': 'fry',
              },
              dea: {
                'data-info': 'dea',
              },
            },
            selectedProps: {
              fry: {
                'aria-describedby': 'fry',
              },
              dea: {
                'aria-describedby': 'dea',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['chosenBenefit'],
        properties: {
          'view:subHeading': {
            type: 'object',
            properties: {},
          },
          'view:fry': {
            type: 'object',
            properties: {},
          },
          'view:dea': {
            type: 'object',
            properties: {},
          },
          'view:benefitInfo': {
            type: 'object',
            properties: {},
          },
          chosenBenefit: {
            type: 'string',
            enum: ['fry', 'dea'],
          },
        },
      },
      editMode: false,
    },
    reviewPersonalInformation: {
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
                    children: [
                      'We have this personal information on file for you. Any updates you make will change the information for your education benefits only. If you want to update your personal information for other VA benefits, update your information on your',
                      ' ',
                      {
                        type: 'a',
                        key: null,
                        ref: null,
                        props: {
                          target: '_blank',
                          href: '/profile/personal-information',
                          children: 'profile',
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
                      ' If you want to request that we change your name or date of birth, you will need to send additional information. Learn more on how to change your legal name',
                      ' ',
                      {
                        type: 'a',
                        key: null,
                        ref: null,
                        props: {
                          target: '_blank',
                          href:
                            '/resources/how-to-change-your-legal-name-on-file-with-va/?_ga=2.13947071.963379013.1690376239-159354255.1663160782',
                          children: 'on file with VA.',
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
        'view:personalInformation': {
          'ui:description': {
            type: {
              compare: null,
            },
            key: null,
            ref: null,
            props: {},
            _owner: null,
            _store: {},
          },
        },
        highSchoolDiploma: {
          'ui:title': 'Did you earn a high school or equivalency certificate?',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              yes: 'Yes',
              no: 'No',
            },
          },
        },
        graduationDate: {
          'ui:title':
            'When did you earn your high school diploma or equivalency?',
          'ui:widget': 'date',
          'ui:validations': [null],
          'ui:errorMessages': {
            pattern: 'Please enter a valid current or past date',
            required: 'Please enter a date',
          },
          'ui:options': {},
        },
      },
      schema: {
        type: 'object',
        required: ['highSchoolDiploma', 'graduationDate'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          'view:personalInformation': {
            type: 'object',
            properties: {},
          },
          highSchoolDiploma: {
            type: 'string',
            enum: ['yes', 'no'],
          },
          graduationDate: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
        },
      },
      editMode: false,
    },
    marriageInformation: {
      uiSchema: {
        'view:subHeadings': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  children: 'Marriage information',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        marriageStatus: {
          'ui:title':
            "What's the status of your marriage with your chosen Veteran or service member?",
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              married: 'Married',
              divorced: 'Divorced (or divorce in progress)',
              anulled: 'Marriage was annulled (or an annullment in progress)',
              widowed: 'Widowed',
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['marriageStatus'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          marriageStatus: {
            type: 'string',
            enum: ['married', 'divorced', 'anulled', 'widowed'],
          },
        },
      },
      editMode: false,
    },
    marriageDate: {
      uiSchema: {
        'view:subHeadings': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  children: 'Marriage Date',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        marriageDate: {
          'ui:title':
            'When did you get married to your chosen Veteran or service member?',
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
        required: ['marriageDate'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          marriageDate: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
        },
      },
      editMode: false,
    },
    remarriageInformation: {
      uiSchema: {
        'view:subHeadings': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  children: 'Remarriage',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        remarriageStatus: {
          'ui:title': 'Have you been remarried since your divorce?',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              yes: 'Yes',
              no: 'No',
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['remarriageStatus'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          remarriageStatus: {
            type: 'string',
            enum: ['yes', 'no'],
          },
        },
      },
      editMode: false,
    },
    remarriageDate: {
      uiSchema: {
        'view:subHeadings': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  children: 'Remarriage Date',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        remarriageDate: {
          'ui:title': 'When did you get remarried?',
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
        required: ['remarriageDate'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          remarriageDate: {
            pattern:
              '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
            type: 'string',
          },
        },
      },
      editMode: false,
    },
    outstandingFelony: {
      uiSchema: {
        'view:subHeadings': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  children: 'Outstanding felony',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        felonyOrWarrant: {
          'ui:title':
            'Do you or your chosen Veteran or service member have an outstanding felony or warrant?',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              yes: 'Yes',
              no: 'No',
            },
          },
        },
      },
      schema: {
        type: 'object',
        required: ['felonyOrWarrant'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          felonyOrWarrant: {
            type: 'string',
            enum: ['yes', 'no'],
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
              children: {
                type: 'h3',
                key: null,
                ref: null,
                props: {
                  children: 'Review your phone number and email address',
                },
                _owner: null,
                _store: {},
              },
            },
            _owner: null,
            _store: {},
          },
        },
        'view:EmailAndphoneNumbers': {
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
                    children: 'We’ll use this information to:',
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
                      'This is the contact information we have on file for you. If you notice any errors, please correct them now. Any updates you make here will be used for your education benefits only.',
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
                      ' If you want to update your contact information for other VA benefits, you can do that from your profile.',
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
                    children: {
                      type: 'a',
                      key: null,
                      ref: null,
                      props: {
                        target: '_blank',
                        href:
                          'https://www.va.gov/resources/managing-your-vagov-profile/',
                        rel: 'noreferrer',
                        children: 'Go to your profile',
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
        mobilePhone: {
          'ui:options': {
            hideLabelText: true,
            showFieldLabel: false,
          },
          phone: {
            'ui:widget': {
              compare: null,
            },
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
            'ui:title': 'This mobile phone number is international',
            'ui:options': {},
          },
        },
        homePhone: {
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
            'ui:title': 'This home phone number is international',
            'ui:options': {},
          },
        },
        email: {
          'ui:title': 'Email address',
          'ui:errorMessages': {
            format:
              'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
            pattern:
              'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
            required: 'Please enter an email address',
          },
          'ui:autocomplete': 'email',
          'ui:options': {
            inputType: 'email',
          },
          'ui:widget': {
            compare: null,
          },
        },
        'ui:validations': [null],
        'view:confirmDuplicateData': {
          'ui:description': {
            compare: null,
          },
        },
      },
      schema: {
        type: 'object',
        required: ['email'],
        properties: {
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          'view:EmailAndphoneNumbers': {
            type: 'object',
            properties: {},
          },
          mobilePhone: {
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
          homePhone: {
            type: 'object',
            properties: {
              phone: {
                type: 'string',
                pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
              },
              isInternational: {
                type: 'boolean',
                'ui:hidden': true,
              },
            },
          },
          email: {
            type: 'string',
            format: 'email',
          },
          'view:confirmDuplicateData': {
            type: 'object',
            properties: {},
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
                      'This is the mailing address we have on file for you. If you notice any errors, please correct them now. Any updates you make will change the information for your education benefits only.',
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
                      ' If you want to update your personal information for other VA benefits, you can do that from your profile.',
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
                    children: {
                      type: 'a',
                      key: null,
                      ref: null,
                      props: {
                        target: '_blank',
                        href: '/profile/personal-information',
                        children: 'Go to your profile',
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
        mailingAddressInput: {
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
                      'form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only',
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
                    className: 'meb-review-page-only',
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
                children: {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    className: 'vads-u-margin-top--0',
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
            'ui:validations': [null],
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
              'ui:title': 'State/County/Province',
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
          mailingAddressInput: {
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
    chooseContactMethod: {
      uiSchema: {
        contactMethod: {
          'ui:title':
            'How should we contact you if we have questions on your application?',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              email: 'Email',
              mobilePhone: 'Mobile phone',
              homePhone: 'Home phone',
              mail: 'Mail',
            },
          },
        },
        'view:subHeadings': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              children: {
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
                          'We recommend that you opt into text message notifications about your benefits. These include notifications that prompt you to verify your enrollment so you’ll receive your education payments. This is an easy way to verify your monthly enrollment.',
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
                            children: 'What to know about text notifications:',
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
                              children: 'We’ll send you 2 messages per month.',
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'li',
                            key: null,
                            ref: null,
                            props: {
                              children: 'Message and data rates may apply.',
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'li',
                            key: null,
                            ref: null,
                            props: {
                              children: 'If you want to opt out, text STOP.',
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'li',
                            key: null,
                            ref: null,
                            props: {
                              children: 'If you need help, text HELP.',
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
                        children: {
                          type: 'a',
                          key: null,
                          ref: null,
                          props: {
                            href:
                              'https://www.va.gov/privacy-policy/digital-notifications-terms-and-conditions/',
                            rel: 'noopener noreferrer',
                            target: '_blank',
                            children:
                              'Read our text notifications terms and conditions',
                          },
                          _owner: null,
                          _store: {},
                        },
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      type: 'p',
                      key: null,
                      ref: null,
                      props: {
                        children: {
                          type: 'a',
                          key: null,
                          ref: null,
                          props: {
                            href: 'https://www.va.gov/privacy-policy/',
                            rel: 'noopener noreferrer',
                            target: '_blank',
                            children: 'Read our privacy policy',
                          },
                          _owner: null,
                          _store: {},
                        },
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
                              children: 'Note',
                            },
                            _owner: null,
                            _store: {},
                          },
                          ': At this time, we can only send text messages to U.S. mobile phone numbers.',
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
            _owner: null,
            _store: {},
          },
        },
        'view:noMobilePhoneAlert': {
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
                type: 'div',
                key: null,
                ref: null,
                props: {
                  children: [
                    {
                      type: 'p',
                      key: null,
                      ref: null,
                      props: {
                        className: 'vads-u-margin-y--0',
                        children:
                          'We can’t send you text message notifications because we don’t have a mobile phone number on file for you',
                      },
                      _owner: null,
                      _store: {},
                    },
                    {
                      key: null,
                      ref: null,
                      props: {
                        'aria-label': 'Go back and add a mobile phone number',
                        to: {
                          pathname: 'phone-email',
                          search: '?re',
                        },
                        children: {
                          type: 'va-button',
                          key: null,
                          ref: null,
                          props: {
                            uswds: true,
                            secondary: true,
                            text: 'Go back and add a mobile phone number',
                          },
                          _owner: null,
                          _store: {},
                        },
                        onlyActiveOnIndex: false,
                        style: {},
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
          'ui:options': {},
        },
        notificationMethod: {
          'ui:title': 'Choose how you want to get notifications?',
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              yes: 'Yes, send me text message notifications',
              no: 'No, just send me email notifications',
            },
          },
          'ui:validations': [null],
        },
      },
      schema: {
        type: 'object',
        required: ['contactMethod'],
        properties: {
          contactMethod: {
            type: 'string',
            enum: ['Email', 'Mobile Phone', 'Mail'],
          },
          'view:subHeadings': {
            type: 'object',
            properties: {},
          },
          'view:noMobilePhoneAlert': {
            type: 'object',
            properties: {},
            'ui:hidden': true,
          },
          notificationMethod: {
            type: 'string',
            enum: ['yes', 'no'],
          },
        },
      },
      editMode: false,
    },
    directDeposit: {
      uiSchema: {
        'view:directDeposit': {
          'ui:title': {
            type: 'h4',
            key: null,
            ref: null,
            props: {
              className: 'vads-u-font-size--h5 vads-u-margin-top--0',
              children: 'Direct deposit information',
            },
            _owner: null,
            _store: {},
          },
          'ui:options': {
            editTitle: 'Direct deposit information',
            hideLabelText: true,
            itemName: 'account information',
            itemNameAction: 'Update',
            reviewTitle: 'Direct deposit information',
            showFieldLabel: false,
            startInEdit: true,
            volatileData: true,
          },
          'ui:description': {
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
                ' We make payments only through direct deposit, also called electronic funds transfer (EFT).',
              ],
            },
            _owner: null,
            _store: {},
          },
          bankAccount: {
            'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
            accountType: {
              'ui:title': 'Account type',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  checking: 'Checking',
                  savings: 'Savings',
                },
              },
            },
            accountNumber: {
              'ui:title': 'Bank account number',
              'ui:errorMessages': {
                pattern: 'Please enter a valid 5-17 digit bank account number',
              },
            },
            routingNumber: {
              'ui:title': 'Bank routing number',
              'ui:validations': [null],
              'ui:errorMessages': {
                pattern: 'Please enter a valid 9-digit routing number',
              },
            },
          },
        },
        'view:learnMore': {
          'ui:description': {
            type: 'va-additional-info',
            key: 'learn-more-btn',
            ref: null,
            props: {
              trigger: 'Where can I find these numbers?',
              children: [
                {
                  type: 'img',
                  key: 'check-image-src',
                  ref: null,
                  props: {
                    style: {
                      marginTop: '0.625rem',
                    },
                    src:
                      'https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com/img/check-sample.png',
                    alt:
                      'Example of a check showing where the account and routing numbers are',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'br',
                  key: null,
                  ref: null,
                  props: {},
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'br',
                  key: null,
                  ref: null,
                  props: {},
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: 'learn-more-description',
                  ref: null,
                  props: {
                    children:
                      'The bank routing number is the first 9 digits on the bottom left corner of a printed check. Your account number is the second set of numbers on the bottom of a printed check, just to the right of the bank routing number.',
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'br',
                  key: null,
                  ref: null,
                  props: {},
                  _owner: null,
                  _store: {},
                },
                {
                  type: 'p',
                  key: 'learn-more-additional',
                  ref: null,
                  props: {
                    children:
                      'If you don’t have a printed check, you can sign in to your online banking institution for this information',
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
          'view:directDeposit': {
            type: 'object',
            properties: {
              bankAccount: {
                type: 'object',
                required: ['accountType', 'accountNumber', 'routingNumber'],
                properties: {
                  accountNumber: {
                    type: 'string',
                    pattern: '^[*a-zA-Z0-9]{5,17}$',
                  },
                  accountType: {
                    type: 'string',
                    enum: ['Checking', 'Savings'],
                  },
                  routingNumber: {
                    type: 'string',
                    pattern: '^[\\d*]{5}\\d{4}$',
                  },
                },
              },
            },
          },
          'view:learnMore': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
  },
  initialData: {
    fullName: {},
    'view:subHeading': {},
    'view:fry': {},
    'view:dea': {},
    'view:benefitInfo': {},
    'view:subHeadings': {},
    'view:personalInformation': {},
    'view:EmailAndphoneNumbers': {},
    mobilePhone: {},
    homePhone: {},
    'view:confirmDuplicateData': {},
    mailingAddressInput: {
      livesOnMilitaryBaseInfo: {},
      address: {
        country: 'USA',
      },
    },
    'view:noMobilePhoneAlert': {},
    'view:directDeposit': {
      bankAccount: {},
    },
    'view:learnMore': {},
  },
  savedStatus: 'not-attempted',
  autoSavedStatus: 'success',
  loadedStatus: 'not-attempted',
  version: 0,
  lastSavedDate: 1729862456569,
  expirationDate: 1735046457,
  prefillStatus: 'not-attempted',
  isStartingOver: false,
  inProgressFormId: '',
};
