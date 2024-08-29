import _ from 'platform/utilities/data';

import { transformForSubmit as platformTransformForSubmit } from '~/platform/forms-system/exportsFile';

const transformForSubmit = (formConfig, form) => {
  let formData = {};

  const setName = () => {

    formData['firstName'] = form.data.fullName.first;
    formData['lastName'] = form.data.fullName.last;
    
    if(form.data.fullName?.middle) formData['middleName'] = form.data.fullName.middle;
    if(form.data.fullName?.suffix) formData['suffix'] = form.data.fullName.suffix;
  };

  const setBirth = () => {
    formData['birthdate'] = form.data.dateOfBirth;
    formData['birthCity'] = form.data.placeOfBirth.city;
    formData['birthState'] = form.data.placeOfBirth.state;
    formData['birthCountry'] = form.data.placeOfBirth.country;
  };

  const setHomeAddress = () => {
    formData['homeAddress'] = {};
    formData['homeAddress'].addressType = form.data.homeAddress.isMilitary;
    formData['homeAddress'].line1 = form.data.homeAddress.street;
    if(form.data.homeAddress?.street2) formData['homeAddress'].line2 = form.data.homeAddress.street2;
    formData['homeAddress'].city = form.data.homeAddress.city;
    formData['homeAddress'].postalCode = form.data.homeAddress.postalCode;
    formData['homeAddress'].country = form.data.homeAddress.country;
  }

  const setContactInfo = () => {
    formData['homePhone'] = form.data.phone;
    formData['phoneType'] = {};
    formData['phoneType'].name = form.data.typeOfPhone;
    formData['homeEmail'] = form.data.email;
  };

  const setEmployment = () => {
    formData['employmentStatus'] = form.employmentStatus;
    formData['employmentStatusExplanation'] = form.describeEmployment;
    formData['businessAddress'] = {};
    formData['businessAddress'].addressType = form.workAddress.isMilitary;
    formData['businessAddress'].line1 = form.workAddress.street;
    formData['businessAddress'].line2 = form.workAddress.street2;
    formData['businessAddress'].city = form.workAddress.city;
    formData['businessAddress'].state = form.workAddress.state;
    formData['businessAddress'].postalCode = form.workAddress.postalCode;
    formData['businessAddress'].country = form.workAddress.country;
  };

  const setMilitaryService = () => {
    formData['militaryServices'] = [];

    for (let i = 0; i < form.data.militaryServiceExperiences.length; i += 1) {
      let service = {};

      service['serviceBranch'].name = form.data.militaryServiceExperiences[i].branch;
      service['dischargeType'].name = form.data.militaryServiceExperiences[i].characterOfDischarge;
      service['dischargeTypeExplanation'] = form.data.militaryServiceExperiences[i].explanationOfDischarge;
      service['entryDate'] = form.data.militaryServiceExperiences[i].dateRange;
      service['dischargeDate'] = form.data.militaryServiceExperiences[i].dateRange;

      formData['militaryServices'].push(service);
    }
  };

  const setEmploymentHistory = () => {
    formData['employment'] = [];

    for (let i = 0; i < form.data.employers.length; i += 1) {
      let employer = {};

      employer['employerAddress'].addressType = form.data.employers[i].address.isMilitary;
      employer['employerAddress'].line1 = form.data.employers[i].address.street;
      employer['employerAddress'].line2 = form.data.employers[i].address.street2;
      employer['employerAddress'].city = form.data.employers[i].address.city;
      employer['employerAddress'].state = form.data.employers[i].address.state;
      employer['employerAddress'].postalCode = form.data.employers[i].address.postalCode;
      employer['employerAddress'].country = form.data.employers[i].address.country;
      employer['phoneNumber'] = form.data.employers[i].phone;
      employer['phoneExtension'] = form.data.employers[i].extension;
      employer['positionTitle'] = form.data.employers[i].positionTitle;
      employer['startDate'] = form.data.employers[i].dateRange;
      employer['supervisorName'] = form.data.employers[i].supervisorName;

      formData['employment'].push(employer);
    }
  };

  const setEducation = () => {
    formData['education'] = [];

    for (let i = 0; i < form.data.educationalInstitutions.length; i += 1) {
      let institution = {};

      institution['institutionAddress'].addressType = form.data.educationalInstitutions[i].address.isMilitary;
      institution['institutionAddress'].line1 = form.data.educationalInstitutions[i].address.street;
      institution['institutionAddress'].line2 = form.data.educationalInstitutions[i].address.street2;
      institution['institutionAddress'].city = form.data.educationalInstitutions[i].address.city;
      institution['institutionAddress'].state = form.data.educationalInstitutions[i].address.state;
      institution['institutionAddress'].postalCode = form.data.educationalInstitutions[i].address.postalCode;
      institution['institutionAddress'].country = form.data.educationalInstitutions[i].address.country;
      institution['wasDegreeReceived'] = form.data.educationalInstitutions[i].degreeReceived;
      institution['degreeType'].name = form.data.educationalInstitutions[i].degree;
      institution['major'] = form.data.educationalInstitutions[i].major;
      institution['startDate'] = form.data.educationalInstitutions[i].dateRange;

      formData['education'].push(institution);
    }
  };

  const setJurisdictions = () => {

  };

  setName();
  setHomeAddress();
  setContactInfo();

  return JSON.stringify({ ...formData });
};

export default transformForSubmit;
