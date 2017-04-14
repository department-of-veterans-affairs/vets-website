const mock = require('./mock-helpers');
const selectDropdown = require('./e2e-helpers.js').selectDropdown;
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
    month: '4',
    day: '23',
    year: '1980'
  },
  maritalStatus: 'Married',

  isVaServiceConnected: '',
  compensableVaServiceConnected: '',
  receivesVaPension: '',

  isEssentialAcaCoverage: false,
  facilityState: 'IL',
  vaMedicalFacility: '556GA',
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
    month: '8',
    day: '6',
    year: '1980'
  },
  dateOfMarriage: {
    month: '6',
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
        month: '2',
        day: '2',
        year: '2012'
      },
      childDateOfBirth: {
        month: '2',
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
    month: '4',
    day: '23',
    year: '1980'
  },

  lastServiceBranch: 'army',
  lastEntryDate: {
    month: '10',
    day: '10',
    year: '2000'
  },
  lastDischargeDate: {
    month: '11',
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

function completePersonalInformation(client, data) {
  client
    .waitForElementVisible('input[name="fname"]', Timeouts.normal)
    .fill('input[name="fname"]', data.veteranFullName.first)
    .fill('input[name="lname"]', data.veteranFullName.last)
    .selectDropdown('suffix', data.veteranFullName.suffix)
    .fill('input[name="mname"]', data.veteranFullName.middle)
    .fill('input[name="mothersMaidenName"]', data.mothersMaidenName);
}

function completeBirthInformation(client, data) {
  client
    .selectDropdown('veteranBirthMonth', data.veteranDateOfBirth.month)
    .selectDropdown('veteranBirthDay', data.veteranDateOfBirth.day)
    .fill('input[name="veteranBirthYear"]', data.veteranDateOfBirth.year)
    .fill('input[name="ssn"]', data.veteranSocialSecurityNumber)
    .fill('input[name="cityOfBirth"]', data.cityOfBirth)
    .selectDropdown('stateOfBirth', data.stateOfBirth);
}

function completeDemographicInformation(client, data) {
  client
    .selectDropdown('gender', data.gender)
    .selectDropdown('maritalStatus', data.maritalStatus)
    .click('input[name="isAmericanIndianOrAlaskanNative"]')
    .click('input[name="isBlackOrAfricanAmerican"]')
    .click('input[name="isNativeHawaiianOrOtherPacificIslander"]')
    .click('input[name="isAsian"]')
    .click('input[name="isWhite"]')
    .click('input[name="isSpanishHispanicLatino"]');
}

function completeVeteranAddress(client, data) {
  // client.waitForElementVisible('input[name="address"]', Timeouts.normal);
  client
    .fill('input[name="address"]', data.veteranAddress.street)
    .fill('input[name="city"]', data.veteranAddress.city)
    .selectDropdown('country', data.veteranAddress.country)
    .selectDropdown('state', data.veteranAddress.state)
    // Has to be after the dropdowns or it fails mysteriously
    .fill('input[name="zip"]', data.veteranAddress.zipcode);
}

function completeVeteranContactInformation(client, data) {
  client
    .waitForElementVisible('input.first-email', Timeouts.normal)
    .setValue('input.first-email', data.email)
    .setValue('input.second-email', data.emailConfirmation)
    .setValue('input.home-phone', data.homePhone)
    .setValue('input.mobile-phone', data.mobilePhone);
}

function completeMilitaryService(client, data) {
  client
    .selectDropdown('lastServiceBranch', data.lastServiceBranch)
    .selectDropdown('lastEntryMonth', data.lastEntryDate.month)
    .selectDropdown('lastEntryDay', data.lastEntryDate.day)
    .selectDropdown('lastDischargeMonth', data.lastDischargeDate.month)
    .selectDropdown('lastDischargeDay', data.lastDischargeDate.day)
    .selectDropdown('dischargeType', data.dischargeType)
    .clearValue('input[name="lastEntryYear"]')
    .setValue('input[name="lastEntryYear"]', data.lastEntryDate.year)
    .clearValue('input[name="lastDischargeYear"]')
    .setValue('input[name="lastDischargeYear"]', data.lastDischargeDate.year);
}

function completeVaBenefits(client) {
  client
    .waitForElementVisible('input[name="compensableVaServiceConnected-0"] + label', Timeouts.normal)
    .click('input[name="compensableVaServiceConnected-0"]')
    .click('input[name="isVaServiceConnected-0"]')
    .click('input[name="receivesVaPension-0"]');
}

function completeFinancialDisclosure(client) {
  client
    .waitForElementVisible('input[name="discloseFinancialInformation-1"] + label', Timeouts.normal)
    .click('input[name="discloseFinancialInformation-1"]')
    .click('input[name="discloseFinancialInformation-0"]');
}

function completeSpouseInformation(client, data) {
  client
    .selectDropdown('spouseBirthMonth', data.spouseDateOfBirth.month)
    .selectDropdown('spouseBirthDay', data.spouseDateOfBirth.day)
    .selectDropdown('marriageMonth', data.dateOfMarriage.month)
    .selectDropdown('marriageDay', data.dateOfMarriage.day)
    .fill('input[name="fname"]', data.spouseFullName.first)
    .fill('input[name="mname"]', 'Jacqueline')
    .fill('input[name="lname"]', data.spouseFullName.last)
    .selectDropdown('suffix', 'Sr.')
    .fill('input[name="ssn"]', data.spouseSocialSecurityNumber)
    .fill('input[name="spouseBirthYear"]', data.spouseDateOfBirth.year)
    .fill('input[name="marriageYear"]', data.dateOfMarriage.year)
    .click('input[name="sameAddress-1"]');
  client.expect.element('input[name="address"]').to.be.visible.before(Timeouts.slow);

  client
    .fill('input[name="address"]', data.spouseAddress.street)
    .fill('input[name="city"]', data.spouseAddress.city)
    .selectDropdown('country', data.spouseAddress.country)
    .selectDropdown('state', data.spouseAddress.state)
    .fill('input[name="zip"]', data.spouseAddress.zipcode)
    .click('input[name="cohabitedLastYear-1"]')
    // Can't find this for some reason, but it doesn't fail...
    .click('input[name="provideSupportLastYear-0"]');
}

function completeAnnualIncomeInformation(client, data) {
  client
    .waitForElementVisible('input[name="veteranGrossIncome"]', Timeouts.normal)
    .setValue('input[name="veteranGrossIncome"]', data.veteranGrossIncome)
    .setValue('input[name="veteranNetIncome"]', data.veteranNetIncome)
    .setValue('input[name="veteranOtherIncome"]', data.veteranOtherIncome)
    .setValue('input[name="spouseGrossIncome"]', data.spouseGrossIncome)
    .setValue('input[name="spouseNetIncome"]', data.spouseNetIncome)
    .setValue('input[name="spouseOtherIncome"]', data.spouseOtherIncome)
    .setValue('input[name="childGrossIncome"]', data.children[0].grossIncome)
    .setValue('input[name="childNetIncome"]', data.children[0].netIncome)
    .setValue('input[name="childOtherIncome"]', data.children[0].otherIncome);
}

function completeChildInformation(client, data) {
  client
    .waitForElementVisible('input[name="hasChildrenToReport-0"] + label', Timeouts.normal)
    .click('input[name="hasChildrenToReport-0"]');

  client.expect.element('input[name="fname"]').to.be.visible.before(Timeouts.normal);
  client
    .selectDropdown('childRelation', data.children[0].childRelation)
    .selectDropdown('childBirthMonth', data.children[0].childDateOfBirth.month)
    .selectDropdown('childBirthDay', data.children[0].childDateOfBirth.day)
    .selectDropdown('childBecameDependentMonth', data.children[0].childBecameDependent.month)
    .selectDropdown('childBecameDependentDay', data.children[0].childBecameDependent.day)
    .setValue('input[name="fname"]', data.children[0].childFullName.first)
    .setValue('input[name="mname"]', 'Dirtbike')
    .setValue('input[name="lname"]', data.children[0].childFullName.last)
    .selectDropdown('suffix', 'Jr.')
    .setValue('input[name="ssn"]', data.children[0].childSocialSecurityNumber)
    .setValue('input[name="childBirthYear"]', data.children[0].childDateOfBirth.year)
    .setValue('input[name="childBecameDependentYear"]', data.children[0].childBecameDependent.year)
    .setValue('input[name="childEducationExpenses"]', '6000')
    .click('input[name="childDisabledBefore18-0"]')
    .click('input[name="childAttendedSchoolLastYear-0"]')
    .click('input[name="childCohabitedLastYear-1"]')
    .click('input[name="childReceivedSupportLastYear-0"]');
}

function completeDeductibleExpenses(client, data) {
  client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible.before(Timeouts.normal);
  client
    .setValue('input[name="deductibleMedicalExpenses"]', data.deductibleMedicalExpenses)
    .setValue('input[name="deductibleFuneralExpenses"]', data.deductibleFuneralExpenses)
    .setValue('input[name="deductibleEducationExpenses"]', data.deductibleEducationExpenses);
}


function completeMedicareAndMedicaid(client, data) {
  client
    .waitForElementVisible('input[name="isMedicaidEligible-1"] + label', Timeouts.normal)
    .click('input[name="isMedicaidEligible-1"]')
    .click('input[name="isEnrolledMedicarePartA-1"]')
    .click('input[name="isEnrolledMedicarePartA-0"]')
    .selectDropdown('medicarePartAEffectiveMonth', data.medicarePartAEffectiveDate.month)
    .selectDropdown('medicarePartAEffectiveDay', data.medicarePartAEffectiveDate.day)
    .setValue('input[name="medicarePartAEffectiveYear"]', data.medicarePartAEffectiveDate.year);
}

function completeInsuranceInformation(client, data) {
  client
    .waitForElementVisible('input[name="isCoveredByHealthInsurance-0"] + label', Timeouts.normal)
    .click('input[name="isCoveredByHealthInsurance-0"]');
  client.expect.element('input[name="insuranceName"]').to.be.visible.before(Timeouts.normal);
  client
    .setValue('input[name="insuranceName"]', data.providers[0].insuranceName)
    .setValue('input[name="insurancePolicyHolderName"]', data.providers[0].insurancePolicyHolderName)
    .setValue('input[name="insurancePolicyNumber"]', data.providers[0].insurancePolicyNumber)
    .setValue('input[name="insuranceGroupCode"]', data.providers[0].insuranceGroupCode);
}

function completeVaInsuranceInformation(client, data) {
  client
  .selectDropdown('state', data.facilityState)
  .selectDropdown('vaMedicalFacility', data.vaMedicalFacility)
  .click('input[name="isEssentialAcaCoverage"]')
  .click('input[name="wantsInitialVaContact-0"]');
}

function initApplicationSubmitMock() {
  // TODO: Fully migrate to v1
  mock(null, {
    path: '/v0/health_care_applications',
    verb: 'post',
    value: {
      data: {
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
  initApplicationSubmitMock
};
