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

export async function getProviderById(providerId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/epsApi/providerDetails/${providerId}`,
    {
      method: 'GET',
    },
  );
  return response.data;
}

export async function postReferralAppointment({
  referralId,
  slotId,
  draftApppointmentId,
}) {
  const response = await apiRequestWithUrl(`/vaos/v2/epsApi/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      referralId,
      slotId,
      draftApppointmentId,
    }),
  });
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
