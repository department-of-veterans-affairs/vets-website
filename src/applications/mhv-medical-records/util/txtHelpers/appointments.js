import { generateAppointmentsContent } from '../pdfHelpers/appointments';

export const parseAppointments = records => {
  return `
8) Appointments

If you have allergies that are missing from this list, send a secure message to your care team.

${records
    .map(record => {
      const upcoming = record.upcomingAppointments || [];
      const past = record.pastAppointments || [];

      // Format the upcoming and past appointments
      const upcomingAppointments = generateAppointmentsContent(upcoming);
      const pastAppointments = generateAppointmentsContent(past);

      return `
Subtitles:
- Your VA appointments may be by telephone, video, or in person. Always bring your insurance information with you to your appointment.

Records:
- Upcoming Appointments:
${upcomingAppointments}

- Past Appointments:
${pastAppointments}
    `;
    })
    .join('\n')}
`;
};
