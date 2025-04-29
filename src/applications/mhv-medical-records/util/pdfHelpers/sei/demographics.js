import { NONE_ENTERED } from '../../../reducers/selfEnteredData';

export const generateDemographicsContent = record => {
  const demographicInfo = {
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
            value: `${record.address.street}, ${record.address.city}, ${
              record.address.state
            }, ${record.address.zip}, ${record.address.country}`,
            inline: true,
          },
        ],
      },
    ],
  };

  function formatAddressSingleLine(address) {
    const addressParts = [];

    // Add street address lines if provided
    if (address.street1 && address.street1 !== NONE_ENTERED) {
      addressParts.push(address.street1);
    }
    if (address.street2 && address.street2 !== NONE_ENTERED) {
      addressParts.push(address.street2);
    }

    // Build the city/state/province/zip part
    const cityParts = [];
    if (address.city && address.city !== NONE_ENTERED) {
      cityParts.push(address.city);
    }
    if (address.state && address.state !== NONE_ENTERED) {
      cityParts.push(address.state);
    }
    if (address.province && address.province !== NONE_ENTERED) {
      cityParts.push(address.province);
    }
    if (address.zip && address.zip !== NONE_ENTERED) {
      cityParts.push(address.zip);
    }
    if (cityParts.length > 0) {
      addressParts.push(cityParts.join(', '));
    }

    // Add country if provided
    if (address.country && address.country !== NONE_ENTERED) {
      addressParts.push(address.country);
    }

    // Join all parts into a single-line string
    return addressParts.join(', ');
  }

  const emergencyContacts = {
    title: 'Emergency contacts',
    moveDown: 0.75,
    details: record.emergencyContacts.map(contact => ({
      items: [
        {
          value: [
            {
              value: [
                {
                  label: 'Contact first name',
                  value: contact.firstName,
                },
                {
                  label: 'Contact last name',
                  value: contact.lastName,
                },
                {
                  label: 'Relationship',
                  value: contact.relationship,
                },
                {
                  label: 'Home phone number',
                  value: contact.homePhone,
                },
                {
                  label: 'Work phone number',
                  value: contact.workPhone,
                },
                {
                  label: 'Cell phone number',
                  value: contact.mobilePhone,
                },
                { label: 'Email', value: contact.email, inline: true },
                {
                  label: 'Mailing address',
                  value: formatAddressSingleLine(contact.address),
                },
              ],
            },
          ],
          isRich: true,
        },
      ],
    })),
  };

  return [demographicInfo, emergencyContacts];
};
