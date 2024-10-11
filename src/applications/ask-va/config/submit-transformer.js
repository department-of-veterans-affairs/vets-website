const getSchoolInfo = school => {
  if (!school) return null;
  const schoolInfo = school.split('-');
  const schoolCode = schoolInfo.splice(0, 1);

  return { code: schoolCode[0].trim(), name: schoolInfo.join(' ').trim() };
};

const getFiles = files => {
  if (!files) {
    return [
      {
        FileName: null,
        FileContent: null,
      },
    ];
  }

  return files.map(file => {
    return {
      FileName: file.fileName,
      FileContent: file.base64,
    };
  });
};

const determineInquiryDetails = data => {
  const {
    selectCategory,
    selectTopic,
    yourRole,
    whoIsYourQuestionAbout,
    relationshipToVeteran,
    moreAboutYourRelationshipToVeteran,
    aboutYourRelationshipToFamilyMember,
    isQuestionAboutVeteranOrSomeoneElse,
    theirRelationshipToVeteran,
  } = data;

  const isEducationBenefits =
    selectCategory === 'Education benefits and work study' &&
    selectTopic !== 'Veteran Readiness and Employment';

  // Default return structure
  const inquiryDetails = {
    inquiryAbout: 'Unknown inquiry type',
    dependentRelationship: null,
    veteranRelationship: null,
    levelOfAuthentication: 'Unknown',
  };

  // Determine the level of authentication
  const levelOfAuthentication = yourRole ? 'Business' : 'Personal';

  if (isEducationBenefits) {
    inquiryDetails.inquiryAbout = "It's a general question";
    inquiryDetails.dependentRelationship = null;
    inquiryDetails.veteranRelationship = yourRole || null;
    inquiryDetails.levelOfAuthentication = levelOfAuthentication;
    return inquiryDetails;
  }

  // whoIsYourQuestionAbout === Myself, relationshipToVeteran === I'm the veteran
  if (whoIsYourQuestionAbout === 'Myself') {
    if (relationshipToVeteran === "I'm the Veteran") {
      inquiryDetails.inquiryAbout = 'About Me, the Veteran';
      inquiryDetails.levelOfAuthentication = 'Personal';
      return inquiryDetails;
    }
    // whoIsYourQuestionAbout === Myself, relationshipToVeteran === I'm a family member of a Veteran, moreAboutYourRelationshipToVeteran
    if (
      relationshipToVeteran === "I'm a family member of a Veteran" &&
      moreAboutYourRelationshipToVeteran
    ) {
      inquiryDetails.inquiryAbout = 'For the dependent of a Veteran';
      inquiryDetails.veteranRelationship = moreAboutYourRelationshipToVeteran;
      inquiryDetails.levelOfAuthentication = 'Personal';
      return inquiryDetails;
    }
  }
  // whoIsYourQuestionAbout === Someone else, relationshipToVeteran === I'm the veteran, aboutYourRelationshipToFamilyMember
  if (whoIsYourQuestionAbout === 'Someone else') {
    if (
      relationshipToVeteran === "I'm the Veteran" &&
      aboutYourRelationshipToFamilyMember
    ) {
      inquiryDetails.inquiryAbout = 'For the dependent of a Veteran';
      inquiryDetails.dependentRelationship = aboutYourRelationshipToFamilyMember;
      inquiryDetails.levelOfAuthentication = 'Personal';
      return inquiryDetails;
    }
    // whoIsYourQuestionAbout === Someone else, relationshipToVeteran === I'm a family member of a Veteran, isQuestionaboutVeteranOrSomeoneElse === Veteran, theirRelationshipToVeteran, this is veteranRelationship to submitter
    if (relationshipToVeteran === "I'm a family member of a Veteran") {
      if (
        isQuestionAboutVeteranOrSomeoneElse === 'Veteran' &&
        theirRelationshipToVeteran
      ) {
        inquiryDetails.inquiryAbout = 'On Behalf of a Veteran';
        inquiryDetails.veteranRelationship = theirRelationshipToVeteran;
        inquiryDetails.levelOfAuthentication = 'Personal';
        return inquiryDetails;
      }
      // whoIsYourQuestionAbout === Someone else, relationshipToVeteran === I'm a family member of a Veteran, isQuestionaboutVeteranOrSomeoneElse === Someone else, theirRelationshipToVeteran
      if (
        isQuestionAboutVeteranOrSomeoneElse === 'Someone else' &&
        theirRelationshipToVeteran
      ) {
        inquiryDetails.inquiryAbout = 'For the dependent of a Veteran';
        inquiryDetails.dependentRelationship = theirRelationshipToVeteran;
        inquiryDetails.levelOfAuthentication = 'Personal';
        return inquiryDetails;
      }
    }

    if (yourRole) {
      inquiryDetails.inquiryAbout = 'On Behalf of a Veteran';
      inquiryDetails.veteranRelationship = yourRole;
      inquiryDetails.levelOfAuthentication = 'Business';
      return inquiryDetails;
    }
  }

  return inquiryDetails;
};

