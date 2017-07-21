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
  initApplicationSubmitMock
};
