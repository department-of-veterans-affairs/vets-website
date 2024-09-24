import {
  ADDRESS_TYPE_ID,
  EMPLOYMENT_STATUS_ID,
  SERVICE_BRANCH_ID,
  DISCHARGE_TYPE_ID,
  PHONE_TYPE_ID,
  DEGREE_TYPE_ID,
  ADMITTANCE_TYPE_ID,
  RELATION_TO_APPLICANT_ID,
} from './enums';

const transformedData = {};

const setName = fullName => {
  transformedData.firstName = fullName.first;
  transformedData.lastName = fullName.last;

  if (fullName?.middle) transformedData.middleName = fullName.middle;
  if (fullName?.suffix) transformedData.suffix = fullName.suffix;
};

const setBirth = (placeOfBirth, form) => {
  transformedData.birthDate = form.data.dateOfBirth;
  transformedData.birthCity = placeOfBirth.city;
  transformedData.birthState = placeOfBirth.state;
  transformedData.birthCountry = placeOfBirth.country;
};

const setHomeAddress = homeAddress => {
  transformedData.homeAddress = {
    addressType: homeAddress.isMilitary,
    line1: homeAddress.street,
    city: homeAddress.city,
    postalCode: homeAddress.postalCode,
    country: homeAddress.country,
  };

  transformedData.homeAddressId = ADDRESS_TYPE_ID.home;

  if (homeAddress?.street2)
    transformedData.homeAddress.line2 = homeAddress.street2;
};

const setContactInfo = form => {
  transformedData.homePhone = form.data.phone;
  transformedData.phoneTypeId = PHONE_TYPE_ID[form.data.typeOfPhone];
  transformedData.phoneType = {
    name: form.data.typeOfPhone,
  };
  transformedData.homeEmail = form.data.email;
};

const setEmployment = (workAddress, form) => {
  const employmentStatus = Object.keys(form.data.employmentStatus)[0];
  transformedData.employmentStatus = employmentStatus;
  transformedData.employmentStatusId = EMPLOYMENT_STATUS_ID[employmentStatus];
  if (form.data.describeEmployment) {
    transformedData.employmentStatusExplanation = form.data.describeEmployment;
  }

  if (employmentStatus === 'employed') {
    transformedData.businessAddress = {
      addressType: workAddress.isMilitary,
      line1: workAddress.street,
      city: workAddress.city,
      state: workAddress.state,
      postalCode: workAddress.postalCode,
      country: workAddress.country,
    };

    transformedData.businessAddressId = ADDRESS_TYPE_ID.business;

    if (workAddress.street2)
      transformedData.businessAddress.line2 = workAddress.street2;
  }
};

const setMilitaryService = militaryServiceExperiences => {
  transformedData.militaryServices = [];

  for (let i = 0; i < militaryServiceExperiences.length; i += 1) {
    const service = {
      dischargeTypeExplanation:
        militaryServiceExperiences[i].explanationOfDischarge,
      serviceBranch: {
        name: militaryServiceExperiences[i].branch,
      },
      dischargeType: {
        name: militaryServiceExperiences[i].characterOfDischarge,
      },
      dischargeTypeId:
        DISCHARGE_TYPE_ID[militaryServiceExperiences[i].characterOfDischarge],
      serviceBranchId: SERVICE_BRANCH_ID[militaryServiceExperiences[i].branch],
    };

    transformedData.militaryServices.push(service);
  }
};

const setEmploymentHistory = employers => {
  transformedData.employment = [];

  for (let i = 0; i < employers.length; i += 1) {
    const employer = {
      phoneNumber: employers[i].phone,
      phoneExtension: employers[i].extension,
      phoneTypeId: PHONE_TYPE_ID.Work,
      positionTitle: employers[i].positionTitle,
      supervisorName: employers[i].supervisorName,
      employerAddress: {
        addressType: employers[i].address.isMilitary,
        line1: employers[i].address.street,
        city: employers[i].address.city,
        state: employers[i].address.state,
        postalCode: employers[i].address.postalCode,
        country: employers[i].address.country,
      },
      employerAddressId: ADDRESS_TYPE_ID.business,
    };

    if (employers[i].address?.street2)
      employer.employerAddress.line2 = employers[i].address.street2;

    transformedData.employment.push(employer);
  }
};

