const mock = require('./mock-helpers');
const Timeouts = require('./timeouts.js');

function completePersonalInformation(client, data) {
  client
    .waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.normal)
    .fill('input[name="root_veteranFullName_first"]', data.veteranFullName.first)
    .fill('input[name="root_veteranFullName_last"]', data.veteranFullName.last)
    .selectDropdown('root_veteranFullName_suffix', data.veteranFullName.suffix)
    .fill('input[name="root_veteranFullName_middle"]', data.veteranFullName.middle)
    .fill('input[name="root_mothersMaidenName"]', data.mothersMaidenName);
}

function completeBirthInformation(client, data) {
  client
    .fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth)
    .fill('input[name="root_veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber)
    .fill('input[name="root_view:placeOfBirth_cityOfBirth"]', data['view:placeOfBirth'].cityOfBirth)
    .selectDropdown('root_view:placeOfBirth_stateOfBirth', data['view:placeOfBirth'].stateOfBirth);
}

function completeDemographicInformation(client, data) {
  client
    .selectDropdown('root_gender', data.gender)
    .selectDropdown('root_maritalStatus', data.maritalStatus)
    .click('input[name="root_view:demographicCategories_isAmericanIndianOrAlaskanNative"]')
    .click('input[name="root_view:demographicCategories_isBlackOrAfricanAmerican"]')
    .click('input[name="root_view:demographicCategories_isNativeHawaiianOrOtherPacificIslander"]')
    .click('input[name="root_view:demographicCategories_isAsian"]')
    .click('input[name="root_view:demographicCategories_isWhite"]')
    .click('input[name="root_view:demographicCategories_isSpanishHispanicLatino"]');
}

function completeVeteranAddress(client, data) {
  client
    .fill('input[name="root_veteranAddress_street"]', data.veteranAddress.street)
    .fill('input[name="root_veteranAddress_street2"]', data.veteranAddress.street2)
    .fill('input[name="root_veteranAddress_street3"]', data.veteranAddress.street3)
    .fill('input[name="root_veteranAddress_city"]', data.veteranAddress.city)
    .selectDropdown('root_veteranAddress_country', data.veteranAddress.country)
    .selectDropdown('root_veteranAddress_state', data.veteranAddress.state)
    // Has to be after the dropdowns or it fails mysteriously
    .fill('input[name="root_veteranAddress_postalCode"]', data.veteranAddress.postalCode);
}

function completeVeteranContactInformation(client, data) {
  client
    .waitForElementVisible('input[name="root_email"]', Timeouts.normal)
    .setValue('input[name="root_email"]', data.email)
    .setValue('input[name="root_view:emailConfirmation"]', data['root_view:emailConfirmation'])
    .setValue('input[name="root_homePhone"]', data.homePhone)
    .setValue('input[name="root_mobilePhone"]', data.mobilePhone);
}

function completeMilitaryService(client, data) {
  client
    .selectDropdown('root_lastServiceBranch', data.lastServiceBranch)
    .fillDate('root_lastEntryDate', data.lastEntryDate)
    .selectDropdown('root_dischargeType', data.dischargeType)
    .fillDate('root_lastDischargeDate', data.lastDischargeDate);
}

function completeAdditionalInformation(client) {
  client
    .click('input[name="root_purpleHeartRecipient"]')
    .click('input[name="root_isFormerPow"]')
    .click('input[name="root_postNov111998Combat"]')
    .click('input[name="root_disabledInLineOfDuty"]')
    .click('input[name="root_swAsiaCombat"]')
    .click('input[name="root_vietnamService"]')
    .click('input[name="root_exposedToRadiation"]')
    .click('input[name="root_radiumTreatments"]')
    .click('input[name="root_campLejeune"]');
}

function completeVaBenefits(client) {
  client
    .click('input[name="root_compensableVaServiceConnectedYes"]')
    .click('input[name="root_isVaServiceConnectedYes"]')
    .click('input[name="root_receivesVaPensionYes"]');
}

function completeFinancialDisclosure(client) {
  client
    .click('input[name="root_discloseFinancialInformationYes"]');
}

function completeSpouseInformation(client, data) {
  client
    .fillDate('root_spouseDateOfBirth', data.spouseDateOfBirth)
    .fillDate('root_dateOfMarriage', data.dateOfMarriage)
    .fill('input[name="root_spouseFullName_first"]', data.spouseFullName.first)
    .fill('input[name="root_spouseFullName_middle"]', data.spouseFullName.middle)
    .fill('input[name="root_spouseFullName_last"]', data.spouseFullName.last)
    .selectDropdown('root_spouseFullName_suffix', data.spouseFullName.suffix)
    .fill('input[name="root_spouseSocialSecurityNumber"]', data.spouseSocialSecurityNumber)
    .click('input[name="root_sameAddressNo"]');

  client.expect.element('label[for="root_view:spouseContactInformation_spouseAddress_country"]').to.be.visible.before(Timeouts.slow);

  client
    .fill('input[name="root_view:spouseContactInformation_spouseAddress_street"]', data['view:spouseContactInformation'].spouseAddress.street)
    .fill('input[name="root_view:spouseContactInformation_spouseAddress_street2"]', data['view:spouseContactInformation'].spouseAddress.street2)
    .fill('input[name="root_view:spouseContactInformation_spouseAddress_street3"]', data['view:spouseContactInformation'].spouseAddress.street3)
    .fill('input[name="root_view:spouseContactInformation_spouseAddress_city"]', data['view:spouseContactInformation'].spouseAddress.city)
    .selectDropdown('root_view:spouseContactInformation_spouseAddress_country', data['view:spouseContactInformation'].spouseAddress.country)
    .selectDropdown('root_view:spouseContactInformation_spouseAddress_state', data['view:spouseContactInformation'].spouseAddress.state)
    .fill('input[name="root_view:spouseContactInformation_spouseAddress_postalCode"]', data['view:spouseContactInformation'].spouseAddress.postalCode)
    .click('input[name="root_cohabitedLastYearNo"]')
    .click('input[name="root_provideSupportLastYearYes"]')
    .fill('input[name="root_view:spouseContactInformation_spousePhone"]', data['view:spouseContactInformation'].spousePhone);
}

