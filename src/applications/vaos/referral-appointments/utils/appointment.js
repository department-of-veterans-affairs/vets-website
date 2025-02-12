/**
 * Creates a referral appointment object with the given id and status.
 *
 * @param {string} id - The unique identifier for the appointment.
 * @param {string} [status='draft'] - The status of the appointment. Defaults to 'draft'.
 * @param {Object} [draftResponse={}] - The draft response object.
 * @returns {Object} The referral appointment object.
 */
const createReferralAppointment = (
  id,
  status = 'draft',
  draftResponse = {},
) => {
  return {
    ...draftResponse,
    appointment: { ...draftResponse?.appointment, status, id },
  };
};

module.exports = { createReferralAppointment };
