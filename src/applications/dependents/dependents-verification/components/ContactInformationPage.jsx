import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { selectUser } from '~/platform/user/selectors';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ContactInformation = ({ formData, router, setFormData }) => {
  const { profile } = useSelector(selectUser);
  const {
    userFullName,
    // email: profileEmail,
    // phone: profilePhone,
    // mailingAddress: profileMailing,
    // internationalPhone: profileIntlPhone,
  } = profile || {};
  const { email, phone, mailingAddress, internationalPhone, veteranFullName } =
    formData || {};

  // Prefill contact fields if not already in formData
  // useEffect(
  //   () => {
  //     if (!profile) return;

  //     const updatedFormData = { ...formData };
  //     let needsUpdate = false;

  //     if (!email && profileEmail) {
  //       updatedFormData.email = profileEmail;
  //       needsUpdate = true;
  //     }

  //     if (!phone && profilePhone) {
  //       updatedFormData.phone = profilePhone;
  //       needsUpdate = true;
  //     }

  //     if (!mailingAddress && profileMailing) {
  //       updatedFormData.mailingAddress = profileMailing;
  //       needsUpdate = true;
  //     }

  //     if (!internationalPhone && profileIntlPhone) {
  //       updatedFormData.internationalPhone = profileIntlPhone;
  //       needsUpdate = true;
  //     }

  //     if (needsUpdate) {
  //       setFormData(updatedFormData);
  //     }
  //   },
  //   [
  //     email,
  //     phone,
  //     mailingAddress,
  //     internationalPhone,
  //     profileEmail,
  //     profilePhone,
  //     profileMailing,
  //     profileIntlPhone,
  //     profile,
  //     formData,
  //     setFormData,
  //   ],
  // );

  // Add veteranFullName from profile
  useEffect(
    () => {
      if (
        userFullName &&
        JSON.stringify(veteranFullName) !== JSON.stringify(userFullName)
      ) {
        setFormData({
          ...formData,
          veteranFullName: userFullName,
        });
      }
    },
    [userFullName, veteranFullName, formData, setFormData],
  );

  const handleRouteChange = (e, editHref) => {
    e.preventDefault();
    router.push(editHref);
  };

  const editEmailHref = '/veteran-contact-information/email';
  const editPhoneHref = '/veteran-contact-information/phone';
  const editAddressHref = '/veteran-contact-information/mailing-address';
  const editIntlPhoneHref = '/veteran-contact-information/international-phone';

  const formatAddress = address => {
    if (!address) return '';
    const { street, city, state, postalCode, country } = address;
    return [street, `${city}, ${state} ${postalCode}`, country]
      .filter(Boolean)
      .join(', ');
  };

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the contact information we have on file for you
      </h3>
      <p>
        If you notice any errors, correct them now. Any updates you make will
        change the information on this application only. If you need to update
        your address with VA, go to your profile to make any changes.
      </p>
      <va-link
        text="Update your contact information in your profile"
        external
        href="#"
      />

      {/* Mailing Address */}
      <va-card class="vads-u-margin-top--3">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Mailing address
        </h4>
        <p className="mailing-address">
          {mailingAddress ? (
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="Veteran's address"
            >
              {formatAddress(mailingAddress)}
            </span>
          ) : (
            <span>None provided</span>
          )}
        </p>
        <VaLink
          active
          href={editAddressHref}
          label={
            mailingAddress ? 'Edit mailing address' : 'Add mailing address'
          }
          text={mailingAddress ? 'Edit' : 'Add'}
          onClick={e => handleRouteChange(e, editAddressHref)}
        />
      </va-card>

      {/* Email */}
      <va-card class="vads-u-margin-top--3">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Email address
        </h4>
        <p className="email">
          {email ? (
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="Veteran's email"
            >
              {email}
            </span>
          ) : (
            <span>None provided</span>
          )}
        </p>
        <VaLink
          active
          href={editEmailHref}
          label={email ? 'Edit email address' : 'Add email address'}
          text={email ? 'Edit' : 'Add'}
          onClick={e => handleRouteChange(e, editEmailHref)}
        />
      </va-card>

      {/* Mobile Phone */}
      <va-card class="vads-u-margin-top--3">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Mobile phone number
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
          href={editPhoneHref}
          label={phone ? 'Edit phone number' : 'Add phone number'}
          text={phone ? 'Edit' : 'Add'}
          onClick={e => handleRouteChange(e, editPhoneHref)}
        />
      </va-card>

      {/* International Phone */}
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
          href={editIntlPhoneHref}
          label={
            internationalPhone
              ? 'Edit international phone number'
              : 'Add international phone number'
          }
          text={internationalPhone ? 'Edit' : 'Add'}
          onClick={e => handleRouteChange(e, editIntlPhoneHref)}
        />
      </va-card>
    </>
  );
};

ContactInformation.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  formData: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    internationalPhone: PropTypes.string,
    mailingAddress: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
    }),
    veteranFullName: PropTypes.object,
  }),
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ContactInformation));
