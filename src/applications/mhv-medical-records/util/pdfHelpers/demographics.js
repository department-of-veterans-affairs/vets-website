import { NO_INFO_REPORTED, NONE_RECORDED } from '../constants';

export const generateDemographicsContent = record => {
  const results = {
    results: {
      sectionSeparators: false,
      items: [
        {
          items: [
            {
              title: 'First name',
              value: record.firstName,
              inline: true,
            },
            {
              title: 'Middle name',
              value: record.middleName,
              inline: true,
            },
            {
              title: 'Last name',
              value: record.lastName,
              inline: true,
            },
            {
              title: 'Date of birth',
              value: record.dateOfBirth,
              inline: true,
            },
            {
              title: 'Age',
              value: record.age,
              inline: true,
            },
            {
              title: 'Gender',
              value: record.gender,
              inline: true,
            },
            {
              title: 'Ethnicity',
              value: record.ethnicity,
              inline: true,
            },
            {
              title: 'Religion',
              value: record.religion,
              inline: true,
            },
            {
              title: 'Place of birth',
              value: record.placeOfBirth,
              inline: true,
            },
            {
              title: 'Marital status',
              value: record.maritalStatus,
              inline: true,
            },
          ],
        },
        {
          header: 'Permanent address and contact information',
          headerType: 'H4',
          items: [
            {
              title: 'Street address',
              value: record.permanentAddress.street,
              inline: true,
            },
            {
              title: 'City',
              value: record.permanentAddress.city,
              inline: true,
            },
            {
              title: 'State',
              value: record.permanentAddress.state,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.permanentAddress.zipcode,
              inline: true,
            },
            {
              title: 'County',
              value: record.permanentAddress.county,
              inline: true,
            },
            {
              title: 'Country',
              value: record.permanentAddress.country,
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
              title: 'Cell phone number',
              value: record.contactInfo.cellPhone,
              inline: true,
            },
            {
              title: 'Email address',
              value: record.contactInfo.emailAddress,
              inline: true,
            },
          ],
        },
        {
          header: 'Eligibility',
          headerType: 'H4',
          items: [
            {
              title: 'Service connected percentage',
              value: record.eligibility.serviceConnectedPercentage,
              inline: true,
            },
            {
              title: 'Means test status',
              value: record.eligibility.meansTestStatus,
              inline: true,
            },
            {
              title: 'Primary eligibility code',
              value: record.eligibility.primaryEligibilityCode,
              inline: true,
            },
          ],
        },
        {
          header: 'Employment',
          headerType: 'H4',
          items: [
            {
              title: 'Occupation',
              value: record.employment.occupation,
              inline: true,
            },
            {
              title: 'Means test status',
              value: record.employment.meansTestStatus,
              inline: true,
            },
            {
              title: 'Employer name',
              value: record.employment.employerName,
              inline: true,
            },
          ],
        },
        {
          header: 'Primary next of kin',
          headerType: 'H4',
          items: [
            {
              title: 'Name',
              value: record.primaryNextOfKin.name,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.primaryNextOfKin.address.street,
              inline: true,
            },
            {
              title: 'City',
              value: record.primaryNextOfKin.address.city,
              inline: true,
            },
            {
              title: 'State',
              value: record.primaryNextOfKin.address.state,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.primaryNextOfKin.address.zipcode,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.primaryNextOfKin.homePhone,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.primaryNextOfKin.workPhone,
              inline: true,
            },
          ],
        },
        {
          header: 'Emergency contact',
          headerType: 'H4',
          items: [
            {
              title: 'Name',
              value: record.emergencyContact.name,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.emergencyContact.address.street,
              inline: true,
            },
            {
              title: 'City',
              value: record.emergencyContact.address.city,
              inline: true,
            },
            {
              title: 'State',
              value: record.emergencyContact.address.state,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.emergencyContact.address.zipcode,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.emergencyContact.homePhone,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.emergencyContact.workPhone,
              inline: true,
            },
          ],
        },
        {
          header: 'VA guardian',
          headerType: 'H4',
          items: [
            {
              title: 'Name',
              value: record.vaGuardian.name,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.vaGuardian.address.street,
              inline: true,
            },
            {
              title: 'City',
              value: record.vaGuardian.address.city,
              inline: true,
            },
            {
              title: 'State',
              value: record.vaGuardian.address.state,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.vaGuardian.address.zipcode,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.vaGuardian.homePhone,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.vaGuardian.workPhone,
              inline: true,
            },
          ],
        },
        {
          header: 'Civil guardian',
          headerType: 'H4',
          items: [
            {
              title: 'Name',
              value: record.civilGuardian.name,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.civilGuardian.address.street,
              inline: true,
            },
            {
              title: 'City',
              value: record.civilGuardian.address.city,
              inline: true,
            },
            {
              title: 'State',
              value: record.civilGuardian.address.state,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.civilGuardian.address.zipcode,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.civilGuardian.homePhone,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.civilGuardian.workPhone,
              inline: true,
            },
          ],
        },
        {
          header: 'Active insurance',
          headerType: 'H4',
          items: [
            {
              title: 'Insurance company',
              value: record.activeInsurance.company,
              inline: true,
            },
            {
              title: 'Effective date',
              value: record.activeInsurance.effectiveDate,
              inline: true,
            },
            {
              title: 'Expiration date',
              value: record.activeInsurance.expirationDate,
              inline: true,
            },
            {
              title: 'Group name',
              value: record.activeInsurance.groupName,
              inline: true,
            },
            {
              title: 'Group number',
              value: record.activeInsurance.groupNumber,
              inline: true,
            },
            {
              title: 'Subscriber ID',
              value: record.activeInsurance.subscriberId,
              inline: true,
            },
            {
              title: 'Subscriber name',
              value: record.activeInsurance.subscriberName,
              inline: true,
            },
            {
              title: 'Subscriber relationship',
              value: record.activeInsurance.relationship,
              inline: true,
            },
          ],
        },
      ],
    },
  };

  results.results.items = results.results.items.map(item => {
    if (item.items.every(i => i.value === NONE_RECORDED)) {
      return {
        ...item,
        items: [
          {
            value: NO_INFO_REPORTED,
          },
        ],
      };
    }
    return item;
  });

  return results;
};
