import { apiRequestWithUrl } from '../utils';

export async function getPatientReferrals() {
  const response = await apiRequestWithUrl(`/vaos/v2/referrals`, {
    method: 'GET',
  });

  return response.data;
}

export async function getPatientReferralById(referralId) {
  const response = await apiRequestWithUrl(`/vaos/v2/referrals/${referralId}`, {
    method: 'GET',
  });
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
  const response = await apiRequestWithUrl(`/vaos/v2/appointments/submit`, {
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
  const response = await apiRequestWithUrl(`/vaos/v2/appointments/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ referralId }),
  });

  return response.data;
}

export async function getAppointmentInfo(appointmentId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/appointments/${appointmentId}`,
    {
      method: 'GET',
    },
  );
  return response.data;
}
