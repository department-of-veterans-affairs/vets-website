export const generateAppointmentsContent = records => ({
  results: {
    preface: `Showing ${records.length} appointments, sorted by date`,
    sectionSeparators: false,
    items: records.map(item => ({
      header: item.date,
      headerType: 'H4',
      items: [
        {
          title: 'Appointment type',
          value: item.appointmentType,
          inline: true,
        },
        {
          title: 'Status',
          value: item.status,
          inline: true,
        },
        // cancelled appointment fields?
        {
          title: 'Provider',
          value: [...item.address.map(i => ({ value: i }))],
          isRich: true,
        },
        {
          title: 'Phone',
          value: item.clinicPhone,
          inline: true,
        },
        // not cancelled appointment fields?
        {
          title: 'What',
          value: item.what,
          inline: true,
        },
        {
          title: 'Who',
          value: [...item.address.map(i => ({ value: i }))],
          isRich: true,
        },
        {
          title: 'Where to attend',
          value: item.address,
          inline: true,
        },
        {
          title: 'Clinic',
          value: item.clinicName,
          inline: true,
        },
        {
          title: 'Location',
          value: item.location,
          inline: true,
        },
        {
          title: 'Clinic phone',
          value: item.clinicPhone,
          inline: true,
        },
        // standard field
        {
          title: 'Details you shared with your provider',
          isRich: true,
          paragraphGap: 2,
          lineGap: 4,
          value: [
            {
              title: 'Reason',
              value: item.detailsShared.reason,
              paragraphGap: 2,
            },
            {
              title: 'Other details',
              value: item.detailsShared.otherDetails,
              paragraphGap: 2,
            },
          ],
        },
      ],
    })),
  },
});