function completeAnnualIncomeInformation(client, data) {
  client
    .setValue('input[name="root_veteranGrossIncome"]', data.veteranGrossIncome)
    .setValue('input[name="root_veteranNetIncome"]', data.veteranNetIncome)
    .setValue('input[name="root_veteranOtherIncome"]', data.veteranOtherIncome)
    .setValue('input[name="root_view:spouseIncome_spouseGrossIncome"]', data['view:spouseIncome'].spouseGrossIncome)
    .setValue('input[name="root_view:spouseIncome_spouseNetIncome"]', data['view:spouseIncome'].spouseNetIncome)
    .setValue('input[name="root_view:spouseIncome_spouseOtherIncome"]', data['view:spouseIncome'].spouseOtherIncome)
    .setValue('input[name="root_children_0_grossIncome"]', data.children[0].grossIncome)
    .setValue('input[name="root_children_0_netIncome"]', data.children[0].netIncome)
    .setValue('input[name="root_children_0_otherIncome"]', data.children[0].otherIncome);
}

function completeChildInformation(client, data) {
  client
    .click('input[name="root_view:reportChildrenYes"]');

  client.expect.element('label[for="root_children_0_childFullName_first"]').to.be.visible.before(Timeouts.normal);
  client
    .selectDropdown('root_children_0_childRelation', data.children[0].childRelation)
    .fillDate('root_children_0_childDateOfBirth', data.children[0].childDateOfBirth)
    .fillDate('root_children_0_childBecameDependent', data.children[0].childBecameDependent)
    .setValue('input[name="root_children_0_childFullName_first"]', data.children[0].childFullName.first)
    .setValue('input[name="root_children_0_childFullName_middle"]', data.children[0].childFullName.middle)
    .setValue('input[name="root_children_0_childFullName_last"]', data.children[0].childFullName.last)
    .selectDropdown('root_children_0_childFullName_suffix', data.children[0].childFullName.suffix)
    .setValue('input[name="root_children_0_childSocialSecurityNumber"]', data.children[0].childSocialSecurityNumber)
    .setValue('input[name="root_children_0_childEducationExpenses"]', data.children[0].childEducationExpenses)
    .click('input[name="root_children_0_childDisabledBefore18Yes"]')
    .click('input[name="root_children_0_childAttendedSchoolLastYearYes"]')
    .click('input[name="root_children_0_childCohabitedLastYearNo"]')
    .click('input[name="root_children_0_childReceivedSupportLastYearYes"]');
}

function completeDeductibleExpenses(client, data) {
  client
    .setValue('input[name="root_deductibleMedicalExpenses"]', data.deductibleMedicalExpenses)
    .setValue('input[name="root_deductibleFuneralExpenses"]', data.deductibleFuneralExpenses)
    .setValue('input[name="root_deductibleEducationExpenses"]', data.deductibleEducationExpenses);
}


function completeMedicareAndMedicaid(client, data) {
  client
    .click('input[name="root_isMedicaidEligibleYes"]')
    .click('input[name="root_isEnrolledMedicarePartAYes"]')
    .fillDate('root_medicarePartAEffectiveDate', data.medicarePartAEffectiveDate);
}

function completeInsuranceInformation(client, data) {
  client
    .click('input[name="root_isCoveredByHealthInsuranceYes"]')
    .setValue('input[name="root_providers_0_insuranceName"]', data.providers[0].insuranceName)
    .setValue('input[name="root_providers_0_insurancePolicyHolderName"]', data.providers[0].insurancePolicyHolderName)
    .setValue('input[name="root_providers_0_insurancePolicyNumber"]', data.providers[0].insurancePolicyNumber)
    .setValue('input[name="root_providers_0_insuranceGroupCode"]', data.providers[0].insuranceGroupCode);
}

function completeVaInsuranceInformation(client, data) {
  client
  .selectDropdown('root_view:preferredFacility_view:facilityState', data['view:preferredFacility']['view:facilityState'])
  .selectDropdown('root_view:preferredFacility_vaMedicalFacility', data['view:preferredFacility'].vaMedicalFacility)
  .click('input[name="root_isEssentialAcaCoverage"]')
  .click('input[name="root_wantsInitialVaContactYes"]');
}

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/health_care_applications',
    verb: 'post',
    value: {
      formSubmissionId: '123fake-submission-id-567',
      timestamp: '2016-05-16'
    }
  });
}

module.exports = {
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
  completeAdditionalInformation,
  initApplicationSubmitMock
};
