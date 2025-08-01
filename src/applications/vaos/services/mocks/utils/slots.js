// Helper function to round time to nearest 15-minute interval
const roundToFifteenMinutes = date => {
  const roundedDate = new Date(date);
  const minutes = roundedDate.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  roundedDate.setMinutes(roundedMinutes, 0, 0); // Also reset seconds and milliseconds
  return roundedDate;
};

// Helper function to generate random base64-like identifier
const generateRandomId = (length = 8) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : Math.floor(Math.random() * 4) + 8;
    return v.toString(16);
  });
};

// Helper function to format duration in minutes and seconds
const formatDuration = (startDate, endDate) => {
  const durationMs = endDate.getTime() - startDate.getTime();
  const minutes = Math.floor(durationMs / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  return `${minutes}m${seconds}s`;
};

// Helper function to generate slot ID in the required format
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

// Helper function to format dates for slots
const formatSlotDate = date => {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

// Helper function to check if a date is a business day
const isBusinessDay = date => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
};

// Helper function to generate business dates within a month range
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

// Helper function to generate slots for a specific day
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
      // Demo fake slot id "5vuTac8v-practitioner-11-role-3|533f98bd-d9cd-4e3e-895c-706ae44df8d0|2025-08-06T13:00:00Z|30m0s|1753991495613|ov"
      const slotId = generateSlotId(roundedStartTime, endTime);
      slots.push({
        id: slotId,
        type: 'slots',
        attributes: {
          id: slotId,
          start: formatSlotDate(roundedStartTime),
          // end isn't always present, at least not for Community Care
          end: formatSlotDate(endTime),
        },
      });
    }
  }

  return slots;
};

// Helper function to check if a slot conflicts with existing appointments
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

// Helper function to filter out conflicting slots
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

// Helper function to force specific slots to conflict with given appointments
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

        conflictingSlot = {
          id: `conflict-slot-${appointment.id || Date.now()}-${Math.random()}`,
          type: 'slots',
          attributes: {
            start: roundedConflictStart.toISOString(),
            end: conflictSlotEnd.toISOString(),
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

// Helper function to ensure some conflicts exist for testing
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
  } = options;

  // Calculate date range
  const now = new Date();
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
    data: finalSlots,
  };
};

module.exports = {
  getMockSlots,
};
