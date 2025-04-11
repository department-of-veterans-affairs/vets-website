export const generateDemographicsContent = record => {
  return [
    {
      details: [
        {
          items: [
            { title: 'First name', value: record.firstName, inline: true },
            { title: 'Middle name', value: record.middleName, inline: true },
            { title: 'Last name', value: record.lastName, inline: true },
            { title: 'Alias', value: record.alias, inline: true },
            { title: 'Date of birth', value: record.dateOfBirth, inline: true },
            { title: 'Birth sex', value: record.gender, inline: true },
            { title: 'Blood type', value: record.bloodType, inline: true },
            { title: 'Organ donor', value: record.organDonor, inline: true },
            {
              title: 'Marital status',
              value: record.maritalStatus,
              inline: true,
            },
            {
              title: 'Relationship to VA',
              value: record.relationshipToVA.join(', '),
              inline: true,
            },
            {
              title: 'Current occupation',
              value: record.occupation,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.contactInfo.homePhone,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.contactInfo.workPhone,
              inline: true,
            },
            {
              title: 'Pager number',
              value: record.contactInfo.pager,
              inline: true,
            },
            {
              title: 'Cell phone number',
              value: record.contactInfo.mobilePhone,
              inline: true,
            },
            {
              title: 'Fax number',
              value: record.contactInfo.fax,
              inline: true,
            },
            {
              title: 'Email address',
              value: record.contactInfo.email,
              inline: true,
            },
            {
              title: 'Preferred method of contact',
              value: record.contactInfo.preferredMethod,
              inline: true,
            },
            {
              title: 'Mailing or destination address',
              value: `${record.address.street}, ${record.address.city}, ${record.address.state}, ${record.address.zip}, ${record.address.country}`,
              inline: true,
            },
          ],
        },
      ],
    },
    {
      title: 'Emergency contacts',
      details: record.emergencyContacts.map(contact => ({
        items: [
          {
            title: 'Contact first name',
            value: contact.firstName,
            inline: true,
          },
          {
            title: 'Contact last name',
            value: contact.lastName,
            inline: true,
          },
          {
            title: 'Relationship',
            value: contact.relationship,
            inline: true,
          },
          {
            title: 'Home phone number',
            value: contact.homePhone,
            inline: true,
          },
          {
            title: 'Work phone number',
            value: contact.workPhone,
            inline: true,
          },
          {
            title: 'Cell phone number',
            value: contact.mobilePhone,
            inline: true,
          },
          { title: 'Email', value: contact.email, inline: true },
          {
            title: 'Mailing address',
            value: contact.address,
            inline: true,
          },
        ],
      })),
    },
  ];
};
