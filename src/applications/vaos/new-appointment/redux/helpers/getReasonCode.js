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
  REASON_MAX_CHARS,
  NEW_REASON_MAX_CHARS,
  TYPE_OF_VISIT,
} from '../../../utils/constants';

export function getReasonCode({ data, isCC, isDS, updateLimits }) {
  let reasonText = null;
  let appointmentInfo = null;
  const visitMode = TYPE_OF_VISIT.filter(
    visit => visit.id === data.visitType,
  ).map(visit => (updateLimits ? visit.vsGUI2 : visit.vsGUI));

  const maxChars = updateLimits ? NEW_REASON_MAX_CHARS : REASON_MAX_CHARS;

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
    const facility = updateLimits
      ? `station: ${data.vaFacility}`
      : `station id: ${data.vaFacility}`;
    const modality = updateLimits
      ? `modality: ${visitMode}`
      : `preferred modality: ${visitMode}`;
    const phone = updateLimits
      ? `phone: ${data.phoneNumber}`
      : `phone number: ${data.phoneNumber}`;
    const email = `email: ${data.email}`;
    const preferredDates = `preferred dates:${formattedDates.toString()}`;
    reasonText = `comments:${data.reasonAdditionalInfo.slice(0, maxChars)}`;

    // Build appointmentInfo in order:
    // [0] station id, [1] preferred modality, [2] phone number, [3] email, [4] preferred Date,
    appointmentInfo = `${facility}|${modality}|${phone}|${email}|${preferredDates}`;
  }
  if (isDS) {
    appointmentInfo = ``;
    reasonText = `comments:${data.reasonAdditionalInfo.slice(0, maxChars)}`;
  }

  if (data.reasonAdditionalInfo) {
    return {
      text: appointmentInfo ? `${appointmentInfo}|${reasonText}` : reasonText,
    };
  }
  return { text: null };
}
