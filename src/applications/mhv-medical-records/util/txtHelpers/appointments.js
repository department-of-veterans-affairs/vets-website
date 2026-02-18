import { generateAppointmentsContent } from '../pdfHelpers/appointments';
import { NO_INFO_PROVIDED } from '../constants';

// Helper function to format appointment content into plain text
const formatAppointmentsContentToText = content => {
  const sections = content.results.items;

  // Preface text
  const { preface } = content.results;

  // Format each appointment section into plain text
  const formattedSections = sections
    .map(section => {
      const header = `Date: ${section.header || 'Unknown Date'}`;
      const itemsText = section.items
        .map(item => {
          // Check if item.value is an array of objects
          if (
            Array.isArray(item.value) &&
            item.value.every(val => typeof val === 'object')
          ) {
            // Format each object in the array
            const formattedValues = item.value
              .map(val => {
                return Object.entries(val)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ');
              })
              .join('\n');
            return `${item.title}:\n${formattedValues}`;
          }
          // For other types, display as usual
          return `${item.title}: ${item.value || NO_INFO_PROVIDED}`;
        })
        .join('\n'); // Join each item with a newline

      return `${header}\n${itemsText}`;
    })
    .join('\n\n'); // Separate sections with double newlines

  return `${preface}\n\n${formattedSections}`;
};

// Main function
export const parseAppointments = (appointments, index = 8) => {
  // Filter appointments into upcoming and past
  const upcomingAppointments = appointments.filter(
    appointment => appointment.isUpcoming,
  );
  const pastAppointments = appointments.filter(
    appointment => !appointment.isUpcoming,
  );

  // Generate content for upcoming and past appointments
  const upcomingContent = generateAppointmentsContent(upcomingAppointments);
  const pastContent = generateAppointmentsContent(pastAppointments);

  // Format content into plain text
  const formattedUpcomingContent = formatAppointmentsContentToText(
    upcomingContent,
  );
  const formattedPastContent = formatAppointmentsContentToText(pastContent);

  return `
${index}) Appointments

'Your VA appointments may be by telephone, video, or in person. Always bring your insurance information with you to your appointment.',

Records:
- Upcoming Appointments:
${formattedUpcomingContent}

- Past Appointments:
${formattedPastContent}
`;
};
