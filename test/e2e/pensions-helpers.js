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
  initApplicationSubmitMock
};
