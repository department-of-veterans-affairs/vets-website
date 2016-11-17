const request = require('request');

const E2eHelpers = require('./e2e-helpers');
const Timeouts = require('./timeouts.js');

const testValues = {
  veteranFullName: {
    first: 'William',
    middle: 'John',
    last: 'ZZTEST',
    suffix: 'Jr.'
  },
  mothersMaidenName: 'Arden',
  veteranSocialSecurityNumber: '111-22-3333',
  gender: 'M',
  cityOfBirth: 'Akron',
  stateOfBirth: 'OH',
  veteranDateOfBirth: {
    month: 'Apr',
    day: '23',
    year: '1980'
  },
  maritalStatus: 'Married',

  isVaServiceConnected: '',
  compensableVaServiceConnected: '',
  receivesVaPension: '',

  isEssentialAcaCoverage: false,
  facilityState: 'IL',
  vaMedicalFacility: 'EVANSTON CBOC',
  wantsInitialVaContact: false,

  isSpanishHispanicLatino: false,
  isAmericanIndianOrAlaskanNative: false,
  isBlackOrAfricanAmerican: false,
  isNativeHawaiianOrOtherPacificIslander: false,
  isAsian: false,
  isWhite: false,

  veteranAddress: {
    street: '111 S Michigan Ave',
    city: 'Chicago',
    country: 'USA',
    state: 'IL',
    zipcode: '60603'
  },
  email: 'bills@bard.com',
  emailConfirmation: 'bills@bard.com',
  homePhone: '5551112323',
  mobilePhone: '5551114545',

  discloseFinancialInformation: false,

  spouseFullName: {
    first: 'Anne',
    middle: 'Agnes',
    last: 'Hathaway',
    suffix: 'Sr.'
  },
  spouseSocialSecurityNumber: '444-55-6666',
  spouseDateOfBirth: {
    month: 'Aug',
    day: '6',
    year: '1980'
  },
  dateOfMarriage: {
    month: 'Jun',
    day: '3',
    year: '2006'
  },

  sameAddress: '',
  cohabitedLastYear: false,
  provideSupportLastYear: false,
  spouseAddress: {
    street: '115 S Michigan Ave',
    city: 'Chicago',
    country: 'USA',
    state: 'IL',
    zipcode: '60603'
  },

  hasChildrenToReport: '',
  children: [
    {
      childFullName: {
        first: 'Hamnet',
        middle: 'Dirtbike',
        last: 'Shakespeare',
        suffix: 'Jr.'
      },
      childRelation: 'Son',
      childSocialSecurityNumber: '777-88-9999',
      childBecameDependent: {
        month: 'Feb',
        day: '2',
        year: '2012'
      },
      childDateOfBirth: {
        month: 'Feb',
        day: '2',
        year: '2012'
      },
      childDisabledBefore18: '',
      childAttendedSchoolLastYear: '',
      childEducationExpenses: '6000',
      childCohabitedLastYear: '',
      childReceivedSupportLastYear: '',
      grossIncome: '4000',
      netIncome: '3000',
      otherIncome: '2000'
    }
  ],

  veteranGrossIncome: '10000',
  veteranNetIncome: '9000',
  veteranOtherIncome: '8000',
  spouseGrossIncome: '7000',
  spouseNetIncome: '6000',
  spouseOtherIncome: '5000',

  deductibleMedicalExpenses: '1000',
  deductibleFuneralExpenses: '2000',
  deductibleEducationExpenses: '3000',

  isCoveredByHealthInsurance: '',

  providers: [
    {
      insuranceName: 'BCBS',
      insurancePolicyHolderName: 'William ZZTEST',
      insurancePolicyNumber: '100',
      insuranceGroupCode: '200'
    }
  ],

  isMedicaidEligible: '',
  isEnrolledMedicarePartA: '',
  medicarePartAEffectiveDate: {
    month: 'Apr',
    day: '23',
    year: '1980'
  },

  lastServiceBranch: 'army',
  lastEntryDate: {
    month: 'Oct',
    day: '10',
    year: '2000'
  },
  lastDischargeDate: {
    month: 'Nov',
    day: '11',
    year: '2004'
  },
  dischargeType: 'honorable',

  purpleHeartRecipient: false,
  isFormerPow: false,
  postNov111998Combat: false,
  disabledInLineOfDuty: false,
  swAsiaCombat: false,
  vietnamService: false,
  exposedToRadiation: false,
  radiumTreatments: false,
  campLejeune: false
};

