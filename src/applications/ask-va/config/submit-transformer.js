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

export default function submitTransformer(formData, uploadFiles) {
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
    DependantRelationship: formData.theirRelationshipToVeteran,
    DependantSSN: null,
    DependantState: formData.familyMembersLocationOfResidence,
    DependantStreetAddress: null,
    DependantZipCode: formData.postalCode,
    EmailAddress: formData.emailAddress,
    EmailConfirmation: formData.emailAddress,
    FirstName: formData.aboutYourself.first,
    Gender: null,
    InquiryAbout: formData.whoIsYourQuestionAbout,
    InquiryCategory: formData.selectCategory,
    InquirySource: 'AVA',
    InquirySubtopic: formData.selectSubtopic,
    InquirySummary: formData.subject,
    InquiryTopic: formData.selectTopic,
    IsVAEmployee: null,
    IsVeteran: null,
    IsVeteranAnEmployee: true,
    IsVeteranDeceased: formData.isVeteranDeceased,
    LevelOfAuthentication: null,
    MedicalCenter: null,
    MiddleName: formData.aboutYourself.middle,
    PreferredName: formData.preferredName,
    Pronouns: formData.pronouns,
    ResponseType: formData.contactPreference,
    StreetAddress2: formData.address.street2,
    SubmitterDependent: null,
    SubmitterDOB: null,
    SubmitterGender: null,
    SubmitterProvince: null,
    SubmitterQuestion: 'I would like to know more about my claims',
    SubmitterState: formData.address.state,
    SubmitterStateOfResidency: formData.yourLocationOfResidences,
    SubmitterStateOfSchool: formData.stateOfTheSchool,
    SubmitterStateProperty: null,
    SubmitterStreetAddress: formData.address.street,
    SubmitterVetCenter: null,
    SubmitterZipCodeOfResidency: formData.postalCode,
    Suffix: formData.aboutYourself.suffix,
    SupervisorFlag: null,
    VaEmployeeTimeStamp: null,
    VeteranCity: null,
    VeteranClaimNumber: null,
    VeteranCountry: null,
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
    VeteranRelationship: formData.moreAboutYourRelationshipToVeteran,
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
      SchoolFacilityCode: getSchoolInfo(FormData.school)?.code, // may also come from ava profile prefill
      StateAbbreviation: formData.stateOfTheSchool || null,
      RegionalOffice: null,
    },
    ListOfAttachments: getFiles(uploadFiles),
  };
}
