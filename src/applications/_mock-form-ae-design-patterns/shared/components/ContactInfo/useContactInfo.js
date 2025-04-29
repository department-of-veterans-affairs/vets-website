import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import { generateMockUser } from 'platform/site-wide/user-nav/tests/mocks/user';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const useContactInfo = ({
  disableMockContactInfo = false,
  requiredKeys = [],
  fullContactPath,
} = {}) => {
  const loggedIn = useSelector(isLoggedIn);
  const profile = useSelector(state => state?.user?.profile);

  const editPagePathMap = {
    email: 'edit-email-address',
    homePhone: 'edit-home-phone',
    mobilePhone: 'edit-mobile-phone',
    mailingAddress: 'edit-mailing-address',
  };

  return useMemo(
    () => {
      // Use mock data locally if logged in and not disabled
      const vapContactInfo =
        loggedIn && environment.isLocalhost() && !disableMockContactInfo
          ? generateMockUser({ authBroker: 'iam' }).data.attributes
              .vet360ContactInformation
          : profile?.vapContactInfo || {};

      const email = vapContactInfo?.email?.emailAddress || '';
      const homePhone = vapContactInfo?.homePhone || {};
      const mobilePhone = vapContactInfo?.mobilePhone || {};
      const mailingAddress = vapContactInfo?.mailingAddress || {};

      // Get missing info
      const missingFields = [];
      if (!email && requiredKeys.includes('email'))
        missingFields.push({
          field: 'email',
          editPath: `${fullContactPath}/${editPagePathMap.email}`,
          label: 'email address',
        });
      if (!homePhone?.phoneNumber && requiredKeys.includes('homePhone'))
        missingFields.push({
          field: 'homePhone',
          editPath: `${fullContactPath}/${editPagePathMap.homePhone}`,
          label: 'home phone',
        });
      if (!mobilePhone?.phoneNumber && requiredKeys.includes('mobilePhone'))
        missingFields.push({
          field: 'mobilePhone',
          editPath: `${fullContactPath}/${editPagePathMap.mobilePhone}`,
          label: 'mobile phone',
        });
      if (
        !mailingAddress?.addressLine1 &&
        requiredKeys.includes('mailingAddress')
      )
        missingFields.push({
          field: 'mailingAddress',
          editPath: `${fullContactPath}/${editPagePathMap.mailingAddress}`,
          label: 'mailing address',
        });

      return {
        email: {
          emailAddress: email,
          id: vapContactInfo?.email?.id,
          status: vapContactInfo?.email?.status,
          missing: missingFields.some(field => field.field === 'email'),
          required: requiredKeys.includes('email'),
        },
        homePhone: {
          phoneNumber: homePhone?.phoneNumber || '',
          extension: homePhone?.extension || '',
          id: homePhone?.id,
          status: homePhone?.status,
          missing: missingFields.some(field => field.field === 'homePhone'),
          required: requiredKeys.includes('homePhone'),
        },
        mobilePhone: {
          phoneNumber: mobilePhone?.phoneNumber || '',
          extension: mobilePhone?.extension || '',
          id: mobilePhone?.id,
          status: mobilePhone?.status,
          missing: missingFields.some(field => field.field === 'mobilePhone'),
          required: requiredKeys.includes('mobilePhone'),
        },
        mailingAddress: {
          addressLine1: mailingAddress?.addressLine1 || '',
          addressLine2: mailingAddress?.addressLine2 || '',
          addressLine3: mailingAddress?.addressLine3 || '',
          city: mailingAddress?.city || '',
          stateCode: mailingAddress?.stateCode || '',
          zipCode: mailingAddress?.zipCode || '',
          countryName: mailingAddress?.countryName || '',
          id: mailingAddress?.id,
          status: mailingAddress?.status,
          missing: missingFields.some(
            field => field.field === 'mailingAddress',
          ),
          required: requiredKeys.includes('mailingAddress'),
        },
        missingFields,
        isLoggedIn: loggedIn,
      };
    },
    [
      loggedIn,
      profile,
      disableMockContactInfo,
      requiredKeys,
      fullContactPath,
      editPagePathMap.email,
      editPagePathMap.homePhone,
      editPagePathMap.mailingAddress,
      editPagePathMap.mobilePhone,
    ],
  );
};

export default useContactInfo;
