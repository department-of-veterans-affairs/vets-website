import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { selectUser } from '~/platform/user/selectors';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ContactInformation = ({ formData, router, setFormData }) => {
  const { profile } = useSelector(selectUser);
  // console.log(profile);
  const { email: profileEmail } = profile || {};
  const { veteranContactInformation = {} } = formData || {};
  const {
    email,
    phone,
    mailingAddress,
    internationalPhone,
  } = veteranContactInformation;

  useEffect(
    () => {
      if (profileEmail && !email) {
        setFormData({
          ...formData,
          veteranContactInformation: {
            ...veteranContactInformation,
            email: profileEmail,
          },
        });
      }
    },
    [profileEmail, email, veteranContactInformation, formData, setFormData],
  );

  const handleRouteChange = (e, editHref) => {
    e.preventDefault();
    router.push(editHref);
  };

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
          href="/veteran-contact-information/mailing-address"
          label={
            mailingAddress ? 'Edit mailing address' : 'Add mailing address'
          }
          text={mailingAddress ? 'Edit' : 'Add'}
          onClick={e =>
            handleRouteChange(e, '/veteran-contact-information/mailing-address')
          }
        />
      </va-card>

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
          href="/veteran-contact-information/email"
          label={email ? 'Edit email address' : 'Add email address'}
          text={email ? 'Edit' : 'Add'}
          onClick={e =>
            handleRouteChange(e, '/veteran-contact-information/email')
          }
        />
      </va-card>

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
          href="/veteran-contact-information/phone"
          label={phone ? 'Edit phone number' : 'Add phone number'}
          text={phone ? 'Edit' : 'Add'}
          onClick={e =>
            handleRouteChange(e, '/veteran-contact-information/phone')
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
          label={
            internationalPhone
              ? 'Edit international phone number'
              : 'Add international phone number'
          }
          text={internationalPhone ? 'Edit' : 'Add'}
          onClick={e =>
            handleRouteChange(
              e,
              '/veteran-contact-information/international-phone',
            )
          }
        />
      </va-card>
    </>
  );
};

ContactInformation.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  formData: PropTypes.shape({
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
