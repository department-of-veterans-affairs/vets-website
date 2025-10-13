/**
 * Rounds a date to the nearest 15-minute interval.
 *
 * @param {Date} date - The date to round.
 * @returns {Date} A new date rounded to the nearest 15-minute interval.
 */
const roundToFifteenMinutes = date => {
  const roundedDate = new Date(date);
  const minutes = roundedDate.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  roundedDate.setMinutes(roundedMinutes, 0, 0); // Also reset seconds and milliseconds
  return roundedDate;
};

/**
 * Generates a random alphanumeric identifier.
 *
 * @param {number} [length=8] - The length of the identifier to generate.
 * @returns {string} A random alphanumeric string of the specified length.
 */
const generateRandomId = (length = 8) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a UUID v4 string.
 *
 * @returns {string} A UUID v4 formatted string.
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : Math.floor(Math.random() * 4) + 8;
    return v.toString(16);
  });
};

/**
 * Formats the duration between two dates as a string in minutes and seconds.
 *
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {string} Duration formatted as "Xm Ys" (e.g., "60m0s").
 */
const formatDuration = (startDate, endDate) => {
  const durationMs = endDate.getTime() - startDate.getTime();
  const minutes = Math.floor(durationMs / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  return `${minutes}m${seconds}s`;
};

/**
 * Generates a slot ID in the required format with multiple components.
 *
 * @param {Date} startDate - The start date of the slot.
 * @param {Date} endDate - The end date of the slot.
 * @returns {string} A formatted slot ID string with pipe-separated components.
 */
const generateSlotId = (startDate, endDate) => {
  // Generate components for the slot ID
  const baseId = generateRandomId(8);
  const practitionerNum = Math.floor(Math.random() * 20) + 1;
  const roleNum = Math.floor(Math.random() * 5) + 1;
  const practitionerRole = `practitioner-${practitionerNum}-role-${roleNum}`;
  const uuid = generateUUID();
  const startTime = startDate.toISOString();
  const duration = formatDuration(startDate, endDate);
  const timestamp = Date.now();
  const suffix = 'ov';

  // Combine all components with pipe separator
  return `${baseId}-${practitionerRole}|${uuid}|${startTime}|${duration}|${timestamp}|${suffix}`;
};

/**
 * Formats a date for slot data without milliseconds.
 *
 * @param {Date} date - The date to format.
 * @returns {string} ISO string formatted date without milliseconds.
 */
const formatSlotDate = date => {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Checks if a given date falls on a business day (Monday-Friday).
 *
 * @param {Date} date - The date to check.
 * @returns {boolean} True if the date is a business day, false otherwise.
 */
const isBusinessDay = date => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
};

/**
 * Generates an array of business dates within a specified month range.
 *
 * @param {Date} startMonth - The start date of the range.
 * @param {Date} endMonth - The end date of the range.
 * @returns {Date[]} An array of dates that fall on business days within the range.
 */
const generateBusinessDatesInRange = (startMonth, endMonth) => {
  const dates = [];
  const current = new Date(startMonth);

  while (current <= endMonth) {
    if (isBusinessDay(current)) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

/**
 * Generates appointment slots for a specific day based on business hours and configuration.
 *
 * @param {Date} date - The date to generate slots for.
 * @param {Object} options - Configuration options for slot generation.
 * @param {Object} options.businessHours - Object with start and end hours (24-hour format).
 * @param {number} options.slotDuration - Duration of each slot in minutes.
 * @param {number} options.slotsPerDay - Maximum number of slots to generate per day.
 * @returns {Object[]} An array of slot objects with ID, type, and attributes.
 */
const generateSlotsForDay = (date, options) => {
  const { businessHours, slotDuration, slotsPerDay } = options;
  const slots = [];

  // Calculate actual slots based on business hours and duration
  const totalBusinessMinutes = (businessHours.end - businessHours.start) * 60;
  const maxPossibleSlots = Math.floor(totalBusinessMinutes / slotDuration);
  const actualSlotsCount = Math.min(slotsPerDay, maxPossibleSlots);

  // Generate slots with 15-minute interval spacing
  for (let i = 0; i < actualSlotsCount; i++) {
    const minuteOffset = Math.floor(
      (totalBusinessMinutes / actualSlotsCount) * i,
    );

    const startTime = new Date(date);
    startTime.setHours(businessHours.start, 0, 0, 0);
    startTime.setMinutes(startTime.getMinutes() + minuteOffset);

    // Round to nearest 15-minute interval
    const roundedStartTime = roundToFifteenMinutes(startTime);

    const endTime = new Date(roundedStartTime);
    endTime.setMinutes(endTime.getMinutes() + slotDuration);

    // Don't create slots that go beyond business hours
    if (endTime.getHours() <= businessHours.end) {
      const slotId = generateSlotId(roundedStartTime, endTime);
      slots.push({
        id: slotId,
        type: 'slots',
        attributes: {
          id: slotId,
          start: formatSlotDate(roundedStartTime),
          end: formatSlotDate(endTime),
          providerServiceId: 'Lfg2Mxk4',
          appointmentTypeId: 'ov',
          remaining: 1,
        },
      });
    }
  }

  return slots;
};

/**
 * Transforms slots for community care by removing the end time.
 *
 * @param {Object[]} slots - Array of slot objects to transform.
 * @returns {Object[]} Transformed slots with end time removed.
 */
const transformSlotsForCommunityCare = slots => {
  return slots.map(slot => ({
    ...slot.attributes,
    end: undefined,
  }));
};

/**
 * Checks if a slot time conflicts with any existing appointments.
 *
 * @param {string} slotStart - ISO string of slot start time.
 * @param {string} slotEnd - ISO string of slot end time.
 * @param {Object[]} appointments - Array of existing appointment objects.
 * @returns {boolean} True if there is a conflict, false otherwise.
 */
const hasAppointmentConflict = (slotStart, slotEnd, appointments) => {
  const slotStartTime = new Date(slotStart);
  const slotEndTime = new Date(slotEnd);

  return appointments.some(appointment => {
    if (appointment.attributes.status === 'cancelled') {
      return false; // Cancelled appointments don't create conflicts
    }

    const appointmentStart = new Date(appointment.attributes.start);
    const appointmentEnd = new Date(
      appointment.attributes.end ||
        new Date(
          appointmentStart.getTime() +
            (appointment.attributes.minutesDuration || 60) * 60 * 1000,
        ),
    );

    // Check for overlap: slots overlap if one starts before the other ends
    return slotStartTime < appointmentEnd && slotEndTime > appointmentStart;
  });
};

/**
 * Filters out slots that conflict with existing appointments.
 *
 * @param {Object[]} slots - Array of slot objects to filter.
 * @param {Object[]} existingAppointments - Array of existing appointment objects.
 * @returns {Object[]} Filtered array of slots without conflicts.
 */
const removeConflictingSlots = (slots, existingAppointments) => {
  if (!existingAppointments || existingAppointments.length === 0) {
    return slots;
  }

  return slots.filter(
    slot =>
      !hasAppointmentConflict(
        slot.attributes.start,
        slot.attributes.end,
        existingAppointments,
      ),
  );
};

/**
 * Forces the creation of slots that conflict with specific appointments for testing purposes.
 *
 * @param {Object[]} allSlots - Array of all available slots.
 * @param {Object[]} appointmentsToConflict - Array of appointments to create conflicts with.
 * @returns {Object[]} Updated slots array with additional conflicting slots.
 */
const forceConflictingSlots = (allSlots, appointmentsToConflict) => {
  if (!appointmentsToConflict || appointmentsToConflict.length === 0) {
    return allSlots;
  }

  const conflictingSlots = [];

  appointmentsToConflict.forEach(appointment => {
    // Find the date of the appointment
    const appointmentDateKey = appointment.attributes.start.split('T')[0];

    // Find slots on the same date
    const slotsOnSameDate = allSlots.filter(slot => {
      const slotDateKey = slot.attributes.start.split('T')[0];
      return slotDateKey === appointmentDateKey;
    });

    if (slotsOnSameDate.length > 0) {
      // Find a slot that would conflict with this appointment
      let conflictingSlot = slotsOnSameDate.find(slot =>
        hasAppointmentConflict(slot.attributes.start, slot.attributes.end, [
          appointment,
        ]),
      );

      // If no existing slot conflicts, create one that overlaps
      if (!conflictingSlot) {
        const appointmentStart = new Date(appointment.attributes.start);
        const appointmentEnd = new Date(
          appointment.attributes.end ||
            new Date(
              appointmentStart.getTime() +
                (appointment.attributes.minutesDuration || 60) * 60 * 1000,
            ),
        );

        // Create a slot that starts 30 minutes before the appointment ends
        // This ensures overlap
        const conflictSlotStart = new Date(
          appointmentEnd.getTime() - 30 * 60 * 1000,
        );
        // Round to 15-minute interval
        const roundedConflictStart = roundToFifteenMinutes(conflictSlotStart);
        const conflictSlotEnd = new Date(
          roundedConflictStart.getTime() + 60 * 60 * 1000,
        );

        const conflictSlotId = generateSlotId(
          roundedConflictStart,
          conflictSlotEnd,
        );
        conflictingSlot = {
          id: conflictSlotId,
          type: 'slots',
          attributes: {
            id: conflictSlotId,
            start: formatSlotDate(roundedConflictStart),
            end: formatSlotDate(conflictSlotEnd),
            providerServiceId: 'Lfg2Mxk4',
            appointmentTypeId: 'ov',
            remaining: 1,
          },
        };
      }

      conflictingSlots.push(conflictingSlot);
    }
  });

  // Add the conflicting slots to the existing slots
  // Remove duplicates if any
  const existingSlotIds = new Set(allSlots.map(slot => slot.id));
  const newSlots = conflictingSlots.filter(
    slot => !existingSlotIds.has(slot.id),
  );

  return [...allSlots, ...newSlots];
};

/**
 * Ensures that a certain percentage of days with appointments have slot conflicts for testing.
 *
 * @param {Object[]} allSlots - Array of all available slots.
 * @param {Object[]} existingAppointments - Array of existing appointments.
 * @param {number} conflictRate - Percentage (0-1) of days that should have conflicts.
 * @returns {Object[]} Filtered slots array with controlled conflict rate.
 */
const ensureConflictsForTesting = (
  allSlots,
  existingAppointments,
  conflictRate,
) => {
  if (
    !existingAppointments ||
    existingAppointments.length === 0 ||
    conflictRate === 0
  ) {
    return allSlots;
  }

  // Group slots by date
  const slotsByDate = {};
  allSlots.forEach(slot => {
    const dateKey = slot.attributes.start.split('T')[0];
    if (!slotsByDate[dateKey]) {
      slotsByDate[dateKey] = [];
    }
    slotsByDate[dateKey].push(slot);
  });

  // Group appointments by date
  const appointmentsByDate = {};
  existingAppointments.forEach(appointment => {
    const dateKey = appointment.attributes.start.split('T')[0];
    if (!appointmentsByDate[dateKey]) {
      appointmentsByDate[dateKey] = [];
    }
    appointmentsByDate[dateKey].push(appointment);
  });

  const finalSlots = [];

  Object.keys(slotsByDate).forEach(dateKey => {
    const daySlots = slotsByDate[dateKey];
    const dayAppointments = appointmentsByDate[dateKey] || [];

    if (dayAppointments.length > 0 && Math.random() < conflictRate) {
      // This day should have conflicts - remove some slots that would conflict
      const filteredSlots = removeConflictingSlots(daySlots, dayAppointments);
      finalSlots.push(...filteredSlots);
    } else {
      // This day should have all slots available
      finalSlots.push(...daySlots);
    }
  });

  return finalSlots;
};

/**
 * Generates mock appointment slots data for testing purposes.
 *
 * @param {Object} [options={}] - Configuration options for generating slots.
 * @param {number} [options.futureMonths=6] - Number of future months to generate slots for.
 * @param {number} [options.pastMonths=1] - Number of past months to generate slots for.
 * @param {number} [options.slotsPerDay=8] - Number of slots to generate per day.
 * @param {number} [options.slotDuration=60] - Duration of each slot in minutes.
 * @param {Object} [options.businessHours={start: 8, end: 17}] - Business hours configuration.
 * @param {Object[]} [options.existingAppointments=[]] - Existing appointments to avoid conflicts with.
 * @param {number} [options.conflictRate=0.3] - Rate of conflict generation for testing.
 * @param {Object[]} [options.forceConflictWithAppointments=[]] - Appointments to force conflicts with.
 * @param {boolean} [options.communityCareSlots=false] - Whether to format slots for community care.
 * @returns {Object} Object containing an array of mock slot data.
 */
const getMockSlots = (options = {}) => {
  const {
    futureMonths = 6,
    pastMonths = 1,
    slotsPerDay = 8,
    slotDuration = 60, // minutes
    businessHours = { start: 8, end: 17 }, // 8 AM to 5 PM
    existingAppointments = [],
    conflictRate = 0.3, // 30% of days with appointments should have conflicts
    forceConflictWithAppointments = [],
    communityCareSlots = false,
    currentDate = null,
  } = options;

  // Calculate date range
  const now = currentDate || new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - pastMonths, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + futureMonths, 0);

  // Generate all business days in the range
  const businessDays = generateBusinessDatesInRange(startDate, endDate);

  // Generate slots for each business day
  const allSlots = [];
  businessDays.forEach(date => {
    const daySlots = generateSlotsForDay(date, {
      businessHours,
      slotDuration,
      slotsPerDay,
    });
    allSlots.push(...daySlots);
  });

  // First, force conflicts with specific appointments
  const slotsWithForcedConflicts = forceConflictingSlots(
    allSlots,
    forceConflictWithAppointments,
  );

  // Then apply random conflict logic with existing appointments
  const finalSlots = ensureConflictsForTesting(
    slotsWithForcedConflicts,
    existingAppointments,
    conflictRate,
  );

  // Sort slots by start time
  finalSlots.sort((a, b) => {
    const dateA = new Date(a.attributes.start);
    const dateB = new Date(b.attributes.start);
    return dateA - dateB;
  });

  return {
    data: communityCareSlots
      ? transformSlotsForCommunityCare(finalSlots)
      : finalSlots,
  };
};

module.exports = {
  getMockSlots,
  generateSlotsForDay,
  transformSlotsForCommunityCare,
};
