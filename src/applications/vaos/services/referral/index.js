import { apiRequestWithUrl } from '../utils';

const acheronHeader = {
  headers: { ACHERON_REQUESTS: 'true' },
};

export async function getPatientDetails(
  facilityId,
  clinicId,
  startDate,
  endDate,
) {
  try {
    const response = await apiRequestWithUrl(
      `/vaos/v2/wellhive/referralDetails?facilityId=${facilityId}&clinicId=${clinicId}&start=${startDate}&end=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...acheronHeader.headers,
        },
      },
    );

    return response.patientDetails.data;
  } catch (error) {
    return null;
  }
}
