/**
 * Creates a referral appointment object with the given id and status.
 *
 * @param {string} id - The unique identifier for the appointment.
 * @param {string} [status='draft'] - The status of the appointment. Defaults to 'draft'.
 * @returns {Object} The referral appointment object.
 */
export const createReferralAppointment = (id, status = 'draft') => {
  return { appointment: { id, status } };
};
