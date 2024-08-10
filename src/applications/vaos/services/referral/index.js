import { apiRequestWithUrl } from '../utils';

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
      },
    );

    return response.patientDetails.data;
  } catch (error) {
    return null;
  }
}

export async function getReferralByReferralId(referralId) {
  try {
    return await apiRequestWithUrl(`/vaos/v2/wellhive/referral/${referralId}`, {
      method: 'GET',
    });
  } catch (error) {
    return null;
  }
}

export async function getProviderOrgs() {
  try {
    return await apiRequestWithUrl(`/vaos/v2/wellhive/provider-organization`, {
      method: 'GET',
    });
  } catch (error) {
    return null;
  }
}

export async function getProviderServices() {
  try {
    return await apiRequestWithUrl(`/vaos/v2/wellhive/provider-services`, {
      method: 'GET',
    });
  } catch (error) {
    return null;
  }
}

export async function getProviderServiceSlotById(providerServiceId) {
  try {
    return await apiRequestWithUrl(
      `/vaos/v2/wellhive/provider-services/${providerServiceId}/slots`,
      {
        method: 'GET',
      },
    );
  } catch (error) {
    return null;
  }
}

export async function getReferralById(referralId) {
  try {
    const response = await apiRequestWithUrl(
      `/vaos/v2/wellhive/referralDetails/${referralId}`,
      {
        method: 'GET',
      },
    );
    return response.data;
  } catch (error) {
    return null;
  }
}
