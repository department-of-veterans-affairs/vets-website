const mock = require('./mock-helpers');
const Timeouts = require('./timeouts.js');

function completeClaimantInformation(client, data) {
  client
    .fillName('root_application_claimant_name', data.application.claimant.name)
    .fill('input[name="root_application_claimant_ssn"]', data.application.claimant.ssn)
    .fillDate('root_application_claimant_dateOfBirth', data.application.claimant.dateOfBirth)
    .selectRadio('root_application_claimant_relationshipToVet', data.application.claimant.relationshipToVet);

  if (data.application.claimant.relationshipToVet.type === 'other') {
    client
      .waitForElementVisible('input[name="root_application_claimant_relationship_other"]', Timeouts.normal)
      .fill('input[name="root_application_claimant_relationship_other"]', data.application.claimant.relationship.other)
      // Not sure what to do with this, exactly, but I'll make it an option.
      .clickIf('#root_application_claimant_relationship_view:isEntity', data.application.claimant.relationship.isEntity);
  }
}

function completeVeteranInformation(client, data) {
  client
    .fillName('root_application_veteran_currentName', data.application.veteran.currentName)
    .fill('input[name="root_application_veteran_ssn"]', data.application.veteran.ssn)
    .fill('input[name="root_application_veteran_militaryServiceNumber"]', data.application.veteran.militaryServiceNumber)
    .fillDate('root_application_veteran_dateOfBirth', data.application.veteran.dateOfBirth)
    .fill('input[name="root_application_veteran_placeOfBirth"]', data.application.veteran.placeOfBirth)
    .selectRadio('root_application_veteran_gender', data.application.veteran.gender)
    .selectRadio('root_application_veteran_maritalStatus', data.application.veteran.maritalStatus)
    .selectDropdown('root_application_veteran_militaryStatus', data.application.veteran.militaryStatus)
    .selectRadio('root_application_veteran_isDeceased', data.application.veteran.isDeceased)
    .fillDate('root_application_veteran_dateOfDeath', data.application.veteran.dateOfDeath);
}

function completeServicePeriods(client, data) {
  data.serviceRecords.forEach((tour, index) => {
    client
      .fillDate(`root_application_veteran_serviceRecords_${index}_dateRange_from`, tour.dateRange.from)
      .fillDate(`root_application_veteran_serviceRecords_${index}_dateRange_to`, tour.dateRange.to)
      .selectDropdown(`root_application_veteran_serviceRecords_${index}_serviceBranch`, tour.serviceBranch)
      .fill(`input[name="root_application_veteran_serviceRecords_${index}_highestRank"]`, tour.highestRank)
      .selectDropdown(`root_application_veteran_serviceRecords_${index}_dischargeType`, tour.dischargeType);

    // Keep adding them until we're finished.
    if (index < data.serviceRecords.length - 1) {
      client.click('.usa-button-secondary.va-growable-add-btn');
    }
  });
}

function completeServiceName(client, data) {
  client.selectRadio('root_application_veteran_view:hasServiceName', 'Y')
    .fillName('root_application_veteran_serviceName', data.serviceName);
}

function completeBenefitSelection(client, data) {
  client
    .fill('input[name="root_application_claimant_desiredCemetery"]', data.claimant.desiredCemetery.label)
    .selectRadio('root_application_hasCurrentlyBuried', data.hasCurrentlyBuried);
  if (data.currentlyBuriedPersons.length) {
    data.currentlyBuriedPersons.forEach((person, index) => {
      client.fill(`input[name="root_application_currentlyBuriedPersons_${index}_cemeteryNumber"]`, person.cemeteryNumber.label)
        .fillName(`root_application_currentlyBuriedPersons_${index}_name`, person.name);
      if (index < data.currentlyBuriedPersons.length - 1) {
        client.click('.usa-button-secondary.va-growable-add-btn');
      }
    });
  }
}

function completeClaimantContactInformation(client, data) {
  client
    .fillAddress('root_application_claimant_address', data.address)
    .fill('input[name$="email"]', data.email)
    .fill('input[name$="phoneNumber"]', data.phoneNumber);
}


function completeVeteranContactInformation(client, data) {
  client.fillAddress('root_application_veteran_address', data.address);
}


function completeApplicantContactInformation(client, data) {
  client.selectRadio('root_application_applicant_applicantRelationshipToClaimant', data.applicantRelationshipToClaimant);
  if (data.applicantRelationshipToClaimant === 'Authorized Agent/Rep') {
    client.fillName('root_application_applicant_view:applicantInfo_name', data['view:applicantInfo'].name)
      .fillAddress('root_application_applicant_view:applicantInfo_mailingAddress', data['view:applicantInfo'].mailingAddress)
      .fill('input[name$="applicantPhoneNumber"]', data['view:applicantInfo']['view:contactInfo'].applicantPhoneNumber);
  }
}


function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/burial_claims',
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

function initDocumentUploadMock() {
  mock(null, {
    path: '/v0/claim_attachments',
    verb: 'post',
    value: {
      data: {
        attributes: {
          attachmentId: '1',
          name: 'test.pdf',
          confirmationCode: 'e2128ec4-b2fc-429c-bad2-e4b564a80d20',
        }
      }
    }
  });
}

module.exports = {
  completeClaimantInformation,
  completeVeteranInformation,
  completeServicePeriods,
  completeServiceName,
  completeBenefitSelection,
  completeClaimantContactInformation,
  completeVeteranContactInformation,
  completeApplicantContactInformation,

  initApplicationSubmitMock,
  initDocumentUploadMock
};
