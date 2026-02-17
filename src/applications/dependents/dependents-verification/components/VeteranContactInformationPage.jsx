import React, { useEffect, useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '~/platform/user/selectors';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollAndFocus, scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';

import { electronicCorrespondenceMessage } from '../config/chapters/veteran-contact-information/editEmailPage';
import EditCardLink from './EditCardLink';
import {
  getEditContactInformation,
  removeEditContactInformation,
  contactInfoXref,
  convertPhoneObjectToString,
} from '../util/contact-info';
import { isEmptyObject } from '../../shared/utils';

/**
 * Veteran contact informationPage Component
 * @typedef {object} VeteranContactInformationPageProps
 * @property {object} data - form data
 * @property {function} goToPath - function to go to specific path
 * @property {function} setFormData - function to set form data
 * @property {node} contentBeforeButtons - content to render before buttons
 * @property {node} contentAfterButtons - content to render after buttons
 *
 * @param {VeteranContactInformationPageProps} props - Component props
 * @returns {React.Component} - Veteran contact information page
 */
const VeteranContactInformationPage = ({
  data,
  goBack,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const alertRef = useRef(null);
  const updateAlertRef = useRef(null);

  const { profile } = useSelector(selectUser);
  const {
    email,
    phone,
    address,
    internationalPhone,
    electronicCorrespondence,
  } = data;

  const editstate = useRef(getEditContactInformation());
  const { name, action } = editstate?.current || {};
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

  /* Mobile > Home > Work
   * https://www.figma.com/design/bvj72inycD0iZkuCbjYTWL/Dependent-Verification-MVP?node-id=3283-112583&t=AQOdcM9NR0aEb8CC-4
   * Can we add logic about what attributes we can show in this page?
   * If there’s a mobile number available in the profile, show only this mobile number
   * If there’s a mobile number and home number, show only mobile number
   * If there’s home number and no mobile number, show home number
   * If there’s no phone number but work number, show mobile number card with “none provided.” Should we use work number at all?
   */
  const profileMobilePhoneString =
    convertPhoneObjectToString(profileMobilePhone);
  const profileHomePhoneString = convertPhoneObjectToString(profileHomePhone);
  const phoneSource =
    data['view:phoneSource'] ||
    (phone || profileMobilePhoneString ? 'Mobile' : 'Home');

  // Get international phone from mobile or home, if it's international
  let profileInternationalPhone = null;
  if (profileMobilePhone?.isInternational) {
    profileInternationalPhone = convertPhoneObjectToString(profileMobilePhone);
  } else if (profileHomePhone?.isInternational) {
    profileInternationalPhone = convertPhoneObjectToString(profileHomePhone);
  }

  const updateContactInfo = field => {
    setFormData({
      ...data,
      ...field,
    });
  };

  const checkErrors = useCallback(() => {
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
  }, [email, address]);

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
      'view:phoneSource': phoneSource,
      email: email || profileEmail?.emailAddress || '',
      phone: phone || profileMobilePhoneString || profileHomePhoneString || '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [email, address, profileEmail, profileMailingAddress],
  );

  useEffect(() => {
    if (name) {
      if (updateAlertRef?.current && name && action === 'update') {
        setTimeout(() => {
          scrollAndFocus(updateAlertRef.current);
          removeEditContactInformation();
        });
      } else if (action === 'cancel') {
        setTimeout(() => {
          const card = document.querySelector(`va-card[data-field="${name}"]`);
          if (card) {
            scrollTo(card);
            focusElement('a', {}, card.querySelector('va-link'));
          }
          removeEditContactInformation();
        });
      }
    }
  }, [updateAlertRef, name, action]);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      removeEditContactInformation();
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

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the contact information we have on file for you
      </h3>
      {name && action === 'update' && (
        <va-alert ref={updateAlertRef} status="success" visible>
          <h3 slot="headline">
            {`We updated your ${contactInfoXref[name].label}`}
          </h3>
          <p>This update only applies to this application</p>
        </va-alert>
      )}
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
        If you notice any errors, correct them now. Changes made here apply only
        to this form. If you want to update your contact information in our
        system, go to your VA profile.
      </p>
      <va-link
        text="Update your contact information in your VA profile"
        external
        href="/profile/contact-information"
      />

      <div
        className={submitted && hasMissingAddress ? 'contact-info-error' : ''}
      >
        <va-card class="vads-u-margin-top--3" data-field="address">
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
                  {`${address.city}, ${address.state || address.province} ${
                    address.postalCode || address.internationalPostalCode
                  }`}
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
          <EditCardLink
            value={address.street}
            name="address"
            onClick={handlers.editClick}
          />
        </va-card>
      </div>

      <div className={submitted && hasMissingEmail ? 'contact-info-error' : ''}>
        <va-card class="vads-u-margin-top--3" data-field="email">
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
                  {electronicCorrespondenceMessage(electronicCorrespondence)}
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
          <EditCardLink
            value={email}
            name="email"
            onClick={handlers.editClick}
          />
        </va-card>
      </div>

      <va-card class="vads-u-margin-top--3" data-field="phone">
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
        <EditCardLink
          value={phone}
          name="phone"
          type={phoneSource}
          onClick={handlers.editClick}
        />
      </va-card>

      <va-card class="vads-u-margin-top--3" data-field="internationalPhone">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          International number
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
        <EditCardLink
          value={internationalPhone}
          name="internationalPhone"
          onClick={handlers.editClick}
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
    'view:phoneSource': PropTypes.string,
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
