/**
 * Transforms the reason text based on the appointment data and booleans
 *
 * @export
 * @param {Object} appointment parameters needed to create the comment text
 * @param {boolean} params.isCC whether the appointment is Community Care
 * @param {boolean} params.isDS whether the appointment is direct schedule
 * @returns {string} The created reason text
 */

import { format } from 'date-fns';
import {
  PURPOSE_TEXT_V2,
  REASON_MAX_CHARS,
  NEW_REASON_MAX_CHARS,
  TYPE_OF_VISIT,
} from '../../../utils/constants';

export function getReasonCode({ data, isCC, isDS, updateRequestFlow }) {
  const apptReasonCode = PURPOSE_TEXT_V2.find(
    purpose => purpose.id === data.reasonForAppointment,
  )?.commentShort;
  let reasonText = null;
  let appointmentInfo = null;
  const visitMode = TYPE_OF_VISIT.filter(
    visit => visit.id === data.visitType,
  ).map(visit => (updateRequestFlow ? visit.vsGUI2 : visit.vsGUI));

  const maxChars = updateRequestFlow ? NEW_REASON_MAX_CHARS : REASON_MAX_CHARS;

  if (isCC) {
    reasonText = data.reasonAdditionalInfo?.slice(0, REASON_MAX_CHARS);
    return {
      text: reasonText,
    };
  }
  if (!isCC) {
    const formattedDates = data.selectedDates.map(
      date =>
        `${format(new Date(date), 'MM/dd/yyyy')}${
          new Date(date).getHours() >= 12 ? ' PM' : ' AM'
        }`,
    );
    const facility = updateRequestFlow
      ? `station: ${data.vaFacility}`
      : `station id: ${data.vaFacility}`;
    const modality = updateRequestFlow
      ? `modality: ${visitMode}`
      : `preferred modality: ${visitMode}`;
    const phone = updateRequestFlow
      ? `phone: ${data.phoneNumber}`
      : `phone number: ${data.phoneNumber}`;
    const email = `email: ${data.email}`;
    const preferredDates = `preferred dates:${formattedDates.toString()}`;
    const reasonCode = `reason code:${apptReasonCode}`;
    reasonText = `comments:${data.reasonAdditionalInfo.slice(0, maxChars)}`;

    // Build appointmentInfo in order:
    // [0] station id, [1] preferred modality, [2] phone number, [3] email, [4] preferred Date,
    // [5] reason Code (omit when updateRequestFlow is true so it doesn't contribute to char count)
    appointmentInfo = `${facility}|${modality}|${phone}|${email}|${preferredDates}${
      updateRequestFlow ? '' : `|${reasonCode}`
    }`;
  }
  if (isDS) {
    appointmentInfo = `reason code:${apptReasonCode}`;
    reasonText = `comments:${data.reasonAdditionalInfo.slice(
      0,
      REASON_MAX_CHARS,
    )}`;
  }
  return {
    text: data.reasonAdditionalInfo ? `${appointmentInfo}|${reasonText}` : null,
  };
}
