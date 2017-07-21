const mock = require('./mock-helpers');

function completeApplicantInformation(client, data) {
  client
    .fillName('root_veteranFullName', data.veteranFullName)
    .fill('input[name="root_veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber)
    .fill('input[name="root_vaFileNumber"]', data.vaFileNumber)
    .fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth);
}

function completeMilitaryHistory(client, data) {
  client
    .fill('input[name="root_servicePeriods_0_serviceBranch"]', data.servicePeriods[0].serviceBranch)
    .fillDate('root_servicePeriods_0_activeServiceDateRange_from', data.servicePeriods[0].activeServiceDateRange.from)
    .fillDate('root_servicePeriods_0_activeServiceDateRange_to', data.servicePeriods[0].activeServiceDateRange.to)
    .click('.va-growable-add-btn')
    .fill('input[name="root_servicePeriods_1_serviceBranch"]', data.servicePeriods[1].serviceBranch)
    .fillDate('root_servicePeriods_1_activeServiceDateRange_from', data.servicePeriods[1].activeServiceDateRange.from)
    .fillDate('root_servicePeriods_1_activeServiceDateRange_to', data.servicePeriods[1].activeServiceDateRange.to);
}

function completeGeneralMilitaryInfo(client, data) {
  client
    .selectYesNo('root_view:serveUnderOtherNames', data['view:serveUnderOtherNames'])
    .fillName('root_previousNames_0', data.previousNames[0])
    .click('.va-growable-add-btn')
    .fillName('root_previousNames_1', data.previousNames[1])
    .fill('input[name="root_placeOfSeparation"]', data.placeOfSeparation)
    .selectYesNo('root_combatSince911', data.combatSince911);
}

function completeNationalGuard(client, data) {
  client
    .selectYesNo('root_nationalGuardActivation', data.nationalGuardActivation)
    .fill('input[name="root_nationalGuard_name"]', data.nationalGuard.name)
    .fillAddress('root_nationalGuard_address', data.nationalGuard.address)
    .fill('input[name="root_nationalGuard_phone"]', data.nationalGuard.phone)
    .fillDate('root_nationalGuard_date', data.nationalGuard.date);
}

function completePOW(client, data) {
  client
    .selectYesNo('root_view:powStatus', data['view:powStatus'])
    .fillDate('root_powDateRange_from', data.powDateRange.from)
    .fillDate('root_powDateRange_to', data.powDateRange.to)
    .selectYesNo('root_view:receivedSeverancePay', data['view:receivedSeverancePay'])
    .selectRadio('root_severancePay_type', data.severancePay.type)
    .fill('input[name="root_severancePay_amount"]', data.severancePay.amount);
}

function completeDisabilityHistory(client, data) {
  client
    .fill('input[name="root_disabilities_0_name"]', data.disabilities[0].name)
    .fillDate('root_disabilities_0_disabilityStartDate', data.disabilities[0].disabilityStartDate)
    .click('.va-growable-add-btn')
    .fill('input[name="root_disabilities_1_name"]', data.disabilities[1].name)
    .fillDate('root_disabilities_1_disabilityStartDate', data.disabilities[1].disabilityStartDate)
    .selectYesNo('root_view:hasVisitedVAMC', data['view:hasVisitedVAMC'])
    .fill('input[name="root_vamcTreatmentCenters_0_location"]', data.vamcTreatmentCenters[0].location)
    .click('.form-expanding-group .va-growable-add-btn')
    .fill('input[name="root_vamcTreatmentCenters_1_location"]', data.vamcTreatmentCenters[1].location);
}

function completeWorkHistory(client, data) {
  data['view:history'].jobs.forEach((job, index) => {
    client
      .selectYesNo('root_view:workedBeforeDisabled', data['view:workedBeforeDisabled'])
      .fill(`input[name="root_view:history_jobs_${index}_employer"]`, job.employer)
      .fillAddress(`root_view:history_jobs_${index}_address`, job.address)
      .fill(`input[name="root_view:history_jobs_${index}_jobTitle"]`, job.jobTitle)
      .fillDate(`root_view:history_jobs_${index}_dateRange_from`, job.dateRange.from)
      .fillDate(`root_view:history_jobs_${index}_dateRange_to`, job.dateRange.to)
      .fill(`input[name="root_view:history_jobs_${index}_daysMissed"]`, job.daysMissed)
      .fill(`input[name="root_view:history_jobs_${index}_annualEarnings"]`, job.annualEarnings)
      .clickIf('.va-growable-add-btn', index < data['view:history'].jobs.length - 1);
  });
}

