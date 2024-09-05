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
    transformedData.accreditationTypeId = ACCREDITATION_TYPE_ID;
   };

  const setName = () => {
    transformedData.firstName = fullName.first;
    transformedData.lastName = fullName.last;
    
    if(fullName?.middle) transformedData.middleName = fullName.middle;
    if(fullName?.suffix) transformedData.suffix = fullName.suffix;
  };

  const setBirth = () => {
    transformedData.birthdate = form.data.dateOfBirth;
    transformedData.birthCity = placeOfBirth.city;
    transformedData.birthState = placeOfBirth.state;
    transformedData.birthCountry = placeOfBirth.country;
  };

  const setHomeAddress = () => {
    transformedData.homeAddress = {
      addressType: homeAddress.isMilitary,
      line1: homeAddress.street,
      city: homeAddress.city,
      postalCode: homeAddress.postalCode,
      country: homeAddress.country,
    };

    if(homeAddress?.street2) transformedData.homeAddress.line2 = homeAddress.street2;
  }

  const setContactInfo = () => {
    transformedData.homePhone = form.data.phone;
    transformedData.phoneType = {
      name: form.data.typeOfPhone,
    };
    transformedData.homeEmail = form.data.email;
  };

  const setEmployment = () => {
    transformedData.employmentStatus = form.employmentStatus;
    transformedData.employmentStatusExplanation = form.describeEmployment;
    transformedData.businessAddress = {
      addressType: workAddress.isMilitary,
      line1: workAddress.street,
      city: workAddress.city,
      state: workAddress.state,
      postalCode: workAddress.postalCode,
      country: workAddress.country,
    };

    if(workAddress.street2) transformedData.businessAddress.line2 = workAddress.street2;

  };

  const setMilitaryService = () => {
    transformedData.militaryServices = [];

    for (let i = 0; i < militaryServiceExperiences.length; i += 1) {
      let service = {
        dischargeTypeExplanation: militaryServiceExperiences[i].explanationOfDischarge,
        entryDate: militaryServiceExperiences[i].dateRange,
        dischargeDate: militaryServiceExperiences[i].dateRange,
        serviceBranch: {
          name: militaryServiceExperiences[i].branch,
        },
        dischargeType: {
          name: militaryServiceExperiences[i].characterOfDischarge,
        }
      };

      transformedData.militaryServices.push(service);
    }
  };

  const setEmploymentHistory = () => {
    transformedData.employment = [];

    for (let i = 0; i < employers.length; i += 1) {
      let employer = {
        phoneNumber: employers[i].phone,
        phoneExtension: employers[i].extension,
        positionTitle: employers[i].positionTitle,
        supervisorName: employers[i].supervisorName,
        employerAddress: {
          addressType: employers[i].address.isMilitary,
          line1: employers[i].address.street,
          city: employers[i].address.city,
          state: employers[i].address.state,
          postalCode: employers[i].address.postalCode,
          country: employers[i].address.country,
        }
      };

      if(employers[i].address?.street2) employer.employerAddress.line2 = employers[i].address.street2;

      transformedData.employment.push(employer);
    }
  };

  const setEducation = () => {
    transformedData.education = [];

    for (let i = 0; i < educationalInstitutions.length; i += 1) {
      let institution = {
        wasDegreeReceived: educationalInstitutions[i].degreeReceived,
        major: educationalInstitutions[i].major,
        degreeType: {
          name: educationalInstitutions[i].degree
        },
        institutionAddress: {
          addressType: educationalInstitutions[i].address.isMilitary,
          line1: educationalInstitutions[i].address.street,
          city: educationalInstitutions[i].address.city,
          state: educationalInstitutions[i].address.state,
          postalCode: educationalInstitutions[i].address.postalCode,
          country: educationalInstitutions[i].address.country
        }
      };

      if(educationalInstitutions[i].address?.street2) institution.institutionAddress.line2 = educationalInstitutions[i].address.street2;

      transformedData.education.push(institution);
    }
  };

  const setJurisdictions = () => {
    transformedData.jurisdictions = [];

    for (let i = 0; i < jurisdictions.length; i += 1) {
      let jurisdiction = {
        name: jurisdictions[i].jurisdiction,
        admissionDate: jurisdictions[i].admissionDate,
        membershipRegistrationNumber: jurisdictions[i].membershipOrRegistrationNumber,
      };

      transformedData.jurisdictions.push(jurisdiction);
    }
  };

  const setAgencies = () => {
    transformedData.agencies = [];

    for (let i = 0; i < agenciesOrCourts.length; i += 1) {
      let agency = {
        name: agenciesOrCourts[i].name,
        admissionDate: agenciesOrCourts[i].admissionDate,
        membershipRegistrationNumber: agenciesOrCourts[i].membershipOrRegistrationNumber,
      };

      transformedData.agencies.push(agency);
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
