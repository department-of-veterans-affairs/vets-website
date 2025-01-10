import { apiRequest } from 'platform/utilities/api';

export const validateFacilityCode = async field => {
  try {
    const response = await apiRequest(
      `/gi/institutions/${field?.institutionDetails.facilityCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data?.attributes?.accredited;
  } catch (error) {
    return false;
  }
};

export const calculatedPercentage = formData => {
  const numOfStudent = Number(formData?.studentRatioCalcChapter?.numOfStudent);
  const beneficiaryStudent = Number(
    formData?.studentRatioCalcChapter?.beneficiaryStudent,
  );
  return numOfStudent >= 0 && beneficiaryStudent >= 0
    ? `${((beneficiaryStudent / numOfStudent) * 100).toFixed(1)}%`
    : '---';
};
