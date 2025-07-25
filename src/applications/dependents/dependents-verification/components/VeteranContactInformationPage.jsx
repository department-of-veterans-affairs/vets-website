import React, { useEffect, useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '~/platform/user/selectors';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollAndFocus } from 'platform/utilities/scroll';

import { isEmptyObject } from '../../shared/utils';

const VeteranContactInformationPage = ({
  data,
  goBack,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const alertRef = useRef(null);
  const { profile } = useSelector(selectUser);
  const {
    email,
    phone,
    address,
    internationalPhone,
    electronicCorrespondence,
  } = data;

  const { vapContactInfo } = profile || {};
  const {
    email: profileEmail,
    mailingAddress: profileMailingAddress,
    homePhone: profileHomePhone,
    mobilePhone: profileMobilePhone,
  } = vapContactInfo || {};

  const [hasMissingEmail, setHasMissingEmail] = useState(null);
  const [hasMissingAddress, setHasMissingAddress] = useState(null);
  const [showPrefillAlert, setShowPrefillAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  // Mobile > Home - see
  // https://www.figma.com/design/bvj72inycD0iZkuCbjYTWL/Dependent-Verification-MVP?node-id=3283-112583&t=AQOdcM9NR0aEb8CC-4
  const [phoneSource] = useState(
    phone || profileMobilePhone ? 'Mobile' : 'Home',
  );

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
      ...field,
    });
  };

  let profileInternationalPhone = null;
  if (profileHomePhone?.isInternational) {
    profileInternationalPhone = convertPhoneObjectToString(profileHomePhone);
  } else if (profileMobilePhone?.isInternational) {
    profileInternationalPhone = convertPhoneObjectToString(profileMobilePhone);
  }

  const checkErrors = useCallback(
    () => {
      // Show error alert if no email or mailing address
      const missingEmail = !email;
      setHasMissingEmail(missingEmail);
      const missingAddress = !address?.street || !address?.city;
      setHasMissingAddress(missingAddress);
      if (missingEmail || missingAddress) {
        setShowAlert(true);
        return true;
      }
      setHasMissingEmail(null);
      setHasMissingAddress(null);
      setShowAlert(null);
      return false;
    },
    [email, address],
  );

  useEffect(() => {
    let newAddress = {};
    if (!isEmptyObject(address)) {
      newAddress = address;
    } else if (!isEmptyObject(profileMailingAddress)) {
      newAddress = {
        addressType: profileMailingAddress?.addressType,
        street: profileMailingAddress?.addressLine1,
        street2: profileMailingAddress?.addressLine2,
        city: profileMailingAddress?.city,
        state:
          profileMailingAddress?.stateCode || profileMailingAddress?.province,
        postalCode:
          profileMailingAddress?.zipCode ||
          profileMailingAddress?.internationalPostalCode,
        country: profileMailingAddress?.countryCodeIso3,
      };
    }

    updateContactInfo({
      email: email || profileEmail?.emailAddress || '',
      phone:
        phone ||
        convertPhoneObjectToString(profileHomePhone) ||
        convertPhoneObjectToString(profileMobilePhone) ||
        '',
      address: newAddress,
      internationalPhone: internationalPhone || profileInternationalPhone || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      // Show no email or mailing address prefill alert
      if (
        (!profileMailingAddress?.city && !address?.city) ||
        (!email && !profileEmail?.emailAddress)
      ) {
        setShowPrefillAlert(true);
      } else {
        setShowPrefillAlert(null);
      }
      checkErrors();
    },
    [email, address, profileEmail, profileMailingAddress],
  );

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        setSubmitted(true);
        setShowPrefillAlert(null); // Hide prefill alert if there are errors
        setTimeout(() => {
          scrollAndFocus('va-alert[status="error"]');
        });
      } else if (email) {
        setSubmitted(false);
        // goForward(data);
        goToPath('/dependents', { force: true });
      }
    },
    editClick: (e, editHref) => {
      e.preventDefault();
      goToPath(editHref, { force: true });
    },
  };

  const alertMissingInfo = [
    hasMissingEmail ? 'email' : '',
    hasMissingAddress ? 'mailing' : '',
  ]
    .filter(Boolean)
    .join(' and ');

  const prefillMissingInfo = [
    profileEmail?.emailAddress ? '' : 'email',
    profileMailingAddress?.city ? '' : 'mailing',
  ]
    .filter(Boolean)
    .join(' and ');
  const article = !email ? 'an' : 'a';

  const agreementMessage = electronicCorrespondence
    ? 'I agree to receive electronic correspondence from the VA about my claim at this email address'
    : 'I do not agree to receive electronic correspondence from the VA about my claim at this email address';

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the contact information we have on file for you
      </h3>
      {!submitted && showPrefillAlert ? (
        <va-alert status="warning" visible>
          We could not prefill this form with your {prefillMissingInfo} address.
          Provide {article} {prefillMissingInfo} address.
        </va-alert>
      ) : null}
      {submitted && showAlert ? (
        <va-alert ref={alertRef} status="error" visible>
          Your {alertMissingInfo} address{' '}
          {alertMissingInfo.includes(' and ') ? 'are' : 'is'} required before
          you continue. Provide a valid {alertMissingInfo} address.
        </va-alert>
      ) : null}
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

      <div
        className={submitted && hasMissingAddress ? 'contact-info-error' : ''}
      >
        <va-card class="vads-u-margin-top--3">
          <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Mailing address{' '}
            <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
              (*Required)
            </span>
          </h4>
          <div className="mailing-address vads-u-margin-y--2">
            {!hasMissingAddress ? (
              <span
                className="dd-privacy-hidden"
                data-dd-action-name="Veteran's address"
              >
                <div className="dd-privacy-hidden" data-dd-action-name="street">
                  {address.street}
                </div>
                {address.street2 && (
                  <div
                    className="dd-privacy-hidden"
                    data-dd-action-name="street2"
                  >
                    {address.street2}
                  </div>
                )}
                <div
                  className="dd-privacy-hidden"
                  data-dd-action-name="city, state and zip code"
                >
                  {`${address.city}, ${address.state ||
                    address.province} ${address.postalCode ||
                    address.internationalPostalCode}`}
                </div>
                {address.country === 'USA' ? null : (
                  <div>{address.country}</div>
                )}
              </span>
            ) : (
              <>
                {submitted && (
                  <span className="usa-error-message">
                    Select "Add" to enter your mailing address
                  </span>
                )}
                <div>None provided</div>
              </>
            )}
          </div>
          <VaLink
            active
            href="/veteran-contact-information/mailing-address"
            label={`${address ? 'Edit' : 'Add'} mailing address`}
            text={address ? 'Edit' : 'Add'}
            onClick={e =>
              handlers.editClick(
                e,
                '/veteran-contact-information/mailing-address',
              )
            }
          />
        </va-card>
      </div>

      <div className={submitted && hasMissingEmail ? 'contact-info-error' : ''}>
        <va-card class="vads-u-margin-top--3">
          <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Email address{' '}
            <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
              (*Required)
            </span>
          </h4>
          <div className="email vads-u-margin-y--2">
            {!hasMissingEmail ? (
              <span
                className="dd-privacy-hidden"
                data-dd-action-name="Veteran's email"
              >
                <div
                  className="dd-privacy-hidden"
                  data-dd-action-name="Veteran's email"
                >
                  {email}
                </div>
                <div
                  className="dd-privacy-hidden"
                  data-dd-action-name="Electronic correspondence"
                >
                  {agreementMessage}
                </div>
              </span>
            ) : (
              <>
                {submitted && (
                  <span className="usa-error-message">
                    Select "Add" to enter your email address
                  </span>
                )}
                <div>None provided</div>
              </>
            )}
          </div>
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
      </div>

      <va-card class="vads-u-margin-top--3">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          {`${phoneSource} phone number`}
        </h4>
        <div className="phone vads-u-margin-y--2">
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
        </div>
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
        <div className="intl-phone vads-u-margin-y--2">
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
        </div>
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
        useWebComponents
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
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.shape({
      street: PropTypes.string,
      street2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      province: PropTypes.string,
      postalCode: PropTypes.string,
      internationalPostalCode: PropTypes.string,
      country: PropTypes.string,
    }),
    internationalPhone: PropTypes.string,
    electronicCorrespondence: PropTypes.bool,
  }),
};

export default VeteranContactInformationPage;