function selectDropdown(client, field, value) {
  client.click(`select[name='${field}']`)
    .click(`select option[value='${value}']`)
    .keys(['\uE006']);
}

function completePersonalInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="fname"]')
    .setValue('input[name="fname"]', data.veteranFullName.first)
    .clearValue('input[name="lname"]')
    .setValue('input[name="lname"]', data.veteranFullName.last);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="mname"]', data.veteranFullName.middle)
      .setValue('select[name="suffix"]', data.veteranFullName.suffix)
      .setValue('input[name="mothersMaidenName"]', data.mothersMaidenName);
  }
}

function completeBirthInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('select[name="veteranBirthMonth"]')
    .setValue('select[name="veteranBirthMonth"]', data.veteranDateOfBirth.month)
    .clearValue('select[name="veteranBirthDay"]')
    .setValue('select[name="veteranBirthDay"]', data.veteranDateOfBirth.day)
    .clearValue('input[name="veteranBirthYear"]')
    .setValue('input[name="veteranBirthYear"]', data.veteranDateOfBirth.year)
    .clearValue('input[name="ssn"]')
    .setValue('input[name="ssn"]', data.veteranSocialSecurityNumber);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="cityOfBirth"]', data.cityOfBirth)
      .setValue('select[name="stateOfBirth"]', data.stateOfBirth);
  }
}

function completeDemographicInformation(client, data, onlyRequiredFields) {
  client
    .setValue('select[name="gender"]', data.gender)
    .clearValue('select[name="maritalStatus"]')
    .setValue('select[name="maritalStatus"]', data.maritalStatus);

  if (!onlyRequiredFields) {
    client
      .click('input[name="isAmericanIndianOrAlaskanNative"]')
      .click('input[name="isBlackOrAfricanAmerican"]')
      .click('input[name="isNativeHawaiianOrOtherPacificIslander"]')
      .click('input[name="isAsian"]')
      .click('input[name="isWhite"]')
      .click('input[name="isSpanishHispanicLatino"]');
  }
}

function completeVeteranAddress(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="address"]')
    .setValue('input[name="address"]', data.veteranAddress.street)
    .clearValue('input[name="city"]')
    .setValue('input[name="city"]', data.veteranAddress.city);

  selectDropdown(client, 'country', data.veteranAddress.country);
  selectDropdown(client, 'state', data.veteranAddress.state);

  client
    .clearValue('input[name="zip"]')
    .setValue('input[name="zip"]', data.veteranAddress.zipcode);

  if (!onlyRequiredFields) {
    onlyRequiredFields;
  }
}

function completeVeteranContactInformation(client, data, onlyRequiredFields) {
  if (!onlyRequiredFields) {
    client
      .setValue('input.first-email', data.email)
      .setValue('input.second-email', data.emailConfirmation)
      .setValue('input.home-phone', data.homePhone)
      .setValue('input.mobile-phone', data.mobilePhone);
  }
}

function completeMilitaryService(client, data, onlyRequiredFields) {
  client
    .clearValue('select[name="lastServiceBranch"]')
    .setValue('select[name="lastServiceBranch"]', data.lastServiceBranch)
    .clearValue('select[name="lastEntryMonth"]')
    .setValue('select[name="lastEntryMonth"]', data.lastEntryDate.month)
    .clearValue('select[name="lastEntryDay"]')
    .setValue('select[name="lastEntryDay"]', data.lastEntryDate.day)
    .clearValue('input[name="lastEntryYear"]')
    .setValue('input[name="lastEntryYear"]', data.lastEntryDate.year)
    .clearValue('select[name="lastDischargeMonth"]')
    .setValue('select[name="lastDischargeMonth"]', data.lastDischargeDate.month)
    .clearValue('select[name="lastDischargeDay"]')
    .setValue('select[name="lastDischargeDay"]', data.lastDischargeDate.day)
    .clearValue('input[name="lastDischargeYear"]')
    .setValue('input[name="lastDischargeYear"]', data.lastDischargeDate.year)
    .clearValue('select[name="dischargeType"]')
    .setValue('select[name="dischargeType"]', data.dischargeType);

  if (!onlyRequiredFields) {
    onlyRequiredFields;
  }
}

