export default [
  // 0 -> 1, move user back to address page if country code is bad
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/95950
  ({ formData, metadata }) => {
    let newMetadata = metadata;

    if (formData?.claimantAddress?.country?.length !== 3) {
      newMetadata = {
        ...metadata,
        returnUrl: '/claimant-information/mailing-address',
      };
    }

    return { formData, metadata: newMetadata };
  },
  // 1 > 2, move user without an email back to the contact information page
  ({ formData = {}, metadata = {} }) => {
    const newMetadata = { ...metadata };

    if (!formData.claimantEmail) {
      newMetadata.returnUrl = '/claimant-information/contact-information';
    }

    return { formData, metadata: newMetadata };
  },
  // 2 > 3, use new location of death format
  ({ formData = {}, metadata = {} }) => {
    const { locationOfDeath } = formData;
    if (
      !locationOfDeath ||
      locationOfDeath.location === 'other' ||
      locationOfDeath.location === 'atHome'
    ) {
      return { formData, metadata };
    }

    const newFormData = formData;
    const { location } = locationOfDeath;
    newFormData[location] = locationOfDeath[location];
    newFormData.locationOfDeath[location] = {};

    return { formData: newFormData, metadata };
  },
  // 3 > 4, align with new PDF form and redirect
  // ({ formData, metadata }) => {
  //   let newFormData = { ...formData };
  //   const newMetadata = {
  //     ...metadata,
  //     // Always redirect to the first page of the application
  //     returnUrl: '/claimant-information/relationship-to-veteran',
  //   };

  //   if (
  //     !Array.isArray(formData.toursOfDuty) ||
  //     formData.toursOfDuty.length === 0
  //   ) {
  //     return { formData: newFormData, metadata: newMetadata };
  //   }

  //   const [servicePeriod] = formData.toursOfDuty;

  //   // Old (stored) label -> new (stored) key mapping
  //   const branchLabelToKey = {
  //     Army: 'army',
  //     Navy: 'navy',
  //     'Air Force': 'airForce',
  //     'Coast Guard': 'coastGuard',
  //     'Marine Corps': 'marineCorps',
  //     // Note: intentionally no mappings for Reserve/Guard/Other,
  //     // since those are not 1:1 with the new enum keys.
  //   };

  //   const mappedServiceBranchKey =
  //     branchLabelToKey[(servicePeriod?.serviceBranch)];

  //   const migratedFields = {
  //     serviceDateRange: servicePeriod?.dateRange,
  //     placeOfSeparation: servicePeriod?.placeOfSeparation,
  //   };

  //   // Only set serviceBranch when we can safely map it
  //   if (mappedServiceBranchKey) {
  //     migratedFields.serviceBranch = mappedServiceBranchKey;
  //   }

  //   newFormData = {
  //     ...newFormData,
  //     ...migratedFields,
  //   };

  //   // Remove legacy array to prevent schema mismatch / resume issues
  //   delete newFormData.toursOfDuty;

  //   return {
  //     formData: newFormData,
  //     metadata: newMetadata,
  //   };
  // },
];
