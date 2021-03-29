import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { selectProfile } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from '../config/form';

export const FormApp = ({
  location,
  children,
  profile,
  formData,
  setFormData,
}) => {
  const { email = {}, homePhone = {}, mailingAddress = {} } =
    profile?.vapContactInfo || {};

  // Update profile data changes in the form data dynamically
  useEffect(
    () => {
      const { veteran = {} } = formData || {};
      if (
        email?.emailAddress !== veteran.email ||
        homePhone?.updatedAt !== veteran.phone?.updatedAt ||
        mailingAddress?.updatedAt !== veteran.address?.updatedAt
      ) {
        setFormData({
          ...formData,
          veteran: {
            ...veteran,
            address: mailingAddress,
            phone: homePhone,
            email: email?.emailAddress,
          },
        });
      }
    },
    [email, homePhone, mailingAddress, formData, setFormData],
  );

  return (
    <article id="form-10182" data-location={`${location?.pathname?.slice(1)}`}>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );
};

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const formData = state.form?.data || {};
  return { profile, formData };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormApp);