function completeMaritalStatus(client, data) {
  client
    .selectRadio('root_maritalStatus', data.maritalStatus)
    .fill('input[name="root_marriages"]', data.marriages.length);
}

function completeMarriage(client, data, index) {
  client
    .fillName('root_spouseFullName', data.marriages[index].spouseFullName)
    .fillDate('root_dateOfMarriage', data.marriages[index].dateOfMarriage)
    .fill('input[name="root_locationOfMarriage"]', data.marriages[index].locationOfMarriage)
    .selectRadio('root_marriageType', data.marriages[index].marriageType);
  if (data.marriages[index]['view:pastMarriage']) {
    client
      .selectRadio('root_view:pastMarriage_reasonForSeparation', data.marriages[index]['view:pastMarriage'].reasonForSeparation)
      .fillDate('root_view:pastMarriage_dateOfSeparation', data.marriages[index]['view:pastMarriage'].dateOfSeparation)
      .fill('input[name="root_view:pastMarriage_locationOfSeparation"]', data.marriages[index]['view:pastMarriage'].locationOfSeparation);
  }
}

function completeSpouseInfo(client, data) {
  client
    .fillDate('root_spouseDateOfBirth', data.spouseDateOfBirth)
    .fill('input[name="root_spouseSocialSecurityNumber"]', data.spouseSocialSecurityNumber)
    .selectYesNo('root_spouseIsVeteran', data.spouseIsVeteran)
    .fill('input[name="root_spouseVaFileNumber"]', data.spouseVaFileNumber)
    .selectYesNo('root_liveWithSpouse', data.liveWithSpouse)
    .fillAddress('root_spouseAddress', data.spouseAddress)
    .fill('input[name="root_reasonForNotLivingWithSpouse"]', data.reasonForNotLivingWithSpouse)
    .fill('input[name="root_monthlySpousePayment"]', data.monthlySpousePayment)
    .fill('input[name="root_spouseMarriages"]', data.spouseMarriages.length + 1);
}

function completeSpouseMarriage(client, data) {
  client
    .fillDate('root_dateOfMarriage', data.spouseMarriages[0].dateOfMarriage)
    .fill('input[name="root_locationOfMarriage"]', data.spouseMarriages[0].locationOfMarriage)
    .fillName('root_spouseFullName', data.spouseMarriages[0].spouseFullName)
    .selectRadio('root_marriageType', data.spouseMarriages[0].marriageType)
    .selectRadio('root_reasonForSeparation', data.spouseMarriages[0].reasonForSeparation)
    .fillDate('root_dateOfSeparation', data.spouseMarriages[0].dateOfSeparation)
    .fill('input[name="root_locationOfSeparation"]', data.spouseMarriages[0].locationOfSeparation);
}

function completeDependents(client, data) {
  client
    .selectYesNo('root_view:hasDependents', data['view:hasDependents']);

  data.dependents.forEach((dependent, index) => {
    client
      .fillName(`root_dependents_${index}_fullName`, data.dependents[index].fullName)
      .fillDate(`root_dependents_${index}_childDateOfBirth`, data.dependents[index].childDateOfBirth)
      .clickIf('.va-growable-add-btn', index < data.dependents.length - 1);
  });
}

function completeDependentInfo(client, data, index) {
  client
    .fill('input[name="root_childPlaceOfBirth"]', data.dependents[index].childPlaceOfBirth)
    .clickIf('input[name="root_view:noSSN"]', data.dependents[index]['view:noSSN'])
    .fill('input[name="root_childSocialSecurityNumber"]', data.dependents[index].childSocialSecurityNumber)
    .selectRadio('root_childRelationship', data.dependents[index].childRelationship);

  if (typeof data.dependents[index].attendingCollege !== 'undefined') {
    client
      .selectYesNo('root_attendingCollege', data.dependents[index].attendingCollege);
  }

  if (typeof data.dependents[index].disabled !== 'undefined') {
    client
      .selectYesNo('root_disabled', data.dependents[index].disabled);
  }

  client
    .selectYesNo('root_previouslyMarried', data.dependents[index].previouslyMarried);

  if (data.dependents[index].previouslyMarried) {
    client
      .selectYesNo('root_married', data.dependents[index].married);
  }
}

function completeDependentAddressInfo(client, data, index) {
  client
    .selectYesNo('root_childInHousehold', data.dependents[index].childInHousehold);

  if (!data.dependents[index].childInHousehold) {
    client
      .fillAddress('root_childAddress', data.dependents[index].childAddress)
      .fillName('root_personWhoLivesWithChild', data.dependents[index].personWhoLivesWithChild)
      .fill('input[name="root_monthlyPayment"]', data.dependents[index].monthlyPayment);
  }
}

