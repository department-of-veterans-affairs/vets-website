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
    ...formData,
    files: getFiles(uploadFiles),
    SchoolObj: {
      InstitutionName: getSchoolInfo(formData.school)?.name,
      SchoolFacilityCode: getSchoolInfo(formData.school)?.code,
      StateAbbreviation:
        formData.stateOfTheSchool || formData.stateOfTheFacility,
    },
  };
}
