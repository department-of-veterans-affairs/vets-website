import { apiRequestWithUrl } from '../utils';

export async function getPatientReferrals() {
  const response = await apiRequestWithUrl(`/vaos/v2/epsApi/referralDetails`, {
    method: 'GET',
  });

  return response.data;
}

export async function getPatientReferralById(referralId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/epsApi/referralDetails/${referralId}`,
    {
      method: 'GET',
    },
  );
  return response.data;
}

export async function postDraftReferralAppointment(referralId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/epsApi/providerDetails/${referralId}`,
    {
      method: 'POST',
    },
  );
  return response.data;
}
