import { apiRequestWithUrl, parseApiObject } from '../utils';

const acheronHeader = {
  headers: { ACHERON_REQUESTS: 'true' },
};

// Assuming apiRequestWithUrl is imported or available in the scope

export async function getPatientDetails(
  facilityId,
  clinicId,
  startDate,
  endDate,
) {
  let patientData;
  try {
    // Use apiRequestWithUrl instead of fetch
    const response = await apiRequestWithUrl(
      `/vaos/v2/wellhive/referralDetails?facilityId=${facilityId}&clinicId=${clinicId}&start=${startDate}&end=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...acheronHeader.headers,
        },
      },
    ).then(parseApiObject);
    // Check if the response has an 'ok' property or handle success/failure differently based on how apiRequestWithUrl works
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    // Assuming apiRequestWithUrl or apiRequest returns the JSON data directly
    patientData = response;
  } catch (error) {
    return null; // or throw error;
  }

  return patientData;
}
