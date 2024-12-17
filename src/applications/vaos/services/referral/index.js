import { apiRequestWithUrl } from '../utils';

export async function getPatientReferrals() {
  const response = await apiRequestWithUrl(`/vaos/v2/epsApi/referralDetails`, {
    method: 'GET',
  });

  return response.data;
}

export async function getPatientReferralById(referralId) {
  try {
    const response = await apiRequestWithUrl(
      `/vaos/v2/epsApi/referralDetails/${referralId}`,
      {
        method: 'GET',
      },
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getProviderById(providerId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/epsApi/providerDetails/${providerId}`,
    {
      method: 'GET',
    },
  );
  return response.data;
}