function completeVaBenefits(client, data, onlyRequiredFields) {
  client
    .click('input[name="compensableVaServiceConnected-0"]')
    .click('input[name="isVaServiceConnected-0"]')
    .click('input[name="receivesVaPension-0"]');

  if (!onlyRequiredFields) {
    onlyRequiredFields;
  }
}

function completeFinancialDisclosure(client, data, onlyRequiredFields) {
  client.click('input[name="discloseFinancialInformation-1"]');

  if (!onlyRequiredFields) {
    client.click('input[name="discloseFinancialInformation-0"]');
  }
}

function completeSpouseInformation(client, data, onlyRequiredFields) {
  client
    .clearValue('input[name="fname"]')
    .setValue('input[name="fname"]', data.spouseFullName.first)
    .clearValue('input[name="lname"]')
    .setValue('input[name="lname"]', data.spouseFullName.last)
    .clearValue('input[name="ssn"]')
    .setValue('input[name="ssn"]', data.spouseSocialSecurityNumber)
    .clearValue('select[name="spouseBirthMonth"]')
    .setValue('select[name="spouseBirthMonth"]', data.spouseDateOfBirth.month)
    .clearValue('select[name="spouseBirthDay"]')
    .setValue('select[name="spouseBirthDay"]', data.spouseDateOfBirth.day)
    .clearValue('input[name="spouseBirthYear"]')
    .setValue('input[name="spouseBirthYear"]', data.spouseDateOfBirth.year)
    .clearValue('select[name="marriageMonth"]')
    .setValue('select[name="marriageMonth"]', data.dateOfMarriage.month)
    .clearValue('select[name="marriageDay"]')
    .setValue('select[name="marriageDay"]', data.dateOfMarriage.day)
    .clearValue('input[name="marriageYear"]')
    .setValue('input[name="marriageYear"]', data.dateOfMarriage.year)
    .click('input[name="sameAddress-1"]');
  client.expect.element('input[name="address"]').to.be.visible.before(Timeouts.normal);

  client
    .clearValue('input[name="address"]')
    .setValue('input[name="address"]', data.spouseAddress.street)
    .clearValue('input[name="city"]')
    .setValue('input[name="city"]', data.spouseAddress.city);

  selectDropdown(client, 'country', data.spouseAddress.country);
  selectDropdown(client, 'state', data.spouseAddress.state);

  client
    .clearValue('input[name="zip"]')
    .setValue('input[name="zip"]', data.spouseAddress.zipcode);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="mname"]', 'Jacqueline')
      .setValue('select[name="suffix"]', 'Sr.')
      .click('input[name="sameAddress-1"]')
      .click('input[name="cohabitedLastYear-0"]')
      .click('input[name="provideSupportLastYear-0"]');
  }
}

function completeAnnualIncomeInformation(client, data, onlyRequiredFields) {
  client.expect.element('input[name="veteranGrossIncome"]').to.be.visible.before(Timeouts.normal);
  client
    .setValue('input[name="veteranGrossIncome"]', data.veteranGrossIncome)
    .setValue('input[name="veteranNetIncome"]', data.veteranNetIncome)
    .setValue('input[name="veteranOtherIncome"]', data.veteranOtherIncome);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="spouseGrossIncome"]', data.spouseGrossIncome)
      .setValue('input[name="spouseNetIncome"]', data.spouseNetIncome)
      .setValue('input[name="spouseOtherIncome"]', data.spouseOtherIncome)
      .setValue('input[name="childGrossIncome"]', data.children[0].grossIncome)
      .setValue('input[name="childNetIncome"]', data.children[0].netIncome)
      .setValue('input[name="childOtherIncome"]', data.children[0].otherIncome);
  }
}