export default function submitTransformer(formData, uploadFiles) {
  const inquiryDetails = determineInquiryDetails(formData);

  return {
    AreYouTheDependent: null,
    AttachmentPresent: null,
    BranchOfService: formData.branchOfService,
    City: formData.address.city,
    ContactMethod: formData.contactPreference,
    Country: formData.country,
    DaytimePhone: formData.phoneNumber,
    DependantCity: null,
    DependantCountry: null,
    DependantDOB: formData.aboutTheFamilyMember.dateOfBirth,
    DependantEmail: null,
    DependantFirstName: formData.aboutTheFamilyMember.first,
    DependantGender: null,
    DependantLastName: formData.aboutTheFamilyMember.last,
    DependantMiddleName: formData.aboutTheFamilyMember.middle,
    DependantProvince: null,
    DependantRelationship: formData.aboutTheFamilyMember.first
      ? inquiryDetails.dependentRelationship
      : null,
    DependantSSN: null,
    DependantState: formData.familyMembersLocationOfResidence,
    DependantStreetAddress: null,
    DependantZipCode: formData.postalCode,
    EmailAddress: formData.emailAddress,
    EmailConfirmation: formData.emailAddress,
    FirstName: formData.aboutYourself.first,
    Gender: null,
    InquiryAbout: inquiryDetails.inquiryAbout,
    InquiryCategory: formData.selectCategory,
    InquirySource: 'AVA',
    InquirySubtopic: formData.selectSubtopic,
    InquirySummary: formData.subject,
    InquiryTopic: formData.selectTopic,
    InquiryType: null,
    IsVAEmployee: null,
    IsVeteran: null,
    IsVeteranAnEmployee: true,
    IsVeteranDeceased: formData.isVeteranDeceased,
    LevelOfAuthentication: inquiryDetails.levelOfAuthentication,
    MedicalCenter: null,
    MiddleName: formData.aboutYourself.middle,
    PreferredName: formData.preferredName,
    Pronouns: formData.pronouns,
    ResponseType: formData.contactPreference,
    StreetAddress2: formData.address.street2,
    SubmitterDOB: formData.aboutYourself.dateOfBirth,
    SubmitterProvince: null,
    SubmitterQuestion: 'I would like to know more about my claims',
    SubmittersDodIdEdipiNumber: null,
    SubmitterSSN: formData.aboutYourself.ssn,
    SubmitterState: formData.address.state,
    SubmitterStateOfResidency: formData.yourLocationOfResidences,
    SubmitterStateOfSchool: formData.stateOfTheSchool,
    SubmitterStateProperty: null,
    SubmitterStreetAddress: formData.address.street,
    SubmitterVetCenter: null,
    SubmitterZipCodeOfResidency: formData.postalCode,
    Suffix: formData.aboutYourself.suffix,
    UntrustedFlag: null,
    VeteranClaimNumber: null,
    VeteranDateOfDeath: null,
    VeteranDOB: formData.aboutTheVeteran.dateOfBirth,
    VeteranDodIdEdipiNumber: null,
    VeteranEmail: null,
    VeteranEmailConfirmation: null,
    VeteranEnrolled: null,
    VeteranFirstName: formData.aboutTheVeteran.first,
    VeteranICN: null,
    VeteranLastName: formData.aboutTheVeteran.last,
    VeteranMiddleName: formData.aboutTheVeteran.middle,
    VeteranPhone: null,
    VeteranPreferedName: null,
    VeteranPronouns: null,
    VeteranProvince: null,
    VeteranRelationship: formData.aboutTheVeteran.first
      ? inquiryDetails.veteranRelationship
      : null,
    VeteranServiceEndDate: null,
    VeteranServiceNumber: null,
    VeteranServiceStartDate: null,
    VeteranSSN: formData.aboutTheVeteran.socialOrServiceNum.ssn,
    VeteransState: null,
    VeteranStreetAddress: null,
    VeteranSuffix: formData.aboutTheVeteran.suffix,
    VeteranSuiteAptOther: null,
    VeteranZipCode: formData.VeteranPostalCode,
    WhoWasTheirCounselor: null,
    YourLastName: formData.aboutYourself.last,
    ZipCode: formData.postalCode,
    School: {
      City: null,
      InstitutionName: getSchoolInfo(formData.school)?.name, // may also come from ava profile prefill
      SchoolFacilityCode: getSchoolInfo(formData.school)?.code, // may also come from ava profile prefill
      StateAbbreviation: formData.stateOfTheSchool || null,
      RegionalOffice: null,
    },
    ListOfAttachments: getFiles(uploadFiles),
    SubmitterProfile: {
      FirstName: formData.aboutYourself.first,
      MiddleName: formData.aboutYourself.middle,
      LastName: formData.aboutYourself.last,
      PreferredName: formData.preferredName,
      Suffix: formData.aboutYourself.suffix,
      Gender: formData.gender,
      Pronouns: formData.pronouns,
      Country: formData.country,
      Street: formData.address.street,
      City: formData.address.city,
      State: formData.address.state,
      ZipCode: formData.postalCode,
      Province: formData.province,
      BusinessPhone: null,
      PersonalPhone: formData.phoneNumber,
      PersonalEmail: formData.emailAddress,
      SSN: formData.aboutYourself.ssn,
      BusinessEmail: null,
      SchoolState: formData.stateOfTheSchool,
      SchoolFacilityCode: getSchoolInfo(formData.school)?.code,
      ServiceNumber: null,
      ClaimNumber: null,
      VeteranServiceStateDate: null,
      VeteranServiceEndDate: null,
      DateOfBirth: formData.aboutYourself.dateOfBirth,
      EDIPI: null,
      ICN: null,
    },
    VeteranProfile: {
      FirstName: formData.aboutTheVeteran.first,
      MiddleName: formData.aboutTheVeteran.middle,
      LastName: formData.aboutTheVeteran.last,
      PreferredName: formData.aboutTheVeteran.preferredName,
      Suffix: formData.aboutTheVeteran.suffix,
      Gender: formData.aboutTheVeteran.gender,
      Pronouns: formData.aboutTheVeteran.pronouns,
      Country: formData.aboutTheVeteran.country,
      Street: formData.aboutTheVeteran.street,
      City: formData.aboutTheVeteran.city,
      State: formData.aboutTheVeteran.state,
      ZipCode: formData.aboutTheVeteran.zipCode,
      Province: formData.aboutTheVeteran.province,
      BusinessPhone: formData.aboutTheVeteran.businessPhone,
      PersonalPhone: formData.aboutTheVeteran.personalPhone,
      PersonalEmail: formData.aboutTheVeteran.emailAddress,
      SSN: formData.aboutTheVeteran.socialOrServiceNum.ssn,
      BusinessEmail: formData.aboutTheVeteran.businessEmail,
      SchoolState: formData.aboutTheVeteran.schoolState,
      SchoolFacilityCode: formData.aboutTheVeteran.schoolFacilityCode,
      ServiceNumber: formData.aboutTheVeteran.serviceNumber,
      ClaimNumber: formData.aboutTheVeteran.claimNumber,
      VeteranServiceStateDate: formData.aboutTheVeteran.serviceStartDate,
      VeteranServiceEndDate: formData.aboutTheVeteran.serviceEndDate,
      DateOfBirth: formData.aboutTheVeteran.dateOfBirth,
      EDIPI: null,
      ICN: null,
    },
  };
}
