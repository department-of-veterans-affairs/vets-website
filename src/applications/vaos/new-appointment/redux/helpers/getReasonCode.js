/**
 * Transforms the reason text based on the appointment data and booleans
 *
 * @export
 * @param {Object} appointment parameters needed to create the comment text
 * @param {boolean} params.isCC whether the appointment is Community Care
 * @param {boolean} params.isAcheron whether Acheron Service is used
 * @param {boolean} params.isDS whether the appointment is direct schedule
 * @returns {string} The created reason text
 */

import moment from '../../../lib/moment-tz';
import { PURPOSE_TEXT_V2, TYPE_OF_VISIT } from '../../../utils/constants';

export function getReasonCode({ data, isCC, isAcheron, isDS }) {
  const apptReasonCode = PURPOSE_TEXT_V2.find(
    purpose => purpose.id === data.reasonForAppointment,
  )?.commentShort;
  // code is utilized when Acheron is off; need to cleanup
  const code = PURPOSE_TEXT_V2.filter(purpose => purpose.id !== 'other').find(
    purpose => purpose.id === data.reasonForAppointment,
  )?.short;
  let reasonText = null;
  let appointmentInfo = null;
  const visitMode = TYPE_OF_VISIT.filter(
    visit => visit.id === data.visitType,
  ).map(visit => visit.vsGUI);

  if (isCC && data.reasonAdditionalInfo) {
    reasonText = data.reasonAdditionalInfo.slice(0, 250);
  }
  if (!isCC) {
    reasonText = data.reasonAdditionalInfo.slice(0, 250);
  }
  if (!isCC && isAcheron) {
    const formattedDates = data.selectedDates.map(
      date =>
        `${moment(date).format('MM/DD/YYYY')}${
          moment(date).hour() >= 12 ? ' PM' : ' AM'
        }`,
    );
    const facility = `station id: ${data.vaFacility}`;
    const modality = `preferred modality: ${visitMode}`;
    const phone = `phone number: ${data.phoneNumber}`;
    const email = `email: ${data.email}`;
    const preferredDates = `preferred dates:${formattedDates.toString()}`;
    const reasonCode = `reason code:${apptReasonCode}`;
    reasonText = `comments:${data.reasonAdditionalInfo.slice(0, 250)}`;
    // Add station id, preferred modality, phone number, email, preferred Date, reason Code to
    // appointmentInfo string in this order: [0]station id, [1]preferred modality, [2]phone number,
    // [3]email, [4]preferred Date, [5]reason Code
    appointmentInfo = `${facility}|${modality}|${phone}|${email}|${preferredDates}|${reasonCode}`;
  }
  if (isDS) {
    appointmentInfo = `reasonCode:${apptReasonCode}`;
    reasonText = `comments:${data.reasonAdditionalInfo.slice(0, 250)}`;
  }
  const reasonCodeBody = {
    text:
      data.reasonAdditionalInfo && isAcheron
        ? `${appointmentInfo}|${reasonText}`
        : null,
  };
  if (isAcheron) return reasonCodeBody;
  // the below return is utilized when Acheron is off - need to cleanup
  return {
    coding: code ? [{ code }] : undefined,
    // Per Brad - All comments should be sent in the reasonCode.text field and should should be
    // truncated to 300 char for both VA appointment types only. CC appointments will continue
    // to be truncated to 250 char
    text: data.reasonAdditionalInfo ? reasonText : null,
  };
}
