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
      spouseFullName: {
        first: 'Lisa',
        middle: 'A',
        last: 'Anderson',
      },
      agesOfOtherDependents: ['14', '6'],
      employmentHistory: [
        {
          veteranOrSpouse: 'VETERAN',
          occupationName: 'welder',
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
          veteranOrSpouse: 'VETERAN',
          occupationName: 'welder',
          from: '06/2017',
          to: '06/2019',
          present: false,
          employerName: 'Subway Metal Fabrications Inc.',
          employerAddress: {
            addresslineOne: '321 Knox Avenue',
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
