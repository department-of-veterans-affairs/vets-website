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
  draftApppointmentId,
  referralNumber,
  slotId,
  networkId,
  providerServiceId,
}) {
  const response = await apiRequestWithUrl(`/vaos/v2/appointments/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: draftApppointmentId,
      referralNumber,
      slotId,
      networkId,
      providerServiceId,
    }),
  });
  return response.data;
}

export async function postDraftReferralAppointment(referralNumber) {
  const response = await apiRequestWithUrl(`/vaos/v2/appointments/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // eslint-disable-next-line camelcase
    body: JSON.stringify({ referralNumber }),
  });

  return response.data;
}

export async function getAppointmentInfo(appointmentId) {
  const response = await apiRequestWithUrl(
    `/vaos/v2/eps_appointments/${appointmentId}`,
    {
      method: 'GET',
    },
  );
  return response.data;
}
