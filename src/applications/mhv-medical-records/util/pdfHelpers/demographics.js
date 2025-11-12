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
              value: record.permanentAddress?.street ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'City',
              value: record.permanentAddress?.city ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'State',
              value: record.permanentAddress?.state ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.permanentAddress?.zipcode ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'County',
              value: record.permanentAddress?.county ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Country',
              value: record.permanentAddress?.country ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.contactInfo?.homePhone ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.contactInfo?.workPhone ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Cell phone number',
              value: record.contactInfo?.cellPhone ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Email address',
              value: record.contactInfo?.emailAddress ?? NONE_RECORDED,
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
              value:
                record.eligibility?.serviceConnectedPercentage ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Means test status',
              value: record.eligibility?.meansTestStatus ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Primary eligibility code',
              value:
                record.eligibility?.primaryEligibilityCode ?? NONE_RECORDED,
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
              value: record.employment?.occupation ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Means test status',
              value: record.employment?.meansTestStatus ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Employer name',
              value: record.employment?.employerName ?? NONE_RECORDED,
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
              value: record.primaryNextOfKin?.name ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.primaryNextOfKin?.address?.street ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'City',
              value: record.primaryNextOfKin?.address?.city ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'State',
              value: record.primaryNextOfKin?.address?.state ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.primaryNextOfKin?.address?.zipcode ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.primaryNextOfKin?.homePhone ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.primaryNextOfKin?.workPhone ?? NONE_RECORDED,
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
              value: record.emergencyContact?.name ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.emergencyContact?.address?.street ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'City',
              value: record.emergencyContact?.address?.city ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'State',
              value: record.emergencyContact?.address?.state ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.emergencyContact?.address?.zipcode ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.emergencyContact?.homePhone ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.emergencyContact?.workPhone ?? NONE_RECORDED,
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
              value: record.vaGuardian?.name ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.vaGuardian?.address?.street ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'City',
              value: record.vaGuardian?.address?.city ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'State',
              value: record.vaGuardian?.address?.state ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.vaGuardian?.address?.zipcode ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.vaGuardian?.homePhone ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.vaGuardian?.workPhone ?? NONE_RECORDED,
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
              value: record.civilGuardian?.name ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Street address',
              value: record.civilGuardian?.address?.street ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'City',
              value: record.civilGuardian?.address?.city ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'State',
              value: record.civilGuardian?.address?.state ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Zip code',
              value: record.civilGuardian?.address?.zipcode ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Home phone number',
              value: record.civilGuardian?.homePhone ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Work phone number',
              value: record.civilGuardian?.workPhone ?? NONE_RECORDED,
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
              value: record.activeInsurance?.company ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Effective date',
              value: record.activeInsurance?.effectiveDate ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Expiration date',
              value: record.activeInsurance?.expirationDate ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Group name',
              value: record.activeInsurance?.groupName ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Group number',
              value: record.activeInsurance?.groupNumber ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Subscriber ID',
              value: record.activeInsurance?.subscriberId ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Subscriber name',
              value: record.activeInsurance?.subscriberName ?? NONE_RECORDED,
              inline: true,
            },
            {
              title: 'Subscriber relationship',
              value: record.activeInsurance?.relationship ?? NONE_RECORDED,
              inline: true,
            },
          ],
        },
      ],
    },
  };

  results.results.items = results.results.items?.map(item => {
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
