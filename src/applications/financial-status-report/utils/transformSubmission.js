import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

export const transformForSubmission = formData => {
  return {
    personalIdentification: {
      ssn: formData.personalIdentification?.ssn,
      fileNumber: formData.personalIdentification?.vaFileNumber,
    },
    personalData: {
      veteranFullName: {
        ...formData.personalData?.fullName,
      },
      address: {
        addresslineOne: formData.mailingAddress?.addressLine1,
        addresslineTwo: formData.mailingAddress?.addressLine2,
        addresslineThree: formData.mailingAddress?.addressLine3,
        city: formData.mailingAddress?.city,
        stateOrProvince: formData.mailingAddress?.state
          ? formData.mailingAddress.state
          : formData.mailingAddress.province,
        zipOrPostalCode: formData.mailingAddress?.zipCode
          ? formData.mailingAddress.zipCode
          : formData.mailingAddress?.internationalPostalCode,
        countryName: formData.mailingAddress.countryName,
      },
      telephoneNumber: formData.contactInfo?.phoneNumber,
      emailAddress: formData.contactInfo?.primaryEmail,
      dateOfBirth: formData.personalData?.dateOfBirth,
      married: formData.spouseInformation?.maritalStatus === 'Married',
      // needs schema update on form
      spouseFullName: {
        first: 'Lisa',
        middle: 'A',
        last: 'Anderson',
      },
      agesOfOtherDependents: formData.dependentRecords?.map(
        record => record.dependentAge,
      ),
      employmentHistory: [
        {
          veteranOrSpouse: 'VETERAN',
          // needs to be added to form
          occupationName: '',
          from: '06/2019',
          to: '',
          present: true,
          employerName: 'Faker Metal Fabrications Inc.',
          employerAddress: {
            addresslineOne: '321 Notreal Avenue',
            addresslineTwo: '',
            addresslineThree: '',
            city: 'Fakerville',
            stateOrProvince: 'CO',
            zipOrPostalCode: '11111',
            countryName: 'USA',
          },
        },
        {
          veteranOrSpouse: 'SPOUSE',
          occupationName: 'welder',
          from: '06/2017',
          to: '',
          present: true,
          employerName: 'Faker Metal Fabrications Inc.',
          employerAddress: {
            addresslineOne: '321 Notreal Avenue',
            addresslineTwo: '',
            addresslineThree: '',
            city: 'Fakerville',
            stateOrProvince: 'CO',
            zipORPostalCode: '11111',
            countryName: 'USA',
          },
        },
      ],
    },
    income: [
      {
        veteranOrSpouse: 'VETERAN',
        monthlyGrossSalary: '450000',
        deductions: {
          taxes: '67500',
          retirement: '67500',
          socialSecurity: '67500',
          otherDeductions: {
            name: 'health savings account',
            amount: '67500',
          },
        },
        totalDeductions: '252500',
        netTakeHomePay: '197500',
        otherIncome: {
          name: 'VA Disability Compensation',
          amount: '150000',
        },
        totalMonthlyNetIncome: '347500',
      },
      {
        veteranOrSpouse: 'SPOUSE',
        monthlyGrossSalary: '450000',
        deductions: {
          taxes: '67500',
          retirement: '67500',
          socialSecurity: '67500',
          otherDeductions: {
            name: 'health savings account',
            amount: '67500',
          },
        },
        totalDeductions: '252500',
        netTakeHomePay: '197500',
        otherIncome: {
          name: 'VA Disability Compensation',
          amount: '150000',
        },
        totalMonthlyNetIncome: '347500',
      },
    ],
    expenses: {
      rentOrMortgage: '100000',
      food: '60000',
      utilities: '30000',
      otherLivingExpenses: {
        name: 'charity donations',
        amount: '150000',
      },
      expensesInstallmentContractsAndOtherDebts: '50000',
      totalMonthlyExpenses: '240000',
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: '107500',
      amountCanBePaidTowardDebt: '107500',
    },
    assets: {
      cashInBank: '123 Letter NOT sent',
      cashOnHand: 'Project write-off',
      automobiles: [
        {
          make: 'Pontiac',
          model: 'Grand AM',
          year: '1999',
          resaleValue: '200000',
        },
      ],
      trailersBoatsCampers: '400',
      usSavingsBonds: '',
      stocksAndOtherBonds: '10000000',
      realEstateOwned: '25000000',
      otherAssets: [
        {
          name: 'gold',
          amount: '150000',
        },
      ],
      totalAssets: '39000000',
    },
    installmentContractsAndOtherDebts: [
      {
        creditorName: 'Faker Bank',
        creditorAddress: {
          addresslineOne: '555 Bogus Street',
          addresslineTwo: '',
          addresslineThree: '',
          city: 'Fakerville',
          stateOrProvince: 'CO',
          zipOrPostalCode: '11111',
          countryName: 'USA',
        },
        dateStarted: '06/28/2020',
        purpose: 'debt consolidation loan',
        originalAmount: '1500000',
        unpaidBalance: '100000',
        amountDueMonthly: '50000',
        amountPastDue: '0',
      },
    ],
    totalOfInstallmentContractsAndOtherDebts: {
      originalAmount: '4500000',
      unpaidBalance: '300000',
      amountDueMonthly: '80000',
      amountPastDue: '0',
    },
    additionalData: {
      bankruptcy: {
        hasBeenAdjudicatedBankrupt: false,
        dateDischarged: '',
        courtLocation: '',
        docketNumber: '',
      },
      additionalComments: 'No comments',
    },
  };
};

export const submit = _form => {
  const payload = {};

  const options = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const onSuccess = resp => {
    // analytics stuff here
    return Promise.resolve(resp);
  };

  const onFailure = error =>
    new Promise(reject => {
      recordEvent({});
      return reject(error);
    });

  return apiRequest('submissionAPI', options)
    .then(onSuccess)
    .catch(onFailure);
};

