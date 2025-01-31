import { apiRequestWithUrl } from '../utils';

export async function getPatientReferrals() {
  const response = await apiRequestWithUrl(`/vaos/v2/epsApi/referrals`, {
    method: 'GET',
  });

  return response.data;
}

export async function getPatientReferralById(referralId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/epsApi/referrals/${referralId}`,
    {
      method: 'GET',
    },
  );
  return response.data;
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

export async function postDraftReferralAppointment(referralId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/epsApi/draftReferralAppointment/${referralId}`,
    {
      method: 'POST',
    },
  );
  return response.data;
}