const setEducation = educationalInstitutions => {
  transformedData.education = [];

  for (let i = 0; i < educationalInstitutions.length; i += 1) {
    const institution = {
      wasDegreeReceived: educationalInstitutions[i].degreeReceived,
      major: educationalInstitutions[i].major,
      degreeType: {
        name: educationalInstitutions[i].degree,
      },
      institutionAddress: {
        addressType: educationalInstitutions[i].address.isMilitary,
        line1: educationalInstitutions[i].address.street,
        city: educationalInstitutions[i].address.city,
        state: educationalInstitutions[i].address.state,
        postalCode: educationalInstitutions[i].address.postalCode,
        country: educationalInstitutions[i].address.country,
      },
      institutionAddressId: ADDRESS_TYPE_ID.institution,
      degreeTypeId: DEGREE_TYPE_ID[educationalInstitutions[i].degree],
    };

    if (educationalInstitutions[i].address?.street2)
      institution.institutionAddress.line2 =
        educationalInstitutions[i].address.street2;

    transformedData.education.push(institution);
  }
};

const setJurisdictions = jurisdictions => {
  transformedData.jurisdictions = [];

  for (let i = 0; i < jurisdictions.length; i += 1) {
    const jurisdiction = {
      name: jurisdictions[i].jurisdiction,
      admissionDate: jurisdictions[i].admissionDate,
      membershipRegistrationNumber:
        jurisdictions[i].membershipOrRegistrationNumber,
      admittanceTypeId: ADMITTANCE_TYPE_ID.Jurisdiction,
    };

    transformedData.jurisdictions.push(jurisdiction);
  }
};

const setAgencies = agenciesOrCourts => {
  transformedData.agencies = [];

  for (let i = 0; i < agenciesOrCourts.length; i += 1) {
    const agency = {
      name: agenciesOrCourts[i].name,
      admissionDate: agenciesOrCourts[i].admissionDate,
      membershipRegistrationNumber:
        agenciesOrCourts[i].membershipOrRegistrationNumber,
      admittanceTypeId: ADMITTANCE_TYPE_ID.Agency,
    };

    transformedData.agencies.push(agency);
  }
};

const setCharacterReferences = characterReferences => {
  transformedData.characterReferences = [];

  for (let i = 0; i < characterReferences.length; i += 1) {
    const characterReference = {
      firstName: characterReferences[i].fullName.first,
      middleName: characterReferences[i].fullName.middle,
      lastName: characterReferences[i].fullName.last,
      suffix: characterReferences[i].fullName.suffix,
      addressLine1: characterReferences[i].address.street,
      addressLine2: characterReferences[i].address?.street2,
      addressCity: characterReferences[i].address.city,
      addressState: characterReferences[i].address.state,
      addressPostalCode: characterReferences[i].address.postalCode,
      addressCountry: characterReferences[i].address.country,
      addressIsMilitary: characterReferences[i].address.isMilitary,
      phoneNumber: characterReferences[i].phone,
      phoneTypeId: PHONE_TYPE_ID.Home,
      email: characterReferences[i].email,
      relationshipToApplicantTypeId:
        RELATION_TO_APPLICANT_ID[characterReferences[i].relationship],
      addressId: ADDRESS_TYPE_ID.home,
    };

    transformedData.characterReferences.push(characterReference);
  }
};

const setBackgroundInfo = form => {
  transformedData.wasImprisoned = form.data.conviction;
  transformedData.wasMilitaryConviction = form.data.courtMartialed;
  transformedData.isCurrentlyCharged = form.data.underCharges;
  transformedData.wasSuspended = form.data.resignedFromEducation;
  transformedData.hasWithdrawn = form.data.withdrawnFromEducation;
  transformedData.wasDisciplined = form.data.disciplinedForDishonesty;
  transformedData.hasResignedRetired = form.data.resignedForDishonesty;
  transformedData.wasAgentAttorney = form.data.representativeForAgency;
  transformedData.wasReprimanded = form.data.reprimandedInAgency;
  transformedData.hasResignedToAvoidReprimand = form.data.resignedFromAgency;
  transformedData.hasAppliedForAccreditation =
    form.data.appliedForVaAccreditation;
  transformedData.wasAccreditationTerminated = form.data.terminatedByVsorg;
  transformedData.hasImpairments = form.data.conditionThatAffectsRepresentation;
  transformedData.hasPhysicalLimitations =
    form.data.conditionThatAffectsExamination;
};

const transformForSubmit = (_formConfig, form) => {
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
    characterReferences,
  } = form.data;

  setName(fullName);
  setBirth(placeOfBirth, form);
  setHomeAddress(homeAddress);
  setContactInfo(form);
  setEmployment(workAddress, form);
  setMilitaryService(militaryServiceExperiences);
  setEmploymentHistory(employers);
  setEducation(educationalInstitutions);
  setJurisdictions(jurisdictions);
  setAgencies(agenciesOrCourts);
  setCharacterReferences(characterReferences);
  setBackgroundInfo(form);

  return JSON.stringify({ ...transformedData });
};

export default transformForSubmit;
