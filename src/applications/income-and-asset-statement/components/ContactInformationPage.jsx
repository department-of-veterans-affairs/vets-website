import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { selectProfile } from '~/platform/user/selectors';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ContactInformation = ({ formData, router, setFormData }) => {
  const profile = useSelector(selectProfile);
  const { userFullName, email: profileEmail, phone: profilePhone } =
    profile || {};
  const { email, phone } = formData || {};

  // Initialize email and phone with user profile if not already set in formData
  useEffect(
    () => {
      const updatedFormData = { ...formData };
      let needsUpdate = false;

      if (!email && profileEmail) {
        updatedFormData.email = profileEmail;
        needsUpdate = true;
      }

      if (!phone && profilePhone) {
        updatedFormData.phone = profilePhone;
        needsUpdate = true;
      }

      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    },
    [email, phone, profileEmail, profilePhone, formData, setFormData],
  );

  // Since Contact Information always follows Personal Information, it’s a reliable
  // checkpoint to add veteranFullName from user profile if it exists
  useEffect(
    () => {
      if (
        formData?.claimantType === 'VETERAN' &&
        userFullName &&
        JSON.stringify(formData?.veteranFullName) !==
          JSON.stringify(userFullName)
      ) {
        setFormData({
          ...formData,
          veteranFullName: userFullName,
        });
      }
    },
    [formData, setFormData, userFullName],
  );

  const editEmailHref = '/contact/information/email';
  const editPhoneHref = '/contact/information/phone';

  const handleRouteChange = (e, editHref) => {
    e.preventDefault();
    router.push(editHref);
  };

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the contact information we have on file for you
      </h3>
      <va-card>
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Current Email
        </h4>
        <p className="email">
          <span
            className="name dd-privacy-hidden"
            data-dd-action-name="Veteran's email"
          >
            {email}
          </span>
        </p>
        <VaLink
          active
          href={editEmailHref}
          label={email ? 'Edit email address' : 'Add email address'}
          text={email ? 'Edit' : 'Add'}
          onClick={e => handleRouteChange(e, editEmailHref)}
        />
      </va-card>
      <va-card class="vads-u-margin-top--3">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Current phone number (optional)
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
    claimantType: PropTypes.string.isRequired,
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
