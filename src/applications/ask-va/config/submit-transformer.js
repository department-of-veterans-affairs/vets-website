import { relationshipOptionsSomeoneElse } from '../constants';

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

const transformAddress = formData => {
  const { address } = formData;
  if (formData.address) {
    return {
      onBaseOutsideUS: address?.isMilitary,
      country: address?.country,
      address: {
        ...address,
        militaryAddress: {
          militaryPostOffice: address.isMilitary ? address?.city : null,
          militaryState: address.isMilitary ? address?.state : null,
        },
      },
    };
  }
  return {
    address: null,
  };
};

export default function submitTransformer(formData, uploadFiles) {
  /* eslint-disable no-param-reassign */
  const { stateOrResidency } = formData;

  let schoolName;
  let schoolCode;

  // Check if this is a business inquiry - only then prioritize business email
  const isWorkRelated =
    formData.relationshipToVeteran === relationshipOptionsSomeoneElse.WORK;

  // vets-api always looks for the field emailAddress or phoneNumber
  // Therefore send businessEmail and businessPhone if this is a work-related inquiry.
  // Otherwise the emailAddress and phoneNumber fields will already be filled with
  // the correct information from their profile.
  if (isWorkRelated) {
    formData.emailAddress = formData.businessEmail;
    formData.phoneNumber = formData.businessPhone;
  }

  if (stateOrResidency?.schoolState || stateOrResidency?.residencyState) {
    stateOrResidency.schoolState = stateOrResidency?.schoolState || null;
    stateOrResidency.residencyState = stateOrResidency?.residencyState || null;
  }

  if (formData?.school) {
    const schoolInfo = getSchoolInfo(formData.school);
    if (schoolInfo) {
      schoolName = schoolInfo.name;
      schoolCode = schoolInfo.code;
    }
  } else {
    schoolName = formData?.schoolInfo?.schoolName || null;
    schoolCode = formData?.schoolInfo?.schoolFacilityCode || null;
  }

  const requireSignIn = formData?.requireSignInLogic
    ? Object.values(formData?.requireSignInLogic).some(value => value === true)
    : false;

  return {
    ...formData,
    ...transformAddress(formData),
    files: getFiles(uploadFiles),
    SchoolObj: {
      InstitutionName: schoolName,
      SchoolFacilityCode: schoolCode,
      StateAbbreviation:
        formData.stateOfTheSchool ||
        formData.stateOfTheFacility ||
        formData.stateOrResidency.schoolState,
    },
    requireSignIn,
  };
}