function completeNetWorthInfo(client, data) {
  client
      .fill('input[name="root_netWorth_bank"]', data.netWorth.bank)
      .fill('input[name="root_netWorth_interestBank"]', data.netWorth.interestBank)
      .fill('input[name="root_netWorth_ira"]', data.netWorth.ira)
      .fill('input[name="root_netWorth_stocks"]', data.netWorth.stocks)
      .fill('input[name="root_netWorth_realProperty"]', data.netWorth.realProperty)
      .click('.pensions-sources-add-btn')
      .fill('input[name="root_netWorth_additionalSources_0_name"]', data.netWorth.additionalSources[0].name)
      .fill('input[name="root_netWorth_additionalSources_0_amount"]', data.netWorth.additionalSources[0].amount)
      .click('.va-growable-expanded .float-left');
}

function completeMonthlyIncomeInfo(client, data) {
  client
      .fill('input[name="root_monthlyIncome_socialSecurity"]', data.monthlyIncome.socialSecurity)
      .fill('input[name="root_monthlyIncome_civilService"]', data.monthlyIncome.civilService)
      .fill('input[name="root_monthlyIncome_railroad"]', data.monthlyIncome.railroad)
      .fill('input[name="root_monthlyIncome_blackLung"]', data.monthlyIncome.blackLung)
      .fill('input[name="root_monthlyIncome_serviceRetirement"]', data.monthlyIncome.serviceRetirement)
      .fill('input[name="root_monthlyIncome_ssi"]', data.monthlyIncome.ssi)
      .click('.pensions-sources-add-btn')
      .fill('input[name="root_monthlyIncome_additionalSources_0_name"]', data.netWorth.additionalSources[0].name)
      .fill('input[name="root_monthlyIncome_additionalSources_0_amount"]', data.netWorth.additionalSources[0].amount)
      .click('.va-growable-expanded .float-left');
}

function completeExpectedIncomeInfo(client, data) {
  client
      .fill('input[name="root_expectedIncome_salary"]', data.expectedIncome.salary)
      .fill('input[name="root_expectedIncome_interest"]', data.expectedIncome.interest)
      .fill('input[name="root_expectedIncome_additionalSources_0_name"]', data.expectedIncome.additionalSources[0].name)
      .fill('input[name="root_expectedIncome_additionalSources_0_amount"]', data.expectedIncome.additionalSources[0].amount)
      .click('.va-growable-expanded .float-left');
}

function completeOtherExpensesInfo(client, data) {
  client
      .selectYesNo('root_view:hasOtherExpensesYes', data['view:hasOtherExpenses'])
      .fill('input[name="root_otherExpenses_0_amount"]', data.otherExpenses[0].amount)
      .fill('input[name="root_otherExpenses_0_purpose"]', data.otherExpenses[0].purpose)
      .fillDate('input[name="root_otherExpenses_0_amount"]', data.otherExpenses[0].date)
      .fill('input[name="root_otherExpenses_0_paidTo"]', data.otherExpenses[0].paidTo);
}

function completeSpouseNetWorthInfo(client, data) {
  client
      .fill('input[name="root_spouseNetWorth_bank"]', data.spouseNetWorth.bank)
      .fill('input[name="root_spouseNetWorth_interestBank"]', data.spouseNetWorth.interestBank)
      .fill('input[name="root_spouseNetWorth_ira"]', data.spouseNetWorth.ira)
      .fill('input[name="root_spouseNetWorth_stocks"]', data.spouseNetWorth.stocks)
      .fill('input[name="root_spouseNetWorth_realProperty"]', data.spouseNetWorth.realProperty)
      .click('.pensions-sources-add-btn')
      .fill('input[name="root_spouseNetWorth_additionalSources_0_name"]', data.spouseNetWorth.additionalSources[0].name)
      .fill('input[name="root_spouseNetWorth_additionalSources_0_amount"]', data.spouseNetWorth.additionalSources[0].amount)
      .click('.va-growable-expanded .float-left');
}

