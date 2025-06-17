import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '~/platform/user/selectors';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollAndFocus } from 'platform/utilities/scroll';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

const VeteranContactInformationPage = ({
  data,
  goBack,
  goForward,
  goToPath,
  // onReviewPage,
  // updatePage,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [hasMissingEmail, setHasMissingEmail] = useState(null);
  const [hasMissingAddress, setHasMissingAddress] = useState(null);
  const [alert, setAlert] = useState(null);
  const { profile } = useSelector(selectUser);
  const { veteranContactInformation = {} } = data || {};

  const convertPhoneObjectToString = phoneObj => {
    if (!phoneObj) return '';
    const { areaCode, phoneNumber, countryCode, isInternational } = phoneObj;
    return areaCode && phoneNumber
      ? `${isInternational ? countryCode : ''}${areaCode}${phoneNumber}`
      : '';
  };

  const updateContactInfo = field => {
    setFormData({
      ...data,
      veteranContactInformation: { ...veteranContactInformation, ...field },
    });
  };

  const {
    email,
    phone,
    mailingAddress,
    internationalPhone,
  } = veteranContactInformation;

  const { email: profileEmail, vapContactInfo } = profile || {};
  const {
    mailingAddress: profileMailingAddress,
    homePhone: profileHomePhone,
    mobilePhone: profileMobilePhone,
  } = vapContactInfo || {};

  let profileInternationalPhone = null;
  if (profileHomePhone?.isInternational) {
    profileInternationalPhone = convertPhoneObjectToString(profileHomePhone);
  } else if (profileMobilePhone?.isInternational) {
    profileInternationalPhone = convertPhoneObjectToString(profileMobilePhone);
  }

  const checkErrors = () => {
    // Show error alert if no email or mailing address
    const missingEmail = !email;
    setHasMissingEmail(missingEmail);
    const missingAddress =
      !mailingAddress?.addressLine1 || !mailingAddress?.city;
    setHasMissingAddress(missingAddress);
    if (missingEmail || missingAddress) {
      const missingInfo = [
        email ? '' : 'email address',
        missingAddress ? 'mailing address' : '',
      ].join(' and ');
      setAlert(
        <va-alert status="error" visible>
          Your {missingInfo} is required before you continue. Provide a valid
          {missingInfo}.
        </va-alert>,
      );
      return true;
    }
    setHasMissingEmail(null);
    setHasMissingAddress(null);
    setAlert(null);
    return false;
  };

  useEffect(() => {
    updateContactInfo({
      email: email || profileEmail || '',
      phone:
        phone ||
        convertPhoneObjectToString(profileHomePhone) ||
        convertPhoneObjectToString(profileMobilePhone) ||
        '',
      mailingAddress: mailingAddress || profileMailingAddress || {},
      internationalPhone: internationalPhone || profileInternationalPhone || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      // Show no email or mailing address prefill alert
      if (
        (!profileMailingAddress?.city && !mailingAddress?.city) ||
        (!email && !profileEmail)
      ) {
        const missingInfo = [
          profileEmail ? '' : 'email address',
          profileMailingAddress?.city ? '' : 'mailing address',
        ].join(' and ');
        const article = !email ? 'an' : 'a';

        setAlert(
          <va-alert status="warning" visible>
            We could not prefill this form with your {missingInfo}. Provide
            {article} {missingInfo}.
          </va-alert>,
        );
      }

      checkErrors();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [email, mailingAddress, profileEmail, profileMailingAddress],
  );

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollAndFocus('va-alert');
      } else if (email) {
        goForward(data);
      }
    },
    editClick: (e, editHref) => {
      e.preventDefault();
      goToPath(editHref);
    },
  };

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the contact information we have on file for you
      </h3>
      {alert}
      <p>
        If you notice any errors, correct them now.{' '}
        <strong>
          Any updates you make will change the information on this application
          only
        </strong>
        . If you need to update your address with VA, go to your profile to make
        any changes.
      </p>
      <va-link
        text="Update your contact information in your profile"
        external
        href="/profile/contact-information"
      />

      {/* Include "hydrated" otherwise the va-card remains hidden when class updates */}
      <va-card
        class={`vads-u-margin-top--3 hydrated ${
          hasMissingAddress ? 'contact-info-error' : ''
        }`}
      >
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Mailing address{' '}
          <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
            (*Required)
          </span>
        </h4>
        <p className="mailing-address">
          {!hasMissingAddress ? (
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="Veteran's address"
            >
              <AddressView data={mailingAddress} />
            </span>
          ) : (
            <span className="usa-input-error-message">
              Select "Add" to enter your mailing address
            </span>
          )}
        </p>
        <VaLink
          active
          href="/veteran-contact-information/mailing-address"
          label={`${mailingAddress ? 'Edit' : 'Add'} mailing address`}
          text={mailingAddress ? 'Edit' : 'Add'}
          onClick={e =>
            handlers.editClick(
              e,
              '/veteran-contact-information/mailing-address',
            )
          }
        />
      </va-card>

      {/* Include "hydrated" otherwise the va-card remains hidden when class updates */}
      <va-card
        class={`vads-u-margin-top--3 hydrated ${
          hasMissingEmail ? 'contact-info-error' : ''
        }`}
      >
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Email address{' '}
          <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
            (*Required)
          </span>
        </h4>
        <p className="email">
          {!hasMissingEmail ? (
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="Veteran's email"
            >
              {email}
            </span>
          ) : (
            <span className="usa-input-error-message">
              Select "Add" to enter your email address
            </span>
          )}
        </p>
        <VaLink
          active
          href="/veteran-contact-information/email"
          label={`${email ? 'Edit' : 'Add'} email address`}
          text={email ? 'Edit' : 'Add'}
          onClick={e =>
            handlers.editClick(e, '/veteran-contact-information/email')
          }
        />
      </va-card>

      <va-card class="vads-u-margin-top--3">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Home phone number
        </h4>
        <p className="phone">
          {phone ? (
            <va-telephone
              not-clickable
              contact={phone}
              class="dd-privacy-hidden"
              data-dd-action-name="Veteran's phone"
            />
          ) : (
            <span>None provided</span>
          )}
        </p>
        <VaLink
          active
          href="/veteran-contact-information/phone"
          label={`${phone ? 'Edit' : 'Add'} phone number`}
          text={phone ? 'Edit' : 'Add'}
          onClick={e =>
            handlers.editClick(e, '/veteran-contact-information/phone')
          }
        />
      </va-card>

      <va-card class="vads-u-margin-top--3">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          International phone number
        </h4>
        <p className="intl-phone">
          {internationalPhone ? (
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="Veteran's international phone"
            >
              {internationalPhone}
            </span>
          ) : (
            <span>None provided</span>
          )}
        </p>
        <VaLink
          active
          href="/veteran-contact-information/international-phone"
          label={`${
            internationalPhone ? 'Edit' : 'Add'
          } international phone number`}
          text={internationalPhone ? 'Edit' : 'Add'}
          onClick={e =>
            handlers.editClick(
              e,
              '/veteran-contact-information/international-phone',
            )
          }
        />
      </va-card>

      <p className="vads-u-margin-top--4" />
      {contentBeforeButtons}
      <FormNavButtons
        goBack={goBack}
        goForward={handlers.onSubmit}
        submitToContinue
      />
      {contentAfterButtons}
    </>
  );
};

VeteranContactInformationPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  // onReviewPage: PropTypes.bool,
  // updatePage: PropTypes.func,
  data: PropTypes.shape({
    veteranContactInformation: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      mailingAddress: PropTypes.shape({
        street: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        postalCode: PropTypes.string,
        country: PropTypes.string,
      }),
      internationalPhone: PropTypes.string,
    }),
  }),
};

export default VeteranContactInformationPage;
