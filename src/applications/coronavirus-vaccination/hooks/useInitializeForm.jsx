import { useEffect, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';

import { retrievePreviouslySubmittedForm } from '../api';

import initialFormSchema from '../config/schema';
import initialUiSchema from '../config/uiSchema';

export default function useInitializeForm(
  formState,
  updateFormData,
  isLoggedIn,
  profile,
) {
  const [oldFormData, setOldFormData] = useState(null);

  useEffect(
    () => {
      if (formState) {
        // If formState isn't null, then we've already initialized the form
        // so we skip doing it again. This occurs if you navigate to the form,
        // fill out some fields, navigate back to the intro, then back to the form.
        return;
      }

      function renderEmptyForm() {
        const formData = {
          isIdentityVerified: false,
        };
        updateFormData(
          initialFormSchema,
          initialUiSchema.unauthenticated,
          formData,
        );

        recordEvent({
          event: 'no-login-start-form',
        });
      }

      async function prefillFromAuthenticatedSource() {
        recordEvent({
          event: 'covid-vaccination-login-successful-start-form',
        });

        const isIdentityVerified =
          profile?.loa?.current === profile?.loa?.highest;

        // If they are LO3, attempt to load and prefill from a previous submission.
        if (isIdentityVerified) {
          try {
            const json = await retrievePreviouslySubmittedForm();
            const previouslySubmittedFormData = json?.data?.attributes;

            if (previouslySubmittedFormData) {
              const formData = {
                isIdentityVerified,
                firstName: previouslySubmittedFormData?.firstName,
                lastName: previouslySubmittedFormData?.lastName,
                birthDate: previouslySubmittedFormData?.birthDate,
                email: previouslySubmittedFormData?.email,
                zipCode: previouslySubmittedFormData?.zipCode,
                locationDetails: previouslySubmittedFormData?.zipCodeDetails,
                phone: previouslySubmittedFormData?.phone,
                vaccineInterest: previouslySubmittedFormData?.vaccineInterest,
              };

              updateFormData(
                initialFormSchema,
                initialUiSchema.authenticated,
                formData,
              );
              setOldFormData(previouslySubmittedFormData);
              return;
            }
          } catch (error) {
            // Ideally we'd capture this in Sentry but we're surrounded by PII so
            // we can't really capture any details that may help us.
          }
        }

        // Otherwise, they are logged-in but NOT LOA3; or they ARE LOA3 but
        // don't have a previous form submission. In this case, just prefill
        // off of the profile data.

        const formData = {
          isIdentityVerified,
          firstName: profile?.userFullName?.first,
          lastName: profile?.userFullName?.last,
          birthDate: profile?.dob,
          email: profile?.vapContactInfo?.email?.emailAddress,
          zipCode: profile?.vapContactInfo?.residentialAddress?.zipCode,
          phone: profile?.vapContactInfo?.homePhone
            ? `${profile.vapContactInfo.homePhone.areaCode}${
                profile.vapContactInfo.homePhone.phoneNumber
              }`
            : '',
        };

        updateFormData(
          initialFormSchema,
          initialUiSchema.authenticated,
          formData,
        );
      }

      if (isLoggedIn) {
        prefillFromAuthenticatedSource();
      } else {
        renderEmptyForm();
      }
    },
    [formState, updateFormData, isLoggedIn, profile],
  );

  return [oldFormData];
}