// eslint-disable-next-line no-unused-vars
const data = {
  submission: {
    status: false,
    errorMessage: false,
    id: false,
    timestamp: false,
    hasAttemptedSubmit: false,
  },
  formId: '5655',
  loadedData: {
    formData: {
      veteranInfo: {},
      personalData: {
        fullName: {
          first: 'Mark',
          last: 'Webb',
          middle: 'R',
          suffix: 'Jr.',
        },
        dateOfBirth: '1950-10-04',
        phone: '4445551212',
        email: 'test2@test1.net',
      },
      personalIdentification: {
        ssn: '4437',
        vaFileNumber: '5678',
        fileNumber: '4437',
      },
      fsrDebts: [],
      debt: {
        currentAr: 0,
        debtHistory: [
          {
            date: '',
          },
        ],
        deductionCode: '',
        originalAr: 0,
      },
      mailingAddress: {
        livesOnMilitaryBaseInfo: {},
        country: 'United States',
        addressLine1: '1493 Martin Luther King Rd',
        addressLine2: 'Apt 1',
        city: 'Fulton',
        state: 'FL',
        zipCode: '97062',
        addressLine3: null,
        addressPou: 'CORRESPONDENCE',
        addressType: 'DOMESTIC',
        countryName: 'United States',
        countryCodeFips: 'US',
        countryCodeIso2: 'US',
        countryCodeIso3: 'USA',
        createdAt: '2018-04-21T20:09:50Z',
        effectiveEndDate: '2018-04-21T20:09:50Z',
        effectiveStartDate: '2018-04-21T20:09:50Z',
        id: 123,
        internationalPostalCode: '54321',
        province: 'string',
        sourceDate: '2018-04-21T20:09:50Z',
        stateCode: 'NY',
        updatedAt: '2018-04-21T20:09:50Z',
        zipCodeSuffix: '1234',
      },
      contactInfo: {
        phoneNumber: '5035551234',
        primaryEmail: 'veteran@gmail.com',
        confirmationEmail: 'veteran@gmail.com',
      },
      employment: {
        currentEmployment: {},
        spouse: {
          currentEmployment: {},
        },
      },
      vaBenefitsOnFile: {},
      benefits: {
        spouseBenefits: {},
      },
      socialSecurity: {
        spouse: {},
      },
      additionalIncome: {
        spouse: {},
      },
      spouseInformation: {},
      dependents: {},
      householdAssets: {},
      'view:vehicleInfo': {},
      'view:recVehicleInfo': {},
      'view:assetInfo': {},
      expenses: {},
      'view:financialHardshipExplanation': {},
      'view:resolutionOptionsInfo': {},
      bankruptcyHistory: {},
      income: [
        {
          veteranOrSpouse: 'VETERAN',
          compensationAndPension: '3261.1',
        },
      ],
    },
    metadata: {
      version: 0,
      prefill: true,
      returnUrl: '/veteran-information',
    },
  },
  reviewPageView: {
    openChapters: [],
    viewedPages: {},
  },
  trackingPrefix: 'fsr-5655-',
  data: {
    bankruptcyHistory: {
      bankruptcyDischargeDate: '2004-01-XX',
      courtLocation: 'Foo, Florida',
      docketNumber: '1234CPDocketFoo',
      hasBeenAdjudicated: true,
    },
    'view:financialHardshipExplanation': {},
    'view:resolutionOptionsInfo': {},
    resolutionComments: 'Foo waiver reason',
    otherExpenses: [
      {
        expenseType: 'Public transportation',
        expenseAmount: 50,
      },
    ],
    'view:assetInfo': {},
    hasOtherExpenses: true,
    repayments: [
      {
        debtType: 'Attorney costs',
        creditorName: 'Foo Attorney',
        originalDebtAmount: 12234,
        unpaidBalance: 100,
        monthlyPaymentAmount: 50,
        debtDate: '2019-01-XX',
        amountOverdue: 0,
      },
    ],
    hasRepayments: true,
    utilityRecords: [
      {
        utilityType: 'Electric',
        monthlyUtilityAmount: 123,
      },
    ],
    hasUtilities: true,
    expenses: {
      housingExpense: 1234,
      foodExpense: 234,
    },
    otherAssetRecords: [
      {
        otherAssetType: 'Artwork (based on appraised value)',
        otherAssetAmount: 123,
      },
    ],
    hasOtherAssets: true,
    recreationalVehicleRecords: [
      {
        recreationalVehicleType: 'Trawler',
        recreationalVehicleAmount: 1234,
      },
    ],
    'view:recVehicleInfo': {},
    hasRecreationalVehicle: true,
    vehicleRecords: [
      {
        vehicleType: 'Car',
        vehicleMake: 'Ford',
        vehicleModel: 'Mustang',
        vehicleYear: '2012',
        vehicleAmount: 5000,
      },
    ],
    'view:vehicleInfo': {},
    hasVehicle: true,
    realEstateRecords: [
      {
        realEstateType: 'Foo real estate',
        realEstateAmount: 123456,
      },
    ],
    hasRealEstate: true,
    householdAssets: {
      checkingAndSavings: 123,
      availableAssets: 123,
      savingsBonds: 123,
      stocksAndOtherBonds: 123,
    },
    dependentRecords: [
      {
        dependentAge: '12',
      },
    ],
    dependents: {
      hasDependents: true,
    },
    spouseInformation: {
      maritalStatus: 'Single',
    },
    additionalIncome: {
      additionalIncomeRecords: [
        {
          incomeType: 'Foo other income',
          monthlyAmount: 123,
        },
      ],
      hasAdditionalIncome: true,
      spouse: {},
    },
    socialSecurity: {
      socialSecurityAmount: 123,
      hasSocialSecurityPayments: true,
      spouse: {},
    },
    employment: {
      previouslyEmployed: false,
      previousEmploymentRecords: [
        {
          previousEmploymentType: 'Full time',
        },
      ],
      currentEmployment: {
        employmentType: 'Full time',
        employmentStart: '1995-01-01',
        employerName: 'Foo',
        grossMonthlyIncome: 1234,
        payrollDeductions: [
          {
            deductionType: 'Foo',
            deductionAmount: 123,
          },
        ],
      },
      isEmployed: true,
      spouse: {
        currentEmployment: {},
      },
    },
    veteranInfo: {},
    personalData: {
      fullName: {
        first: 'Mark',
        last: 'Webb',
        middle: 'R',
        suffix: 'Jr.',
      },
      dateOfBirth: '1950-10-04',
      phone: '4445551212',
      email: 'test2@test1.net',
    },
    personalIdentification: {
      ssn: '4437',
      vaFileNumber: '5678',
      fileNumber: '4437',
    },
    fsrDebts: [
      {
        financialOverview: {},
        debtRepaymentOptions: {},
        resolution: {
          resolutionType: 'Waiver',
          eduWaiver: true,
        },
        fileNumber: '796121200',
        payeeNumber: '00',
        personEntitled: 'AJHONS',
        deductionCode: '30',
        benefitType: 'Comp & Pen',
        diaryCode: '080',
        diaryCodeDescription: 'Referred to the Department of the Treasury',
        amountOverpaid: 0,
        amountWithheld: 0,
        originalAr: 136.24,
        currentAr: 100,
        debtHistory: [
          {
            date: '02/25/2009',
            letterCode: '914',
            description:
              'Paid In Full - Account balance cleared via offset, not including TOP.',
          },
          {
            date: '02/07/2009',
            letterCode: '905',
            description: 'Administrative Write Off',
          },
          {
            date: '12/03/2008',
            letterCode: '487',
            description: 'Death Case Pending Action',
          },
        ],
        id: 0,
      },
      {
        financialOverview: {},
        debtRepaymentOptions: {},
        resolution: {
          resolutionType: 'Waiver',
          eduWaiver: true,
        },
        fileNumber: '796121200',
        payeeNumber: '00',
        personEntitled: 'STUB_M',
        deductionCode: '44',
        benefitType: 'CH35 EDU',
        diaryCode: '100',
        diaryCodeDescription: 'Pending payment',
        amountOverpaid: 26000,
        amountWithheld: 0,
        originalAr: 100,
        currentAr: 80,
        debtHistory: [
          {
            date: '12/19/2014',
            letterCode: '681',
            description:
              'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
          },
          {
            date: '04/11/2013',
            letterCode: '080',
            description: 'Debt referred to Treasury for Cross servicing',
          },
          {
            date: '12/11/2012',
            letterCode: '510',
            description:
              'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
          },
          {
            date: '10/17/2012',
            letterCode: '212',
            description: 'Bad Address - Locator Request Sent',
          },
          {
            date: '09/28/2012',
            letterCode: '117',
            description: 'Second Demand Letter',
          },
          {
            date: '09/18/2012',
            letterCode: '100',
            description:
              'First Demand Letter - Inactive Benefits - Due Process',
          },
        ],
        id: 1,
      },
    ],
    debt: {
      currentAr: 0,
      debtHistory: [
        {
          date: '',
        },
      ],
      deductionCode: '',
      originalAr: 0,
    },
    mailingAddress: {
      livesOnMilitaryBaseInfo: {},
      country: 'United States',
      addressLine1: '1493 Martin Luther King Rd',
      addressLine2: 'Apt 1',
      city: 'Fulton',
      state: 'FL',
      zipCode: '97062',
      addressLine3: null,
      addressPou: 'CORRESPONDENCE',
      addressType: 'DOMESTIC',
      countryName: 'United States',
      countryCodeFips: 'US',
      countryCodeIso2: 'US',
      countryCodeIso3: 'USA',
      createdAt: '2018-04-21T20:09:50Z',
      effectiveEndDate: '2018-04-21T20:09:50Z',
      effectiveStartDate: '2018-04-21T20:09:50Z',
      id: 123,
      internationalPostalCode: '54321',
      province: 'string',
      sourceDate: '2018-04-21T20:09:50Z',
      stateCode: 'NY',
      updatedAt: '2018-04-21T20:09:50Z',
      zipCodeSuffix: '1234',
    },
    contactInfo: {
      phoneNumber: '5035551234',
      primaryEmail: 'veteran@gmail.com',
      confirmationEmail: 'veteran@gmail.com',
    },
    vaBenefitsOnFile: {},
    benefits: {
      spouseBenefits: {},
    },
    income: [
      {
        veteranOrSpouse: 'VETERAN',
        compensationAndPension: '3261.1',
      },
    ],
  },
  pages: {
    veteranInfo: {
      uiSchema: {
        veteranInfo: {},
      },
      schema: {
        type: 'object',
        properties: {
          veteranInfo: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string',
              },
              ssnLastFour: {
                type: 'number',
              },
              dob: {
                type: 'string',
              },
              vaFileNumber: {
                type: 'number',
              },
            },
          },
        },
      },
      editMode: false,
    },
    availableDebts: {
      uiSchema: {
        'ui:title': 'Available Debts',
        'ui:description': '',
        fsrDebts: {
          'ui:title': ' ',
        },
      },
      schema: {
        type: 'object',
        properties: {
          fsrDebts: {
            type: 'array',
            title: ' ',
            minItems: 0,
            items: [
              {
                type: 'object',
                properties: {},
              },
              {
                type: 'object',
                properties: {},
              },
            ],
            additionalItems: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
      editMode: false,
    },
    contactInfo: {
      uiSchema: {
        'ui:title': 'Contact information',
        'ui:description': {
          type: 'p',
          key: null,
          ref: null,
          props: {
            children:
              'This is the contact information we have on file for you. We’ll send any information about your debt to this mailing address. Please review and make any needed edits. You can also add or change your phone number or email address.',
          },
          _owner: null,
          _store: {},
        },
        'ui:options': {
          classNames: 'contact-info',
        },
        mailingAddress: {
          'ui:subtitle': {
            key: null,
            ref: null,
            props: {
              children: [
                {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    children:
                      'Any updates you make here will only change your mailing address for this request.',
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
                      'If you want to change your address for other VA benefits and services,',
                      ' ',
                      {
                        type: 'a',
                        key: null,
                        ref: null,
                        props: {
                          href: 'https://va.gov/profile',
                          children: 'go to your VA.gov profile',
                        },
                        _owner: null,
                        _store: {},
                      },
                      '. Or',
                      ' ',
                      {
                        type: 'a',
                        key: null,
                        ref: null,
                        props: {
                          href:
                            'https://www.va.gov/resources/change-your-address-on-file-with-va/',
                          children:
                            'find out how to change your address on file with VA',
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
          'ui:options': {
            editTitle: 'Edit mailing address',
            startInEdit: false,
          },
          livesOutsideUS: {
            'ui:title': 'I live on a U.S. military base outside of the U.S.',
            'ui:options': {
              widgetClassNames: 'checkbox-group',
            },
          },
          livesOnMilitaryBaseInfo: {},
          country: {
            'ui:title': 'Country',
            'ui:options': {
              classNames: 'input-size-7',
            },
            'ui:disabled': false,
          },
          addressLine1: {
            'ui:title': 'Street address',
            'ui:errorMessages': {
              required: 'Please enter a street address',
            },
            'ui:options': {
              classNames: 'input-size-7',
            },
          },
          addressLine2: {
            'ui:title': 'Line 2',
            'ui:options': {
              classNames: 'input-size-7',
            },
          },
          city: {
            'ui:errorMessages': {
              pattern: 'Please enter a valid city',
              required: 'Please enter a city',
            },
            'ui:options': {
              classNames: 'input-size-7',
            },
            'ui:validations': [
              {
                options: {
                  addressPath: 'mailingAddress',
                },
              },
            ],
          },
          state: {
            'ui:title': 'State',
            'ui:options': {
              classNames: 'input-size-7',
            },
            'ui:validations': [
              {
                options: {
                  addressPath: 'mailingAddress',
                },
              },
            ],
            'ui:errorMessages': {
              pattern: 'Please enter a valid state',
              required: 'Please enter a state',
            },
          },
          zipCode: {
            'ui:title': 'Zip code',
            'ui:validations': [null],
            'ui:errorMessages': {
              required: 'Please enter a postal code',
              pattern:
                'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
            },
            'ui:options': {
              classNames: 'input-size-2',
            },
          },
        },
        contactInfo: {
          phoneNumber: {
            'ui:title': 'Phone number',
            'ui:errorMessages': {
              pattern:
                'Please enter a 10-digit phone number (with or without dashes)',
              minLength:
                'Please enter a 10-digit phone number (with or without dashes)',
              required: 'Please enter a phone number',
            },
            'ui:options': {
              classNames: 'input-size-7',
            },
          },
          primaryEmail: {
            'ui:title': 'Email address',
            'ui:errorMessages': {
              pattern:
                'Please enter an email address using this format: X@X.com',
              required: 'Please enter an email address',
            },
            'ui:options': {
              classNames: 'input-size-7',
            },
          },
          confirmationEmail: {
            'ui:title': 'Re-enter email address',
            'ui:errorMessages': {
              pattern:
                'Please enter an email address using this format: X@X.com',
              required: 'Please enter an email address',
            },
            'ui:options': {
              classNames: 'input-size-7',
              hideOnReview: true,
            },
            'ui:description': {
              type: 'p',
              key: null,
              ref: null,
              props: {
                className: 'formfield-subtitle',
                children:
                  'To receive a confirmation email when you submit your request, you must re-enter your email address.',
              },
              _owner: null,
              _store: {},
            },
            'ui:validations': [{}],
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          mailingAddress: {
            type: 'object',
            required: ['country', 'addressLine1', 'city', 'state', 'zipCode'],
            properties: {
              livesOutsideUS: {
                type: 'boolean',
              },
              livesOnMilitaryBaseInfo: {
                type: 'object',
                properties: {},
              },
              country: {
                type: 'string',
                enum: [
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
              addressLine1: {
                type: 'string',
                maxLength: 50,
                pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
              },
              addressLine2: {
                type: 'string',
                maxLength: 50,
                pattern: "^([-a-zA-Z0-9'.,&#]([-a-zA-Z0-9'.,&# ])?)+$",
              },
              city: {
                title: 'City',
                type: 'string',
                maxLength: 30,
                pattern: "^([-a-zA-Z0-9'.#]([-a-zA-Z0-9'.# ])?)+$",
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
                  'PI',
                  'PR',
                  'RI',
                  'SC',
                  'SD',
                  'TN',
                  'TX',
                  'UM',
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
                  'Philippine Islands',
                  'Puerto Rico',
                  'Rhode Island',
                  'South Carolina',
                  'South Dakota',
                  'Tennessee',
                  'Texas',
                  'U.S. Minor Outlying Islands',
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
              zipCode: {
                type: 'string',
                pattern: '^\\d{5}(?:([-\\s]?)\\d{4})?$',
              },
            },
          },
          contactInfo: {
            type: 'object',
            properties: {
              phoneNumber: {
                type: 'string',
                pattern: '^\\d{10}$',
              },
              primaryEmail: {
                type: 'string',
                minLength: 6,
                maxLength: 80,
                pattern:
                  '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
              },
              confirmationEmail: {
                type: 'string',
                minLength: 6,
                maxLength: 80,
                pattern:
                  '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
              },
            },
          },
        },
      },
      editMode: false,
    },
    employment: {
      uiSchema: {
        'ui:title': 'Your work history',
        employment: {
          isEmployed: {
            'ui:title': 'Do you currently have a job?',
            'ui:widget': 'yesNo',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          employment: {
            type: 'object',
            properties: {
              isEmployed: {
                type: 'boolean',
              },
            },
            required: ['isEmployed'],
          },
        },
      },
      editMode: false,
    },
    employmentRecords: {
      uiSchema: {
        'ui:title': 'Your work history',
        employment: {
          'ui:options': {
            classNames: 'current-employment-container',
          },
          currentEmployment: {
            'ui:description': 'Tell us about your current job.',
            employmentType: {
              'ui:title': 'Type of work',
              'ui:options': {
                classNames: 'vads-u-margin-top--3',
                widgetClassNames: 'input-size-3',
              },
            },
            employmentStart: {
              'ui:title': 'Date you started work at this job',
              'ui:widget': 'date',
              'ui:options': {
                widgetClassNames: 'vads-u-margin-top--3',
              },
            },
            employerName: {
              'ui:title': 'Employer name',
              'ui:options': {
                widgetClassNames: 'input-size-6',
              },
            },
            grossMonthlyIncome: {
              'ui:title': 'Gross monthly income',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-1 vads-u-margin-bottom--3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
              'ui:description': {
                type: 'p',
                key: null,
                ref: null,
                props: {
                  className: 'formfield-subtitle',
                  children:
                    'You’ll find this in your paycheck. It’s the amount of your pay before taxes and deductions.',
                },
                _owner: null,
                _store: {
                  validated: true,
                },
              },
            },
            payrollDeductions: {
              'ui:title': 'Payroll deductions',
              'ui:description':
                'You’ll find your payroll deductions in a recent paycheck. Deductions include money withheld from your pay for things like taxes and benefits.',
              'ui:options': {
                viewType: 'table',
                doNotScroll: true,
                showSave: true,
                itemName: 'payroll deduction',
              },
              items: {
                'ui:options': {
                  classNames: 'horizonal-field-container no-wrap',
                },
                deductionType: {
                  'ui:title': 'Type of payroll deduction',
                  'ui:options': {},
                },
                deductionAmount: {
                  'ui:title': 'Deduction amount',
                  'ui:options': {
                    classNames: 'schemaform-currency-input',
                    widgetClassNames: 'input-size-1',
                  },
                  'ui:errorMessages': {
                    pattern: 'Please enter a valid dollar amount',
                    required: 'Please enter an amount',
                  },
                },
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          employment: {
            type: 'object',
            properties: {
              currentEmployment: {
                type: 'object',
                required: [
                  'employmentType',
                  'employmentStart',
                  'grossMonthlyIncome',
                ],
                properties: {
                  employmentType: {
                    type: 'string',
                    enum: ['Full time', 'Part time', 'Seasonal', 'Temporary'],
                  },
                  employmentStart: {
                    type: 'string',
                  },
                  employerName: {
                    type: 'string',
                  },
                  grossMonthlyIncome: {
                    type: 'number',
                  },
                  payrollDeductions: {
                    type: 'array',
                    items: [
                      {
                        type: 'object',
                        required: ['deductionType', 'deductionAmount'],
                        properties: {
                          deductionType: {
                            type: 'string',
                          },
                          deductionAmount: {
                            type: 'number',
                          },
                        },
                      },
                    ],
                    additionalItems: {
                      type: 'object',
                      required: ['deductionType', 'deductionAmount'],
                      properties: {
                        deductionType: {
                          type: 'string',
                        },
                        deductionAmount: {
                          type: 'number',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    previousEmployment: {
      uiSchema: {
        'ui:title': 'Your work history',
        employment: {
          previouslyEmployed: {
            'ui:title': 'Have you had any other jobs in the past 2 years?',
            'ui:widget': 'yesNo',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          employment: {
            type: 'object',
            properties: {
              previouslyEmployed: {
                type: 'boolean',
              },
            },
            required: ['previouslyEmployed'],
          },
        },
      },
      editMode: false,
    },
    previousEmploymentRecords: {
      uiSchema: {
        'ui:title': 'Your work history',
        employment: {
          'ui:options': {
            classNames: 'vads-u-margin-top--2',
          },
          previousEmploymentRecords: {
            'ui:description':
              'Tell us about your other jobs in the past 2 years.',
            'ui:options': {
              doNotScroll: true,
              showSave: true,
              itemName: 'a job',
            },
            items: {
              'ui:options': {
                classNames: 'vads-u-margin-top--3 vads-u-margin-bottom--3',
              },
              previousEmploymentType: {
                'ui:title': 'Type of work',
                'ui:options': {
                  widgetClassNames: 'input-size-3',
                },
              },
              previousEmploymentStart: {
                'ui:title': 'Date you started work at this job',
                'ui:widget': 'date',
                'ui:options': {
                  widgetClassNames: 'vads-u-margin-bottom--2',
                },
              },
              previousEmploymentEnd: {
                'ui:title': 'Date you stopped work at this job',
                'ui:widget': 'date',
                'ui:options': {
                  widgetClassNames: 'vads-u-margin-bottom--2',
                },
              },
              previousEmployerName: {
                'ui:title': 'Employer name',
                'ui:options': {
                  classNames: 'vads-u-margin-top--3',
                  widgetClassNames: 'input-size-6',
                },
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          employment: {
            type: 'object',
            properties: {
              previousEmploymentRecords: {
                type: 'array',
                items: [
                  {
                    type: 'object',
                    required: [
                      'previousEmploymentType',
                      'previousEmploymentStart',
                      'previousEmploymentEnd',
                    ],
                    properties: {
                      previousEmploymentType: {
                        type: 'string',
                        enum: [
                          'Full time',
                          'Part time',
                          'Seasonal',
                          'Temporary',
                        ],
                      },
                      previousEmploymentStart: {
                        type: 'string',
                      },
                      previousEmploymentEnd: {
                        type: 'string',
                      },
                      previousEmployerName: {
                        type: 'string',
                      },
                    },
                  },
                ],
                additionalItems: {
                  type: 'object',
                  required: [
                    'previousEmploymentType',
                    'previousEmploymentStart',
                    'previousEmploymentEnd',
                  ],
                  properties: {
                    previousEmploymentType: {
                      type: 'string',
                      enum: ['Full time', 'Part time', 'Seasonal', 'Temporary'],
                    },
                    previousEmploymentStart: {
                      type: 'string',
                    },
                    previousEmploymentEnd: {
                      type: 'string',
                    },
                    previousEmployerName: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    benefits: {
      uiSchema: {
        'ui:title': 'Your VA benefits',
        'ui:description':
          'This is the VA benefit information we have on file for you.',
        vaBenefitsOnFile: {},
      },
      schema: {
        type: 'object',
        properties: {
          vaBenefitsOnFile: {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
    socialSecurity: {
      uiSchema: {
        'ui:title': 'Your other income',
        socialSecurity: {
          hasSocialSecurityPayments: {
            'ui:title': 'Do you get Social Security payments?',
            'ui:widget': 'yesNo',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          socialSecurity: {
            type: 'object',
            properties: {
              hasSocialSecurityPayments: {
                type: 'boolean',
              },
            },
            required: ['hasSocialSecurityPayments'],
          },
        },
      },
      editMode: false,
    },
    socialSecurityRecords: {
      uiSchema: {
        'ui:title': 'Your other income',
        socialSecurity: {
          socialSecurityAmount: {
            'ui:title': 'How much do you get for Social Security each month?',
            'ui:options': {
              classNames: 'schemaform-currency-input',
              widgetClassNames: 'input-size-3',
            },
            'ui:errorMessages': {
              pattern: 'Please enter a valid dollar amount',
              required: 'Please enter an amount',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          socialSecurity: {
            type: 'object',
            required: ['socialSecurityAmount'],
            properties: {
              socialSecurityAmount: {
                type: 'number',
              },
            },
          },
        },
      },
      editMode: false,
    },
    additionalIncome: {
      uiSchema: {
        'ui:title': 'Your other income',
        additionalIncome: {
          hasAdditionalIncome: {
            'ui:title':
              'Do you get income from any other sources (like a retirement pension or alimony support)?',
            'ui:widget': 'yesNo',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          additionalIncome: {
            type: 'object',
            properties: {
              hasAdditionalIncome: {
                type: 'boolean',
              },
            },
            required: ['hasAdditionalIncome'],
          },
        },
      },
      editMode: false,
    },
    additionalIncomeRecords: {
      uiSchema: {
        'ui:title': 'Your other income',
        additionalIncome: {
          additionalIncomeRecords: {
            'ui:description':
              'Tell us how much you get each month for each type of income.',
            'ui:options': {
              viewType: 'table',
              doNotScroll: true,
              showSave: true,
              itemName: 'income',
            },
            items: {
              'ui:options': {
                classNames: 'horizonal-field-container no-wrap',
              },
              incomeType: {
                'ui:title': 'Type of income',
                'ui:options': {
                  classNames: 'input-size-4',
                },
              },
              monthlyAmount: {
                'ui:title': 'Monthly income amount',
                'ui:options': {
                  classNames: 'schemaform-currency-input',
                  widgetClassNames: 'input-size-2',
                },
                'ui:errorMessages': {
                  pattern: 'Please enter a valid dollar amount',
                  required: 'Please enter an amount',
                },
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          additionalIncome: {
            type: 'object',
            properties: {
              additionalIncomeRecords: {
                type: 'array',
                items: [
                  {
                    type: 'object',
                    required: ['incomeType', 'monthlyAmount'],
                    properties: {
                      incomeType: {
                        type: 'string',
                      },
                      monthlyAmount: {
                        type: 'number',
                      },
                    },
                  },
                ],
                additionalItems: {
                  type: 'object',
                  required: ['incomeType', 'monthlyAmount'],
                  properties: {
                    incomeType: {
                      type: 'string',
                    },
                    monthlyAmount: {
                      type: 'number',
                    },
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    spouseInformation: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        spouseInformation: {
          maritalStatus: {
            'ui:title': 'What is your marital status?',
            'ui:widget': 'radio',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          spouseInformation: {
            type: 'object',
            properties: {
              maritalStatus: {
                type: 'string',
                enum: [
                  'Single',
                  'Married',
                  'Widowed',
                  'Divorced',
                  'Separated',
                  'Registered partnership',
                ],
              },
            },
            required: ['maritalStatus'],
          },
        },
      },
      editMode: false,
    },
    spouseEmployment: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        personalData: {
          spouseFullName: {
            'ui:title': 'What’s your spouse’s name?',
            'ui:options': {
              widgetClassNames: 'input-size-3',
            },
          },
        },
        employment: {
          spouse: {
            isEmployed: {
              'ui:title': 'Does your spouse currently have a job?',
              'ui:widget': 'yesNo',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          personalData: {
            type: 'object',
            properties: {
              spouseFullName: {
                type: 'string',
              },
            },
          },
          employment: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                properties: {
                  isEmployed: {
                    type: 'boolean',
                  },
                },
                required: ['isEmployed'],
              },
            },
          },
        },
      },
      editMode: false,
    },
    spouseEmploymentRecords: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        employment: {
          'ui:options': {
            classNames: 'current-employment-container',
          },
          spouse: {
            currentEmployment: {
              'ui:description': "Tell us about your spouse's current job.",
              employmentType: {
                'ui:title': 'Type of work',
                'ui:options': {
                  classNames: 'vads-u-margin-top--3',
                  widgetClassNames: 'input-size-3',
                },
              },
              employmentStart: {
                'ui:title': 'Date your spouse started work at this job',
                'ui:widget': 'date',
              },
              employerName: {
                'ui:title': 'Employer name',
                'ui:options': {
                  widgetClassNames: 'input-size-6',
                },
              },
              grossMonthlyIncome: {
                'ui:title': 'Gross monthly income',
                'ui:options': {
                  classNames: 'schemaform-currency-input',
                  widgetClassNames: 'input-size-1 vads-u-margin-bottom--3',
                },
                'ui:errorMessages': {
                  pattern: 'Please enter a valid dollar amount',
                  required: 'Please enter an amount',
                },
                'ui:description': {
                  type: 'p',
                  key: null,
                  ref: null,
                  props: {
                    className: 'formfield-subtitle',
                    children:
                      "You’ll find this in your spouse's paycheck. It’s the amount of your pay before taxes and deductions.",
                  },
                  _owner: null,
                  _store: {},
                },
              },
              payrollDeductions: {
                'ui:title': 'Payroll deductions',
                'ui:description':
                  'You’ll find your spouse’s payroll deductions in a recent paycheck. Deductions include money withheld from their pay for things like taxes and benefits.',
                'ui:options': {
                  viewType: 'table',
                  doNotScroll: true,
                  showSave: true,
                  itemName: 'payroll deduction',
                },
                items: {
                  'ui:options': {
                    classNames: 'horizonal-field-container no-wrap',
                  },
                  deductionType: {
                    'ui:title': 'Type of payroll deduction',
                    'ui:options': {},
                  },
                  deductionAmount: {
                    'ui:title': 'Deduction amount',
                    'ui:options': {
                      classNames: 'schemaform-currency-input',
                      widgetClassNames: 'input-size-1',
                    },
                    'ui:errorMessages': {
                      pattern: 'Please enter a valid dollar amount',
                      required: 'Please enter an amount',
                    },
                  },
                },
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          employment: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                properties: {
                  currentEmployment: {
                    type: 'object',
                    required: [
                      'employmentType',
                      'employmentStart',
                      'grossMonthlyIncome',
                    ],
                    properties: {
                      employmentType: {
                        type: 'string',
                        enum: [
                          'Full time',
                          'Part time',
                          'Seasonal',
                          'Temporary',
                        ],
                      },
                      employmentStart: {
                        type: 'string',
                      },
                      employerName: {
                        type: 'string',
                      },
                      grossMonthlyIncome: {
                        type: 'number',
                      },
                      payrollDeductions: {
                        type: 'array',
                        items: [],
                        additionalItems: {
                          type: 'object',
                          required: ['deductionType', 'deductionAmount'],
                          properties: {
                            deductionType: {
                              type: 'string',
                            },
                            deductionAmount: {
                              type: 'number',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    spousePreviousEmployment: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        employment: {
          spouse: {
            previouslyEmployed: {
              'ui:title':
                'Has your spouse had any other jobs in the past 2 years?',
              'ui:widget': 'yesNo',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          employment: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                properties: {
                  previouslyEmployed: {
                    type: 'boolean',
                  },
                },
                required: ['previouslyEmployed'],
              },
            },
          },
        },
      },
      editMode: false,
    },
    spousePreviousEmploymentRecords: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        employment: {
          'ui:options': {
            classNames: 'vads-u-margin-top--2',
          },
          spouse: {
            previousEmploymentRecords: {
              'ui:description':
                'Tell us about your spouse’s other jobs in the past 2 years.',
              'ui:options': {
                doNotScroll: true,
                showSave: true,
                itemName: 'a job',
              },
              items: {
                'ui:options': {
                  classNames: 'vads-u-margin-top--3 vads-u-margin-bottom--3',
                },
                previousEmploymentType: {
                  'ui:title': 'Type of work',
                  'ui:options': {
                    widgetClassNames: 'input-size-3',
                  },
                },
                previousEmploymentStart: {
                  'ui:title': 'Date your spouse started work at this job',
                  'ui:widget': 'date',
                },
                previousEmploymentEnd: {
                  'ui:title': 'Date your spouse stopped work at this job',
                  'ui:widget': 'date',
                },
                previousEmployerName: {
                  'ui:title': 'Employer name',
                  'ui:options': {
                    classNames: 'vads-u-margin-top--3',
                    widgetClassNames: 'input-size-6',
                  },
                },
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          employment: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                properties: {
                  previousEmploymentRecords: {
                    type: 'array',
                    items: [],
                    additionalItems: {
                      type: 'object',
                      required: [
                        'previousEmploymentType',
                        'previousEmploymentStart',
                        'previousEmploymentEnd',
                      ],
                      properties: {
                        previousEmploymentType: {
                          type: 'string',
                          enum: [
                            'Full time',
                            'Part time',
                            'Seasonal',
                            'Temporary',
                          ],
                        },
                        previousEmploymentStart: {
                          type: 'string',
                        },
                        previousEmploymentEnd: {
                          type: 'string',
                        },
                        previousEmployerName: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    spouseBenefits: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        benefits: {
          spouseHasBenefits: {
            'ui:title': 'Does your spouse get VA benefits?',
            'ui:widget': 'yesNo',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          benefits: {
            type: 'object',
            properties: {
              spouseHasBenefits: {
                type: 'boolean',
              },
            },
            required: ['spouseHasBenefits'],
          },
        },
      },
      editMode: false,
    },
    spouseBenefitRecords: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        benefits: {
          spouseBenefits: {
            benefitAmount: {
              'ui:title':
                'How much does your spouse get each month for disability compensation and pension benefits?',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
            educationAmount: {
              'ui:title':
                'How much does your spouse get each month for education benefits?',
              'ui:options': {
                classNames: 'max-width-400',
                widgetClassNames: 'input-size-3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          benefits: {
            type: 'object',
            properties: {
              spouseBenefits: {
                type: 'object',
                required: ['benefitAmount', 'educationAmount'],
                properties: {
                  benefitAmount: {
                    type: 'number',
                  },
                  educationAmount: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    spouseSocialSecurity: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        socialSecurity: {
          spouse: {
            hasSocialSecurityPayments: {
              'ui:title':
                'Does your spouse currently get Social Security payments?',
              'ui:widget': 'yesNo',
              'ui:options': {
                classNames: 'no-wrap',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          socialSecurity: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                properties: {
                  hasSocialSecurityPayments: {
                    type: 'boolean',
                  },
                },
                required: ['hasSocialSecurityPayments'],
              },
            },
          },
        },
      },
      editMode: false,
    },
    spouseSocialSecurityRecords: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        socialSecurity: {
          spouse: {
            'ui:options': {
              classNames: 'no-wrap',
            },
            socialSecurityAmount: {
              'ui:title':
                'How much does your spouse get for Social Security each month?',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          socialSecurity: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                required: ['socialSecurityAmount'],
                properties: {
                  socialSecurityAmount: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    spouseAdditionalIncome: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        additionalIncome: {
          spouse: {
            hasAdditionalIncome: {
              'ui:title':
                'Does your spouse get income from any other sources (like a retirement pension or alimony support)?',
              'ui:widget': 'yesNo',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          additionalIncome: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                properties: {
                  hasAdditionalIncome: {
                    type: 'boolean',
                  },
                },
                required: ['hasAdditionalIncome'],
              },
            },
          },
        },
      },
      editMode: false,
    },
    spouseAdditionalIncomeRecords: {
      uiSchema: {
        'ui:title': 'Your spouse information',
        additionalIncome: {
          spouse: {
            additionalIncomeRecords: {
              'ui:description':
                'Tell us how much you get each month for each type of income.',
              'ui:options': {
                viewType: 'table',
                doNotScroll: true,
                showSave: true,
                itemName: 'income',
              },
              items: {
                'ui:options': {
                  classNames: 'horizonal-field-container no-wrap',
                },
                incomeType: {
                  'ui:title': 'Type of income',
                  'ui:options': {
                    classNames: 'input-size-4',
                  },
                },
                monthlyAmount: {
                  'ui:title': 'Monthly amount',
                  'ui:options': {
                    classNames: 'schemaform-currency-input',
                    widgetClassNames: 'input-size-2',
                  },
                  'ui:errorMessages': {
                    pattern: 'Please enter a valid dollar amount',
                    required: 'Please enter an amount',
                  },
                },
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          additionalIncome: {
            type: 'object',
            properties: {
              spouse: {
                type: 'object',
                properties: {
                  additionalIncomeRecords: {
                    type: 'array',
                    items: [],
                    additionalItems: {
                      type: 'object',
                      required: ['incomeType', 'monthlyAmount'],
                      properties: {
                        incomeType: {
                          type: 'string',
                        },
                        monthlyAmount: {
                          type: 'number',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    dependents: {
      uiSchema: {
        'ui:title': 'Your dependents',
        dependents: {
          hasDependents: {
            'ui:title':
              'Do you have any dependents who rely on you for financial support?',
            'ui:widget': 'yesNo',
            'ui:options': {
              classNames: 'no-wrap',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          dependents: {
            type: 'object',
            properties: {
              hasDependents: {
                type: 'boolean',
              },
            },
            required: ['hasDependents'],
          },
        },
      },
      editMode: false,
    },
    dependentRecords: {
      uiSchema: {
        'ui:title': 'Your dependents',
        dependentRecords: {
          'ui:description': 'Enter each dependent’s age separately below.',
          'ui:options': {
            doNotScroll: true,
            showSave: true,
            itemName: 'a dependent',
          },
          items: {
            dependentAge: {
              'ui:title': 'Dependent’s age',
              'ui:options': {
                classNames: 'vads-u-margin-bottom--3 vads-u-margin-top--3',
                widgetClassNames: 'input-size-3',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          dependentRecords: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: ['dependentAge'],
                properties: {
                  dependentAge: {
                    type: 'string',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: ['dependentAge'],
              properties: {
                dependentAge: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    monetary: {
      uiSchema: {
        'ui:title': 'Your household assets',
        'ui:description': {
          type: 'div',
          key: null,
          ref: null,
          props: {
            className: 'assets-note',
            children: [
              {
                type: 'strong',
                key: null,
                ref: null,
                props: {
                  children: 'Note: ',
                },
                _owner: null,
                _store: {},
              },
              ' For each question below, include the total amounts for you and your spouse. If you don’t have any of these items, answer “0”.',
            ],
          },
          _owner: null,
          _store: {},
        },
        householdAssets: {
          'ui:options': {
            classNames: 'no-wrap',
          },
          checkingAndSavings: {
            'ui:title':
              'How much money do you have in checking and savings accounts?',
            'ui:options': {
              classNames: 'schemaform-currency-input',
              widgetClassNames: 'input-size-3',
            },
            'ui:errorMessages': {
              pattern: 'Please enter a valid dollar amount',
              required: 'Please enter an amount',
            },
          },
          availableAssets: {
            'ui:title':
              'How much other cash do you have access to at this time?',
            'ui:options': {
              classNames: 'schemaform-currency-input',
              widgetClassNames: 'input-size-3',
            },
            'ui:errorMessages': {
              pattern: 'Please enter a valid dollar amount',
              required: 'Please enter an amount',
            },
          },
          savingsBonds: {
            'ui:title': 'What’s the current value of your U.S. Savings Bonds?',
            'ui:options': {
              classNames: 'schemaform-currency-input',
              widgetClassNames: 'input-size-3',
            },
            'ui:errorMessages': {
              pattern: 'Please enter a valid dollar amount',
              required: 'Please enter an amount',
            },
          },
          stocksAndOtherBonds: {
            'ui:title':
              'What’s the current value of your stocks and other bonds?',
            'ui:options': {
              classNames: 'schemaform-currency-input',
              widgetClassNames: 'input-size-3',
            },
            'ui:errorMessages': {
              pattern: 'Please enter a valid dollar amount',
              required: 'Please enter an amount',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          householdAssets: {
            type: 'object',
            required: [
              'checkingAndSavings',
              'availableAssets',
              'savingsBonds',
              'stocksAndOtherBonds',
            ],
            properties: {
              checkingAndSavings: {
                type: 'number',
              },
              availableAssets: {
                type: 'number',
              },
              savingsBonds: {
                type: 'number',
              },
              stocksAndOtherBonds: {
                type: 'number',
              },
            },
          },
        },
      },
      editMode: false,
    },
    realEstate: {
      uiSchema: {
        'ui:title': 'Your real estate assets',
        hasRealEstate: {
          'ui:title': 'Do you currently own any real estate?',
          'ui:widget': 'yesNo',
        },
      },
      schema: {
        type: 'object',
        properties: {
          hasRealEstate: {
            type: 'boolean',
          },
        },
        required: ['hasRealEstate'],
      },
      editMode: false,
    },
    realEstateRecords: {
      uiSchema: {
        'ui:title': 'Your real estate assets',
        realEstateRecords: {
          'ui:description': 'Enter each of your real estate assets below.',
          'ui:options': {
            doNotScroll: true,
            showSave: true,
            itemName: 'real estate',
          },
          items: {
            realEstateType: {
              'ui:title': 'Type of real estate',
              'ui:options': {
                classNames:
                  'input-size-6 vads-u-margin-top--3 vads-u-margin-bottom--3',
              },
            },
            realEstateAmount: {
              'ui:title': 'Estimated value',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          realEstateRecords: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: ['realEstateType', 'realEstateAmount'],
                properties: {
                  realEstateType: {
                    type: 'string',
                  },
                  realEstateAmount: {
                    type: 'number',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: ['realEstateType', 'realEstateAmount'],
              properties: {
                realEstateType: {
                  type: 'string',
                },
                realEstateAmount: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    vehicles: {
      uiSchema: {
        'ui:title': 'Your cars or other vehicles',
        hasVehicle: {
          'ui:title': 'Do you own any cars or other vehicles?',
          'ui:widget': 'yesNo',
        },
      },
      schema: {
        type: 'object',
        properties: {
          hasVehicle: {
            type: 'boolean',
          },
        },
        required: ['hasVehicle'],
      },
      editMode: false,
    },
    vehicleRecords: {
      uiSchema: {
        'ui:title': 'Your cars or other vehicles',
        vehicleRecords: {
          'ui:description':
            'Enter information for each vehicle separately below.',
          'ui:options': {
            doNotScroll: true,
            showSave: true,
            itemName: 'vehicle',
          },
          items: {
            vehicleType: {
              'ui:title': 'Type of vehicle',
              'ui:options': {
                classNames:
                  'input-size-7 vads-u-margin-top--3 vads-u-margin-bottom--3',
              },
            },
            vehicleMake: {
              'ui:title': 'Vehicle make',
              'ui:options': {
                widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
              },
            },
            vehicleModel: {
              'ui:title': 'Vehicle model',
              'ui:options': {
                widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
              },
            },
            vehicleYear: {
              'ui:title': 'Vehicle year',
              'ui:options': {
                widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
              },
            },
            vehicleAmount: {
              'ui:title': 'Estimated value',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-5 vads-u-margin-bottom--3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
        'view:vehicleInfo': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              triggerText:
                'What if I don’t know the estimated value of my car or other vehicle?',
              children: [
                'Include the amount of money you think you would get if you sold the vehicle in your local community. To get an idea of prices, you can check these places:',
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
                          children: 'Online forums for your community',
                        },
                        _owner: null,
                        _store: {},
                      },
                      {
                        type: 'li',
                        key: null,
                        ref: null,
                        props: {
                          children: 'Classified ads in local newspapers',
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
                            'Websites that appraise the value of vehicles',
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
      },
      schema: {
        type: 'object',
        properties: {
          vehicleRecords: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: ['vehicleType', 'vehicleAmount'],
                properties: {
                  vehicleType: {
                    type: 'string',
                  },
                  vehicleMake: {
                    type: 'string',
                  },
                  vehicleModel: {
                    type: 'string',
                  },
                  vehicleYear: {
                    type: 'string',
                  },
                  vehicleAmount: {
                    type: 'number',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: ['vehicleType', 'vehicleAmount'],
              properties: {
                vehicleType: {
                  type: 'string',
                },
                vehicleMake: {
                  type: 'string',
                },
                vehicleModel: {
                  type: 'string',
                },
                vehicleYear: {
                  type: 'string',
                },
                vehicleAmount: {
                  type: 'number',
                },
              },
            },
          },
          'view:vehicleInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
    recreationalVehicles: {
      uiSchema: {
        'ui:title': 'Your trailers, campers, and boats',
        hasRecreationalVehicle: {
          'ui:title': 'Do you own any trailers, campers, or boats?',
          'ui:widget': 'yesNo',
        },
      },
      schema: {
        type: 'object',
        properties: {
          hasRecreationalVehicle: {
            type: 'boolean',
          },
        },
        required: ['hasRecreationalVehicle'],
      },
      editMode: false,
    },
    recreationalVehicleRecords: {
      uiSchema: {
        'ui:title': 'Your trailers, campers, and boats',
        recreationalVehicleRecords: {
          'ui:description':
            'Enter each of your trailers, campers, and boats separately below.',
          'ui:options': {
            doNotScroll: true,
            showSave: true,
            itemName: 'trailer, camper, or boat',
          },
          items: {
            recreationalVehicleType: {
              'ui:title': 'Type of vehicle',
              'ui:options': {
                classNames:
                  'input-size-6 vads-u-margin-top--3 vads-u-margin-bottom--3',
              },
            },
            recreationalVehicleAmount: {
              'ui:title': 'Estimated value',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
        'view:recVehicleInfo': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              triggerText:
                'What if I don’t know the estimated value of my trailer, camper, or boat?',
              children: [
                'Include the amount of money you think you would get if you sold the vehicle in your local community. To get an idea of prices, you can check these places:',
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
                          children: 'Online forums for your community',
                        },
                        _owner: null,
                        _store: {},
                      },
                      {
                        type: 'li',
                        key: null,
                        ref: null,
                        props: {
                          children: 'Classified ads in local newspapers',
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
                            'Websites that appraise the value of vehicles',
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
      },
      schema: {
        type: 'object',
        properties: {
          recreationalVehicleRecords: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: [
                  'recreationalVehicleType',
                  'recreationalVehicleAmount',
                ],
                properties: {
                  recreationalVehicleType: {
                    type: 'string',
                  },
                  recreationalVehicleAmount: {
                    type: 'number',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: [
                'recreationalVehicleType',
                'recreationalVehicleAmount',
              ],
              properties: {
                recreationalVehicleType: {
                  type: 'string',
                },
                recreationalVehicleAmount: {
                  type: 'number',
                },
              },
            },
          },
          'view:recVehicleInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
    otherAssets: {
      uiSchema: {
        'ui:title': 'Your other assets',
        hasOtherAssets: {
          'ui:title':
            'Do you own any other items of value, like jewelry or art (called assets)?',
          'ui:widget': 'yesNo',
          'ui:options': {
            classNames: 'no-wrap',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          hasOtherAssets: {
            type: 'boolean',
          },
        },
        required: ['hasOtherAssets'],
      },
      editMode: false,
    },
    otherAssetRecords: {
      uiSchema: {
        'ui:title': 'Your other assets',
        otherAssetRecords: {
          'ui:description':
            'Enter each type of asset separately below. For each, include an estimated value.',
          'ui:options': {
            viewType: 'table',
            doNotScroll: true,
            showSave: true,
            itemName: 'asset',
          },
          items: {
            'ui:options': {
              classNames: 'horizonal-field-container no-wrap',
            },
            otherAssetType: {
              'ui:title': 'Type of asset',
              'ui:options': {
                classNames: 'input-size-3',
              },
            },
            otherAssetAmount: {
              'ui:title': 'Estimated value',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-1',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
        'view:assetInfo': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              triggerText:
                'What if I don’t know the estimated value of an asset?',
              children: [
                'Don’t worry. We just want to get an idea of items of value you may own so we can better understand your financial situation. Include the amount of money you think you would get if you sold the asset. To get an idea of prices, you can check these places:',
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
                          children: 'Online forums for your community',
                        },
                        _owner: null,
                        _store: {},
                      },
                      {
                        type: 'li',
                        key: null,
                        ref: null,
                        props: {
                          children: 'Classified ads in local newspapers',
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
                            'Websites or forums that appraise the value of items like jewelry and art',
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
      },
      schema: {
        type: 'object',
        properties: {
          otherAssetRecords: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: ['otherAssetType', 'otherAssetAmount'],
                properties: {
                  otherAssetType: {
                    type: 'string',
                  },
                  otherAssetAmount: {
                    type: 'number',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: ['otherAssetType', 'otherAssetAmount'],
              properties: {
                otherAssetType: {
                  type: 'string',
                },
                otherAssetAmount: {
                  type: 'number',
                },
              },
            },
          },
          'view:assetInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
    expenses: {
      uiSchema: {
        'ui:title': 'Your monthly household expenses',
        expenses: {
          housingExpense: {
            'ui:title':
              'How much do you spend on housing each month? Please include expenses such as rent, mortgage, taxes, and HOA fees.',
            'ui:options': {
              classNames: 'schemaform-currency-input',
              widgetClassNames: 'input-size-3',
            },
            'ui:errorMessages': {
              pattern: 'Please enter a valid dollar amount',
              required: 'Please enter an amount',
            },
          },
          foodExpense: {
            'ui:title': 'How much do you pay for food each month?',
            'ui:options': {
              classNames: 'schemaform-currency-input',
              widgetClassNames: 'input-size-3',
            },
            'ui:errorMessages': {
              pattern: 'Please enter a valid dollar amount',
              required: 'Please enter an amount',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          expenses: {
            type: 'object',
            required: ['housingExpense', 'foodExpense'],
            properties: {
              housingExpense: {
                type: 'number',
              },
              foodExpense: {
                type: 'number',
              },
            },
          },
        },
      },
      editMode: false,
    },
    utilities: {
      uiSchema: {
        'ui:title': 'Your monthly utility bills',
        hasUtilities: {
          'ui:title':
            'Do you pay any monthly utility bills (like water, electricity, or gas)?',
          'ui:widget': 'yesNo',
          'ui:options': {
            classNames: 'no-wrap',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          hasUtilities: {
            type: 'boolean',
          },
        },
        required: ['hasUtilities'],
      },
      editMode: false,
    },
    utilityRecords: {
      uiSchema: {
        'ui:title': 'Your monthly utility bills',
        utilityRecords: {
          'ui:description':
            'Enter each type of utility separately below. For each, enter the amount you paid last month.',
          'ui:options': {
            viewType: 'table',
            doNotScroll: true,
            showSave: true,
            itemName: 'utility',
          },
          items: {
            'ui:options': {
              classNames: 'horizonal-field-container no-wrap',
            },
            utilityType: {
              'ui:title': 'Type of utility',
              'ui:options': {
                classNames: 'input-size-3',
              },
            },
            monthlyUtilityAmount: {
              'ui:title': 'Monthly payment amount',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-1',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          utilityRecords: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: ['utilityType', 'monthlyUtilityAmount'],
                properties: {
                  utilityType: {
                    type: 'string',
                  },
                  monthlyUtilityAmount: {
                    type: 'number',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: ['utilityType', 'monthlyUtilityAmount'],
              properties: {
                utilityType: {
                  type: 'string',
                },
                monthlyUtilityAmount: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    repayments: {
      uiSchema: {
        'ui:title': 'Your installment contracts and other debts',
        hasRepayments: {
          'ui:title':
            'Do you make monthly payments on any installments contracts or other debts (like loans, purchase payment agreements, or credit card debt)?',
          'ui:widget': 'yesNo',
          'ui:options': {
            classNames: 'max-width-400',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          hasRepayments: {
            type: 'boolean',
          },
        },
        required: ['hasRepayments'],
      },
      editMode: false,
    },
    repaymentRecords: {
      uiSchema: {
        'ui:title': 'Your installment contracts and other debts',
        'ui:description':
          'Enter information for each installment contract or debt separately below.',
        repayments: {
          'ui:options': {
            doNotScroll: true,
            showSave: true,
            itemName: 'installment or other debt',
          },
          items: {
            debtType: {
              'ui:title': 'Type of contract or debt',
              'ui:options': {
                classNames:
                  'input-size-7 vads-u-margin-top--3 vads-u-margin-bottom--3',
              },
            },
            creditorName: {
              'ui:title': 'Name of creditor who holds the contract or debt',
              'ui:options': {
                widgetClassNames: 'input-size-7 vads-u-margin-bottom--3',
              },
            },
            originalDebtAmount: {
              'ui:title': 'Original contract or debt amount',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-6 vads-u-margin-bottom--3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
            unpaidBalance: {
              'ui:title': 'Unpaid balance',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-6 vads-u-margin-bottom--3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
            monthlyPaymentAmount: {
              'ui:title': 'Minimum monthly payment amount',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-6',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
            debtDate: {
              'ui:title': 'Date debt began',
              'ui:widget': 'date',
              'ui:options': {
                monthYear: true,
              },
              'ui:validations': [null],
              'ui:errorMessages': {
                pattern: 'Please enter a valid month and year',
                required: 'Please enter a date',
              },
            },
            amountOverdue: {
              'ui:title': 'Amount overdue',
              'ui:options': {
                classNames: 'vads-u-margin-top--2',
                widgetClassNames: 'input-size-4 vads-u-margin-bottom--3',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          repayments: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: [
                  'debtType',
                  'monthlyPaymentAmount',
                  'debtDate',
                  'amountOverdue',
                ],
                properties: {
                  debtType: {
                    type: 'string',
                  },
                  creditorName: {
                    type: 'string',
                  },
                  originalDebtAmount: {
                    type: 'number',
                  },
                  unpaidBalance: {
                    type: 'number',
                  },
                  monthlyPaymentAmount: {
                    type: 'number',
                  },
                  debtDate: {
                    type: 'string',
                  },
                  amountOverdue: {
                    type: 'number',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: [
                'debtType',
                'monthlyPaymentAmount',
                'debtDate',
                'amountOverdue',
              ],
              properties: {
                debtType: {
                  type: 'string',
                },
                creditorName: {
                  type: 'string',
                },
                originalDebtAmount: {
                  type: 'number',
                },
                unpaidBalance: {
                  type: 'number',
                },
                monthlyPaymentAmount: {
                  type: 'number',
                },
                debtDate: {
                  type: 'string',
                },
                amountOverdue: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
      editMode: false,
    },
    otherExpenses: {
      uiSchema: {
        'ui:title': 'Other living expenses',
        hasOtherExpenses: {
          'ui:title':
            'Do you have any other living expenses (like clothing, transportation, child care, or health care costs)?',
          'ui:widget': 'yesNo',
        },
      },
      schema: {
        type: 'object',
        properties: {
          hasOtherExpenses: {
            type: 'boolean',
          },
        },
        required: ['hasOtherExpenses'],
      },
      editMode: false,
    },
    otherExpenseRecords: {
      uiSchema: {
        'ui:title': 'Other living expenses',
        otherExpenses: {
          'ui:description':
            'Enter each expense separately below. For each, include an estimate of how much you pay for that expense each month.',
          'ui:options': {
            viewType: 'table',
            doNotScroll: true,
            showSave: true,
            itemName: 'an expense',
          },
          items: {
            'ui:options': {
              classNames: 'horizonal-field-container no-wrap',
            },
            expenseType: {
              'ui:title': 'Type of expense',
              'ui:options': {
                classNames: 'input-size-3',
              },
            },
            expenseAmount: {
              'ui:title': 'Estimated cost each month',
              'ui:options': {
                classNames: 'schemaform-currency-input',
                widgetClassNames: 'input-size-1',
              },
              'ui:errorMessages': {
                pattern: 'Please enter a valid dollar amount',
                required: 'Please enter an amount',
              },
            },
          },
        },
        'view:assetInfo': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              triggerText: 'What counts as an expense?',
              children:
                'Many everyday living costs count as expenses. If you’re not sure about a specific expense, we encourage you to start typing the expense into the form. The form will help you fill in options that count as expenses.',
            },
            _owner: null,
            _store: {},
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          otherExpenses: {
            type: 'array',
            items: [
              {
                type: 'object',
                required: ['expenseType', 'expenseAmount'],
                properties: {
                  expenseType: {
                    type: 'string',
                  },
                  expenseAmount: {
                    type: 'number',
                  },
                },
              },
            ],
            additionalItems: {
              type: 'object',
              required: ['expenseType', 'expenseAmount'],
              properties: {
                expenseType: {
                  type: 'string',
                },
                expenseAmount: {
                  type: 'number',
                },
              },
            },
          },
          'view:assetInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
      editMode: false,
    },
    resolutionOptions: {
      uiSchema: {
        fsrDebts: {
          items: {
            financialOverview: {},
            debtRepaymentOptions: {},
            resolution: {
              resolutionType: {
                'ui:title':
                  'What type of help do you want for your Post-9/11 GI Bill debt for tuition and fees?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {
                    Waiver: {
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
                                'vads-u-display--block vads-u-font-weight--bold',
                              children: 'Waiver',
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                              className:
                                'vads-u-display--block vads-u-font-size--sm',
                              children: {
                                key: null,
                                ref: null,
                                props: {
                                  children: [
                                    {
                                      type: 'div',
                                      key: null,
                                      ref: null,
                                      props: {
                                        children:
                                          'If making even smaller monthly payments would cause you financial hardship, you can ask us to stop collection on (or “waive”) the debt.',
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
                                          'If we grant you a waiver for some or all of this debt, you won’t have to pay the amount we waived. For education debts, we’ll reduce the amount of your remaining education benefit entitlement as part of the waiver.',
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
                        ],
                      },
                      _owner: null,
                      _store: {},
                    },
                    'Extended monthly payments': {
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
                                'vads-u-display--block vads-u-font-weight--bold',
                              children: 'Extended monthly payments',
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                              className:
                                'vads-u-display--block vads-u-font-size--sm',
                              children: {
                                key: null,
                                ref: null,
                                props: {
                                  children: [
                                    {
                                      type: 'div',
                                      key: null,
                                      ref: null,
                                      props: {
                                        children:
                                          'If you can’t pay back the total amount of your debt now, you can ask to make smaller monthly payments for up to 3 years. You can make these payments in 1 of 2 ways:',
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
                                              children: [
                                                {
                                                  type: 'strong',
                                                  key: null,
                                                  ref: null,
                                                  props: {
                                                    children:
                                                      'Monthly offsets.',
                                                  },
                                                  _owner: null,
                                                  _store: {},
                                                },
                                                ' This means we’ll keep part or all of your VA benefit payments each month until you’ve paid the full debt.',
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
                                                  type: 'strong',
                                                  key: null,
                                                  ref: null,
                                                  props: {
                                                    children:
                                                      'Monthly payment plan.',
                                                  },
                                                  _owner: null,
                                                  _store: {},
                                                },
                                                ' This means you’ll pay us directly each month. You can pay online, by phone, or by mail.',
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
                    Compromise: {
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
                                'vads-u-display--block vads-u-font-weight--bold',
                              children: 'Compromise',
                            },
                            _owner: null,
                            _store: {},
                          },
                          {
                            type: 'span',
                            key: null,
                            ref: null,
                            props: {
                              className:
                                'vads-u-display--block vads-u-font-size--sm',
                              children: {
                                key: null,
                                ref: null,
                                props: {
                                  children: [
                                    {
                                      type: 'div',
                                      key: null,
                                      ref: null,
                                      props: {
                                        children:
                                          'If you don’t get a monthly VA benefit payment and can’t pay monthly, you can propose a compromise offer. This means you ask us to accept less money than you owe and consider it to be full payment.',
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
                                          'If we accept your offer, you’ll have to pay the lesser amount within 30 days.',
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
                        ],
                      },
                      _owner: null,
                      _store: {},
                    },
                  },
                },
              },
              eduWaiver: {
                'ui:options': {
                  expandUnder: 'resolutionType',
                  expandUnderCondition: 'Waiver',
                },
                'ui:title': {
                  key: null,
                  ref: null,
                  props: {
                    children: [
                      {
                        type: 'p',
                        key: null,
                        ref: null,
                        props: {
                          children:
                            'By checking this box, I’m agreeing that I understand how a debt waiver may affect my VA education benefits. If VA grants me a waiver, this will reduce any remaining education benefit entitlement I may have.',
                        },
                        _owner: null,
                        _store: {},
                      },
                      {
                        type: 'p',
                        key: null,
                        ref: null,
                        props: {
                          className: 'eduWaiverNote',
                          children:
                            'Note: If you have questions about this, call us at 800-827-0648 (or 1-612-713-6415 from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.',
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
              affordToPay: {
                'ui:options': {
                  expandUnder: 'resolutionType',
                  expandUnderCondition: 'Extended monthly payments',
                  classNames: 'no-wrap',
                },
                canAffordToPay: {
                  'ui:title':
                    'How much can you afford to pay monthly on this debt?',
                  'ui:options': {
                    classNames: 'schemaform-currency-input',
                    widgetClassNames: 'input-size-3',
                  },
                  'ui:errorMessages': {
                    pattern: 'Please enter a valid dollar amount',
                    required: 'Please enter an amount',
                  },
                },
              },
              offerToPay: {
                'ui:options': {
                  expandUnder: 'resolutionType',
                  expandUnderCondition: 'Compromise',
                  classNames: 'no-wrap',
                },
                canOfferToPay: {
                  'ui:title':
                    'How much do you offer to pay for this debt with a single payment?',
                  'ui:options': {
                    classNames: 'schemaform-currency-input',
                    widgetClassNames: 'input-size-3',
                  },
                  'ui:errorMessages': {
                    pattern: 'Please enter a valid dollar amount',
                    required: 'Please enter an amount',
                  },
                },
              },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          fsrDebts: {
            bankruptcyHistory: {
              bankruptcyDischargeDate: '2004-01-XX',
              courtLocation: 'Foo, Florida',
              docketNumber: '1234CPDocketFoo',
              hasBeenAdjudicated: true,
            },
            'view:financialHardshipExplanation': {},
            'view:resolutionOptionsInfo': {},
            resolutionComments: 'Foo waiver reason',
            otherExpenses: [
              {
                expenseType: 'Public transportation',
                expenseAmount: 50,
              },
            ],
            'view:assetInfo': {},
            hasOtherExpenses: true,
            repayments: [
              {
                debtType: 'Attorney costs',
                creditorName: 'Foo Attorney',
                originalDebtAmount: 12234,
                unpaidBalance: 100,
                monthlyPaymentAmount: 50,
                debtDate: '2019-01-XX',
                amountOverdue: 0,
              },
            ],
            hasRepayments: true,
            utilityRecords: [
              {
                utilityType: 'Electric',
                monthlyUtilityAmount: 123,
              },
            ],
            hasUtilities: true,
            expenses: {
              housingExpense: 1234,
              foodExpense: 234,
            },
            otherAssetRecords: [
              {
                otherAssetType: 'Artwork (based on appraised value)',
                otherAssetAmount: 123,
              },
            ],
            hasOtherAssets: true,
            recreationalVehicleRecords: [
              {
                recreationalVehicleType: 'Trawler',
                recreationalVehicleAmount: 1234,
              },
            ],
            'view:recVehicleInfo': {},
            hasRecreationalVehicle: true,
            vehicleRecords: [
              {
                vehicleType: 'Car',
                vehicleMake: 'Ford',
                vehicleModel: 'Mustang',
                vehicleYear: '2012',
                vehicleAmount: 5000,
              },
            ],
            'view:vehicleInfo': {},
            hasVehicle: true,
            realEstateRecords: [
              {
                realEstateType: 'Foo real estate',
                realEstateAmount: 123456,
              },
            ],
            hasRealEstate: true,
            householdAssets: {
              checkingAndSavings: 123,
              availableAssets: 123,
              savingsBonds: 123,
              stocksAndOtherBonds: 123,
            },
            dependentRecords: [
              {
                dependentAge: '12',
              },
            ],
            dependents: {
              hasDependents: true,
            },
            spouseInformation: {
              maritalStatus: 'Single',
            },
            additionalIncome: {
              additionalIncomeRecords: [
                {
                  incomeType: 'Foo other income',
                  monthlyAmount: 123,
                },
              ],
              hasAdditionalIncome: true,
              spouse: {},
            },
            socialSecurity: {
              socialSecurityAmount: 123,
              hasSocialSecurityPayments: true,
              spouse: {},
            },
            employment: {
              previouslyEmployed: false,
              previousEmploymentRecords: [
                {
                  previousEmploymentType: 'Full time',
                },
              ],
              currentEmployment: {
                employmentType: 'Full time',
                employmentStart: '1995-01-01',
                employerName: 'Foo',
                grossMonthlyIncome: 1234,
                payrollDeductions: [
                  {
                    deductionType: 'Foo',
                    deductionAmount: 123,
                  },
                ],
              },
              isEmployed: true,
              spouse: {
                currentEmployment: {},
              },
            },
            veteranInfo: {},
            personalData: {
              fullName: {
                first: 'Mark',
                last: 'Webb',
                middle: 'R',
                suffix: 'Jr.',
              },
              dateOfBirth: '1950-10-04',
              phone: '4445551212',
              email: 'test2@test1.net',
            },
            personalIdentification: {
              ssn: '4437',
              vaFileNumber: '5678',
              fileNumber: '4437',
            },
            fsrDebts: [
              {
                financialOverview: {},
                debtRepaymentOptions: {},
                resolution: {
                  resolutionType: 'Waiver',
                  eduWaiver: true,
                },
                fileNumber: '796121200',
                payeeNumber: '00',
                personEntitled: 'AJHONS',
                deductionCode: '30',
                benefitType: 'Comp & Pen',
                diaryCode: '080',
                diaryCodeDescription:
                  'Referred to the Department of the Treasury',
                amountOverpaid: 0,
                amountWithheld: 0,
                originalAr: 136.24,
                currentAr: 100,
                debtHistory: [
                  {
                    date: '02/25/2009',
                    letterCode: '914',
                    description:
                      'Paid In Full - Account balance cleared via offset, not including TOP.',
                  },
                  {
                    date: '02/07/2009',
                    letterCode: '905',
                    description: 'Administrative Write Off',
                  },
                  {
                    date: '12/03/2008',
                    letterCode: '487',
                    description: 'Death Case Pending Action',
                  },
                ],
                id: 0,
              },
              {
                financialOverview: {},
                debtRepaymentOptions: {},
                resolution: {
                  resolutionType: 'Waiver',
                  eduWaiver: true,
                },
                fileNumber: '796121200',
                payeeNumber: '00',
                personEntitled: 'STUB_M',
                deductionCode: '44',
                benefitType: 'CH35 EDU',
                diaryCode: '100',
                diaryCodeDescription: 'Pending payment',
                amountOverpaid: 26000,
                amountWithheld: 0,
                originalAr: 100,
                currentAr: 80,
                debtHistory: [
                  {
                    date: '12/19/2014',
                    letterCode: '681',
                    description:
                      'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
                  },
                  {
                    date: '04/11/2013',
                    letterCode: '080',
                    description:
                      'Debt referred to Treasury for Cross servicing',
                  },
                  {
                    date: '12/11/2012',
                    letterCode: '510',
                    description:
                      'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
                  },
                  {
                    date: '10/17/2012',
                    letterCode: '212',
                    description: 'Bad Address - Locator Request Sent',
                  },
                  {
                    date: '09/28/2012',
                    letterCode: '117',
                    description: 'Second Demand Letter',
                  },
                  {
                    date: '09/18/2012',
                    letterCode: '100',
                    description:
                      'First Demand Letter - Inactive Benefits - Due Process',
                  },
                ],
                id: 1,
              },
            ],
            debt: {
              currentAr: 0,
              debtHistory: [
                {
                  date: '',
                },
              ],
              deductionCode: '',
              originalAr: 0,
            },
            mailingAddress: {
              livesOnMilitaryBaseInfo: {},
              country: 'United States',
              addressLine1: '1493 Martin Luther King Rd',
              addressLine2: 'Apt 1',
              city: 'Fulton',
              state: 'FL',
              zipCode: '97062',
              addressLine3: null,
              addressPou: 'CORRESPONDENCE',
              addressType: 'DOMESTIC',
              countryName: 'United States',
              countryCodeFips: 'US',
              countryCodeIso2: 'US',
              countryCodeIso3: 'USA',
              createdAt: '2018-04-21T20:09:50Z',
              effectiveEndDate: '2018-04-21T20:09:50Z',
              effectiveStartDate: '2018-04-21T20:09:50Z',
              id: 123,
              internationalPostalCode: '54321',
              province: 'string',
              sourceDate: '2018-04-21T20:09:50Z',
              stateCode: 'NY',
              updatedAt: '2018-04-21T20:09:50Z',
              zipCodeSuffix: '1234',
            },
            contactInfo: {
              phoneNumber: '5035551234',
              primaryEmail: 'veteran@gmail.com',
              confirmationEmail: 'veteran@gmail.com',
            },
            vaBenefitsOnFile: {},
            benefits: {
              spouseBenefits: {},
            },
            income: [
              {
                veteranOrSpouse: 'VETERAN',
                compensationAndPension: '3261.1',
              },
            ],
            items: [
              {
                type: 'object',
                properties: {
                  financialOverview: {
                    type: 'object',
                    properties: {
                      income: {
                        type: 'string',
                      },
                    },
                  },
                  debtRepaymentOptions: {
                    type: 'object',
                    properties: {},
                  },
                  resolution: {
                    type: 'object',
                    properties: {
                      resolutionType: {
                        type: 'string',
                        enum: [
                          'Waiver',
                          'Extended monthly payments',
                          'Compromise',
                        ],
                      },
                      eduWaiver: {
                        type: 'boolean',
                      },
                      affordToPay: {
                        type: 'object',
                        properties: {
                          canAffordToPay: {
                            type: 'number',
                          },
                        },
                        'ui:collapsed': true,
                      },
                      offerToPay: {
                        type: 'object',
                        properties: {
                          canOfferToPay: {
                            type: 'number',
                          },
                        },
                        'ui:collapsed': true,
                      },
                    },
                    required: ['resolutionType'],
                  },
                },
              },
              {
                type: 'object',
                properties: {
                  financialOverview: {
                    type: 'object',
                    properties: {
                      income: {
                        type: 'string',
                      },
                    },
                  },
                  debtRepaymentOptions: {
                    type: 'object',
                    properties: {},
                  },
                  resolution: {
                    type: 'object',
                    properties: {
                      resolutionType: {
                        type: 'string',
                        enum: [
                          'Waiver',
                          'Extended monthly payments',
                          'Compromise',
                        ],
                      },
                      eduWaiver: {
                        type: 'boolean',
                      },
                      affordToPay: {
                        type: 'object',
                        properties: {
                          canAffordToPay: {
                            type: 'number',
                          },
                        },
                        'ui:collapsed': true,
                      },
                      offerToPay: {
                        type: 'object',
                        properties: {
                          canOfferToPay: {
                            type: 'number',
                          },
                        },
                        'ui:collapsed': true,
                      },
                    },
                    required: ['resolutionType'],
                  },
                },
              },
            ],
          },
        },
      },
      editMode: [false, false],
      showPagePerItem: true,
      arrayPath: 'fsrDebts',
    },
    resolutionComments: {
      uiSchema: {
        'ui:title': 'Supporting personal statement',
        'view:financialHardshipExplanation': {},
        'view:resolutionOptionsInfo': {
          'ui:description': {
            key: null,
            ref: null,
            props: {
              triggerText: 'Why do I need to share this information?',
              children:
                "We want to fully understand your situation so we can make the best decision on your request. You can share any details that you think we should know about why it's hard for you or your family to repay this debt.",
            },
            _owner: null,
            _store: {},
          },
        },
        resolutionComments: {
          'ui:title': ' ',
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 5,
            maxLength: 32000,
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          'view:financialHardshipExplanation': {
            type: 'object',
            properties: {},
          },
          'view:resolutionOptionsInfo': {
            type: 'object',
            properties: {},
          },
          resolutionComments: {
            type: 'string',
          },
        },
        required: ['resolutionComments'],
      },
      editMode: false,
    },
    bankruptcyHistory: {
      uiSchema: {
        'ui:title': 'Your bankruptcy details',
        bankruptcyHistory: {
          hasBeenAdjudicated: {
            'ui:title': 'Have you ever declared bankruptcy?',
            'ui:widget': 'yesNo',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          bankruptcyHistory: {
            type: 'object',
            properties: {
              hasBeenAdjudicated: {
                type: 'boolean',
              },
            },
            required: ['hasBeenAdjudicated'],
          },
        },
      },
      editMode: false,
    },
    bankruptcyHistoryRecords: {
      uiSchema: {
        'ui:title': 'Your bankruptcy details',
        bankruptcyHistory: {
          bankruptcyDischargeDate: {
            'ui:title': 'Date a court granted you a bankruptcy discharge',
            'ui:widget': 'date',
          },
          courtLocation: {
            'ui:title': 'Location of court (city, state)',
            'ui:options': {
              widgetClassNames: 'input-size-6',
            },
          },
          docketNumber: {
            'ui:title': 'Case or docket number',
            'ui:description': {
              type: 'p',
              key: null,
              ref: null,
              props: {
                className: 'formfield-subtitle',
                children: 'You’ll find this number on your case documents.',
              },
              _owner: null,
              _store: {},
            },
            'ui:options': {
              widgetClassNames: 'input-size-6',
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          bankruptcyHistory: {
            type: 'object',
            properties: {
              bankruptcyDischargeDate: {
                type: 'string',
              },
              courtLocation: {
                type: 'string',
              },
              docketNumber: {
                type: 'string',
              },
            },
          },
        },
      },
      editMode: false,
    },
  },
  initialData: {
    veteranInfo: {},
    personalData: {
      fullName: {
        first: 'Hector',
        last: 'Smith',
        middle: 'R',
      },
      dateOfBirth: '01/01/1970',
    },
    personalIdentification: {
      ssn: '1234',
      vaFileNumber: '5678',
    },
    fsrDebts: [],
    debt: {
      currentAr: 0,
      debtHistory: [
        {
          date: '',
        },
      ],
      deductionCode: '',
      originalAr: 0,
    },
    mailingAddress: {
      livesOnMilitaryBaseInfo: {},
      country: 'United States',
      addressLine1: '1234 W Nebraska St',
      city: 'Tampa',
      state: 'FL',
      zipCode: '33614',
    },
    contactInfo: {
      phoneNumber: '5551234567',
      primaryEmail: 'hector.smith@email.com',
      confirmationEmail: 'hector.smith@email.com',
    },
    employment: {
      currentEmployment: {},
      spouse: {
        currentEmployment: {},
      },
    },
    vaBenefitsOnFile: {},
    benefits: {
      spouseBenefits: {},
    },
    socialSecurity: {
      spouse: {},
    },
    additionalIncome: {
      spouse: {},
    },
    spouseInformation: {},
    dependents: {},
    householdAssets: {},
    'view:vehicleInfo': {},
    'view:recVehicleInfo': {},
    'view:assetInfo': {},
    expenses: {},
    'view:financialHardshipExplanation': {},
    'view:resolutionOptionsInfo': {},
    bankruptcyHistory: {},
  },
  savedStatus: 'not-attempted',
  autoSavedStatus: 'success',
  loadedStatus: 'not-attempted',
  version: 0,
  lastSavedDate: 1613670773958,
  expirationDate: 1618854774,
  prefillStatus: 'success',
  isStartingOver: false,
};