function completeChildInformation(client, data, onlyRequiredFields) {
  client.click('input[name="hasChildrenToReport-0"]');
  client.expect.element('input[name="fname"]').to.be.visible.before(Timeouts.normal);
  client
    .setValue('input[name="fname"]', data.children[0].childFullName.first)
    .setValue('input[name="lname"]', data.children[0].childFullName.last)
    .setValue('select[name="childRelation"]', data.children[0].childRelation)
    .setValue('input[name="ssn"]', data.children[0].childSocialSecurityNumber)
    .setValue('select[name="childBirthMonth"]', data.children[0].childDateOfBirth.month)
    .setValue('select[name="childBirthDay"]', data.children[0].childDateOfBirth.day)
    .setValue('input[name="childBirthYear"]', data.children[0].childDateOfBirth.year)
    .setValue('select[name="childBecameDependentMonth"]', data.children[0].childBecameDependent.month)
    .setValue('select[name="childBecameDependentDay"]', data.children[0].childBecameDependent.day)
    .setValue('input[name="childBecameDependentYear"]', data.children[0].childBecameDependent.year);

  if (!onlyRequiredFields) {
    client
      .setValue('input[name="mname"]', 'Dirtbike')
      .setValue('select[name="suffix"]', 'Jr.')
      .click('input[name="childDisabledBefore18-0"]')
      .click('input[name="childAttendedSchoolLastYear-0"]')
      .setValue('input[name="childEducationExpenses"]', '6000')
      .click('input[name="childCohabitedLastYear-1"]')
      .click('input[name="childReceivedSupportLastYear-0"]');
  }
}

function completeDeductibleExpenses(client, data) {
  client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible.before(Timeouts.normal);
  client
    .setValue('input[name="deductibleMedicalExpenses"]', data.deductibleMedicalExpenses)
    .setValue('input[name="deductibleFuneralExpenses"]', data.deductibleFuneralExpenses)
    .setValue('input[name="deductibleEducationExpenses"]', data.deductibleEducationExpenses);
}


function completeMedicareAndMedicaid(client, data, onlyRequiredFields) {
  client
    .click('input[name="isMedicaidEligible-1"]')
    .click('input[name="isEnrolledMedicarePartA-1"]');

  if (!onlyRequiredFields) {
    client
      .click('input[name="isEnrolledMedicarePartA-0"]');

    client
      .setValue('select[name="medicarePartAEffectiveMonth"]', data.medicarePartAEffectiveDate.month)
      .setValue('select[name="medicarePartAEffectiveDay"]', data.medicarePartAEffectiveDate.day)
      .setValue('input[name="medicarePartAEffectiveYear"]', data.medicarePartAEffectiveDate.year);
  }
}

function completeInsuranceInformation(client, data, onlyRequiredFields) {
  client.click('input[name="isCoveredByHealthInsurance-0"]');
  client.expect.element('input[name="insuranceName"]').to.be.visible.before(Timeouts.normal);
  client
    .setValue('input[name="insuranceName"]', data.providers[0].insuranceName)
    .setValue('input[name="insurancePolicyHolderName"]', data.providers[0].insurancePolicyHolderName)
    .setValue('input[name="insurancePolicyNumber"]', data.providers[0].insurancePolicyNumber);

  if (!onlyRequiredFields) {
    client.setValue('input[name="insuranceGroupCode"]', data.providers[0].insuranceGroupCode);
  }
}

function completeVaInsuranceInformation(client, data, onlyRequiredFields) {
  client
    .setValue('select[name="state"]', data.facilityState)
    .setValue('select[name="vaMedicalFacility"]', data.vaMedicalFacility);

  if (!onlyRequiredFields) {
    client
      .click('input[name="isEssentialAcaCoverage"]')
      .click('input[name="wantsInitialVaContact-1"]');
  }
}

function initApplicationSubmitMock() {
  request({
    uri: `${E2eHelpers.apiUrl}/mock`,
    method: 'POST',
    json: {
      path: '/api/hca/v1/application',
      verb: 'post',
      value: {
        formSubmissionId: '123fake-submission-id-567',
        timeStamp: '2016-05-16'
      }
    }
  });
}

module.exports = {
  testValues,
  completePersonalInformation,
  completeBirthInformation,
  completeDemographicInformation,
  completeVeteranAddress,
  completeVeteranContactInformation,
  completeMilitaryService,
  completeVaBenefits,
  completeFinancialDisclosure,
  completeSpouseInformation,
  completeChildInformation,
  completeAnnualIncomeInformation,
  completeDeductibleExpenses,
  completeMedicareAndMedicaid,
  completeInsuranceInformation,
  completeVaInsuranceInformation,
  initApplicationSubmitMock,
  selectDropdown
};
