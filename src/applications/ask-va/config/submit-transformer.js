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
  const { stateOrResidency } = formData;

  if (stateOrResidency?.schoolState || stateOrResidency?.residencyState) {
    stateOrResidency.schoolState = stateOrResidency?.schoolState || null;
    stateOrResidency.residencyState = stateOrResidency?.residencyState || null;
  }

  return {
    ...formData,
    ...transformAddress(formData),
    files: getFiles(uploadFiles),
    SchoolObj: {
      InstitutionName: getSchoolInfo(formData.school)?.name,
      SchoolFacilityCode: getSchoolInfo(formData.school)?.code,
      StateAbbreviation:
        formData.stateOfTheSchool ||
        formData.stateOfTheFacility ||
        formData.stateOrResidency.schoolState,
    },
  };
}
