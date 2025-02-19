/**
 * Creates a referral appointment object with the given id and state.
 *
 * @param {string} id - The unique identifier for the appointment.
 * @param {string} [state='draft'] - The state of the appointment. Defaults to 'draft'.
 * @param {Object} [draftResponse={}] - The draft response object.
 * @returns {Object} The referral appointment object.
 */
const createReferralAppointment = (id, state = 'draft', draftResponse = {}) => {
  return {
    ...draftResponse,
    appointment: { ...draftResponse?.appointment, state, id },
  };
};

module.exports = { createReferralAppointment };
