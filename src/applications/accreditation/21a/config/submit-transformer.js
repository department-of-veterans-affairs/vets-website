import {
  FORM_TYPE_ID,
  ACCREDITATION_TYPE_ID,
  APPLICATION_STATUS_ID,
  ADDRESS_TYPE_ID,
  EMPLOYMENT_STATUS_ID,
  SERVICE_BRANCH_ID,
  DISCHARGE_TYPE_ID,
  PHONE_TYPE_ID,
  INSTITUTION_TYPE_ID,
  DEGREE_TYPE_ID,
  ADMITTANCE_TYPE_ID,
  DOCUMENT_TYPE_ID,
  RELATION_TO_APPLICANT_ID
} from 'enums';

const transformForSubmit = (formConfig, form) => {
  let transformedData = {};

  const {
    fullName,
    placeOfBirth,
    homeAddress,
    workAddress,
    militaryServiceExperiences,
    employers,
    educationalInstitutions,
    jurisdictions,
    agenciesOrCourts,
   } = form.data;

   const setAccreditationTypeId = () => {
    transformedData['accreditationTypeId'] = ACCREDITATION_TYPE_ID;
   };

  const setName = () => {
    transformedData['firstName'] = fullName.first;
    transformedData['lastName'] = fullName.last;
    
    if(fullName?.middle) transformedData['middleName'] = fullName.middle;
    if(fullName?.suffix) transformedData['suffix'] = fullName.suffix;
  };

  const setBirth = () => {
    transformedData['birthdate'] = form.data.dateOfBirth;
    transformedData['birthCity'] = placeOfBirth.city;
    transformedData['birthState'] = placeOfBirth.state;
    transformedData['birthCountry'] = placeOfBirth.country;
  };

  const setHomeAddress = () => {
    transformedData['homeAddress'] = {};
    transformedData['homeAddress'].addressType = homeAddress.isMilitary;
    transformedData['homeAddress'].line1 = homeAddress.street;
    if(homeAddress?.street2) transformedData['homeAddress'].line2 = homeAddress.street2;
    transformedData['homeAddress'].city = homeAddress.city;
    transformedData['homeAddress'].postalCode = homeAddress.postalCode;
    transformedData['homeAddress'].country = homeAddress.country;
  }

  const setContactInfo = () => {
    transformedData['homePhone'] = form.data.phone;
    transformedData['phoneType'] = {};
    transformedData['phoneType'].name = form.data.typeOfPhone;
    transformedData['homeEmail'] = form.data.email;
  };

  const setEmployment = () => {
    transformedData['employmentStatus'] = form.employmentStatus;
    transformedData['employmentStatusExplanation'] = form.describeEmployment;
    transformedData['businessAddress'] = {};
    transformedData['businessAddress'].addressType = workAddress.isMilitary;
    transformedData['businessAddress'].line1 = workAddress.street;
    transformedData['businessAddress'].line2 = workAddress.street2;
    transformedData['businessAddress'].city = workAddress.city;
    transformedData['businessAddress'].state = workAddress.state;
    transformedData['businessAddress'].postalCode = workAddress.postalCode;
    transformedData['businessAddress'].country = workAddress.country;
  };

  const setMilitaryService = () => {
    transformedData['militaryServices'] = [];

    for (let i = 0; i < militaryServiceExperiences.length; i += 1) {
      let service = {};

      service['serviceBranch'].name = militaryServiceExperiences[i].branch;
      service['dischargeType'].name = militaryServiceExperiences[i].characterOfDischarge;
      service['dischargeTypeExplanation'] = militaryServiceExperiences[i].explanationOfDischarge;
      service['entryDate'] = militaryServiceExperiences[i].dateRange;
      service['dischargeDate'] = militaryServiceExperiences[i].dateRange;

      transformedData['militaryServices'].push(service);
    }
  };

  const setEmploymentHistory = () => {
    transformedData['employment'] = [];

    for (let i = 0; i < employers.length; i += 1) {
      let employer = {};

      employer['employerAddress'].addressType = employers[i].address.isMilitary;
      employer['employerAddress'].line1 = employers[i].address.street;
      employer['employerAddress'].line2 = employers[i].address.street2;
      employer['employerAddress'].city = employers[i].address.city;
      employer['employerAddress'].state = employers[i].address.state;
      employer['employerAddress'].postalCode = employers[i].address.postalCode;
      employer['employerAddress'].country = employers[i].address.country;
      employer['phoneNumber'] = employers[i].phone;
      employer['phoneExtension'] = employers[i].extension;
      employer['positionTitle'] = employers[i].positionTitle;
      employer['startDate'] = employers[i].dateRange;
      employer['supervisorName'] = employers[i].supervisorName;

      transformedData['employment'].push(employer);
    }
  };

  const setEducation = () => {
    transformedData['education'] = [];

    for (let i = 0; i < educationalInstitutions.length; i += 1) {
      let institution = {};

      institution['institutionAddress'].addressType = educationalInstitutions[i].address.isMilitary;
      institution['institutionAddress'].line1 = educationalInstitutions[i].address.street;
      institution['institutionAddress'].line2 = educationalInstitutions[i].address.street2;
      institution['institutionAddress'].city = educationalInstitutions[i].address.city;
      institution['institutionAddress'].state = educationalInstitutions[i].address.state;
      institution['institutionAddress'].postalCode = educationalInstitutions[i].address.postalCode;
      institution['institutionAddress'].country = educationalInstitutions[i].address.country;
      institution['wasDegreeReceived'] = educationalInstitutions[i].degreeReceived;
      institution['degreeType'].name = educationalInstitutions[i].degree;
      institution['major'] = educationalInstitutions[i].major;
      institution['startDate'] = educationalInstitutions[i].dateRange;

      transformedData['education'].push(institution);
    }
  };

  const setJurisdictions = () => {
    transformedData['jurisdictions'] = [];

    for (let i = 0; i < jurisdictions.length; i += 1) {
      let jurisdiction = {};

      jurisdiction['name'] = jurisdictions[i].jurisdiction;
      jurisdiction['admissionDate'] = jurisdictions[i].admissionDate;
      jurisdiction['membershipRegistrationNumber'] = jurisdictions[i].membershipOrRegistrationNumber;

      transformedData['jurisdictions'].push(jurisdiction);
    }
  };

  const setAgencies = () => {
    transformedData['agencies'] = [];

    for (let i = 0; i < agenciesOrCourts.length; i += 1) {
      let agency = {};

      agency['name'] = agenciesOrCourts[i].name;
      agency['admissionDate'] = agenciesOrCourts[i].admissionDate;
      agency['membershipRegistrationNumber'] = agenciesOrCourts[i].membershipOrRegistrationNumber;

      transformedData['agencies'].push(agency);
    }
  };

  setName();
  setBirth();
  setHomeAddress();
  setContactInfo();
  setEmployment();
  setMilitaryService();
  setEmploymentHistory();
  setEducation();
  setJurisdictions();
  setAgencies();

  return JSON.stringify({ ...transformedData });
};

export default transformForSubmit;
