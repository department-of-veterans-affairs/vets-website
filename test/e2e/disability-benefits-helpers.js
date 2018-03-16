const mock = require('./mock-helpers');

function completeApplicantInformation(client, data) {
  client
    .fillName('root_veteranFullName', data.veteranFullName)
    .selectRadio('root_gender', data.gender)
    .fill('input[name="root_veteranSocialSecurityNumber"]', data.veteranSocialSecurityNumber)
    .fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth)
    .selectDropdown('root_serviceBranch', data.serviceBranch);
}

function completeEvidenceTypeInformation(client, data) {
  client
    .fillCheckbox('input[name="root_view:vaMedicalRecords"]', data.disabilities[0]['view:vaMedicalRecords'])
    .fillCheckbox('input[name="root_view:privateMedicalRecords"]', data.disabilities[0]['view:privateMedicalRecords'])
    .fillCheckbox('input[name="root_view:otherEvidence"]', data.disabilities[0]['view:otherEvidence']);
}

function completeVAFacilitiesInformation(client, data) {
  client
    .selectDropdown('root_treatments_0_treatment_startTreatmentMonth', data.treatments[0].startTreatmentMonth)
    .selectDropdown('root_treatments_0_treatment_startTreatmentDay', data.treatments[0].startTreatmentDay)
    .fill('input[name="root_treatments_0_treatment_startTreatmentYear"]', data.treatments[0].startTreatmentYear)
    .selectDropdown('root_treatments_0_treatment_endTreatmentMonth', data.treatments[0].endTreatmentMonth)
    .selectDropdown('root_treatments_0_treatment_endTreatmentDay', data.treatments[0].endTreatmentDay)
    .fill('input[name="root_treatments_0_treatment_endTreatmentYear"]', data.treatments[0].endTreatmentYear)
    .fill('input[name="root_treatments_0_treatment_treatmentCenterName"]', data.treatments[0].treatmentCenterName);
}

function completePrivateMedicalRecordsChoice(client, data) {
  client
    .selectRadio('root_view:uploadPrivateRecords', data.disabilities[0]['view:uploadPrivateRecords']);
}

function initApplicationSubmitMock() {
  mock(null, {
    path: '/v0/21-526EZ',
    verb: 'post',
    value: {
      data: {
        attributes: {
          guid: '123fake-submission-id-567'
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
          guid: '123fake-submission-id-567'
        }
      }
    }
  });
}

module.exports = {
  initApplicationSubmitMock,
  initDocumentUploadMock,
  completeApplicantInformation,
  completeEvidenceTypeInformation,
  completeVAFacilitiesInformation,
  completePrivateMedicalRecordsChoice
};
