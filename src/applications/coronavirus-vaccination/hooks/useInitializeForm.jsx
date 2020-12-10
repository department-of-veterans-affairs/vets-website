import { useEffect } from 'react';
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
  useEffect(
    () => {
      if (formState) {
        // If formState isn't null, then we've already initialized the form
        // so we skip doing it again. This occurs if you navigate to the form,
        // fill out some fields, navigate back to the intro, then back to the form.
        return;
      }

      function renderEmptyForm() {
        const emptyFormData = {
          isIdentityVerified: false,
        };

        updateFormData(initialFormSchema, initialUiSchema, emptyFormData);

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
            const response = await retrievePreviouslySubmittedForm();
            const json = await response.json();
            const previouslySubmittedFormData = json?.data?.attributes;

            if (previouslySubmittedFormData) {
              const prefilledFromOldForm = {
                isIdentityVerified,
                firstName: previouslySubmittedFormData.firstName,
                lastName: previouslySubmittedFormData.lastName,
                birthDate: previouslySubmittedFormData.dateOfBirth,
                email: previouslySubmittedFormData.email,
                zipCode: previouslySubmittedFormData.zipCode,
                zipCodeDetails: previouslySubmittedFormData.timeAtZip,
                phone: previouslySubmittedFormData.phone,
                vaccineInterest: previouslySubmittedFormData.vaccineInterest,
              };

              updateFormData(
                initialFormSchema,
                initialUiSchema,
                prefilledFromOldForm,
              );

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

        const prefilledFromProfile = {
          isIdentityVerified,
          firstName: profile?.userFullName?.first,
          lastName: profile?.userFullName?.last,
          birthDate: profile?.dob,
          ssn: undefined,
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
          initialUiSchema,
          prefilledFromProfile,
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
}
