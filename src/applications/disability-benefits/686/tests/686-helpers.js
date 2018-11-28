const mock = require('../../../../platform/testing/e2e/mock-helpers');

function completeVeteranInformation(client, data) {
  client
    .fillName('root_veteranFullName', data.veteranFullName)
    .fill(
      'input[name="root_veteranSocialSecurityNumber"]',
      data.veteranSocialSecurityNumber,
    )
    .fill('input[name="root_veteranVAfileNumber"]', data.vaFileNumber)
    .selectRadio('root_view:relationship', data['view:relationship'])
    .fillName('root_veteranFullName', data.veteranFullName);
}

function completeClaimantInformation(client, data) {
  client
    .fillName('root_view:applicantInfo_claimantFullName', data.claimantFullName)
    .fillAddress('root_view:applicantInfo_address', data.claimantAddress)
    .fill(
      'input[name="root_view:applicantInfo_ssn"]',
      data.claimantSocialSecurityNumber,
    )
    .fill(
      'input[name="root_view:applicantInfo_claimantEmail"]',
      data.claimantEmail,
    );
}

function completeMarriageInformation(client, data) {
  client
    .selectRadio('root_maritalStatus', data.maritalStatus)
    .fill('input[name="root_marriages"]', data.marriages.length);
}

function completeMarriage(client, marriageData) {
  client
    .fillName('root_spouseFullName', marriageData.spouseFullName)
    .fillDate('root_dateOfMarriage', marriageData.dateOfMarriage)
    .fill(
      'input[name="root_locationOfMarriage"]',
      marriageData.locationOfMarriage,
    );
  if (marriageData['view:pastMarriage']) {
    client
      .fillDate(
        'root_view:pastMarriage_dateOfSeparation',
        marriageData['view:pastMarriage'].dateOfSeparation,
      )
      .fill(
        'input[name="root_view:pastMarriage_locationOfSeparation"]',
        marriageData['view:pastMarriage'].locationOfSeparation,
      );
  }
}

function completeSpouseInformation(client, data) {
  client
    .fillDate('root_spouseDateOfBirth', data.spouseDateOfBirth)
    .fill(
      'input[name="root_spouseSocialSecurityNumber"]',
      data.spouseSocialSecurityNumber,
    )
    .selectYesNo('root_spouseIsVeteran', data.spouseIsVeteran)
    .fill('input[name="root_spouseVaFileNumber"]', data.spouseVaFileNumber)
    .selectYesNo('root_liveWithSpouse', data.liveWithSpouse)
    .fillAddress('root_spouseAddress', data.spouseAddress)
    .fill(
      'input[name="root_spouseMarriages"]',
      data.spouseMarriages.length + 1,
    );
}

function completeSpouseMarriageInformation(client, data) {
  client
    .fillDate('root_dateOfMarriage', data.spouseMarriages[0].dateOfMarriage)
    .fill(
      'input[name="root_locationOfMarriage"]',
      data.spouseMarriages[0].locationOfMarriage,
    )
    .fillName('root_spouseFullName', data.spouseMarriages[0].spouseFullName)
    .selectRadio(
      'root_reasonForSeparation',
      data.spouseMarriages[0].reasonForSeparation,
    )
    .fillDate('root_dateOfSeparation', data.spouseMarriages[0].dateOfSeparation)
    .fill(
      'input[name="root_locationOfSeparation"]',
      data.spouseMarriages[0].locationOfSeparation,
    );
}

function completeDependentsInformation(client, data) {
  client.selectYesNo(
    'root_view:hasUnmarriedChildren',
    data['view:hasUnmarriedChildren'],
  );

  data.dependents.forEach((dependent, index) => {
    client
      .fillName(
        `root_dependents_${index}_fullName`,
        data.dependents[index].fullName,
      )
      .fillDate(
        `root_dependents_${index}_childDateOfBirth`,
        data.dependents[index].childDateOfBirth,
      )
      .clickIf('.va-growable-add-btn', index < data.dependents.length - 1);
  });
}

function completeDependentInfo(client, data, index) {
  client
    .fillCheckboxIf(
      'input[name="root_view:noSSN"]',
      data.dependents[index]['view:noSSN'],
    )
    .fill(
      'input[name="root_childSocialSecurityNumber"]',
      data.dependents[index].childSocialSecurityNumber,
    )
    .selectRadio(
      'root_childRelationship',
      data.dependents[index].childRelationship,
    );
}

function completeDependentAddressInfo(client, data, index) {
  client.selectYesNo(
    'root_childInHousehold',
    data.dependents[index].childInHousehold,
  );

  if (!data.dependents[index].childInHousehold) {
    client
      .fillAddress(
        'root_childInfo_childAddress',
        data.dependents[index].childAddress,
      )
      .fill(
        'input#root_childInfo_personChildLiveWith_firstName',
        data.dependents[index].personWhoLivesWithChild.first,
      )
      .fill(
        'input#root_childInfo_personChildLiveWith_lastName',
        data.dependents[index].personWhoLivesWithChild.last,
      );
  }
}

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/dependents_applications',
    verb: 'post',
    value: {
      data: {
        attributes: {
          confirmationNumber: '123fake-submission-id-567',
          submittedAt: '2016-05-16',
        },
      },
    },
  });
}

module.exports = {
  completeClaimantInformation,
  completeDependentAddressInfo,
  completeDependentsInformation,
  completeDependentInfo,
  completeMarriage,
  completeMarriageInformation,
  completeSpouseInformation,
  completeSpouseMarriageInformation,
  completeVeteranInformation,
  initApplicationSubmitMock,
};