function completeSpouseMonthlyIncomeInfo(client, data) {
  client
      .fill('input[name="root_spouseMonthlyIncome_socialSecurity"]', data.spouseMonthlyIncome.socialSecurity)
      .fill('input[name="root_spouseMonthlyIncome_civilService"]', data.spouseMonthlyIncome.civilService)
      .fill('input[name="root_spouseMonthlyIncome_railroad"]', data.spouseMonthlyIncome.railroad)
      .fill('input[name="root_spouseMonthlyIncome_blackLung"]', data.spouseMonthlyIncome.blackLung)
      .fill('input[name="root_spouseMonthlyIncome_serviceRetirement"]', data.spouseMonthlyIncome.serviceRetirement)
      .fill('input[name="root_spouseMonthlyIncome_ssi"]', data.spouseMonthlyIncome.ssi)
      .click('.pensions-sources-add-btn')
      .fill('input[name="root_spouseMonthlyIncome_additionalSources_0_name"]', data.spouseMonthlyIncome.additionalSources[0].name)
      .fill('input[name="root_spouseMonthlyIncome_additionalSources_0_amount"]', data.spouseMonthlyIncome.additionalSources[0].amount)
      .click('.va-growable-expanded .float-left');
}

function completeSpouseExpectedIncomeInfo(client, data) {
  client
      .fill('input[name="root_spouseExpectedIncome_salary"]', data.spouseExpectedIncome.salary)
      .fill('input[name="root_spouseExpectedIncome_interest"]', data.spouseExpectedIncome.interest)
      .fill('input[name="root_spouseExpectedIncome_additionalSources_0_name"]', data.spouseExpectedIncome.additionalSources[0].name)
      .fill('input[name="root_spouseExpectedIncome_additionalSources_0_amount"]', data.spouseExpectedIncome.additionalSources[0].amount)
      .click('.va-growable-expanded .float-left');
}

function completeSpouseOtherExpensesInfo(client, data) {
  client
      .selectYesNo('root_view:spouseHasOtherExpensesYes', data['view:spouseHasOtherExpenses'])
      .fill('input[name="root_spouseOtherExpenses_0_amount"]', data.spouseOtherExpenses[0].amount)
      .fill('input[name="root_spouseOtherExpenses_0_purpose"]', data.spouseOtherExpenses[0].purpose)
      .fillDate('input[name="root_spouseOtherExpenses_0_amount"]', data.spouseOtherExpenses[0].date)
      .fill('input[name="root_spouseOtherExpenses_0_paidTo"]', data.spouseOtherExpenses[0].paidTo);
}

function completeDirectDepositInfo(client, data) {
  client
      .fill('input[name="root_bankAccount_accountType"]', data.bankAccount.accountType)
      .fill('input[name="root_bankAccount_bankName"]', data.bankAccount.bankName)
      .fill('input[name="root_bankAccount_accountNumber"]', data.bankAccount.accountNumber)
      .fill('input[name="root_bankAccount_routingNumber"]', data.bankAccount.routingNumber);
}

function completeContactInfo(client, data) {
  client
      .fill('input[name="root_veteranAddress_country"]', data.veteranAddress.country)
      .fill('input[name="root_veteranAddress_street"]', data.veteranAddress.street)
      .fill('input[name="root_veteranAddress_city"]', data.veteranAddress.city)
      .fill('input[name="root_veteranAddress_state"]', data.veteranAddress.state)
      .fill('input[name="root_veteranAddress_postalCode"]', data.veteranAddress.postalCode)
      .fill('input[name="root_veteranAddress_email"]', data.veteranAddress.email)
      .fill('input[name="root_veteranAddress_altEmail"]', data.veteranAddress.altEmail)
      .fill('input[name="root_veteranAddress_dayPhone"]', data.veteranAddress.dayPhone)
      .fill('input[name="root_veteranAddress_nightPhone"]', data.veteranAddress.nightPhone)
      .fill('input[name="root_veteranAddress_mobilePhone"]', data.veteranAddress.mobilePhone);
}

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/pension_claims',
    verb: 'post',
    value: {
      data: {
        attributes: {
          regionalOffice: [],
          confirmationNumber: '123fake-submission-id-567',
          submittedAt: '2016-05-16'
        }
      }
    }
  });
}

module.exports = {
  completeApplicantInformation,
  completeMilitaryHistory,
  completeNationalGuard,
  completeGeneralMilitaryInfo,
  completePOW,
  completeDisabilityHistory,
  completeWorkHistory,
  completeMaritalStatus,
  completeMarriage,
  completeSpouseInfo,
  completeSpouseMarriage,
  completeDependents,
  completeDependentInfo,
  completeDependentAddressInfo,
  completeNetWorthInfo,
  completeMonthlyIncomeInfo,
  completeExpectedIncomeInfo,
  completeOtherExpensesInfo,
  completeSpouseNetWorthInfo,
  completeSpouseMonthlyIncomeInfo,
  completeSpouseExpectedIncomeInfo,
  completeSpouseOtherExpensesInfo,
  completeDirectDepositInfo,
  completeContactInfo,
  initApplicationSubmitMock
};
